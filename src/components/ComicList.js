import React from 'react'
import styled from 'styled-components'
import Loader from './Loader'


const ComicListStyled = styled.ul`

    margin:1rem;
    height:70vh;
    width:80%;
    padding:0;
    overflow:hidden;
    overflow-y:scroll;
    li:nth-child(2n){
        background-color:${props => props.theme.main.listitema};
    }
    li:nth-child(2n+1){
        background-color:${props => props.theme.main.listitemb};
    }

    @media (max-width: 768px) {
        height:80vh;
      }

`
const ComicItem = styled.li`
      width:100%;
    display:flex;
    justify-content:space-around;
    height:5rem;
    span{
        margin:auto;
        text-align:center;

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
let offset = 0;
class ComicList extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            comics: [],
            loading: false,
            noMoreComics: false
        }
        this.extractYearFromString = this.extractYearFromString.bind(this)
        this.loadComics = this.loadComics.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
    }

    componentDidMount() {
        offset = 0;
        document.addEventListener('scroll', this.trackScrolling);
        this.loadComics()
    }
    handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom && !this.state.noMoreComics && !this.state.loading) {
            this.loadComics()
        }
    }

    loadComics = async () => {

        try {
            this.setState({ loading: true })
            const response = await fetch(this.props.comics.collectionURI + "?apikey=" + process.env.REACT_APP_PUBLIC_KEY + "&hash=" + process.env.REACT_APP_HASH + "&ts=" + process.env.REACT_APP_TS + "&orderBy=modified&offset=" + offset)
            const { data } = await response.json()
            offset += data.count
            if (data.count < data.limit && data.offset > 0) {
                this.setState({ noMoreComics: true })
            }
            this.setState({
                comics: [...this.state.comics, ...data.results],
                loading: false
            })
        } catch (e) {

        }

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
            <ComicListStyled onScroll={this.handleScroll}>
                {
                    this.state.comics.map(comic => (
                        <ComicItem key={comic.id}>
                            <span>{comic.name || comic.title}</span>
                            {comic.thumbnail &&
                                <img src={comic.thumbnail.path + "/portrait_small." + comic.thumbnail.extension} alt="hero thumbnail"></img>
                            }
                        </ComicItem>
                    ))


                }
                {!this.state.loading && this.state.noMoreComics && <li style={{ 'textAlign': 'center' }}>There is no more comics...</li>}
                {this.state.loading && <li><Loader></Loader></li>}
                {!this.state.loading && this.state.comics.length === 0 && !this.state.noMoreComics && <li>There is no comics registered from this super-hero</li>}
            </ ComicListStyled >
        )
    }

}

export default ComicList