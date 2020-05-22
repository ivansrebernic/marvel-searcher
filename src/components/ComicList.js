import React from 'react'
import styled from 'styled-components'


const ComicListStyled = styled.ul`
    background-color:#F7F8FA;
    width:80%;
    height:80%;
    max-height:70vh;
    max-width:50rem;
    padding:0;
    overflow:auto;

    list-style-type:none;

    li:nth-child(2n){
        background-color:#F7F8FA;
    }
    li:nth-child(2n+1){
        background-color:white;
    }

`
const ComicItem = styled.li`

    display:flex;
    height:100%;
    max-height:5rem;
    width:100%;
    justify-content:space-around;
    span{
        margin:auto;
        text-align:center;
        display:inline-block;
    }
    img{
        margin:5px;
    }

    @media (max-width: 768px) {
        span{
            margin:none;
        }
      }


`


class ComicList extends React.Component {

    constructor(props) {
        super(props)
        this.state = { comics: [] }
        this.extractYearFromString = this.extractYearFromString.bind(this)
    }

    componentDidMount() {
        console.log(this.props.comics)
        const sortedComics = this.props.comics.items.sort(this.sortComics)
        this.setState({ comics: sortedComics })
    }

    //Apply regex to find the year of origin from title string
    extractYearFromString = (string) => {
        const year = /\b(19[0-9][0-9]|200[0-9]|201[0-9])\b/.exec(string);
        if (!year)
            return 0
        return Number(year[0])
    }

    //Sort comics by year in which they were released
    sortComics = (a, b) => {

        const dateA = this.extractYearFromString(a.name || a.title)
        const dateB = this.extractYearFromString(b.name || b.title)
        if (dateA > dateB)
            return 1
        if (dateB > dateA)
            return -1

        return 0;
    };


    render() {
        return (
            <ComicListStyled >
                {
                    this.state.comics.map(comic => (
                        <ComicItem key={comic.name || comic.title}>
                            <span>{comic.name || comic.title}</span>
                            {comic.thumbnail &&
                                <img src={comic.thumbnail.path + "/portrait_small." + comic.thumbnail.extension}></img>
                            }
                        </ComicItem>
                    ))
                }
            </ ComicListStyled>
        )
    }

}

export default ComicList