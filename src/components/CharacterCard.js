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

function CharacterCard(props) {

    const [favorite, setFavorite] = React.useState(false);


    const handleFavorite = () => {
        setFavorite(true)
    }
    const handleUnfavorite = () => {
        setFavorite(false)
    }

    return (

        <CharacterCardStyled character={props.character} onClick={props.onOpenModal}>
            <FavoriteButtonStyled isFavorite={favorite} onFavorite={handleFavorite} onUnfavorite={handleUnfavorite} />
            <h2 >
                {props.character.name}
            </h2>
            <Modal character={props.character} isOpen={props.modalIsOpen} onClose={props.onCloseModal}></Modal>
        </CharacterCardStyled >

    )



}



export default CharacterCard