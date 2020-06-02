import React from 'react';
import logo from './logo.svg';
import './App.css';
import fetchTopAlbums from "./top-albums";
import { useState, useEffect } from 'react';
import _ from "lodash";

function AlbumCard({album}){
  console.log(album)
  let width = "300px"
  return(
    <div className="bg-black-10pa4" style={{width}}>
      <div className="b">
        {album?.["im:artist"]?.label}
      </div>
      <div>
        {album?.["im:name"]?.label}
      </div>
    </div>
  )
}

function App() {
  const [albums, setAlbums] = useState({})
  useEffect(() =>{
    (async () => {
      setAlbums(await fetchTopAlbums());
    })();})

  let entry = albums?.feed?.entry;
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
        <div className="flex flex-wrap justify-around">
          {_.map(entry, x =>
            <AlbumCard album={x} key={x?.attributes?.["im:id"]}/>
          )}
        </div>
      </div>
  );
}

export default App;
