import React from 'react'
import SearchInput from './SearchInput'
import FavoriteButton from './FavoriteButton'
import FavoritesListItem from './FavoritesListItem'
import FavoritesList from './FavoritesList'
import SearchIconPNG from '../assets/images/search.png'
import styled from 'styled-components'
import ls from 'local-storage'


const SearchBoxStyled = styled.form`
    display:flex !important;
    justify-content: between;
    z-index:1000;
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
    const [query, setQuery] = React.useState("")
    const [collapsed, setCollapsed] = React.useState('')

    React.useEffect(function () {

        const storedFavorites = ls.get('favorites')
        if (storedFavorites) {
            setFavorites(storedFavorites)
        }


    }, []);

    //Rember to attribute Icons made by <a href="https://www.flaticon.com/authors/good-ware" title="Good Ware">Good Ware</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
    const addQueryToFavorites = () => {
        if (query !== "" && !favorites.includes(query)) {
            setFavorites([...favorites, query])
            ls.set('favorites', [...favorites, query])
        }

    }
    const removeQueryFromFavorites = () => {

        if (favorites) {
            const newFavorites = favorites.filter(favorite => { return favorite !== query })
            setFavorites(newFavorites)
            ls.set('favorites', newFavorites)
        }

    }
    const submitQuery = (e) => {
        e.preventDefault()
        props.handleQuery(query)
    }
    const handleQueryInput = (e) => {
        setQuery(e.target.value)

    }
    const handleQueryList = (e) => {
        setQuery(e.target.innerHTML)
    }

    const collapseFavoritesList = () => {
        setCollapsed(true);
    }
    const handleCollapse = () => {
        setCollapsed(false)
    }
    const favoritesList = (
        <FavoritesList >
            {
                favorites.map(query => (
                    <FavoritesListItem key={query} returnQuery={handleQueryList}>{query}</FavoritesListItem>
                ))
            }
        </FavoritesList>)
    return (
        <SearchBoxStyled onFocus={handleCollapse} onBlur={collapseFavoritesList} tabIndex="0" onSubmit={e => submitQuery(e)} >
            <SearchIcon src={SearchIconPNG} />
            <SearchInput handleQuery={handleQueryInput} >{query}</SearchInput>
            {!collapsed && favoritesList}

            <FavoriteButton isFavorite={favorites.includes(query)} onFavorite={addQueryToFavorites} onUnfavorite={removeQueryFromFavorites} />
        </SearchBoxStyled >
    )



}



export default SearchBox