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

//The global state of the application, the query will be stored here for easier access from the parent container
const credentials = "?&ts=1&apikey=5460d0eab98a150ad956ad40e9fc8d16&hash=2f9134ed0757cff89b65d4e472cf9267"
class Characters extends React.Component {


  constructor(props) {
    super(props)
    //console.log(props.location.search)
    //console.log(qs.parse(props.location.search), { arrayFormat: 'comma' })
    this.state = {
      query: "",
      character: '',
      results: [],
      page: 0,
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
      this.setState({ fetching: true });
      this.fetchCharactersSearchBar(this.state.query)
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
      this.fetchCharacters(characters, comics)
    } else {
      this.fetchRandom();
    }
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
  fetchCharactersSearchBar = async (query) => {
    try {
      let results = []
      let page = 0;
      this.setState({
        loading: true
      })
      if (query != this.state.query) {
        this.setState({ page: page })
      }
      else {
        page = this.state.page
      }
      const resultsCharacters = await this.fetchCharactersByName([query], page)
      console.log(resultsCharacters, this.state.page)
      const resultsCharactersFromComics = await this.fetchCharactersFromComics([query], page)
      results = [...resultsCharacters, ...resultsCharactersFromComics]

      if (results.length === 0) {
        results = []
      } else {
        if (this.state.page > 0) {
          results = [...this.state.results, ...results]
          results = _.uniq(results);
          this.setState((state, props) => ({
            results: results
          }))
        } else {
          this.setState({ results: results })
        }
      }
      this.setState({
        loading: false
      })
      if (results.length < 20) {
        this.setState({ noMoreResults: true })
      } else {
        this.setState({ noMoreResults: false })
      }
      this.setState((state, props) => ({ page: state.page + 1 }))
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
      if (characters === undefined || characters == "")
        characters = []
      if (comics === undefined || comics == "")
        comics = []
      //If the query came without comics
      if (characters.length >= 1 && comics.length === 0) {
        results = await this.fetchCharactersByName(characters, this.state.page)
      }
      //If the query came without characters
      if (characters.length === 0 && comics.length >= 1) {
        results = await this.fetchCharactersByComic(comics, this.state.page)
      }
      //if the query came with both
      if (characters.length !== 0 && comics.length !== 0) {
        results = await this.fetchCharactersFromComics(characters, comics, this.state.page)
      }
      if (results.length === 0) {
        results = []
      } else {
        if (this.state.page > 0) {
          this.setState((state, props) => ({
            results: [...state.results, results]
          }))
        } else {
          this.setState({ results: results })
        }
      }
      this.setState({
        loading: false
      })
      if (results.length < 20) {
        this.setState({ noMoreResults: true })
      }
      this.setState((state, props) => ({ page: state.page + 1 }))
      this.setState({ fetching: false })
    } catch (error) {
      console.log(error)
    }
  }
  fetchCharactersByName = async (characters, page) => {
    let promises = []
    let results = [];
    let promisesResults;
    characters.forEach((character) => {
      promises.push(fetch(`http://gateway.marvel.com/v1/public/characters${credentials}${(characters == "") ? "" : "&nameStartsWith=" + character}&offset=${page * 20}`)
        .then(response => { return response.json() })
      )
    });
    promisesResults = await Promise.all(promises)
    promisesResults.forEach(promiseResults => {
      results = [...results, ...promiseResults.data.results]
    });
    return results
  }
  fetchCharactersFromComics = async (value, page) => {
    try {
      let totalCharacters = []
      let promises = []
      let response = await fetch(`http://gateway.marvel.com/v1/public/comics${credentials}${value ? '&title=' + value : ''}`)
      const { data } = await response.json()

      data.results.forEach((comic) => {
        if (comic.characters.available > 0) {
          promises.push(fetch(`http://gateway.marvel.com/v1/public/comics/${comic.id}/characters${credentials}`).then(response => { return response.json() }))
        }

      })
      totalCharacters = Promise.all(promises)
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
    this.setState((state, props) => ({ query: query }))
    if (query == "") {
      this.fetchRandom()
    } else {
      this.fetchCharactersSearchBar(query)
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
