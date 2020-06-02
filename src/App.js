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

const selectedAlbumSlice = createSlice({
  name: 'selectedAlbum',
  initialState: null,
  reducers: {
    select: (state, action) => action?.payload,
  }
})

const favoritedAlbumsSlice = createSlice({
  name: 'favoritedAlbums',
  initialState: {},
  reducers: {
    add: (state, action) => {
      state[action?.payload?.id?.attributes?.["im:id"]] = (action?.payload)
    },
    remove: (state, action) => {
      delete state[action?.payload?.id?.attributes?.["im:id"]]
    },
  }
})

const store = configureStore({
  reducer: combineReducers({
    rootFilter: favoriteOrAllSlice.reducer,
    currentAlbum: selectedAlbumSlice.reducer,
    favs: favoritedAlbumsSlice.reducer,
  })
})



function AlbumInfoFold() {
  const album = useSelector(x => x?.currentAlbum)
  const albumId = album?.id?.attributes?.["im:id"];

  const {actions: selActions } = selectedAlbumSlice
  const { select } = selActions

  const { actions: favActions } = favoritedAlbumsSlice
  const { add, remove } = favActions
  const isFaved = useSelector(x => !!x?.favs[albumId])

  console.log({isFaved})

  let rows = [
    {label: "Album Name", value: album?.["im:name"]?.label},
    {label: "Artist", value: album?.["im:artist"]?.label},
    {label: "Category", value: album?.category?.attributes?.label},
    {label: "Number of Songs", value: album?.["im:itemCount"]?.label},
    {label: "Price", value:album?.["im:price"]?.label}
  ]
  if(album === null){
    return(<React.Fragment/>)
  } else {
    return (
      <div className="bg-light-green flex br4 br--bottom">
        <img className="pa3" src={_.last(album?.["im:image"])?.label}/>
        <div className="tl">
          <table>
            {_.map(rows,
              r => {
                return (
                  <tr>
                    <th className="pa1">{r.label}</th>
                    <td className="pa1">{r.value}</td>
                  </tr>)},
            )}
          </table>
          <div className="pa1">{album?.rights?.label}</div>
          <button onClick={() => store.dispatch(isFaved ? remove(album) : add(album))}
            className="center">{isFaved ? "Remove from" : "Add to"}  Favorites
          </button>
        </div>
        <div className={"ml-auto pa4"}>
          <button onClick={() => store.dispatch(select(null))}>Close</button>
        </div>
      </div>
    )
  }

}

function TopNav() {
  const { actions, reducer } = favoriteOrAllSlice
  const { favorite, all} = actions
  const albumFilter = useSelector(x => x?.rootFilter)

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
    </header>)
}
function AlbumCard({album}){
  const { actions, reducer } = selectedAlbumSlice
  const { select } = actions
  const selectedAlbum = useSelector(x => x?.currentAlbum)
  const albumId = album?.id?.attributes?.["im:id"];

  const { actions: favActions } = favoritedAlbumsSlice
  const isFaved = useSelector(x => !!x?.favs[albumId])

  let width = "250px"
  let bgColor = "bg-black-10"
  if (album === selectedAlbum){
    bgColor = "bg-lightest-blue"
  }

  return(
    <div className={bgColor + " pa3 ma2 br3"} style={{width}}
    onClick={() => store.dispatch(select(album))}>
      <img src={_.last(album?.["im:image"])?.label}/>
      <div className="b">
        {album?.["im:artist"]?.label}
      </div>
      <p>
        {album?.["im:name"]?.label}
      </p>
      {isFaved ? <span>⭐</span>: <span>&nbsp;</span>}
    </div>
  )
}

function AlbumGrid({albums}) {
  const albumFilter = useSelector(x => x?.rootFilter)
  const favs = useSelector(x => _.values(x?.favs));
  const albumsView = albumFilter === "Favorite" ? favs : albums

  return(
    <div className="flex flex-wrap justify-around" style={{"padding-top": "3rem"}}>
      {_.map(albumsView, x =>
        <AlbumCard album={x} key={x?.attributes?.["im:id"]}/>
      )}
    </div>)
}

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
        <div className={"fixed w-100"}>
          <TopNav/>
          <AlbumInfoFold album={_.first(entry)}/>
        </div>
        <AlbumGrid albums={entry}/>
      </div>
    </Provider>
  );
}

export default App;
