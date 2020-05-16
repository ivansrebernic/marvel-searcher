import React from 'react'
import styled from 'styled-components'

class CharacterCard extends React.Component {

    constructor({ character, props }) {
        super(props)
        console.log(character.thumbnail.path + "." + character.thumbnail.extension)
    }

    render() {
        return (
            <CharacterCardStyled character={this.props.character}>
                {this.props.character.name}

            </CharacterCardStyled >
        )
    }


}

const CharacterCardStyled = styled.div`
    display:inline-flex;
    background-image: url("${props => props.character.thumbnail.path}/portrait_xlarge.${props => props.character.thumbnail.extension}");
    background-size:cover;

    justify-self: stretch;
    height:30rem;

`


export default CharacterCard