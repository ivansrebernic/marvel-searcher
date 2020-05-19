import React from 'react'
import styled from 'styled-components'
import Loader from './components/Loader'
import ModalCharacterInfo from './components/ModalCharacterInfo'
import CharacterCard from './components/CharacterCard'
import NavBar from './components/NavBar'



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
const credentials = "?&ts=1&apikey=d267dc8180768e976a2442235e0617f6&hash=0ad4c739d3e46cefdb021c410ddefe5e"
class Characters extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      query: "",
      character: '',
      results: [],
      page: 0,
      filteredResults: [],
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
    this.fetchCharactersFromComicContainer = this.fetchCharactersFromComicContainer.bind(this)
  }
  handleScroll() {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    if (!this.state.noMoreResults && !this.state.fetching) {

      this.setState({ fetching: true });
      this.fetchMoreData()
    }


  }
  componentDidMount() {
    this.fetchRandom();

    window.addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)

  }
  fetchRandom = async () => {
    try {

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
    } catch (error) {
      this.setState({
        loading: false,
      })
      this.setState({
        error: error
      })
    }
  }

  fetchMoreData = async () => {
    try {
      const response = await fetch(`http://gateway.marvel.com/v1/public/characters${credentials}${this.state.query ? '&nameStartsWith=' + this.state.query : ''}&offset=${20 * this.state.page}`
        , {
          headers: { 'if-none-match': this.state.digest }
        })

      const characters = await response.json();


      this.setState({
        fetching: false
      })

      this.setState((state, props) => ({ page: state.page++ }))
      this.setState((state, props) => ({
        results: [...state.results, ...characters.data.results]
      }))

      if (characters.data.offset > characters.data.total - characters.data.count)
        this.setState({ noMoreResults: true })
    } catch (error) {
      this.setState({
        loading: false,
      })
      this.setState({
        error: error
      })
    }
  }
  getUnique(arr, comp) {
    // store the comparison  values in array
    const unique = arr.map(e => e[comp])
      // store the indexes of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)
      // eliminate the false indexes & return unique objects
      .filter((e) => arr[e]).map(e => arr[e]);
    return unique;
  }
  getCharacters(comics) {
    let characters = []
    comics.results.forEach(comic => {
      if (comic.characters.items.length > 0)
        comic.characters.items.forEach(character => {
          characters = [...characters, character]
        })
    })
    characters = this.getUnique(characters, 'name')
    return characters
  }
  fetchCharacters = async (value) => {

    try {
      let response = await fetch(`http://gateway.marvel.com/v1/public/characters${credentials}${value ? '&nameStartsWith=' + value : ''}`)
      const { data } = await response.json()
      return data.results
    } catch (err) {
      console.error(err)
    }

  }
  fetchCharactersFromComics = async (value) => {

    try {
      let totalCharacters = []
      let response = await fetch(`http://gateway.marvel.com/v1/public/comics${credentials}${value ? '&titleStartsWith=' + value : ''}`)
      const { data } = await response.json()
      console.log(data)
      data.results.forEach((comic) => {
        comic.characters.items.forEach((character) => {
          //If there are characters in the list
          if (totalCharacters.length !== 0) {
            let flag = false;
            //Check if the new extracted character already exists in characters list
            totalCharacters.forEach((characterInList) => {
              if (characterInList.name !== character.name) {
                return
              } else {
                flag = true;
              }
            }
            )
            if (!flag) {
              totalCharacters.push(character)
            }
          } else {
            totalCharacters.push(character)
          }
        })
      })
      /*
      let characters = []
      totalCharacters.forEach(async (character) => {
        const result = await this.fetchCharacter(character.resourceURI)
      })
      */
      return totalCharacters
    } catch (error) {
      console.log(error)
    }
  }
  fetchCharactersFromComicContainer = (charactersFromComicContainer) => {

    let promises = []
    charactersFromComicContainer.forEach((characterInComic) => {
      const promise = fetch(characterInComic.resourceURI + credentials).then(response => { return response.json() })
      promises.push(promise)
    })
    return promises

  }
  fetchData = async (value) => {

    let characters;
    let charactersFromComic
    let charactersPromises
    let newCharacters
    try {
      this.setState({ loading: true })
      characters = await this.fetchCharacters(value)
      if (value !== '') {
        charactersFromComic = await this.fetchCharactersFromComics(value);
        charactersPromises = await this.fetchCharactersFromComicContainer(charactersFromComic)
        newCharacters = await Promise.all(charactersPromises)
        console.log(newCharacters)
        newCharacters.forEach(({ data }) => {
          if (!characters.includes(data.results[0])) {
            characters.push(data.results[0])
          }
        })

      }


      this.setState((state, props) => ({
        results: [...characters]
      }))
      this.setState({ digest: characters.etag })


      this.setState({
        loading: false
      })
      this.setState((state, props) => ({ page: state.page + 1 }))
      this.setState({ fetching: false })
      this.setState({ noMoreResults: false })



    } catch (error) {
      this.setState({
        loading: false,
      })
      this.setState({
        error: error
      })
    }
  }
  setQuery(value) {
    this.setState((state, props) => ({ query: value }))
    this.fetchData(value)
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
