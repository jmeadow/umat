const { expect } = require("chai");
const assert = require('assert');


describe('UMAT', () => {
    it('first test please', async () => {
        const UMAT = await ethers.getContractFactory('UMAT');
        const umat = await UMAT.deploy();

        await umat.deployed();
        const umatSymbol = await umat.symbol();
        console.log(umatSymbol);
        assert.equal('UMAT',umatSymbol); // confirms that an address exists
    });
});


