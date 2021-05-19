import React from 'react';
import ReactDOM from 'react-dom';

// create a new component that produces html
const App = function() {
    return <div>hello world</div>; 
}

// generate html from the component and put it on the page (in the DOM (Document Object Model))
ReactDOM.render(<App />); // adding a jsx tag around app means that it will be passed through as an instance of the app