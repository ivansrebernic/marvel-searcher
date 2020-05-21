import React from 'react'
import styled from 'styled-components'
import Loader from './components/Loader'
import ModalCharacterInfo from './components/ModalCharacterInfo'
import CharacterCard from './components/CharacterCard'
import NavBar from './components/NavBar'
import qs from 'query-string'
import _ from 'lodash'



//TS: 1
//Private Key : 689e54de613203045cc2402b42581b8914fff973
//Public Key : d267dc8180768e976a2442235e0617f6
//Hash MD5 : 0ad4c739d3e46cefdb021c410ddefe5e
/* EXAMPLE
/* http://gateway.marvel.com/v1/public/comics?ts=1&apikey=d267dc8180768e976a2442235e0617f6&hash=0ad4c739d3e46cefdb021c410ddefe5e */


const StyledCharacters = styled.div`
  background-color: #E5E5E5;
  margin-top:4rem;
  margin-left:4rem;
  margin-right:4rem;
  display: grid;
  justify-content: center;
  grid-gap: 1rem 1rem;
  grid-template-columns: repeat(auto-fill, 350px);
`

let flagCharacters = false;
let flagComics = false;

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
      offset: 0,
      isModalOpen: false,
      noMoreResults: false,
      fetching: false,
      loading: false,
      error: null,
      digest: ''
    }
    this.handleCloseModal = this.handleCloseModal.bind(this)
    this.handleOpenModal = this.handleOpenModal.bind(this)
    this.setQuery = this.setQuery.bind(this)
    this.handleScroll = this.handleScroll.bind(this)

  }
  handleScroll() {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    if (!this.state.noMoreResults && !this.state.fetching) {
      this.fetchCharacters(this.state.query, this.state.query, this.state.offset)
    }
  }
  componentDidMount() {
    if (this.props.location.search) {
      const query = qs.parse(this.props.location.search)
      let characters;
      let comics;
      if (typeof query.characters === 'string') {
        characters = [query.characters]
      } else {
        characters = query.characters
      }
      if (typeof query.comics === 'string') {
        comics = [query.comics]
      }

      this.fetchCharactersQueryParams(characters, comics)
    } else {
      this.fetchRandom();
    }
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
  fetchCharacters = async (characters, comics, offset) => {

    try {
      this.setState({ fetching: true })
      let charactersResults = []
      let comicsResults = []
      let totalResults = []

      let charactersSearch = []
      let comicsSearch = []

      if (typeof characters === "string") {
        characters = [characters]
      }
      if (typeof comics === "string") {
        comics = [comics]
      }

      if (characters.length > 0 && !flagCharacters) {
        //Character search
        //charactersResults = await this.fetchCharactersByName(characters, offset)
      }
      if (comics.length > 0 && !flagComics) {
        //Comic search
        comicsResults = await this.fetchCharactersByComics(comics, offset)
      }

      //If the current search of comics doesn't have anymore results
      if (comicsResults.length === 0) {
        flagComics = true
      }
      //If the current search of characters doesn't have anymore results
      if (charactersResults.length === 0) {
        flagCharacters = true
      }

      if (flagComics && flagCharacters) {
        this.setState({ noMoreResults: true })
      } else {
        this.setState({ offset: offset + 20 })
      }

      totalResults = [...charactersResults, ...comicsResults]
      totalResults = [...this.state.results, ...totalResults]
      totalResults = _.uniqBy(totalResults, 'id')
      /*
      if (comics.length > 0 && characters.length > 0) {
        //Characters in comics search
        results = await this.fetchCharactersFromComics(comics, characters, offset)
      }*/


      this.setState({ results: [...totalResults] })
      this.setState({ fetching: false })

    } catch (error) {

    }


  }
  fetchCharactersSearchBar = async (query) => {
    try {
      let results = []

      this.setState({ fetching: true })
      const resultsCharacters = await this.fetchCharactersByName([query], this.state.offset)
      const resultsCharactersFromComics = await this.fetchCharactersFromComics([query], this.state.offset)
      results = [...resultsCharacters, ...resultsCharactersFromComics]
      results = _.uniqBy(results, 'id')

      //The query is new?
      if (query !== this.state.query) {
        this.setState((state, props) => ({ query: query }))
        this.setState({ results: [...results] })
      } else {
        results = [...this.state.results, ...results]
        results = _.uniqBy(results, 'id')
        this.setState({ results: [...results] })
      }

      this.setState({ fetching: false })

    } catch (error) {
      console.log(error)
    }
  }
  fetchCharactersQueryParams = async (characters, comics) => {

    try {

      let results = [];
      this.setState({
        loading: true
      })
      this.setState({ fetching: true })

      if (characters === undefined || characters == "")
        characters = []
      if (comics === undefined || comics == "")
        comics = []


      //If the query came without comics
      if (characters.length >= 1 && comics.length === 0) {
        results = await this.fetchCharactersByName(characters, this.state.offset)
      }
      //If the query came without characters
      if (characters.length === 0 && comics.length >= 1) {
        results = await this.fetchCharactersByComics(comics, this.state.offset)
      }
      //if the query came with both
      if (characters.length !== 0 && comics.length !== 0) {
        results = await this.fetchCharactersFromComics(characters, comics, this.state.offset)
      }

      if (results.length !== 0) {
        if (this.state.offset > 0) {
          results = [...this.state.results, ...results]
          results = _.uniqBy(results, 'id')
          this.setState({ results: [...results] })
        } else {
          this.setState({ results: results })
        }
      }
      this.setState({ fetching: false })
      this.setState({ loading: false })

    } catch (error) {
      console.log(error)
    }
  }
  fetchCharactersByComics = async (comics, offset) => {

    try {
      let promisesComics = []
      //First get the comics matching entirely by name and not by how the comic name starts

      comics.forEach(comic => {
        let issueNumber = comic.match(/(#)([0-9])([0-9])?([0-9])?/g)
        if (issueNumber) {
          comic = comic.replace(issueNumber, '')
          issueNumber = issueNumber[0].substr(1)
        }
        console.log(comic, issueNumber, offset)
        promisesComics.push(fetch(`http://gateway.marvel.com/v1/public/comics${credentials}&offset=${offset}&title=${comic}&${issueNumber ? 'issueNumber=' + Number(issueNumber) : ''}`)
          .then(response => { return response.json() }))
      })
      let comicsResults = await Promise.all(promisesComics)
      console.log(comicsResults)


      //Once we get all the results, proceed to get the characters that are in the comics provided
      let promisesCharacters = []

      comicsResults.forEach(result => {
        result.data.results.forEach(comic => {
          if (comic.characters.available > 0) {
            promisesCharacters.push(fetch(`http://gateway.marvel.com/v1/public/comics/${comic.id}/characters${credentials}`)
              .then(response => {
                return response.json()
              }).then((data) => {
                return data
              }))
          }
        })
      })
      let charactersResults = await Promise.all(promisesCharacters)

      //Add all the results of the characters into one array and remove duplicates
      let totalCharacters = []
      charactersResults.forEach(result => {
        //Attach the comics in the character
        result.data.results.forEach(character => {
          const newCharacter = _.find(totalCharacters, { 'id': character.id })
          if (!newCharacter) {
            totalCharacters.push(character)
          }
        })
      })

      //Finally return the characters
      return totalCharacters
    } catch (error) {
      console.log(error)
    }

  }
  fetchCharactersByName = async (characters, offset) => {

    let promises = []
    let results = [];
    let promisesResults;

    characters.forEach((character) => {
      promises.push(fetch(`http://gateway.marvel.com/v1/public/characters${credentials}${(characters === "") ? "" : "&nameStartsWith=" + character}&offset=${offset}`)
        .then(response => { return response.json() })
      )
    });

    promisesResults = await Promise.all(promises)

    let flag = false;

    promisesResults.forEach(promiseResults => {
      if (promiseResults.data.count === promiseResults.data.limit) {
        if (promiseResults.data.offset === 0) {
          this.setState({ etag: promiseResults.etag })
        }

        this.setState({ offset: offset + promiseResults.data.limit })


      }
      results = [...results, ...promiseResults.data.results]
    });

    return results
  }
  fetchCharactersFromComics = async (comics, offset) => {
    try {
      let promisesComics = []
      //First get the comics matching entirely by name and not by how the comic name starts

      comics.forEach(comic => {
        let issueNumber = comic.match(/(#)([0-9])([0-9])?([0-9])?/g)
        if (issueNumber) {
          comic = comic.replace(issueNumber, '')
          issueNumber = issueNumber[0].substr(1)
        }
        promisesComics.push(fetch(`http://gateway.marvel.com/v1/public/comics${credentials}&offset=${offset}&title=${comic}&${issueNumber ? 'issueNumber=' + Number(issueNumber[0]) : ''}`)
          .then(response => { return response.json() }))
      })

      let comicsResults = await Promise.all(promisesComics)



      //Once we get all the results, proceed to get the characters that are in the comics provided
      let promisesCharacters = []

      let flag = false;
      let tempComics = []
      comicsResults.forEach(result => {

        tempComics = [...tempComics, result.data.results].flat()
        if (result.data.count === result.data.limit) {
          if (result.data.offset === 0) {
            this.setState({ etag: result.etag })
          }
          this.setState({ offset: offset + result.data.limit })
        }

        result.data.results.forEach(comic => {
          if (comic.characters.available > 0) {
            promisesCharacters.push(fetch(`http://gateway.marvel.com/v1/public/comics/${comic.id}/characters${credentials}`)
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
      //Finally return the characters


      return totalCharacters
    } catch (error) {
      console.log(error)
    }
  }
  fetchCharacterByResourceURI = (resourceURI) => {
    return new Promise(resolve => {
      fetch(resourceURI + credentials)
        .then(response => { return response.json() })
        .then(({ data }) => { resolve(data.results[0]) })
    })

  }
  fetchRandom = async () => {
    try {
      this.setState({ loading: true })
      //Asumimos que la busqueda inicial tendra por lo menos 50 paginas de resultados de las cuales obtendremos nuestro personaje random
      const randomPage = () => {
        return Math.floor(Math.random() * 50)
      }
      const response = await fetch(`http://gateway.marvel.com/v1/public/characters${credentials}&offset=${randomPage()}`)
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
    if (query == "") {
      this.fetchRandom()
    } else {
      flagCharacters = false;
      flagComics = false;
      this.setState({ noMoreResults: false })
      this.setState({ offset: 0 })
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
        {this.state.loading && <Loader></Loader>}
        < StyledCharacters >
          {this.state.results.map(character => (

            <CharacterCard key={character.id} character={character} onOpenModal={this.handleOpenModal} />
          ))}
          <ModalCharacterInfo character={this.state.character} isOpen={this.state.modalIsOpen} onClose={this.handleCloseModal} />
        </StyledCharacters>}
        {this.state.fetching && <Loader></Loader>}
        {this.state.noMoreResults && <h4 style={{ textAlign: "center" }}>No hay mas resultados</h4>}
      </div>


    )
  }

}



export default Characters
