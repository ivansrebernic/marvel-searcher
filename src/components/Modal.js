import React from 'react'
import styled from 'styled-components'
import ReactDOM from 'react-dom'


const ModalStyled = styled.div`
    position: absolute;
    display:flex;
    border-radius: 2%;
    justify-content: flex-end;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width 80%;
    height:80%;
    background-color:lightgray;
    box-shadow: 2px 2px 2px gray;
`
const CloseButton = styled.span`
    font-size: 24px;
    margin: 1rem;
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
            <CloseButton onClick={props.onClose}>X</CloseButton>
        </ModalStyled >, document.getElementById('modal')
    )
}

export default Modal;