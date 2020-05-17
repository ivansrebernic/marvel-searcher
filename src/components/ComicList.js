import React from 'react'
import styled from 'styled-components'

const ComicListStyled = styled.ul`
    background-color:#F7F8FA;
    margin:0;
    padding:0;
    max-width:300px;
    height:100px;
    width:100%;
    overflow:scroll;
    list-style-type:none;
`
const ComicItem = styled.li`
    display:flex;
    justify-content:space-between;
    border-bottom: 1px solid grey;

    margin:3px;
    padding:5px;

`


function ComicList(props) {



    return (
        <ComicListStyled>
            {
                props.comicList.map(comic => (
                    <ComicItem>
                        <span>{comic.name}</span>
                        <span>[Fecha]</span>
                    </ComicItem>
                ))
            }
        </ComicListStyled >
    )
}

export default ComicList