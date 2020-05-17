import React from 'react'
import styled from 'styled-components'


const FavoritesListStyled = styled.ul`
    position:absolute;
    background-color:white;
    width:80vw;
    top:100%;
    margin:0;
    padding:0;
    border-radius: 0 0 20px 20px;
`


function FavoritesList(props) {



    return (

        <FavoritesListStyled  >
            {props.children}
        </FavoritesListStyled>

    )


}

export default FavoritesList