import React from 'react'
import styled from 'styled-components'
import CharacterCard from './components/CharacterCard'

class Characters extends React.Component {


  state = {
    data: {
      results: []
    }
  }
  //TS: 1
  //Private Key : 689e54de613203045cc2402b42581b8914fff973
  //Public Key : d267dc8180768e976a2442235e0617f6
  //Hash MD5 : 0ad4c739d3e46cefdb021c410ddefe5e
  /* EXAMPLE
  /* http://gateway.marvel.com/v1/public/comics?ts=1&apikey=d267dc8180768e976a2442235e0617f6&hash=0ad4c739d3e46cefdb021c410ddefe5e */

  componentDidMount() {
    //this.fetchData();


  }
  fetchData = async () => {
    const response = await fetch("http://gateway.marvel.com/v1/public/characters?ts=1&apikey=d267dc8180768e976a2442235e0617f6&hash=0ad4c739d3e46cefdb021c410ddefe5e")
    const { data } = await response.json();
    this.setState({ data: data })

  }

  render() {
    return (
      < StyledCharacters >
        {
          this.state.data.results.map(character => (
            <CharacterCard key={character.id} character={character}>
            </CharacterCard>
          ))
        }
      </StyledCharacters>
    )
  }

}

const StyledCharacters = styled.div`
  background-color: #E5E5E5;

  margin-top:5rem;
  margin-left:5rem;
  margin-right:5rem;
  display: grid;
  justify-content: center;
  grid-gap: 1rem 1rem;
  grid-template-columns: repeat(auto-fill, 400px);


`



export default Characters