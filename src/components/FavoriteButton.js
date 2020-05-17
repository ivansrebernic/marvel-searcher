import React from 'react'
import styled from 'styled-components'
import FavIcon from '../assets/images/fav.png'
import FavIconToggled from '../assets/images/fav-toggled.png'


const FavoriteButtonStyled = styled.a`
    align-self:center;
    margin-left:1rem;
    margin-right: 1rem;
    &:hover{
        cursor: pointer;
    }
     img {
        width: 32px;
        height:32px;
    }
`




function FavoriteButton(props) {


    const toggleButton = (e) => {
        e.stopPropagation();

        props.isFavorite ? props.onUnfavorite() : props.onFavorite()
    }



    return (

        <FavoriteButtonStyled className={props.className} onClick={toggleButton} >
            <img src={props.isFavorite ? FavIconToggled : FavIcon} alt="favorite button" />
        </FavoriteButtonStyled >

    )
}

export default FavoriteButton;