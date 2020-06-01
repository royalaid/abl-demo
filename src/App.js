import React from 'react';
import logo from './logo.svg';
import './App.css';
import fetchTopAlbums from "./top-albums";
import { useState, useEffect } from 'react';
import _ from "lodash";

function App() {
  const [albums, setAlbums] = useState({})
  useEffect(() =>{
    (async () => {
      setAlbums(await fetchTopAlbums());
    })();})

  let entry = albums?.feed?.entry;
  console.log(entry)
  return (
      <div className="App">
        <header className="">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        {_.map(entry, x =>
          <div key={x}>
            {x?.["im:name"]?.label}
          </div>)}
      </div>
  );
}

export default App;
