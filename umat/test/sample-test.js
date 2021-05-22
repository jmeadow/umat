const { expect } = require("chai");
const assert = require('assert');


let UMAT;
let umat;
let owner;


describe('UMAT', () => {

    beforeEach(async () => {
        UMAT = await ethers.getContractFactory('UMAT');
        umat = await UMAT.deploy();
        [owner] = await ethers.getSigners();
    });


    it('has an address and symbol is UMAT', async () => {

        const umatSymbol = await umat.symbol();

        assert.ok(umat.address); // it has an address
        assert.equal('UMAT',umatSymbol); // the symbol is UMAT
    });


    it('the owner has a balance of more than 0', async () => {
        console.log(owner.address);
        const ownerBalance = await umat.balanceOf(owner.address);
        console.log(ownerBalance.toNumber());

        assert(ownerBalance > 0);
        // assert.ok(owner);
        // assert.ok(owner.address);

    });


});

