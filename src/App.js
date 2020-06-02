import React from 'react';
import logo from './logo.svg';
import './App.css';
import fetchTopAlbums from "./top-albums";
import { useState, useEffect } from 'react';
import _ from "lodash";

function AlbumCard({album}){
  console.log(album)
  let width = "250px"
  return(
    <div className="bg-black-10 pa3 ma2 br3" style={{width}}>
      <img src={_.last(album?.["im:image"])?.label}/>
      <div className="b">
        {album?.["im:artist"]?.label}
      </div>
      <p>
        {album?.["im:name"]?.label}
      </p>
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
        <header className="bg-green flex">
          <div className="pa3 mr-auto">
            <b>Top Albums</b>
          </div>
          <div className="pa3 ml-auto">
            Top Albums | Favorite Albums
          </div>
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
