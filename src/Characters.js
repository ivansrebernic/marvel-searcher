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
      data: {
        results: [],

      },
      filteredResults: [],
      isModalOpen: false,
      loading: false,
      error: null
    }

    this.state.filteredResults = this.state.data.results
    this.handleCloseModal = this.handleCloseModal.bind(this)
    this.handleOpenModal = this.handleOpenModal.bind(this)
    this.setQuery = this.setQuery.bind(this)
  }
  componentDidMount() {
    this.fetchData();

  }
  fetchData = async () => {

    try {
      this.setState({ loading: true })
      const response = await fetch(`http://gateway.marvel.com/v1/public/characters?ts=1&apikey=d267dc8180768e976a2442235e0617f6&hash=0ad4c739d3e46cefdb021c410ddefe5e`)
      const { data } = await response.json();
      this.setState({
        loading: false
      })
      this.setState({
        data: data
      })
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

    this.setState({ query: value })
    const filteredResults = this.state.data.results.filter(result => {
      return result.name.toLowerCase().includes(value.toLowerCase())
    })

    this.setState({ filteredResults })
  }

  handleCloseModal(e) {
    e.stopPropagation()
    this.setState({ isModalOpen: false })
    this.setState({ character: null })
    console.log(this.state.isModalOpen)
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

        {this.state.loading && <Loader />}
        {!this.state.loading && < StyledCharacters >
          {this.state.data.results.map(character => (
            <CharacterCard key={character.id} character={character} onOpenModal={this.handleOpenModal} />
          ))}
          <ModalCharacterInfo character={this.state.character} isOpen={this.state.modalIsOpen} onClose={this.handleCloseModal} />
        </StyledCharacters>}

      </div>


    )
  }

}



export default Characters
