// broken video_detail.js from something in lesson 257/258 gets stuck on "Loading..." forever

import React, { Component } from 'react'; // this means "go into the node_modules folder and find the thing called react"
import ReactDOM from 'react-dom';
import YTSearch from 'youtube-api-search';
import SearchBar from './components/search_bar'; // needs to match the function name + file location where the component code is
import VideoList from './components/video_list';
import VideoDetail from './components/video_detail';

const API_KEY = 'AIzaSyDKVCABCzlSN26ZtgosFdsAVXtUYpkuk4g';


// create a new component that produces html
class App extends Component { // this will reference the components we generate in javascript files
    constructor(props) { // runs right away when app is loaded
        super(props);

        this.state = {
            videos: [] // sets default video list to an empty array
            ,selectedVideo: null //null to start
        };
        YTSearch({ key: API_KEY, term: 'and I said heyyyy'}, (videos) => { // sets default search term
            this.setState({
                videos: videos
                ,selectedVideo: videos[0]
            }); // sets the state to the actual video list retrieved from the API; note that just having videos there is the same as { videos: videos }, only works if key/property have the same variable name (note no longer applies after lesson 259)
        });
    }

    render () {
        return (
            <div>
                <SearchBar /> 
                <VideoDetail videos={this.state.selectedVideo} />
                <VideoList
                    onVideoSelect={selectedVideo => this.setState({selectedVideo}) }
                    videos={this.state.videos} 
                />
            </div>
        );
    }
}
// generate html from the component and put it on the page (in the DOM (Document Object Model))
ReactDOM.render(<App />, document.querySelector('.container')); // adding a jsx tag around app means that it will be passed through as an instance of the app