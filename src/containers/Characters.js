import React from 'react'
import styled from 'styled-components'
import Loader from '../components/Loader'
import ModalCharacterInfo from '../components/ModalCharacterInfo'
import CharacterCard from '../components/CharacterCard'
import NavBar from '../components/NavBar'
import API from '../api'
import qs from 'query-string'
import _ from 'lodash'




//TS: 1
//Private Key : 689e54de613203045cc2402b42581b8914fff973
//Public Key : d267dc8180768e976a2442235e0617f6
//Hash MD5 : 0ad4c739d3e46cefdb021c410ddefe5e
/* EXAMPLE
/* http://gateway.marvel.com/v1/public/comics?ts=1&apikey=d267dc8180768e976a2442235e0617f6&hash=0ad4c739d3e46cefdb021c410ddefe5e */




//Helper variables
let urlQuery = false;
let offset = 0
let charactersInQuery = []
let comicsInQuery = []

const StyledCharacters = styled.div`
  background-color: ${props => props.theme.main.page};
  margin-top:4rem;
  margin-left:4rem;
  margin-right:4rem;
  display: grid;
  justify-content: center;
  grid-gap: 1rem 1rem;
  grid-template-columns: repeat(auto-fill, 350px);
`


//The global state of the application, the query will be stored here for easier access from the parent container
const credentials = "?&ts=1&apikey=d267dc8180768e976a2442235e0617f6&hash=0ad4c739d3e46cefdb021c410ddefe5e"

class Characters extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      query: "",
      character: '',
      results: [],
      isModalOpen: false,
      noMoreResults: false,
      fetching: false,
      loading: false,
      error: null,
    }
    this.handleCloseModal = this.handleCloseModal.bind(this)
    this.handleOpenModal = this.handleOpenModal.bind(this)
    this.setQuery = this.setQuery.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
  }

  handleScroll() {
    //When the user scrolls to the bottom of the page, fetch more characters
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    if (!this.state.noMoreResults && !this.state.fetching) {
      if (urlQuery) {
        this.fetchCharacters(charactersInQuery, comicsInQuery)
      } else {
        this.fetchCharacters(this.state.query, this.state.query)
      }
    }
  }
  parseURLQuery(query) {
    let charactersQuery = query.character;
    let comicsQuery = query.comic;
    if (!charactersQuery) {
      charactersQuery = []
    }
    if (!comicsQuery) {
      comicsQuery = []
    }
    if (typeof charactersQuery == 'string') {
      charactersQuery = [charactersQuery]
    }
    if (typeof comicsQuery == 'string') {
      comicsQuery = [comicsQuery]
    }
    charactersInQuery = charactersQuery
    comicsInQuery = comicsQuery
  }
  componentDidMount() {
    //If the components mounts and there is a query in the url, then search by url
    if (this.props.location.search) {
      urlQuery = true;
      const query = qs.parse(this.props.location.search)
      this.parseURLQuery(query)
      this.fetchCharacters(charactersInQuery, comicsInQuery)
    } else {
      //if there is no query in url, just fetch a random character with a random offset
      this.fetchRandom();
    }
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
  fetchCharacters = async (characters, comics) => {
    //Fetch characters by name and by the comics in which they appear
    try {
      this.setState({ fetching: true })
      let charactersResults = []
      let comicsResults = []
      let totalResults = []

      //Checking and converting the input
      if (typeof characters === "string") {
        characters = [characters]
      }
      if (typeof comics === "string") {
        comics = [comics]
      }
      //If the search is done through the url, then search by the intersection of the characters and the characters that appear in comics 
      if (urlQuery && characters.length > 0 && comics.length > 0) {
        totalResults = await this.fetchCharactersFromComics(comics, characters)
      } else {
        //If the search is not done through url, find the characters separately

        //Fetch the characters
        charactersResults = await this.fetchCharactersByName(characters)
        totalResults = [...totalResults, ...charactersResults]
        //Fetch the comics
        comicsResults = await this.fetchComics(comics)
        let comicsIDList = []
        //Marvel's api only accepts sets of 10 id
        comicsResults.forEach((result) => {
          result.data.results.forEach(comic => {
            comicsIDList.push(comic.id)
          })
        })
        //If there are ocurrences with the comics in the query and the ocurrences are less than 10, search the characters that appear in those comics
        if (comicsIDList.length > 0 && comicsIDList.length < 10) {
          let comicsIDString = _.join(comicsIDList, ',')
          const response = await fetch(`https://gateway.marvel.com/v1/public/characters${credentials}&${comicsIDString !== "" ? "comics=" + comicsIDList : ""}&offset=${offset} `)
          const { data } = await response.json()
          totalResults = [...totalResults, ...data.results]
        }
      }
      //Remove duplicates
      totalResults = _.uniqBy(totalResults, 'id')

      this.setState({
        results: [...this.state.results, ...totalResults],
        fetching: false
      })
    } catch (error) {
      console.log(error)
      this.setState({ error: true })
    }
  }
  fetchComics = async (comics) => {
    try {
      let promisesComics = []
      //First get the comics matching entirely by name and not by how the comic name starts to make the response more concise
      comics.forEach(comic => {
        let issueNumber = comic.match(/(#)([0-9])([0-9])?([0-9])?/g)
        //Match by issue number included in the query
        if (issueNumber) {
          comic = comic.replace(issueNumber, '')
          issueNumber = issueNumber[0].substr(1)
        }
        promisesComics.push(fetch(`https://gateway.marvel.com/v1/public/comics${credentials}&offset=${offset}&title=${comic}&${issueNumber ? 'issueNumber=' + Number(issueNumber) : ''}`)
          .then(response => { return response.json() }))
      })
      let comicsResults = await Promise.all(promisesComics)
      return comicsResults
    } catch (error) {
      console.log(error)
      this.setState({ error: true })
    }
  }
  fetchCharactersByName = async (characters) => {
    //Search characters were name starts with the query
    let promises = []
    let results = [];
    let promisesResults;
    characters.forEach((character) => {
      promises.push(fetch(`https://gateway.marvel.com/v1/public/characters${credentials}${(characters === "") ? "" : "&nameStartsWith=" + character}&offset=${offset}`)
        .then(response => {
          return response.json()
        })
        .then(data => {
          data.character = character
          return data
        })
      )
    });
    promisesResults = await Promise.all(promises)

    //flag for registering when there is no more results
    let flag = false;
    promisesResults.forEach(promiseResults => {
      //If the response came with a full container
      if (promiseResults.data.count === promiseResults.data.limit) {
        flag = true;
        //Add offset for consecuent searches
        offset = offset + promiseResults.data.limit;
      } else {
        //if the container came not full, then remove the character from the search so we dont include him in the next request
        charactersInQuery.splice(charactersInQuery.indexOf(promiseResults.character), 1)
      }
      results = [...results, ...promiseResults.data.results]
    });
    if (!flag) {
      this.setState({ noMoreResults: true })
    }

    return results
  }
  fetchCharactersFromComics = async (comics, characters) => {
    try {

      let promisesComics = []
      //First get the comics matching entirely by name and not by how the comic name starts
      comics.forEach(comic => {
        let issueNumber = comic.match(/(#)([0-9])([0-9])?([0-9])?/g)
        if (issueNumber) {
          comic = comic.replace(issueNumber, '')
          issueNumber = issueNumber[0].substr(1)
        }
        promisesComics.push(fetch(`https://gateway.marvel.com/v1/public/comics${credentials}&offset=${offset}&title=${comic}&${issueNumber ? 'issueNumber=' + Number(issueNumber) : ''}`)
          .then(response => { return response.json() }))
      })

      let comicsResults = await Promise.all(promisesComics)

      //Once we get all the results, proceed to get the characters that are in the comics provided
      let promisesCharacters = []
      let tempComics = []
      comicsResults.forEach(result => {
        tempComics = [...tempComics, result.data.results].flat()
        result.data.results.forEach(comic => {
          if (comic.characters.available > 0) {
            promisesCharacters.push(fetch(`https://gateway.marvel.com/v1/public/comics/${comic.id}/characters${credentials}`)
              .then(response => {
                return response.json()
              }).then((data) => {
                data.comic = comic.id
                return data
              }))
          }
        })
      })
      let charactersResults = await Promise.all(promisesCharacters)
      //Add all the results of the characters into one array
      let totalCharacters = []
      charactersResults.forEach(result => {
        //Delete the current comics in the result
        result.data.results.forEach(character => {
          character.comics.items = []
        })
        //Attach the comics in the character
        result.data.results.forEach(character => {
          const newComic = _.find(tempComics, { 'id': result.comic })
          const newCharacter = _.find(totalCharacters, { 'id': character.id })
          if (!newCharacter) {
            character.comics.items.push(newComic)
            totalCharacters.push(character)
          } else {
            newCharacter.comics.items.push(newComic)
          }
        })
      })
      //Remove the characters that were not specified in the query
      totalCharacters = _.filter(totalCharacters, function (o) {
        return _.includes(characters, o.name.toLowerCase())
      })
      //Finally return the characters
      return totalCharacters

    } catch (error) {
      console.log(error)
    }
  }
  fetchRandom = async () => {
    try {
      this.setState({ loading: true })

      const data = await API.fetchRandomCharacter()

      //set a random offset
      const randomCharacter = () => {
        return Math.floor(Math.random() * data.count)
      }
      this.setState((state, props) => ({
        results: [data.results[randomCharacter()]],
        loading: false
      }))
    } catch (error) {
      this.setState({
        loading: false,
        error: error
      })

    }
  }
  setQuery(query) {
    if (query === "") {
      this.fetchRandom()
    } else {
      offset = 0;
      urlQuery = false
      this.setState({ noMoreResults: false })
      this.setState({ results: [] })
      this.setState({ query: query })
      this.fetchCharacters(query, query, 0)
    }
  }
  handleCloseModal(e) {
    e.stopPropagation()
    this.setState({ isModalOpen: false })
    this.setState({ character: null })
  }
  handleOpenModal(e, character) {
    e.stopPropagation()
    if (!this.state.isModalOpen) {
      this.setState({ character: character })
      this.setState({ isModalOpen: true })
    }
  }

  render() {
    return (
      <div>
        <NavBar handleQuery={this.setQuery} />
        < StyledCharacters >
          {this.state.results.map(character => (
            < CharacterCard key={character.id} character={character} onOpenModal={this.handleOpenModal} />
          ))}
          <ModalCharacterInfo theme={this.props.theme} character={this.state.character} isOpen={this.state.modalIsOpen} onClose={this.handleCloseModal} />
        </StyledCharacters>
        {this.state.fetching && <Loader></Loader>}
        {this.state.noMoreResults && !this.state.fetching && <h4 style={{ textAlign: "center" }}>There is no more results</h4>}
        {this.state.error && <h4 style={{ textAlign: "center" }}>There has been an error with the query</h4>}
      </div>
    )
  }
}
export default Characters
