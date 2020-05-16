import React from 'react'
import styled from 'styled-components'
import FavIcon from '../assets/images/fav.png'
import FavIconToggled from '../assets/images/fav-toggled.png'


const FavoriteButtonStyled = styled.a`
    align-self:center;
    margin-left:1rem;
    margin-right: 1rem;
    &:hover{
        cursor: pointer;
    }
     img {
        width: 32px;
        height:32px;
    }
`




class FavoriteButton extends React.Component {


    constructor(props) {
        super(props)
        this.state = { isFavorite: false }
        this.toggleButton = this.toggleButton.bind(this);
    }


    toggleButton() {
        this.setState(state => ({
            isFavorite: !state.isFavorite
        }))
        console.log("asd")
    }

    render() {
        return (
            <FavoriteButtonStyled onClick={this.toggleButton} >
                <img src={this.state.isFavorite ? FavIconToggled : FavIcon} />
            </FavoriteButtonStyled >



        )
    }
}

export default FavoriteButton;