import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Characters from './Characters';
import NavBar from './components/NavBar'
import * as serviceWorker from './serviceWorker';
import styled from 'styled-components';

const Background = styled.div`
position: absolute;
height: 100%;
width:100%;
background-color:#E5E5E5;
`

ReactDOM.render(
  <React.StrictMode >
    <Background>
      <NavBar />
      <Characters />
    </Background>
  </React.StrictMode>,
  document.getElementById('root')
);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
