import React from 'react'
import ComicList from './ComicList'
import styled from 'styled-components'
import ReactDOM from 'react-dom'


const ModalStyled = styled.div`
    z-index:3;
    position: fixed;
    top:0;
    left:0;
    background-color:rgb(0,0,0,0.5);
    width:100%;
    height:100%;

`
const ModalCharacterInfo = styled.div`

    position: fixed ;
    top: 50%;
    left: 50%;
    width:100%;
    max-width:600px;
    padding-bottom: 1rem;
    transform: translate(-50%, -50%);
    border-radius: 1%;
    background-color:white;
    display:flex;
    flex-direction:column;

    div{
        display:flex;
        align-items:center;
        flex-direction: column;
        justify-content: center;
        img{
            width:100%;
            max-width:20rem;
        }
        p {
            width: 300px;
            word-break: break-all;
       }
        h3 {
            margin-top:0;
            margin-bottom:1rem
        }
        label {


        }
    }



`
const CloseButton = styled.span`
    align-self:flex-end;
    font-size: 18px;
    margin: 0.5rem;
    height: 2rem;
    width: 2rem;
    text-align: center;
    &:hover{
        cursor:pointer;
    }

`


function Modal(props) {
    if (!props.isOpen) {
        return null
    }

    return ReactDOM.createPortal(

        <ModalStyled >

            <ModalCharacterInfo>
                <CloseButton onClick={props.onClose}>X</CloseButton>
                <div>
                    <h3>{props.character.name}</h3>
                    <img src={require('../assets/images/portrait_xlarge.jpg')} alt="Super hero"></img>
                    <p>{props.character.description}</p>
                    <i> Comics in which {props.character.name} starred:</i>
                    <ComicList comicList={props.character.comics.items}></ComicList>
                </div>

            </ModalCharacterInfo>
        </ModalStyled >, document.getElementById('modal')
    )
}

export default Modal;