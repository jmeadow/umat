import React from 'react'; // this means "go into the node_modules folder and find the thing called react"
import ReactDOM from 'react-dom';

import SearchBar from './components/search_bar'; // needs to match the function name + file location where the component code is

const API_KEY = 'AIzaSyDKVCABCzlSN26ZtgosFdsAVXtUYpkuk4g';

// create a new component that produces html
const App = () => { // this will reference the components we generate in javascript files
    return <div>
        <SearchBar /> 
    </div>
}

// generate html from the component and put it on the page (in the DOM (Document Object Model))
ReactDOM.render(<App />, document.querySelector('.container')); // adding a jsx tag around app means that it will be passed through as an instance of the app