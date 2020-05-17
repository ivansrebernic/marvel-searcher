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

    const [favorites, setFavorites] = React.useState([]);
    const [query, setQuery] = React.useState({ query: '' })

    //Rember to attribute Icons made by <a href="https://www.flaticon.com/authors/good-ware" title="Good Ware">Good Ware</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
    const addQueryToFavorites = () => {
        if (!favorites.includes(query)) {
            setFavorites([...favorites, query])
            console.log(query + " added to favorites")
        }
    }
    const removeQueryFromFavorites = () => {
        const index = favorites.indexOf(query)
        const newFavorites = favorites.filter(favorite => { return favorite != query })
        setFavorites(newFavorites)
        console.log(query + " removeds to favorites")
    }
    const submitQuery = (e) => {
        e.preventDefault()
        props.handleQuery(e.target.value)
    }

    return (
        <SearchBoxStyled onSubmit={e => submitQuery(e)}>
            <SearchIcon src={SearchIconPNG} />
            <SearchInput handleQuery={(query) => setQuery(query)}></SearchInput>
            <FavoriteButton isFavorite={favorites.includes(query)} onFavorite={addQueryToFavorites} onUnfavorite={removeQueryFromFavorites} />
        </SearchBoxStyled >
    )
}



export default SearchBox