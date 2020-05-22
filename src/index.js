import React from 'react';
import ReactDOM from 'react-dom';
import Router from './components/Routes'
import * as serviceWorker from './serviceWorker';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import theme from './themes/'




//Main theme navbar = F7F7F7
// page:F7F8FA




const GlobalStyle = createGlobalStyle`
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
    background-color:${theme.main.page};
    margin:0;
  }
`

ReactDOM.render(
  <React.StrictMode >
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <Router>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
