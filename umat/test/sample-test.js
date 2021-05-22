const { expect } = require("chai");
const assert = require('assert');


let UMAT;
let umat;
let umatAddress;
let umatSymbol;

describe('UMAT', () => {

    beforeEach(async () => {
        UMAT = await ethers.getContractFactory('UMAT');
        umat = await UMAT.deploy();
    });


    it('has an address and symbol is UMAT', async () => {
        const umatAddress = await umat.address;
        const umatSymbol = await umat.symbol();

        assert.ok(umatAddress); // it has an address
        assert.equal('UMAT',umatSymbol); // the symbol is UMAT
    });
});

