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

    }
`




function SearchInput(props) {


    return (
        <SearchInputStyled type="text" value={props.children} onFocus={props.handleFocus} onBlur={props.handleFocus} onChange={props.handleQuery} placeholder="Search" />
    )


}

export default SearchInput