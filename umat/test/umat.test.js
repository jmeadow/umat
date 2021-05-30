const { expect } = require("chai");
const assert = require('assert');
const umatArtifact = artifacts.require("UMAT");

// not needed if we are running network out of ganache mac app or using truffle develop
// const ganache = require('ganache-cli');
// const Web3 = require('web3');
// const web3 = new Web3(ganache.provider())
// const web3 = new Web3('http://localhost:8545');



let umat;
let pairAddress;
let owner;
let aidFeeWallet;
let aidEquityWallet;
let addr1;
let addr2;
let addr3;
let isLiquid;

// testing configurations
let verbose;
let runPastTests; 


contract('UMAT', (accounts) => {

    beforeEach(async () => {

        owner = accounts[0]
        aidFeeWallet = accounts[1]
        aidEquityWallet = accounts[2]
        addr1 = accounts[3]
        addr2 = accounts[4]
        addr3 = accounts[5]

        umat = await umatArtifact.deployed();
        pairAddress = await umat.uniswapV2Pair();
        router = await umat.uniswapV2Router();

        verbose = false;
    });

    describe('Basic deployment tests', () => {
        it('has an address', async () => {
            assert.ok(umat.address); // it has an address
        });

        it('owner and aid equity have the total umat supply', async () => {
            totalSupply = await umat.totalSupply();
            totalSupply = web3.utils.fromWei(totalSupply, 'ether');

            ownerBalance = await umat.balanceOf.call(owner);
            ownerBalance = web3.utils.fromWei(ownerBalance, 'ether');

            aidEquityBalance = await umat.balanceOf.call(aidEquityWallet);
            aidEquityBalance = web3.utils.fromWei(aidEquityBalance, 'ether');

            mintedBalance = (aidEquityBalance * 1) + (ownerBalance * 1) // messy way to convert to numbers

            // // putting logs to help confirm things are working right
            // console.log('total UMAT: '+totalSupply);
            // console.log(ownerBalance);
            // console.log(mintedBalance);
            
            assert.equal(totalSupply, mintedBalance);
            assert(ownerBalance > 0);
            
        });

        it('there are 4 different accounts with addresses', () => {
            assert.ok(owner);
            assert.ok(addr1);
            assert.ok(addr2);
            assert.ok(addr3);
            assert.notEqual(owner, addr1, addr2, addr3);
        });


        it('address 1+2+3 accounts have ether ', async () => {
            // (owner has deployment gas deducted)
            
            addr1Balance = await web3.eth.getBalance(addr1);
            addr1Balance = web3.utils.fromWei(addr1Balance, 'ether');

            addr2Balance = await web3.eth.getBalance(addr2);
            addr2Balance = web3.utils.fromWei(addr2Balance, 'ether');

            addr3Balance = await web3.eth.getBalance(addr3);
            addr3Balance = web3.utils.fromWei(addr3Balance, 'ether');

            assert.equal(100, addr1Balance, addr2Balance, addr3Balance);
        });
    });

    // describe('Basic token transaction tests', () => {
    //     it('owner can transfer UMAT wei and 5% go to charity wallet', async () => {
            
    //         ownerInitialBalance = await umat.balanceOf.call(owner);
    //         transferAmount = web3.utils.toWei('100', 'ether')

    //         await umat.transfer(addr1, transferAmount, { from: owner });

    //         addr1Balance = await umat.balanceOf.call(addr1);
    //         AidFeeWalletBalance = await umat.balanceOf.call(AidFeeWallet);
    //         ownerNewBalance = await umat.balanceOf.call(owner);

    //         if(verbose) {
    //             console.log('ownerInitialBalance: '+ownerInitialBalance);
    //             console.log('addr1Balance: '+addr1Balance);
    //             console.log('AidFeeWalletBalance: '+AidFeeWalletBalance);
    //             console.log('ownerNewBalance: '+ownerNewBalance);
    //             console.log('AidFeeWallet: '+AidFeeWallet);
    //         }

    //         assert.equal(transferAmount * 0.95, addr1Balance);
    //         assert.equal(transferAmount * 0.05, AidFeeWalletBalance);
    //         assert.equal(ownerInitialBalance - transferAmount, ownerNewBalance);

    //     });

    //     it('liquidity address transfer does not go to charity wallet, reflects to owner', async () => {
            
    //         // transfer 25% to addr1 to test if they get reflections
    //         transferAmount = web3.utils.toWei('250000', 'ether')
    //         await umat.transfer(addr1, transferAmount, { from: owner });

    //         addr1InitialBalance = await umat.balanceOf.call(addr1);
    //         ownerInitialBalance = await umat.balanceOf.call(owner);
    //         AidFeeWalletInitialBalance = await umat.balanceOf.call(AidFeeWallet);

    //         // transfer liquidity
    //         await umat.transfer(liquidityAddress, '100000', { from: owner });

    //         liquidityAddressBalance = await umat.balanceOf.call(liquidityAddress);
    //         AidFeeWalletNewBalance = await umat.balanceOf.call(AidFeeWallet);
    //         ownerNewBalance = await umat.balanceOf.call(owner);
    //         addr1NewBalance = await umat.balanceOf.call(addr1);

    //         if(verbose) {
    //             console.log('addr1InitialBalance: '+addr1InitialBalance);
    //             console.log('addr1NewBalance: '+addr1NewBalance);
    //             console.log('addr1 difference: '+addr1NewBalance.sub(addr1InitialBalance));
    //             console.log('ownerInitialBalance: '+ownerInitialBalance);
    //             console.log('ownerNewBalance: '+ownerNewBalance);
    //             console.log('owner difference: '+ownerInitialBalance.sub(ownerNewBalance));
    //             console.log('liquidityAddressBalance: '+liquidityAddressBalance);
    //             console.log('AidFeeWalletInitialBalance: '+AidFeeWalletInitialBalance);
    //             console.log('AidFeeWalletNewBalance: '+AidFeeWalletNewBalance);
    //             console.log('AidFeeWallet difference: '+AidFeeWalletNewBalance.sub(AidFeeWalletInitialBalance));
    //         }

    //         assert(liquidityAddressBalance = 95000); // liquidity address received transfer less 5% reflection
    //         assert(100000 < ownerNewBalance.sub(ownerInitialBalance) <= 95000); // owner gets reflections back
    //         assert(addr1NewBalance.sub(addr1InitialBalance) > 0); // addr1 gets reflection
    //         assert(AidFeeWalletNewBalance.sub(AidFeeWalletInitialBalance) > 0); // AidFeeWallet gets reflection
    //     });
    // });

    // describe('Uniswap implementation tests', () => {
    //     it('pair address exists', async () => {
    //         pairAddress = await umat.uniswapV2Pair();
    //         console.log('pairAddress: '+pairAddress);
    //         assert.ok(pairAddress);
    //     });

    // god I wish I could get this to work, but it works on rinkeby at least
    //     it('we can add liquidity', async () => {
    //         umatAmount = web3.utils.toWei('100', 'ether');
    //         ethAmount = web3.utils.toWei('1', 'ether');
    //         deadline = Math.floor(Date.now() / 1000) + (60 * 20); // now plus 20 minutes

    //         console.log('router address: '+router);
    //         await umat.approve(router, umatAmount);
    //         console.log('approved sending to router');

    //         await umat.addLiquidityETHTest(
    //             umat.address
    //             ,umatAmount
    //             ,0
    //             ,0
    //             ,owner
    //             ,deadline 
    //             ,{ 
    //                 from: owner
    //                 ,value: ethAmount
    //             }
    //         );
    //         console.log('please dear god');
    //     });
    // });
});










