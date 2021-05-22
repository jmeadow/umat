const { expect } = require("chai");
const assert = require('assert');

describe('UMAT', () => {
    it('has an address and symbol is UMAT', async () => {

        const UMAT = await ethers.getContractFactory('UMAT');
        const umat = await UMAT.deploy();
        
        await umat.deployed();

        const umatAddress = umat.address;
        const umatSymbol = await umat.symbol();

        assert.ok(umatAddress); // it has an address
        assert.equal('UMAT',umatSymbol); // the symbol is UMAT
    });
});

