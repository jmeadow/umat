const { expect } = require("chai");
const assert = require('assert');
const tokenArtifact = artifacts.require("safemoon"); 
const BN = web3.utils.BN;


// not needed if we are running network out of ganache mac app or using truffle develop
// const ganache = require('ganache-cli');
// const Web3 = require('web3');
// const web3 = new Web3(ganache.provider())
// const web3 = new Web3('http://localhost:8545');



let safemoon;
let pairAddress;
let owner;
let addr1;
let addr2;
let addr3;

// testing configurations
let verbose;
let runPastTests; 


contract('SafeMoon', (accounts) => {

    beforeEach(async () => {

        owner = accounts[0]
        addr1 = accounts[1]
        addr2 = accounts[2]
        addr3 = accounts[3]

        safemoon = await tokenArtifact.deployed();
        pairAddress = await safemoon.uniswapV2Pair();
        router = await safemoon.uniswapV2Router();

        verbose = true;
        runPastTests = true; 
    });

    describe('Basic deployment tests', () => {
    //     it('has an address and symbol is safemoon', async () => {
    //         const safemoonSymbol = await safemoon.symbol();

    //         assert.ok(safemoon.address); // it has an address
    //         assert.equal('SAFEMOON',safemoonSymbol); // the symbol is UMAT

    //     });

        it('owner has the total umat supply and a balance > 0', async () => {
            totalSupply = await safemoon.totalSupply();
            totalSupply = web3.utils.hexToNumberString(totalSupply);
            totalSupply = web3.utils.fromWei(totalSupply, 'ether');

            ownerBalance = await safemoon.balanceOf.call(owner);
            ownerBalance = web3.utils.hexToNumberString(ownerBalance);
            ownerBalance = web3.utils.fromWei(ownerBalance, 'ether');

            // putting logs to help confirm things are working right
            console.log('total supply: '+totalSupply);
            console.log(ownerBalance);
            
            assert.equal(totalSupply, ownerBalance);
            assert(ownerBalance > 0);
            
        });

    //     it('there are 4 different accounts with addresses', () => {
    //         assert.ok(owner);
    //         assert.ok(addr1);
    //         assert.ok(addr2);
    //         assert.ok(addr3);
    //         assert.notEqual(owner, addr1, addr2, addr3);
    //     });


    //     it('address 1+2+3 accounts have 10k ether ', async () => {
    //         // (owner has deployment gas deducted)
            
    //         addr1Balance = await web3.eth.getBalance(addr1);
    //         addr1Balance = web3.utils.fromWei(addr1Balance, 'ether');

    //         addr2Balance = await web3.eth.getBalance(addr2);
    //         addr2Balance = web3.utils.fromWei(addr2Balance, 'ether');

    //         addr3Balance = await web3.eth.getBalance(addr3);
    //         addr3Balance = web3.utils.fromWei(addr3Balance, 'ether');

    //         assert.equal(100, addr1Balance, addr2Balance, addr3Balance);
    //     });
    });

    describe('Basic token transaction tests', () => {
        it('owner can transfer tokens and they aren\'t sent to contract', async () => {
            
            transferAmount = web3.utils.toWei('20000', 'ether');
            await safemoon.transfer(addr1, transferAmount, { from: owner });

            addr1Balance = await safemoon.balanceOf.call(addr1);

            console.log('addr1Balance: '+addr1Balance);
            // ownerNewBalance = await safemoon.balanceOf.call(owner);
            contractBalance = await safemoon.balanceOf.call(safemoon.address);

            assert.equal(0, contractBalance);
        });

        it('addr1 can transfer tokens and they are sent to contract', async () => {
            
            transferAmount = web3.utils.toWei('2000', 'ether');
            await safemoon.transfer(addr2, transferAmount, { from: addr1 });

            contractBalance = await safemoon.balanceOf.call(safemoon.address);
            addr1Balance = await safemoon.balanceOf.call(addr1);
            addr2Balance = await safemoon.balanceOf.call(addr2);

            console.log('contractBalance: '+contractBalance);
            console.log('addr1Balance: '+addr1Balance);
            console.log('addr2Balance: '+addr2Balance);

            assert(contractBalance > 0);
        });

        it('transfer above liquidity threshold', async () => {

            numTokensSellToAddToLiquidity = await safemoon.numTokensSellToAddToLiquidity();
            numTokensSellToAddToLiquidity = web3.utils.fromWei(numTokensSellToAddToLiquidity, 'ether');
            console.log('numTokensSellToAddToLiquidity: ',numTokensSellToAddToLiquidity);

            contractNewBalance = await safemoon.balanceOf.call(safemoon.address);
            contractNewBalance = web3.utils.fromWei(contractNewBalance, 'ether');
            console.log('contractBalance: '+contractNewBalance);
            
            transferAmount = web3.utils.toWei('4000', 'ether');
            await safemoon.transfer(addr2, transferAmount, { from: addr1 });

            contractNewBalance = await safemoon.balanceOf.call(safemoon.address);
            contractNewBalance = web3.utils.fromWei(contractNewBalance, 'ether');
            console.log('contractBalance: '+contractNewBalance);

            // liquidity add
            // send eth to contract
            startingEth = web3.utils.toWei('10', 'ether');
            safemoon.sendTransaction({ from: owner ,value: startingEth });
            initialLiquidityAmount = web3.utils.toWei('4000', 'ether');
            initialEthAmount = web3.utils.toWei('1', 'ether');
            console.log('adding liquidity');
            await safemoon.addLiquidity2(initialLiquidityAmount,initialEthAmount, {from: owner, value: initialEthAmount});


            transferAmount = web3.utils.toWei('4000', 'ether');
            await safemoon.transfer(addr2, transferAmount, { from: addr1 });

            contractNewBalance = await safemoon.balanceOf.call(safemoon.address);
            contractNewBalance = web3.utils.fromWei(contractNewBalance, 'ether');
            console.log('contractBalance: '+contractNewBalance);

            contractNewBalance = await safemoon.balanceOf.call(safemoon.address);
            contractNewBalance = web3.utils.fromWei(contractNewBalance, 'ether');
            console.log('contractBalance: '+contractNewBalance);

            assert(numTokensSellToAddToLiquidity > contractNewBalance);

            // assert(contractBalance > contractNewBalance);
            // 45 001   675 059   627 096 948
            // 70 004  300 259  015 550 933
            // 400000000000 000 000 000
            // 1000000 000 000 000
        });


    //     it('liquidity address transfer does not go to charity wallet, reflects to owner', async () => {
            
    //         // transfer 25% to addr1 to test if they get reflections
    //         transferAmount = web3.utils.toWei('250000', 'ether')
    //         await umat.transfer(addr1, transferAmount, { from: owner });

    //         addr1InitialBalance = await umat.balanceOf.call(addr1);
    //         ownerInitialBalance = await umat.balanceOf.call(owner);
    //         aidWalletInitialBalance = await umat.balanceOf.call(aidWallet);

    //         // transfer liquidity
    //         await umat.transfer(liquidityAddress, '100000', { from: owner });

    //         liquidityAddressBalance = await umat.balanceOf.call(liquidityAddress);
    //         aidWalletNewBalance = await umat.balanceOf.call(aidWallet);
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
    //             console.log('aidWalletInitialBalance: '+aidWalletInitialBalance);
    //             console.log('aidWalletNewBalance: '+aidWalletNewBalance);
    //             console.log('aidWallet difference: '+aidWalletNewBalance.sub(aidWalletInitialBalance));
    //         }

    //         assert(liquidityAddressBalance = 95000); // liquidity address received transfer less 5% reflection
    //         assert(100000 < ownerNewBalance.sub(ownerInitialBalance) <= 95000); // owner gets reflections back
    //         assert(addr1NewBalance.sub(addr1InitialBalance) > 0); // addr1 gets reflection
    //         assert(aidWalletNewBalance.sub(aidWalletInitialBalance) > 0); // aidWallet gets reflection
    //     });
    });

    // describe('Uniswap implementation tests', () => {
    //     it('pair address exists', async () => {
    //         pairAddress = await umat.uniswapV2Pair();
    //         console.log('pairAddress: '+pairAddress);
    //         assert.ok(pairAddress);
    //     });

    //     it('test swap and liquify', async () => {
    //         // transfer 25% to addr1 to test if they get reflections
    //         addr1NewBalance = await umat.balanceOf.call(addr1);
    //         addr1NewBalance = web3.utils.fromWei(addr1NewBalance, 'ether');
    //         console.log(addr1NewBalance);

    //         // transfer 25% to addr2 to test if they get reflections
    //         console.log('t2 attempt');
    //         transferAmount = web3.utils.toWei('10000', 'ether')
    //         await umat.transfer(addr2, transferAmount, { from: addr1 });

    //         // transfer 25% to addr3 to test if they get reflections
    //         console.log('t3 attempt');
    //         transferAmount = web3.utils.toWei('20000', 'ether')
    //         await umat.transfer(addr3, transferAmount, { from: addr1 });

    //     });

        // it('we can add liquidity', async () => {
        //     umatAmount = web3.utils.toWei('100', 'ether');
        //     ethAmount = web3.utils.toWei('1', 'ether');
        //     deadline = Math.floor(Date.now() / 1000) + (60 * 20); // now plus 20 minutes

        //     console.log('router address: '+router);
        //     await umat.approve(router, umatAmount);
        //     console.log('approved sending to router');

        //     await umat.addLiquidity(
        //         umat.address
        //         ,owner
        //         ,umatAmount
        //         ,ethAmount
        //         ,deadline 
        //         ,{ 
        //             from: owner
        //             ,value: ethAmount
        //         }
        //     );
        //     console.log('please dear god');
        // });
    // });
});










