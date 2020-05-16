import React from 'react'
import SearchBox from './SearchBox'
import Logo from '../assets/images/marvel-brand.png'
import styled from 'styled-components'


const NavBarStyled = styled.nav`
    display:flex;
    background-color:white;

`
const NavBarBrand = styled.span`
    background-image: url(${Logo});
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    height:4rem;
    width:10rem;

`

function NavBar(props) {


    return (
        <NavBarStyled>
            <NavBarBrand />
            <SearchBox></SearchBox>
        </NavBarStyled>
    )
}

export default NavBar