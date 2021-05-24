const { expect } = require("chai");
const assert = require('assert');

let UMAT;
let umat;
let owner;
let aidWallet;
let addr1;
let addr2;
let addr3;
let totalSupply;

describe('UMAT', () => {

    beforeEach(async () => {
        [owner, aidWallet, addr1, addr2, addr3, _] = await ethers.getSigners();

        UMAT = await ethers.getContractFactory('UMAT');
        umat = await UMAT.deploy(aidWallet.address);
        
    });

    describe('Deployment tests', () => {
        it('has an address and symbol is UMAT', async () => {

            const umatSymbol = await umat.symbol();

            assert.ok(umat.address); // it has an address
            assert.equal('UMAT',umatSymbol); // the symbol is UMAT

        });

        it('owner has the total umat supply and a balance > 0', async () => {

            totalSupply = await umat.totalSupply();
            totalSupply = web3.utils.hexToNumberString(totalSupply); // I don't know how to turn the warning off but I'm ignoring it for now
            totalSupply = web3.utils.fromWei(totalSupply, 'ether');

            ownerBalance = await umat.connect(owner).balanceOf(owner.address);
            ownerBalance = web3.utils.hexToNumberString(ownerBalance);
            ownerBalance = web3.utils.fromWei(ownerBalance, 'ether');
            

            // // putting logs to help confirm things are working right
            // console.log('UMAT address: '+ await umat.address);
            // console.log('owner address: '+ await owner.address);
            // console.log('total UMAT: '+totalSupply);
            // console.log(totalSupply);
            // console.log(ownerBalance);

            
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
        it('owner can transfer 100 UMAT wei', async () => {
            
            ownerInitialBalance = await umat.connect(owner).balanceOf(owner.address);
            ownerInitialBalance = web3.utils.hexToNumberString(ownerInitialBalance);

            await umat.connect(owner).transfer(addr1.address, 100);

            addr1Balance = await umat.connect(owner).balanceOf(addr1.address)
            addr1Balance = web3.utils.hexToNumberString(addr1Balance);

            aidWalletBalance = await umat.connect(owner).balanceOf(aidWallet.address)
            aidWalletBalance = web3.utils.hexToNumberString(aidWalletBalance);

            ownerNewBalance = await umat.connect(owner).balanceOf(owner.address)
            ownerNewBalance = web3.utils.hexToNumberString(ownerNewBalance);
            // console.log(ownerNewBalance);
            assert.equal(95, addr1Balance);
            assert.equal(5, aidWalletBalance);
            assert.equal(ownerInitialBalance - 100, ownerNewBalance);
            // assert(true);

        });
    });

    // describe('Uniswap implementation tests', () => {
    //     it('generic code testing', async () => {
    //         const uniswapV2Factory = await UniswapV2Factory.deploy(signers[0].address);
    //     });
    // });
});























