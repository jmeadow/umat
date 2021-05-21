import React from "react";
import web3 from './web3';
import lottery from './lottery';

class App extends React.Component {
    state = {
        manager: 'loading contract manager...'
        ,players: []
        ,balance: '' // doesn't need a value because we will convert it from a javascript big number object
        ,value: '' // text inputs are always string inputs, even if we expect a number
        ,message: ''
    };

    async componentDidMount() {
        const manager = await lottery.methods.manager().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address); // how to access standard options

        this.setState({ manager, players, balance });
    }

    onSubmit = async (event) => { // needs to be async because it will react with ethereum network
        event.preventDefault(); // prevents the form from submitting itself before the user interacts with it

        const accounts = await web3.eth.getAccounts();

        this.setState({ message: 'Waiting on transaction success...'});

        await lottery.methods.enter().send({ // this will take 15-30 seconds to be mined into the blockchain
            from: accounts[0]
            ,value: web3.utils.toWei(this.state.value, 'ether')
        });

        this.setState({ message: 'You have been successfully entered!'});
    };

    onClick = async () => {
        const accounts = await web3.eth.getAccounts();

        this.setState({ message: 'Waiting to pick a winner...' });

        await lottery.methods.pickWinner().send({
            from: accounts[0] // we do not have to send money although I don't understand why we don't need to send gas, perhaps that's done via metamask?
        })

        this.setState({ message: 'A winner has been picked!' });
    };

    render() {
        web3.eth.getAccounts().then(console.log);
        return (
            <div>
                <h2>Lottery Contract</h2>
                <p>
                This contract is managed by {this.state.manager}. <br/>
                There are currently {this.state.players.length} people entered. <br/>
                They are competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether. 
                </p>

                <hr /> <react-comment this is a horizontal divider />

                <form onSubmit={this.onSubmit}>
                    <h4>Want to try your luck?</h4>
                    <div>
                        <label>Amount of ether to enter</label>
                        <input
                            value={this.state.value}
                            onChange={event => this.setState({ value: event.target.value })}
                        />
                    </div>
                    <button>Enter</button>
                </form>

                <hr />


                <h4>Ready to pick a winner?</h4>
                <button onClick={this.onClick}>Pick a winner!</button>


                <hr />

                <h1> {this.state.message}</h1>
            </div>
        );
    }
}
export default App;
