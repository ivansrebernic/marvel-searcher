import React from 'react'
import styled from 'styled-components'
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
      data: {
        results: [
          {
            id: 1,
            name: "Super-man",
            description: "The best of them all supah heroes lorem20aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            thumbnail: {
              path: "/src/assets/images/portrait_xlarge",
              extension: "jpg"
            },
            comics: {
              items: [
                { name: "Superman return" },
                { name: "Superman returns again" },
                { name: "Superman reborns" },
                { name: "Superman redies" },
                { name: "Superman return" },
                { name: "Superman returns again" },
                { name: "Superman reborns" },
                { name: "Superman redies" }
              ]
            }
          },
          {
            id: 2,
            name: "Mujer maravilla",
            description: "The best of them all supah heroes lorem20aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            thumbnail: {
              path: "/src/assets/images/portrait_xlarge",
              extension: "jpg"
            },
            comics: {
              items: [
                { name: "Superman return" },
                { name: "Superman returns again" },
                { name: "Superman reborns" },
                { name: "Superman redies" },
                { name: "Superman return" },
                { name: "Superman returns again" },
                { name: "Superman reborns" },
                { name: "Superman redies" }
              ]
            }
          },
          {
            id: 3,
            name: "Linterna verde",
            description: "The best of them all supah heroes lorem20aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            thumbnail: {
              path: "/src/assets/images/portrait_xlarge",
              extension: "jpg"
            },
            comics: {
              items: [
                { name: "Superman return" },
                { name: "Superman returns again" },
                { name: "Superman reborns" },
                { name: "Superman redies" },
                { name: "Superman return" },
                { name: "Superman returns again" },
                { name: "Superman reborns" },
                { name: "Superman redies" }
              ]
            }
          },
          {
            id: 4,
            name: "Ant-man",
            description: "The best of them all supah heroes lorem20aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            thumbnail: {
              path: "/src/assets/images/portrait_xlarge",
              extension: "jpg"
            },
            comics: {
              items: [
                { name: "Superman return" },
                { name: "Superman returns again" },
                { name: "Superman reborns" },
                { name: "Superman redies" },
                { name: "Superman return" },
                { name: "Superman returns again" },
                { name: "Superman reborns" },
                { name: "Superman redies" }
              ]
            }
          }
        ],

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
    //this.fetchData();
    const data = {}

  }
  fetchData = async () => {

    try {
      const response = await fetch("http://gateway.marvel.com/v1/public/characters?ts=1&apikey=d267dc8180768e976a2442235e0617f6&hash=0ad4c739d3e46cefdb021c410ddefe5e")
      const { data } = await response.json();
      this.setState({ data: data })
    } catch (error) {
      this.setState({
        loading: false,
        error: error
      })
    }
  }
  setQuery(value) {

    this.setState({ query: value })

    const filteredResults = this.state.data.results.filter(result => {
      return result.name.toLowerCase().includes(value.toLowerCase())
    })
    console.log(filteredResults)
    this.setState({ filteredResults })


  }

  handleCloseModal(e) {
    e.stopPropagation()
    this.setState({ isModalOpen: false }, () => {
      console.log(this.state.isModalOpen)
    })
  }
  handleOpenModal(e) {
    e.stopPropagation()
    if (!this.state.isModalOpen) {
      this.setState({ isModalOpen: true }, () => {
        console.log(this.state.isModalOpen)
      })
    }
  }

  render() {




    return (
      <div>
        <NavBar handleQuery={this.setQuery} />
        < StyledCharacters >
          {this.state.filteredResults.map(character => (
            <CharacterCard key={character.id} character={character} modalIsOpen={this.state.isModalOpen} onOpenModal={this.handleOpenModal} onCloseModal={this.handleCloseModal} />
          ))}
        </StyledCharacters>
      </div>


    )
  }

}



export default Characters
