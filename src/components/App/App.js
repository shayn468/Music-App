import React from 'react';
import './App.css';
// import Playlist from "../Playlist/Playlist";
import SearchBar from "../SearchBar/SearchBar";
import SearchResult from "../SearchResult/SearchResult";
import Spotify from "../../util/Spotify";


class App extends React.Component{
  constructor(props){
    super(props);
  
  this.state={
    SearchResult: [],
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

componentDidMount() {
  const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
  const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
  if(accessTokenMatch && expiresInMatch ){
      let accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      const d = new Date();
      d.setTime(d.getTime() + (expiresIn*1000));
      let expires = "expires="+ d.toUTCString();
      document.cookie = "access_token=" + accessTokenMatch[1] + ";" + expiresIn + ";path=/";
      window.setTimeout(()=> (accessToken=""), expiresIn * 1000 );
      window.history.pushState("Access Token", null, "/"); // this clear the parameters and allowing us to get new access token when it expires.
      

      const src_term = Spotify.getCookie('search_term')
      console.log("searching ",src_term)
      this.search(src_term)
  }
}

search(term){
  Spotify.search(term).then(SearchResultItem => {
    this.setState({SearchResult : SearchResultItem});
    console.log(SearchResultItem)
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
  let TrackSearchBar = this.state.SearchResult;

Tracks = Tracks.filter(currentTracks => currentTracks.id !== track.id);
TrackSearchBar.unshift(track);
this.setState({PlaylistTracks: Tracks});
}

removeTrackSearch(track){
  let Tracks = this.state.SearchResult;
  Tracks = Tracks.filter(currentTracks => currentTracks.id !== track.id);
  this.setState({SearchResult : Tracks}) 
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
  Spotify.savePlaylist(this.state.PlaylistName, trackuris).then( ()=> {
    this.setState({
      UpdatePlaylistName: "New PlayList",
      PlaylistTracks: []
    });
  });
}

render(){
  return(
  // <div>

     <div className='App'>
      <h1>
         <a href='http://localhost:3000'>Music-Hub</a>
       </h1>
       <SearchBar onSearch= {this.search} />
       {/* <div className='App-playlist'> */}
         <SearchResult SearchResult = {this.state.SearchResult} onAdd ={this.doThese}/>
         {/* <Playlist PlaylistTracks = {this.state.PlaylistTracks} onNameChange = {this.UpdatePlaylistName} onRemove = {this.removeTrack}  onSave = {this.savePlayList}/> */}
        {/* <Spotify/> */}
        {/* </div> */}
    </div>
    // </div>
    )
}

}

// function App() {

//   return (
//     <div>
//       <h1>
//         <a href='http://localhost:3000'>Music-Hub</a>
//       </h1>

//     <div className='App'>
//       <SearchBar onSearch= {this.search} />
//       {/* <SearchBar /> */}
//       <div className='App-playlist'>
//         {/* <SearchResult SearchResult = {this.state.SearchResult} onAdd ={this.doThese}/> */}
//         {/* <Playlist PlaylistTracks = {this.state.PlaylistTracks} onNameChange = {this.UpdatePlaylistName} onRemove = {this.removeTrack}  onSave = {this.savePlayList}/> */}
//     {/* <Spotify/> */}
//       </div>
//     </div>
//     </div>
//   );
// }



export default App;
