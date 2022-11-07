import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';

import { legacy_createStore as creatReduxStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { rootReducer } from './reducers';
import rootSaga from './saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { store } from './store';

// const sagaMiddleware = createSagaMiddleware();

// const createStore = (initialState = {}) => {
//   const middleware = [sagaMiddleware];

//   const enhancers = [];
//   const composeEnhancers = composeWithDevTools({});

//   const store = creatReduxStore(
//     rootReducer,
//     initialState,
//     composeEnhancers(applyMiddleware(...middleware), ...enhancers)
//   );
//   sagaMiddleware.run(rootSaga);
//   return store;
// };

// then run the saga
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
