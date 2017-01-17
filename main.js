/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
 require('script-loader!./jsPsych/jspsych.js');
 require('script-loader!./jsPsych/plugins/jspsych-text.js');
 require('script-loader!./jsPsych/plugins/jspsych-instructions.js');
 require('script-loader!./jsPsych/plugins/jspsych-survey-multi-choice.js');
 require('script-loader!./jsPsych/plugins/jspsych-survey-multi-picture.js');
 require('script-loader!./jsPsych/plugins/jspsych-survey-multi-select.js');

 require('./jsPsych/css/jspsych.css');

import 'babel-polyfill';
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { routes } from './core/routes';
import { syncHistoryWithStore } from 'react-router-redux';
import { rootReducer } from './reducers/index';
import thunkMiddleware from 'redux-thunk';
import { compose, createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';

const loggerMiddleware = createLogger();

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(thunkMiddleware, loggerMiddleware))
  );
  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept(
      './reducers',
      () => store.replaceReducer(require('./reducers/index').rootReducer)
    );
  }
  return store;
}

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

function render(routes) {
  FastClick.attach(document.body);
  ReactDOM.render(
    <Provider store={store}>
      <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
        {routes}
      </Router>
    </Provider>,
    document.getElementById('container')
  );
}
render(routes);
if (module.hot) {
  module.hot.accept('./core/routes', () => {
    render(require('./core/routes').routes);
  });
}
