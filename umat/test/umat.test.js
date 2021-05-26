const { expect } = require("chai");
const assert = require('assert');
const umatArtifact = artifacts.require("UMAT");

// // not needed if we are running network out of app
// const ganache = require('ganache-cli');
// const Web3 = require('web3');
// const web3 = new Web3(ganache.provider())


let umat;
let owner;
let aidWallet;
let liquidityAddress;
let addr1;
let addr2;
let addr3;
let isLiquid;


contract('UMAT', (accounts) => {

    beforeEach(async () => {

        owner = accounts[0]
        aidWallet = accounts[1]
        liquidityAddress = accounts[2]
        addr1 = accounts[3]
        addr2 = accounts[4]
        addr3 = accounts[5]

        umat = await umatArtifact.deployed();

        await umat.assignLiquidityAddress(liquidityAddress);
    });

    it('has an address and symbol is UMAT', async () => {
        const umatSymbol = await umat.symbol();

        assert.ok(umat.address); // it has an address
        assert.equal('UMAT',umatSymbol); // the symbol is UMAT

    });

    it('owner has the total umat supply and a balance > 0', async () => {
        totalSupply = await umat.totalSupply();
        totalSupply = web3.utils.hexToNumberString(totalSupply);
        totalSupply = web3.utils.fromWei(totalSupply, 'ether');

        ownerBalance = await umat.balanceOf.call(owner);
        ownerBalance = web3.utils.hexToNumberString(ownerBalance);
        ownerBalance = web3.utils.fromWei(ownerBalance, 'ether');

        // // putting logs to help confirm things are working right
        // console.log('total UMAT: '+totalSupply);
        // console.log(ownerBalance);
        
        assert.equal(totalSupply, ownerBalance);
        assert(ownerBalance > 0);
        
    });

    it('there are 4 different accounts with addresses', () => {
        assert.ok(owner);
        assert.ok(addr1);
        assert.ok(addr2);
        assert.ok(addr3);
        assert.notEqual(owner, addr1, addr2, addr3);
    });


    it('address 1+2+3 accounts have 10k ether ', async () => {
        // (owner has deployment gas deducted)
        
        addr1Balance = await web3.eth.getBalance(addr1);
        addr1Balance = web3.utils.fromWei(addr1Balance, 'ether');

        addr2Balance = await web3.eth.getBalance(addr2);
        addr2Balance = web3.utils.fromWei(addr2Balance, 'ether');

        addr3Balance = await web3.eth.getBalance(addr3);
        addr3Balance = web3.utils.fromWei(addr3Balance, 'ether');

        assert.equal(100, addr1Balance, addr2Balance, addr3Balance);
    });

    it('liquidity address is flagged correctly', async () => {
        isLiquid = await umat._isLiquidityAddress(liquidityAddress);
        assert.equal(true, isLiquid);
    });


    describe('Basic token transaction tests', () => {
        it('owner can transfer 100 UMAT wei and 5 go to charity wallet', async () => {
            
            ownerInitialBalance = await umat.balanceOf.call(owner);

            await umat.transfer(addr1, 100, { from: owner });

            addr1Balance = await umat.balanceOf.call(addr1);
            aidWalletBalance = await umat.balanceOf.call(aidWallet);
            ownerNewBalance = await umat.balanceOf.call(owner);
            console.log('ownerInitialBalance: '+ownerInitialBalance);
            console.log('addr1Balance: '+addr1Balance);
            console.log('aidWalletBalance: '+aidWalletBalance);
            console.log('ownerNewBalance: '+ownerNewBalance);
            console.log('aidWallet: '+aidWallet);

            assert.equal(95, addr1Balance);
            assert.equal(5, aidWalletBalance);
            assert.equal(ownerInitialBalance - 100, ownerNewBalance);

        });

//         it('liquidity address goes to liquidity and does not go to charity wallet', async () => {
            
//             ownerInitialBalance = await umat.connect(owner).balanceOf(owner.address);
//             ownerInitialBalance = web3.utils.hexToNumberString(ownerInitialBalance);

//             await umat.connect(owner).transfer(liquidityAddress.address, 10000);

//             liquidityAddressBalance = await umat.connect(owner).balanceOf(liquidityAddress.address);
//             liquidityAddressBalance = web3.utils.hexToNumberString(liquidityAddressBalance);

//             aidWalletBalance = await umat.connect(owner).balanceOf(aidWallet.address);
//             aidWalletBalance = web3.utils.hexToNumberString(aidWalletBalance);

//             ownerNewBalance = await umat.connect(owner).balanceOf(owner.address);
//             ownerNewBalance = web3.utils.hexToNumberString(ownerNewBalance);

//             console.log('ownerInitialBalance: '+ownerInitialBalance);
//             console.log('liquidityAddressBalance: '+liquidityAddressBalance);
//             console.log('ownerNewBalance: '+ownerNewBalance);
//             // assert.equal(95, addr1Balance);
//             assert.equal(0, aidWalletBalance);
//             assert(liquidityAddressBalance > 0);
//             // assert.equal(ownerInitialBalance - 100, ownerNewBalance);
//             // assert(true);

//         });
    });

//     // describe('Uniswap implementation tests', () => {
//     //     it('generic code testing', async () => {
//     //         const uniswapV2Factory = await UniswapV2Factory.deploy(signers[0].address);
//     //     });
//     // });
});












