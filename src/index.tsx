import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, adaptV4Theme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';

const theme = createTheme(adaptV4Theme({
  overrides: {
    MuiTableCell: {
      root: {
        fontSize: 13
      },

      sizeSmall: {
        padding: '4px 8px 4px 6px'
      }
    }
  }
}));

ReactDOM.render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
        <App></App>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
