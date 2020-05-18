import React from 'react'
import styled from 'styled-components'

const FavoriteItemStyled = styled.li`
    z-index:1000;   
    font-size:24px;
    margin:0.5rem;
    display:flex;
    justify-content:space-between;
    align-items:center;
    height:2rem;


    &:hover{
        cursor:pointer;
        background-color:#E5E5E5;
    }
`
function FavoriteItem(props) {

    return (
        <FavoriteItemStyled onClick={props.returnQuery}>
            {props.children}
        </FavoriteItemStyled>
    )

}

export default FavoriteItem