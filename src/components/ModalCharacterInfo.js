import React from 'react'
import styled from 'styled-components'
import Modal from './Modal'
import ComicList from './ComicList'
import ReactDOM from 'react-dom'



const ModalCharacterInfoStyled = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    img{
        width:100%;
    }
    h3{
        align-self:center;
    }
    p{
        width:100%;
        word-break:break-all;
    }
`

function ModalCharacterInfo(props) {

    if (!props.isOpen) {
        return null
    }
    return ReactDOM.createPortal(
        <Modal onClose={props.onClose}>
            <ModalCharacterInfoStyled>
                <h3>{props.character.name}</h3>
                <img src={require('../assets/images/portrait_xlarge.jpg')} alt="Super hero"></img>
                <p>{props.character.description}</p>
                <i> Comics in which {props.character.name} starred:</i>
                <ComicList comicList={props.character.comics.items}></ComicList>
            </ModalCharacterInfoStyled>
        </Modal>, document.getElementById('modal')
    )
}

export default ModalCharacterInfo