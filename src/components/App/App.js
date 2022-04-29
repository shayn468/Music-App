import React from 'react';
import './App.css';
import Playlist from "../Playlist/Playlist";
import SearchBar from ".//SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Spotify from "../uitl/Spotify";


class App extends React.Component{
  constructor(props){
    super(props);
  
  this.state={
    SearchResults: [],
    PlaylistName: "New PlayList",
    PlaylistTracks: []
  };

  this.search = this.search.bind(this);
  this.addTracks = this.addTracks.bind(this);
  this.removeTrack = this.removeTrack.bind(this);
  this.removeTrackSearch = this.removeTrackSearch.bind(this);
  this.UpdatePlaylistName = this.UpdatePlaylistName.bind(this);
  this.savePlayList = this.savePlayList.bind(this);
  this.doThese = this.doThese.bind(this);
}

 search(term){
  Spotify.search(term).then(SearchResults => {
    this.setState({SearchResults : SearchResults});
  });
}

addTracks(track){
  let Tracks = this.state.PlaylistTracks;
  if(Tracks.find(savedTrack => savedTrack.id === Tracks.id)){
    return;
  }
  Tracks.push(track);
    this.setState({PlaylistTracks: Tracks});
}

removeTrack(track){
  let Tracks = this.state.PlaylistTracks;
  let TrackSearchBar = this.state.SearchResults;

Tracks = Tracks.filter(currentTracks => currentTracks.id !== track.id);
TrackSearchBar.unshift(track);
this.setState({PlaylistTracks: Tracks});
}

removeTrackSearch(track){
  let Tracks = this.state.SearchResults;
  Tracks = Tracks.filter(currentTracks => currentTracks.id !== track.id);
  this.setState({SearchResults : Track}) 
}

doThese(track){
this.addTracks(track);
this.removeTrack(track);
this.removeTrackSearch(track);
}

UpdatePlaylistName(name){
  this.setState({UpdatePlaylistName: name});

}

savePlayList(){
  const trackuris = this.state.PlaylistTracks.map(track => track.uri);
  Spotify.savePlayList(this.state.PlaylistName, trackuris).then( ()=> {
    this.setState({
      UpdatePlaylistName: "New PlayList",
      PlaylistTracks: []
    });
  });
}

}

function App() {
  return (
    <div>
      <h1>
        <a href='http://localhost:3000'>Music-Hub</a>
      </h1>

    <div className='App'>
      <SearchBar onSearch= {this.search} />
      <div className='App-playlist'>
        <SearchResults SearchResults = {this.state.SearchResults} onAdd ={this.doThese}/>
        <Playlist PlaylistTracks = {this.state.PlaylistTracks} onNameChange = {this.UpdatePlaylistName} onRemove = {this.removeTrack}  onSave = {this.savePlayList}/>

      </div>
    </div>
    </div>
  );
}

export default App;
