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
    div{
        padding:1rem;
    }

`
const CharacterInfo = styled.div`
    display:flex;
    flex-direction:column;
    background-color: ${props => props.theme.main.modal};
    color:${props => props.theme.main.text};
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
`
const StyledButton = styled.button`
    background-color:${props => props.theme.main.button};
    border-radius:10px;
    border: 1px solid black;
    padding: 0.5rem;
    transition: 0.1s ease-in;
    &:hover{
        cursor:pointer;
    }
`


function ModalCharacterInfo(props) {
    const [section, setSection] = React.useState('Info')
    React.useEffect(() => {
        return () => {
            if (section === 'Comics')
                setSection('Info')
        }
    });
    const changeSection = () => {

        if (section === 'Info') {
            setSection('Comics')
        } else {
            setSection('Info')
        }

    }
    if (!props.isOpen && !props.character) {
        return null
    };



    return ReactDOM.createPortal(
        <Modal onClose={props.onClose}>
            <ModalCharacterInfoStyled>
                <div>
                    <StyledButton onClick={changeSection}>{section}</StyledButton>

                </div>
                {section === 'Info' &&
                    <CharacterInfo>
                        <img src={props.character.thumbnail.path + '/' + imageSize + '.' + props.character.thumbnail.extension} alt="Super hero"></img>
                        <div>
                            <h3>{props.character.name}</h3>
                            {!props.character.description && <p>There is no description for this super-hero</p>}
                            <p>{props.character.description}</p>
                        </div>
                    </CharacterInfo>}
                {section === 'Comics' &&
                    <ComicList comics={props.character.comics}>

                    </ComicList>}
            </ModalCharacterInfoStyled>
        </Modal >, document.getElementById('modal')
    )
}

export default ModalCharacterInfo