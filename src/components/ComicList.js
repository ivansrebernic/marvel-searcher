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
        const year = /(\d{4})/.exec(string);
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
                        </ComicItem>
                    ))
                }
            </ ComicListStyled>
        )
    }

}

export default ComicList