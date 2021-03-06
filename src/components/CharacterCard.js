import React from 'react'
import styled from 'styled-components'
import FavoriteButton from './FavoriteButton'

//The size of the thumbnails that is going to be requested
//TO DO: Comment other variants
const imageSize = "portrait_xlarge"



const CharacterCardStyled = styled.div`

    display:inline-flex;
    flex-direction: column;
    background-color:gray;
    background-image: url("${props => props.character.thumbnail.path}/${imageSize}.${props => props.character.thumbnail.extension}");
    background-size:cover;
    justify-content: space-between;
    height:30rem;
    transition: 0.3s ease-in;
    h1{


        -webkit-text-fill-color: white; /* Will override color (regardless of order) */
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: black;
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

        <CharacterCardStyled character={props.character} onClick={(e) => props.onOpenModal(e, props.character)}>
            <FavoriteButtonStyled isFavorite={favorite} onFavorite={handleFavorite} onUnfavorite={handleUnfavorite} />
            <h1 >
                {props.character.name}
            </h1>
        </CharacterCardStyled >

    )



}



export default CharacterCard