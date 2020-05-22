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

    }

`
const CharacterInfo = styled.div`

    display:flex;
    flex-direction:row;

    width:100%;

    img{
        min-height:10rem;
        min-width:10rem;
        max-width:20rem;
        max-height:20rem;
        height:100%;
        width:100%;
        margin:10px;
    }
    div{
        h3{
            align-self:center;
            margin:0;
        }
        p{
            font-size:16px;
        }
        display:flex;
        width:70%;
        flex-direction:column;
    }


    @media (max-width: 768px) {

        align-items:center;
        flex-direction: column;
        div{

            p{
                font-size:12px;
            }

      }

`


function ModalCharacterInfo(props) {

    const [section, setSection] = React.useState('info')

    if (!props.isOpen && !props.character) {
        return null
    }


    return ReactDOM.createPortal(
        <Modal onClose={props.onClose}>
            <ModalCharacterInfoStyled>
                <div>
                    <button onClick={() => { setSection('info') }}>Info</button>
                    <button onClick={() => { setSection('comics') }}> Comics</button>
                </div>
                {section === 'info' &&
                    <CharacterInfo>

                        <img src={props.character.thumbnail.path + '/' + imageSize + '.' + props.character.thumbnail.extension} alt="Super hero"></img>
                        <div>
                            <h3>{props.character.name}</h3>
                            {!props.character.description && <p>There is no description for this super-hero</p>}
                            <p>{props.character.description}</p>
                        </div>

                    </CharacterInfo>}
                {section === 'comics' &&
                    <ComicList comics={props.character.comics}>

                    </ComicList>}
            </ModalCharacterInfoStyled>
        </Modal >, document.getElementById('modal')
    )
}

export default ModalCharacterInfo