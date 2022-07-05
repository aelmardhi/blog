import path from 'path';
import fs from 'fs';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom/server'
import express from 'express';

import App from '../src/App';
import blogRouter from './blog'

const PORT = process.env.PORT || 3006;
const app = express();
// ...

app.use(express.json())
app.use(express.urlencoded())

app.get('/', (req,res)=>{
    res.send('hi')
})

app.get('/blog/*', (req, res) => {
    const app = ReactDOMServer.renderToString(
        <StaticRouter basename='blog/' location={req.url}>
        <App />
        </StaticRouter>
        );
    const indexFile = path.resolve('./build/index.html');
  
    fs.readFile(indexFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Something went wrong:', err);
        return res.status(500).send('Oops, better luck next time!');
      }
  
      return res.send(
        data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
      );
    });
  });
  
  app.use(express.static('./build'));
  
  app.use('/api/blog',blogRouter)


  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });