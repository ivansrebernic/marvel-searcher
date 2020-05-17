import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Characters from './Characters';
import Router from './components/Routes'
import * as serviceWorker from './serviceWorker';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color:#E5E5E5;
  }
`



ReactDOM.render(

  <React.StrictMode >
    <GlobalStyle />
    <Router>
      <Characters />
    </Router>
  </React.StrictMode>,

  document.getElementById('root')
);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();