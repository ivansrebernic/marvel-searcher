import React, { useEffect } from 'react'
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
    div{
        padding:1rem;
    }

`
const CharacterInfo = styled.div`


    display:flex;

    flex-direction:column;

    background-color: ${props => props.theme.main.modal};
    img{
        align-self:center;
        width:100%;
        max-width:12rem;
    }
    div{
        h3{
            text-align:center;
            margin:0;
        }
        margin:10px;

    }



    @media (max-width: 768px) {


      }

`


function ModalCharacterInfo(props) {

    const [section, setSection] = React.useState('info')

    React.useEffect(() => {

        return () => {
            if (section === 'comics')
                setSection('info')
        }
    });

    if (!props.isOpen && !props.character) {
        return null
    };



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