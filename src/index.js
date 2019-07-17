import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './index.scss';
import App from './App';

const rootElement = document.getElementById('root');

const render = Root => {
  ReactDOM.render(
    <AppContainer>
      <Root />
    </AppContainer>,
    rootElement
  )
}

render(App);

if(module.hot) {
  module.hot.accept('./App', () => {
    const nextApp = require('./App').default;
    render(nextApp);
  })
}
