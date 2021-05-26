const { expect } = require("chai");
const assert = require('assert');

let tokenFactory;
let token;
let owner;
let aidWallet;
let addr1;
let addr2;
let addr3;
let totalSupply;

describe('reflect tests', () => {

    beforeEach(async () => {
        [owner, aidWallet, addr1, addr2, addr3, _] = await ethers.getSigners();

        tokenFactory = await ethers.getContractFactory('REFLECT');
        token = await tokenFactory.deploy();
        
    });

    describe('Deployment tests', () => {
        it('token contract has an address', async () => {

            assert.ok(token.address); // it has an address

        });

        it('owner has the total umat supply and a balance > 0', async () => {

            totalSupply = await token.totalSupply();
            totalSupply = web3.utils.hexToNumberString(totalSupply); // I don't know how to turn the warning off but I'm ignoring it for now
            totalSupply = web3.utils.fromWei(totalSupply, 'ether');

            ownerBalance = await token.connect(owner).balanceOf(owner.address);
            ownerBalance = web3.utils.hexToNumberString(ownerBalance);
            ownerBalance = web3.utils.fromWei(ownerBalance, 'ether');
            

            // // putting logs to help confirm things are working right
            console.log('total supply: '+totalSupply);
            console.log('owner balance: '+ownerBalance);

            
            assert.equal(totalSupply, ownerBalance);
            assert(ownerBalance > 0);
            
        });

        it('there are 4 different accounts with addresses', () => {
            assert.ok(owner.address);
            assert.ok(addr1.address);
            assert.ok(addr2.address);
            assert.ok(addr3.address);
            assert.notEqual(owner.address, addr1.address, addr2.address, addr3.address);
        });


        it('address 1+2+3 accounts have 10k ether ', async () => {
            // // (owner has deployment gas deducted)
            
            addr1Balance = await web3.eth.getBalance(addr1.address);
            addr1Balance = web3.utils.fromWei(addr1Balance, 'ether');

            addr2Balance = await web3.eth.getBalance(addr2.address);
            addr2Balance = web3.utils.fromWei(addr2Balance, 'ether');

            addr3Balance = await web3.eth.getBalance(addr3.address);
            addr3Balance = web3.utils.fromWei(addr3Balance, 'ether');

            assert.equal(10000, addr1Balance, addr2Balance, addr3Balance);
        });
    });


    describe('Basic token transaction tests', () => {
        it('owner can transfer 100k reflect', async () => {
            
            ownerInitialBalance = await token.connect(owner).balanceOf(owner.address);
            ownerInitialBalance = web3.utils.hexToNumberString(ownerInitialBalance);
            ownerInitialBalance = web3.utils.fromWei(ownerInitialBalance, 'ether');

            await token.connect(owner).transfer(addr1.address,web3.utils.toWei('100000', 'ether'));

            addr1Balance = await token.connect(owner).balanceOf(addr1.address)
            addr1Balance = web3.utils.hexToNumberString(addr1Balance);
            addr1Balance = web3.utils.fromWei(addr1Balance, 'ether');

            ownerNewBalance = await token.connect(owner).balanceOf(owner.address);
            ownerNewBalance = web3.utils.hexToNumberString(ownerNewBalance);
            ownerNewBalance = web3.utils.fromWei(ownerNewBalance, 'ether');
            
            console.log('ownerInitialBalance: '+ownerInitialBalance)
            console.log('addr1Balance: '+addr1Balance);
            console.log('ownerNewBalance: '+ownerNewBalance);
            // assert.equal(95, addr1Balance);
            // assert.equal(5, aidWalletBalance);
            // assert.equal(ownerInitialBalance - 100, ownerNewBalance);
            // assert(true);

        });
    });

    // describe('Uniswap implementation tests', () => {
    //     it('generic code testing', async () => {
    //         const uniswapV2Factory = await UniswapV2Factory.deploy(signers[0].address);
    //     });
    // });
});























