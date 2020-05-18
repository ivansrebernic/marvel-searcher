import React from 'react'
import styled from 'styled-components'
import Modal from './Modal'
import ComicList from './ComicList'
import ReactDOM from 'react-dom'

//The size of the thumbnails that is going to be requested
//TO DO: Comment other variants
const imageSize = "portrait_xlarge"


const ModalCharacterInfoStyled = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    img{
        margin:1rem;
        width:100%;
    }
    h3{
        align-self:center;
    }
    p{
        display:block;

        word-break:break-all;
    }
    div {

        display:flex;
        div{
            display:flex;
            flex-direction:column
        }
    }
`

function ModalCharacterInfo(props) {

    if (!props.isOpen && !props.character) {
        return null
    }


    return ReactDOM.createPortal(
        <Modal onClose={props.onClose}>
            <ModalCharacterInfoStyled>

                <div>
                    <img src={props.character.thumbnail.path + '/' + imageSize + '.' + props.character.thumbnail.extension} alt="Super hero"></img>
                    <div>
                        <h3>{props.character.name}</h3>
                        <p>{props.character.description}</p>
                    </div>

                </div>
                <i> Comics in which {props.character.name} appeared:</i>
                <ComicList comicList={props.character.comics.items}></ComicList>
            </ModalCharacterInfoStyled>
        </Modal>, document.getElementById('modal')
    )
}

export default ModalCharacterInfo