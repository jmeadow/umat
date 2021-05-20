import React, { Component } from 'react';

class SearchBar extends Component { // define a new class called "SearchBar" and give it access to all of the functionality that React.Component has
    constructor(props) {
        super(props); // super() refers to a parent method of the Component class

        this.state = { term: '' }; // when it renders, the initial term is set to an empty string
    }

    render() {
        return (
            <div>
                <input
                    value={this.state.term} // when the object rerenders, this sets its new state to the term until it is updated on the next line
                    onChange={event => this.setState({ term: event.target.value })} /> 
            </div>
        );
    }
}

export default SearchBar; // any file that imports this file will have SearchBar exported to it