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



// describe("Greeter", function() {
//   it("Should return the new greeting once it's changed", async function() {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
    
//     await greeter.deployed();
//     expect(await greeter.greet()).to.equal("Hello, world!");

//     await greeter.setGreeting("Hola, mundo!");
//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });