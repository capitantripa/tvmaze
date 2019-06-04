import React from 'react';
import express from 'express';
import { StaticRouter } from "react-router";
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import Markup from './Markup';
import App from './app/app';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducer from './app/reducer.js';
import path from 'path';
import renderToStringAsync from 'react-fetch-ssr';

const app = express();

//statics server
app.use('/public', express.static('./public'))

app.get('*', async function (request, response){

  //create store
  const store = createStore(
    reducer,
    applyMiddleware(ReduxThunk)
  );

  const context = {};
  const content = await renderToStringAsync(
    <Provider store={store}>
      <StaticRouter context={context} location={request.url}>
        <App />
      </StaticRouter>
    </Provider>
  );

  const preloaded_state = store.getState();
  const html = renderToStaticMarkup(<Markup content={content} state={preloaded_state}/>);
  response.send(html);
  response.end();
})


app.listen(3000);
