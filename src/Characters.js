import React from 'react'
import styled from 'styled-components'
import CharacterCard from './components/CharacterCard'

const mockData = {
  results: [
    {
      character: {
        name: "SupahMen",
        thumbnail: {
          path: "../assets/images/",
          extension: ".jpeg"
        }

      }
    }
  ]
}
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


class Characters extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
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
          }
        ]
      },
      isModalOpen: ''
    }

    this.handleCloseModal = this.handleCloseModal.bind(this)
    this.handleOpenModal = this.handleOpenModal.bind(this)
  }

  componentDidMount() {
    //this.fetchData();
  }
  fetchData = async () => {
    const response = await fetch("http://gateway.marvel.com/v1/public/characters?ts=1&apikey=d267dc8180768e976a2442235e0617f6&hash=0ad4c739d3e46cefdb021c410ddefe5e")
    const { data } = await response.json();
    this.setState({ data: data })
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
      < StyledCharacters >
        {
          this.state.data.results.map(character => (
            <CharacterCard key={character.id} character={character} modalIsOpen={this.state.isModalOpen} onOpenModal={this.handleOpenModal} onCloseModal={this.handleCloseModal}>
            </CharacterCard>
          ))
        }
      </StyledCharacters>
    )
  }

}



export default Characters