const assert = require('assert'); // allows us to make assertions about values in the code
const ganache = require('ganache-cli'); // serves as our local test ethereum network
const Web3 = require('web3'); // web3 constructor function (can be used to make an instance of web3)
const web3 = new Web3(ganache.provider()) // the instance of web3 we will be using; each instance will connect to a specific ethereum network via ganache
const { interface, bytecode } = require('../compile'); // the ABI and contract bytecode that result from compiling

let accounts; // declare the variable so it can be filled later
let inbox;
const INITIAL_MESSAGE = 'hello world'

beforeEach(async () => {
    // get a list of all accounts
    accounts = await web3.eth.getAccounts(); // await is the command to allow time for an asynchronous transaction happens

    // use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface)) // tells web3 eth network that a contract exists with an interface; this is how javascript can interact with contracts written in solidity
        .deploy({
            data: bytecode
            ,arguments: [INITIAL_MESSAGE]
        }) // creates object that can be deployed passes arguments into it; it's an array because it can pass in multiple objects if a function can take multiple arguments
        .send({
            from: accounts[0],
            gas: 1000000
        }) // actually sends the deployment command
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address) // this is able to parse the mocha test output and will check if there is an address; okay checks to see if a value exists (it's a string)
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_MESSAGE);
    });

    it('can change the message', async () => {
        await inbox.methods.setMessage('a new world').send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'a new world');
    });
});

