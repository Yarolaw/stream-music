import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Credentials } from './Credentials';
import Dropdown from './components/Dropdown'
import ListBox from './components/ListBox';
import Detail from './components/Detail';
import Player from './components/Player';

const App = () => {
  const [token, setToken] = useState('')
  const [genres, setGenres] = useState({selectedGenre: '', listOfGenresFromAPI: []});
  const [playlist, setPlaylist] = useState({selectedPlaylist: '', listOfPlaylistFromAPI: []});
  const [tracks, setTracks] = useState({selectedTrack: '', listOfTracksFromAPI: []});
  const [trackDetail, setTrackDetail] = useState(null);

  const spotify = Credentials();

useEffect(() => {

  axios('https://accounts.spotify.com/api/token', {
    headers: {
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)      
    },
    data: 'grant_type=client_credentials',
    method: 'POST'
  })
  .then(tokenResponse => {      
    setToken(tokenResponse.data.access_token);

    axios('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
      method: 'GET',
      headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
    })
    .then (genreResponse => {        
      setGenres({
        selectedGenre: genres.selectedGenre,
        listOfGenresFromAPI: genreResponse.data.categories.items
      })
    });

  });

  console.log('trackDetail', trackDetail);
  console.log('trackDetail?.uri', trackDetail?.uri);
  
}, [genres.selectedGenre, spotify.ClientId, spotify.ClientSecret, trackDetail]); 

const genreChanged = val => {
  setGenres({
    selectedGenre: val, 
    listOfGenresFromAPI: genres.listOfGenresFromAPI
  });

  axios(`https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`, {
    method: 'GET',
    headers: { 'Authorization' : 'Bearer ' + token}
  })
  .then(playlistResponse => {
    setPlaylist({
      selectedPlaylist: playlist.selectedPlaylist,
      listOfPlaylistFromAPI: playlistResponse.data.playlists.items
    })
  });

  console.log(val);
}

const playlistChanged = val => {
  console.log(val);
  setPlaylist({
    selectedPlaylist: val,
    listOfPlaylistFromAPI: playlist.listOfPlaylistFromAPI
  });
}

const buttonClicked = e => {
  e.preventDefault();

  axios(`https://api.spotify.com/v1/playlists/${playlist.selectedPlaylist}/tracks?limit=10`, {
    method: 'GET',
    headers: {
      'Authorization' : 'Bearer ' + token
    }
  })
  .then(tracksResponse => {
    setTracks({
      selectedTrack: tracks.selectedTrack,
      listOfTracksFromAPI: tracksResponse.data.items
    })
  });
}

const listboxClicked = val => {

  const currentTracks = [...tracks.listOfTracksFromAPI];

  const trackInfo = currentTracks.filter(t => t.track.id === val);

  setTrackDetail(trackInfo[0].track);

  console.log('currentTracks', currentTracks);
}
  
  const audioList1 = [
  {
    name: 'Despacito',
    singer: 'Luis Fonsi',
    cover:
      'http://res.cloudinary.com/alick/image/upload/v1502689731/Despacito_uvolhp.jpg',
    musicSrc:
      'http://res.cloudinary.com/alick/video/upload/v1502689683/Luis_Fonsi_-_Despacito_ft._Daddy_Yankee_uyvqw9.mp3',
    // support async fetch music src. eg.
    // musicSrc: async () => {
    //   return await fetch('/api')
    // },
  },
  {
    name: 'Dorost Nemisham',
    singer: 'Sirvan Khosravi',
    cover:
      'https://res.cloudinary.com/ehsanahmadi/image/upload/v1573758778/Sirvan-Khosravi-Dorost-Nemisham_glicks.jpg',
    musicSrc: trackDetail ? trackDetail?.uri : '',
  },
]

  return (
    <div className="container">
      <form onSubmit={buttonClicked}>        
          <Dropdown label="Genre :" options={genres.listOfGenresFromAPI} selectedValue={genres.selectedGenre} changed={genreChanged} />
          <Dropdown label="Playlist :" options={playlist.listOfPlaylistFromAPI} selectedValue={playlist.selectedPlaylist} changed={playlistChanged} />
          <div className="col-sm-6 row form-group px-0">
            <button type='submit' className="btn btn-success col-sm-12">
              Search
            </button>
          </div>
          <div className="row">
            <ListBox items={tracks.listOfTracksFromAPI} clicked={listboxClicked} />
            {trackDetail && <Detail {...trackDetail} /> }
          </div>        
      </form>

      <Player quietUpdate glassBg showMediaSession audioLists={audioList1}/>
    </div>
    
  )
}

export default App;
