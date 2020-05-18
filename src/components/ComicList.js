import React from 'react'
import styled from 'styled-components'

const ComicListStyled = styled.ul`
    background-color:#F7F8FA;
    margin:1rem;
    padding:0;

    max-height:300px;
    overflow:scroll;
    list-style-type:none;
    overflow-x:hidden;
`
const ComicItem = styled.li`
    display:flex;
    justify-content:space-between;

`


function ComicList(props) {


    //Apply regex to find the year of origin from title string
    const extractYearFromString = (string) => {
        const year = /(\d{4})/.exec(string);
        if (!year)
            return 0

        return Number(year[0])
    }

    //Sort comics by year in which they were released
    let sortComics = (a, b) => {

        const dateA = extractYearFromString(a.name)
        const dateB = extractYearFromString(b.name)
        if (dateA > dateB)
            return 1
        if (dateB > dateA)
            return -1

        return 0;
    };

    let sortedComics = props.comicList.sort(sortComics)

    return (



        <ComicListStyled >
            {
                sortedComics.map(comic => (
                    <ComicItem key={comic.name}>
                        <span>{comic.name}</span>
                    </ComicItem>
                ))
            }
        </ ComicListStyled>
    )
}

export default ComicList