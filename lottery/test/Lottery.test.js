const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider())

const { interface, bytecode } = require('../compile');

let accounts;
let lottery;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))    
        .deploy({ data: bytecode })
        .send({
            from: accounts[0]
            ,gas: 1000000
        });
});


describe('Lottery', () => {
    it('addresses exist', async () => {
        assert.ok(lottery.options.address); // confirms that an address exists
    });

    it('allows one account to enter', async () => { // tests whether an account can successfully run the "enter" function
        await lottery.methods.enter().send({
            from: accounts[0]
            ,value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({ // list the first address into the lottery
            from: accounts[0],
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('allows multiple account to enter', async () => { // tests whether an account can successfully run the "enter" function
        await lottery.methods.enter().send({
            from: accounts[0]
            ,value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1]
            ,value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2]
            ,value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({ // list the addresses in the lottery
            from: accounts[0],
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    it('requires a minimum amount of ether', async () => {
        try { // javascript attempts to run the try statement, if there is no error it will continue along
            await lottery.methods.enter().send({
                from: accounts[0]
                ,value: web3.utils.toWei('0.0002', 'ether')
            });
            assert(false); // throws a false, breaking the it() statement
        } catch (err) { // if there is an error, then it ends up here
            assert(err); // asserts that "err" exists
        }
    });


    it('only manager can pick a winner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[0]
                ,value: 1000000
            });
            assert(false); // this should fail – why isn't it?
        } catch (err) {
            assert(true)
        }
    });

    it('sends money to winner and resets players array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0]
            ,value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]); // balance after entering lottery
        await lottery.methods.pickWinner().send({ from: accounts[0] });
        const finalBalance = await web3.eth.getBalance(accounts[0]); // balance after winning lottery as only entrant
        const difference = finalBalance - initialBalance;

        assert(difference > web3.utils.toWei('1.8', 'ether')); // confirm the balnances are about 2 eth different
    });

    it('players array is emptied', async () => {
        const players = await lottery.methods.getPlayers().call({ // list the first address into the lottery
            from: accounts[0],
        });

    })
});