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
    border-radius:10px;
    transition: 0.1s ease-in;
    &:hover{
        cursor:pointer;
        background-color:lightgrey;
    }
`
function FavoriteItem(props) {

    const handleClick = () => {
        console.log(props.children)
        console.log(props)

    }

    return (
        <FavoriteItemStyled onClick={props.returnQuery}>
            {props.children}
        </FavoriteItemStyled>
    )

}

export default FavoriteItem