import React from 'react'
import SearchInput from './SearchInput'
import SearchIconPNG from '../assets/images/search.png'
import styled from 'styled-components'



const SearchBoxStyled = styled.div`
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

class SearchBox extends React.Component {


    //Rember to attribute Icons made by <a href="https://www.flaticon.com/authors/good-ware" title="Good Ware">Good Ware</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
    render() {
        return (

            <SearchBoxStyled>
                <SearchIcon src={SearchIconPNG} />
                <SearchInput >asd</SearchInput>

            </SearchBoxStyled>

        )
    }
}


export default SearchBox