import React from 'react';
import "./SearchBar.css";


class SearchBar extends React.Component{

    constructor(props){
        super(props);

        this.state = {
        term : ""
        };

    this.handletermChange = this.handletermChange.bind(this);
    this.search = this.search.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
};


handletermChange(event){
    this.state({term : event.target.value});
}

search(){
    this.props.onSearch(this.state.term);
}

handleEnter(event){ //keycode is user data which is pressing. 13 is the Ascii code for 13.
    if(event.keycode ==13){
        this.search();
    }
}

render(){
    return(
        <div className= "SearchBar">
        <input placeholder="Enter song, album or artist" onchange={this.handletermChange} onKeyUp={this.handleEnter} />
        <button className="SearchButton" onClick={this.search}> Search </button>
        </div>
    );
``}
    }

export default SearchBar;