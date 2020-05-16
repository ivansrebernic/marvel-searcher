import React from 'react'
import styled from 'styled-components'



const SearchInputStyled = styled.input`
    width:100%;
    height:2.5rem;
    border: none;
    align-self: center;
    font-size:24px;
    &::placeholder{
        color:rgb(192,192,192);
    }
    &:focus, textarea:focus, select:focus{
        outline: none;
    }
`

class SearchInput extends React.Component {



    render() {
        return (
            <SearchInputStyled placeholder="Search" />
        )
    }

}

export default SearchInput