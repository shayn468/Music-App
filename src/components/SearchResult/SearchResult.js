import React from "react";
import "../TrackList/TrackList.css";
import "./SearchResult.css";
import TrackList from "../TrackList/TrackList";

class SearchResult extends React.Component{
    
 render(){

    return(
        <div className="SearchResult">

        <h2>Results</h2>
        <TrackList tracks={this.props.SearchResult} onAdd= {this.props.onAdd} />
        </div>
          
    );
    }
 }   
    
export default SearchResult;

