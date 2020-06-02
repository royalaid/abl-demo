import React from 'react';
import logo from './logo.svg';
import './App.css';
import fetchTopAlbums from "./top-albums";
import { useState, useEffect } from 'react';
import _ from "lodash";
import { configureStore, createSlice } from '@reduxjs/toolkit'
import {Provider, useSelector} from 'react-redux'
import {combineReducers} from 'redux'


const favoriteOrAllSlice = createSlice({
  name: 'favoriteOrAll',
  initialState: "All",
  reducers: {
    favorite: state => "Favorite",
    all: state =>  "All"
  }
})

const store = configureStore({
  reducer: combineReducers({
    rootFilter: favoriteOrAllSlice.reducer
  })
})

function AlbumCard({album}){
  // console.log(album)
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


function TopNav() {
  const { actions, reducer } = favoriteOrAllSlice
  const { favorite, all} = actions
  const albumFilter = useSelector(x => x?.rootFilter)
  console.log(albumFilter)
  return(
      <header className="bg-green flex">
        <div className="pa3 mr-auto">
          <b>Top Albums</b>
        </div>
        <div className="pa3 ml-auto">
          <a className={albumFilter === "All" ? "b" : "p" }
             onClick={() => store.dispatch(all())}>
            Top Albums
          </a>
          <span> | </span>
          <a className={albumFilter === "Favorite" ? "b" : "p" }
             onClick={() => store.dispatch(favorite())}>
            Favorite Albums
          </a>
        </div>
      </header>
)}

function App() {
  const [albums, setAlbums] = useState({})
  useEffect(() =>{
    (async () => {
      setAlbums(await fetchTopAlbums());
    })();})

  let entry = albums?.feed?.entry;
  return (
    <Provider store={store}>
      <div className="App">
        <TopNav/>
        <div className="flex flex-wrap justify-around">
          {_.map(entry, x =>
            <AlbumCard album={x} key={x?.attributes?.["im:id"]}/>
          )}
        </div>
      </div>
    </Provider>
  );
}

export default App;
