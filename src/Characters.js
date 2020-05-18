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
      error: null
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
      const response = await fetch(`http://gateway.marvel.com/v1/public/characters?${this.state.query ? 'nameStartsWith=' + this.state.query : ''}&ts=1&apikey=d267dc8180768e976a2442235e0617f6&hash=0ad4c739d3e46cefdb021c410ddefe5e&offset=${20 * this.state.page}`)
      const { data } = await response.json();


      this.setState({
        fetching: false
      })
      this.setState((state, props) => ({
        results: [...state.results, ...data.results]
      }))
      this.setState((state, props) => ({ page: state.page + 1 }))

      if (data.offset > data.total - data.count)
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
  fetchData = async (value) => {
    try {
      this.setState({ loading: true })
      const response = await fetch(`http://gateway.marvel.com/v1/public/characters?${value ? 'nameStartsWith=' + value : ''}&ts=1&apikey=d267dc8180768e976a2442235e0617f6&hash=0ad4c739d3e46cefdb021c410ddefe5e`)
      const { data } = await response.json();


      this.setState({
        loading: false
      })

      this.setState({ page: 2 })
      this.setState({ fetching: false })
      this.setState({ noMoreResults: false })
      if (data) {
        this.setState((state, props) => ({
          results: [...data.results]
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
