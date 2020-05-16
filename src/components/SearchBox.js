import React from 'react'
import SearchInput from './SearchInput'
import FavoriteButton from './FavoriteButton'
import SearchIconPNG from '../assets/images/search.png'
import styled from 'styled-components'



const SearchBoxStyled = styled.form`
    display:flex !important;
    justify-content: between;

    width: 100%;
    max-width: 80vw;

    align-self:center;
    height: 3rem;

    padding-left:1rem;
    padding-right:1rem;

    border-right: 1px solid lightgray;
    border-left: 1px solid lightgray;

`
const SearchIcon = styled.img`
    align-self:center;
    margin-right:5px;
    width:24px;
    height:24px;
`

function SearchBox(props) {



    //Rember to attribute Icons made by <a href="https://www.flaticon.com/authors/good-ware" title="Good Ware">Good Ware</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>

    return (
        <SearchBoxStyled onSubmit={e => e.preventDefault()}>
            <SearchIcon src={SearchIconPNG} />
            <SearchInput handleQuery={props.handleQuery}></SearchInput>
            <FavoriteButton />
        </SearchBoxStyled>
    )
}



export default SearchBox