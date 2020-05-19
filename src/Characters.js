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
      const response = await fetch(`http://gateway.marvel.com/v1/public/characters?&ts=1&apikey=d267dc8180768e976a2442235e0617f6&hash=0ad4c739d3e46cefdb021c410ddefe5e&offset=${randomPage()}`)
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
      const response = await fetch(`http://gateway.marvel.com/v1/public/characters?${this.state.query ? 'nameStartsWith=' + this.state.query : ''}&ts=1&apikey=d267dc8180768e976a2442235e0617f6&hash=0ad4c739d3e46cefdb021c410ddefe5e&offset=${20 * this.state.page}`
        , {
          headers: { 'if-none-match': this.state.digest }
        })

      const characters = await response.json();
      console.log(this.state.digest)

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

  fetchData = async (value) => {
    try {
      this.setState({ loading: true })

      let responseCharacters = await fetch(`http://gateway.marvel.com/v1/public/characters?${value ? 'nameStartsWith=' + value : ''}&ts=1&apikey=d267dc8180768e976a2442235e0617f6&hash=0ad4c739d3e46cefdb021c410ddefe5e`)
<<<<<<< HEAD
      const characters = await responseCharacters.json()
=======
      const { data: characters } = await responseCharacters.json()

>>>>>>> 6f757b639f2c4936b39b6fc2ffecaca15dc4d7d8
      let responseComics
      let comics
      if (value !== '') {
        responseComics = await fetch(`http://gateway.marvel.com/v1/public/comics?${value ? 'titleStartsWith=' + value : ''}&ts=1&apikey=d267dc8180768e976a2442235e0617f6&hash=0ad4c739d3e46cefdb021c410ddefe5e`)
        comics = await responseComics.json()
      }
<<<<<<< HEAD
      this.setState({ digest: characters.etag })
      const data = [...characters.data.results]

=======

      let results = comics.data.results
      console.log(results)

      const data = [...characters.results]
>>>>>>> 6f757b639f2c4936b39b6fc2ffecaca15dc4d7d8
      this.setState({
        loading: false
      })
      this.setState((state, props) => ({ page: state.page + 1 }))
      this.setState({ fetching: false })
      this.setState({ noMoreResults: false })
      if (data) {
        this.setState((state, props) => ({
          results: data
        }))
      }

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
