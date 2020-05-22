import React from 'react'
import styled from 'styled-components'
import ReactDOM from 'react-dom'


const ModalStyled = styled.div`
    z-index:1000;
    position: fixed;
    width:100%;
    height:100%;
    top:0;
    left:0;
    background-color:rgba(0,0,0,0.3);
`

const CloseButton = styled.span`
    position:absolute;
    left:100%;
    top:0%;
    transform: translateX(-100%);
    font-size: 18px;
    padding: 1rem;

    color:black;

    text-align: center;
    &:hover{
        cursor:pointer;
    }

`
const ModalBox = styled.div`

position: fixed ;
top: 50%;
left: 50%;
width:80%;
height:80%;
max-width:600px;
padding-bottom: 1rem;
transform: translate(-50%, -50%);
border-radius: 1%;
background-color:${props => props.theme.main.modal};
display:flex;
flex-direction:column;
@media (max-width: 768px) {

    width:100%;
    height:100%;
  }
`

function Modal(props) {


    return ReactDOM.createPortal(
        <ModalStyled >
            <ModalBox>
                <CloseButton onClick={props.onClose}>X</CloseButton>
                {props.children}
            </ModalBox>
        </ModalStyled >, document.getElementById('modal')
    )
}

export default Modal;