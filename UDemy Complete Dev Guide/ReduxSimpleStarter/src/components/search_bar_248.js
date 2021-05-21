import React, { Component } from 'react';

class SearchBar extends Component { // define a new class called "SearchBar" and give it access to all of the functionality that React.Component has
    constructor(props) {
        super(props); // super() refers to a parent method of the Component class

        this.state = { term: '' }; 
    }

    render() {
        return (
            <div>
                <input onChange={event => this.setState({ term: event.target.value })} />
                Value of the input: {this.state.term}
            </div>
        );
    }
}

export default SearchBar; // any file that imports this file will have SearchBar exported to it