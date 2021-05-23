const { expect } = require("chai");
const assert = require('assert');

let UMAT;
let umat;
let owner;
let aidWallet;
let addr1;
let addr2;
let addr3;
let accounts;
let totalSupply;

describe('UMAT', () => {

    beforeEach(async () => {
        [owner, aidWallet, addr1, addr2, addr3, _] = await ethers.getSigners();

        UMAT = await ethers.getContractFactory('UMAT');
        umat = await UMAT.deploy(aidWallet.address);
        
        // accounts = await web3.eth.getAccounts();
    });

    describe('Deployment tests', () => {
        it('has an address and symbol is UMAT', async () => {

            const umatSymbol = await umat.symbol();

            assert.ok(umat.address); // it has an address
            assert.equal('UMAT',umatSymbol); // the symbol is UMAT

        });

        it('accounts[0] has the total supply, also we can do math', async () => {

            totalSupply = await umat.totalSupply();
            totalSupply = web3.utils.hexToNumberString(totalSupply); // I don't know how to turn the warning off but I'm ignoring it for now
            totalEtherSupply = web3.utils.fromWei(totalSupply, 'ether'); //confirm that we use Wei utils 

            ownerBalance = await umat.connect(owner).balanceOf(owner.address);
            ownerBalance = web3.utils.hexToNumberString(ownerBalance);


            assert(totalSupply > 0);
            assert.equal(totalSupply, ownerBalance);
            // assert(totalSupply > totalSupply - 1); // I can't get math to work for numbers this large
            assert(totalEtherSupply > totalEtherSupply - 1); // confirm we can do math functions on ether at least

            // // putting logs to help confirm things are working right
            // console.log('UMAT address: '+ await umat.address);
            // console.log('owner address: '+ await owner.address);
            // console.log('total UMAT wei: '+totalSupply);
            // console.log('total UMAT: '+totalEtherSupply);

        });

        it('there are 4 different accounts with addresses', () => {
            assert.ok(owner.address);
            assert.ok(addr1.address);
            assert.ok(addr2.address);
            assert.ok(addr3.address);
            assert.notEqual(owner.address, addr1.address, addr2.address, addr3.address);
        })
    });


    describe('Basic token transaction tests', () => {
        it('owner can transfer 100 wei and 5 goes to aid wallet', async () => {
            
            ownerInitialBalance = await umat.connect(owner).balanceOf(owner.address);
            ownerInitialBalance = web3.utils.hexToNumberString(ownerInitialBalance);

            await umat.connect(owner).transfer(addr1.address, 100);

            addr1Balance = await umat.connect(owner).balanceOf(addr1.address)
            addr1Balance = web3.utils.hexToNumberString(addr1Balance);

            aidWalletBalance = await umat.connect(owner).balanceOf(aidWallet.address)
            aidWalletBalance = web3.utils.hexToNumberString(aidWalletBalance);

            ownerNewBalance = await umat.connect(owner).balanceOf(owner.address)
            ownerNewBalance = web3.utils.hexToNumberString(ownerNewBalance);

            assert.equal(95, addr1Balance);
            assert.equal(5, aidWalletBalance);
            assert.equal(ownerInitialBalance - 100, ownerNewBalance);

        });
    });
});























