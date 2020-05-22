import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import Loader from '../components/Loader'
import ModalCharacterInfo from '../components/ModalCharacterInfo'
import CharacterCard from '../components/CharacterCard'
import NavBar from '../components/NavBar'
import qs from 'query-string'
import _ from 'lodash'




//TS: 1
//Private Key : 689e54de613203045cc2402b42581b8914fff973
//Public Key : d267dc8180768e976a2442235e0617f6
//Hash MD5 : 0ad4c739d3e46cefdb021c410ddefe5e
/* EXAMPLE
/* http://gateway.marvel.com/v1/public/comics?ts=1&apikey=d267dc8180768e976a2442235e0617f6&hash=0ad4c739d3e46cefdb021c410ddefe5e */





let urlQuery = false;
let etag = ""
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
    //console.log(props.location.search)
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
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    if (!this.state.noMoreResults && !this.state.fetching) {
      if (urlQuery) {
        this.fetchCharacters(charactersInQuery, comicsInQuery)
      } else {
        this.fetchCharacters(this.state.query, this.state.query)
      }

    }
  }

  componentDidMount() {
    //If the components mounts and there is a query in the url, then search by url
    if (this.props.location.search) {
      urlQuery = true;
      const query = qs.parse(this.props.location.search)
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


      console.log(charactersInQuery, comicsInQuery)

      this.fetchCharacters(charactersInQuery, comicsInQuery)
      //Because we want to have a different behaviour when searching by url, 
      //we'll use another method for the search if the query possess multiple parameters, 
      //if not, the we'll use a simple searchbar search functionality
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
    try {
      this.setState({ fetching: true })
      let charactersResults = []
      let comicsResults = []
      let charactersFromComics = []
      let totalResults = []

      if (typeof characters === "string") {
        characters = [characters]
      }
      if (typeof comics === "string") {
        comics = [comics]
      }

      if (characters.length > 0 && comics.length > 0 && urlQuery) {
        totalResults = await this.fetchCharactersFromComics(comics, characters)
      } else {
        charactersResults = await this.fetchCharactersByName(characters)
        totalResults = [...totalResults, ...charactersResults]
        comicsResults = await this.fetchComics(comics)
        let comicsIDList = []
        //Marvel's api only accepts sets of 10 id
        comicsResults.forEach((result) => {
          result.data.results.forEach(comic => {
            comicsIDList.push(comic.id)
          })
        })

        if (comicsIDList.length > 0 && comicsIDList.length < 10) {
          let comicsIDString = _.join(comicsIDList, ',')
          const response = await fetch(`https://gateway.marvel.com/v1/public/characters${credentials}&${comicsIDString !== "" ? "comics=" + comicsIDList : ""}&offset=${offset} `)
          const { data } = await response.json()

          totalResults = [...totalResults, ...data.results]
        }

      }


      totalResults = _.uniqBy(totalResults, 'id')



      this.setState({ results: [...this.state.results, ...totalResults] })
      this.setState({ fetching: false })

    } catch (error) {

    }
  }

  fetchComics = async (comics) => {
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
      return comicsResults
    } catch (error) {
      console.log(error)
    }

  }
  fetchCharactersByName = async (characters) => {

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


    let flag = false;

    promisesResults.forEach(promiseResults => {

      //If the response came with a full container
      if (promiseResults.data.count === promiseResults.data.limit) {

        flag = true;
        //Add offset for consecuent searches
        offset = offset + promiseResults.data.limit;
      } else {

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
      console.log(comicsResults)
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


      //Add all the results of the characters into one array and remove duplicates
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

      console.log(totalCharacters)
      return totalCharacters

    } catch (error) {
      console.log(error)
    }
  }
  fetchRandom = async () => {
    try {
      this.setState({ loading: true })
      //Asumimos que la busqueda inicial tendra por lo menos 50 paginas de resultados de las cuales obtendremos nuestro personaje random
      const randomPage = () => {
        return Math.floor(Math.random() * 50)
      }
      const response = await fetch(`https://gateway.marvel.com/v1/public/characters${credentials}&offset=${randomPage()}`)
      const { data } = await response.json();
      //Elegimos aleatoriamente un personaje de todos los de la pagina
      const randomCharacter = () => {
        return Math.floor(Math.random() * data.count)
      }
      this.setState((state, props) => ({
        results: [data.results[randomCharacter()]]
      }))
      this.setState({ loading: false })
    } catch (error) {
      this.setState({
        loading: false,
      })
      this.setState({
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

            <CharacterCard key={character.id} character={character} onOpenModal={this.handleOpenModal} />
          ))}

          <ModalCharacterInfo theme={this.props.theme} character={this.state.character} isOpen={this.state.modalIsOpen} onClose={this.handleCloseModal} />


        </StyledCharacters>}
        {this.state.fetching && <Loader></Loader>}
        {this.state.noMoreResults && <h4 style={{ textAlign: "center" }}>No hay mas resultados</h4>}
      </div>


    )
  }

}



export default Characters
