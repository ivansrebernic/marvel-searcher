import React from 'react'
import styled from 'styled-components'
import Thumbnail from '../assets/images/portrait_xlarge.jpg'
import FavoriteButton from './FavoriteButton'
import Modal from './Modal'
//const imageSize = "portrait_xlarge"


//background-image: url("${props => props.character.thumbnail.path}/${imageSize}.${props => props.character.thumbnail.extension}");
const CharacterCardStyled = styled.div`

    display:inline-flex;
    flex-direction: column;
    background-color:gray;
    background-image: url(${Thumbnail})
    background-size:cover;
    justify-content: space-between;
    height:30rem;
    transition: 0.3s ease-in;
    h2{
        color:white;
        margin: 1rem;
        display:block;
        justify-content:flex-end;
    }
    &:hover{
        cursor: pointer;
        box-shadow: 2px 2px 5px black;
    }

`
const FavoriteButtonStyled = styled(FavoriteButton)`
    align-self:flex-end;
    margin-top: 1rem;

`

class CharacterCard extends React.Component {

    constructor({ character, props }) {
        super(props)

    }
    state = {

    }
    render() {
        return (

            <CharacterCardStyled character={this.props.character} onClick={this.props.onOpenModal}>
                <FavoriteButtonStyled />
                <h2 >
                    {this.props.character.name}
                </h2>
                <Modal character={this.props.character} isOpen={this.props.modalIsOpen} onClose={this.props.onCloseModal}></Modal>
            </CharacterCardStyled >

        )
    }


}



export default CharacterCard