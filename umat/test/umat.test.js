const { expect } = require("chai");
const assert = require('assert');

let UMAT;
let umat;
let owner;
let accounts;
let totalSupply;

describe('UMAT', () => {

    beforeEach(async () => {
        UMAT = await ethers.getContractFactory('UMAT');
        umat = await UMAT.deploy();
        [owner] = await ethers.getSigners();
        accounts = await web3.eth.getAccounts();
    });

    describe('Deployment tests', () => {
        it('has an address and symbol is UMAT', async () => {

            const umatSymbol = await umat.symbol();

            

            assert.ok(umat.address); // it has an address
            assert.equal('UMAT',umatSymbol); // the symbol is UMAT
        });


        it('total supply is greater than 0 and the owner has the total supply, also we can do math', async () => {

            totalSupply = await umat.totalSupply();
            totalSupply = web3.utils.hexToNumberString(totalSupply); // I don't know how to turn the warning off but I'm ignoring it for now
            totalEtherSupply = web3.utils.fromWei(totalSupply, 'ether'); //confirm that we use Wei utils 

            ownerBalance = await umat.balanceOf(owner.address);
            ownerBalance = web3.utils.hexToNumberString(ownerBalance);


            assert(totalSupply > 0);
            assert.equal(totalSupply,ownerBalance);
            // assert(totalSupply > totalSupply - 1); // I can't get math to work for numbers this large
            assert(totalEtherSupply > totalEtherSupply - 1); // confirm we can do math functions on ether at least

            // putting logs to help confirm things are working right
            console.log('UMAT address: '+ await umat.address);
            console.log('owner address: '+ await owner.address);
            console.log('total wei: '+totalSupply);
            console.log('total ether: '+totalEtherSupply);

        });
    });


    // describe('Basic token transaction tests', () => {
    //     it('owner can transfer tokens', async () => {
    //         await 
    //     });
    // });
});

