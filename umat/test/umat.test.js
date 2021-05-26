const { expect } = require("chai");
const assert = require('assert');

let UMAT;
let umat;
let owner;
let aidWallet;
let liquidityAddress;
let addr1;
let addr2;
let addr3;
let isLiquid;

describe('UMAT', () => {

    beforeEach(async () => {
        [owner, aidWallet, liquidityAddress, addr1, addr2, addr3, _] = await ethers.getSigners();

        UMAT = await ethers.getContractFactory('UMAT');
        umat = await UMAT.deploy(aidWallet.address);
        
        await umat.connect(owner).assignLiquidityAddress(liquidityAddress.address);


        // await hre.network.provider.request({ // uniswap router02
        //     method: "hardhat_impersonateAccount",
        //     params: ["0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"]
        // });
        // const router02 = await ethers.provider.getSigner("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");

        // await hre.network.provider.request({ // uniswap router01
        //     method: "hardhat_impersonateAccount",
        //     params: ["0xf164fC0Ec4E93095b804a4795bBe1e041497b92a"]
        // });
        // const router01 = await ethers.provider.getSigner("0xf164fC0Ec4E93095b804a4795bBe1e041497b92a");

        // await hre.network.provider.request({ // uniswap factory
        //     method: "hardhat_impersonateAccount",
        //     params: ["0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"]
        // });
        // const factory = await ethers.provider.getSigner("0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f");

        // await hre.network.provider.request({ // weth (https://blog.0xproject.com/canonical-weth-a9aa7d0279dd)
        //     method: "hardhat_impersonateAccount",
        //     params: ["0xc778417e063141139fce010982780140aa0cd5ab"]
        // });
        // const weth = await ethers.provider.getSigner("0xc778417e063141139fce010982780140aa0cd5ab");
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

        // it('there are 4 different accounts with addresses', () => {
        //     assert.ok(owner.address);
        //     assert.ok(addr1.address);
        //     assert.ok(addr2.address);
        //     assert.ok(addr3.address);
        //     assert.notEqual(owner.address, addr1.address, addr2.address, addr3.address);
        // });


        // it('address 1+2+3 accounts have 10k ether ', async () => {
        //     // (owner has deployment gas deducted)
            
        //     addr1Balance = await web3.eth.getBalance(addr1.address);
        //     addr1Balance = web3.utils.fromWei(addr1Balance, 'ether');

        //     addr2Balance = await web3.eth.getBalance(addr2.address);
        //     addr2Balance = web3.utils.fromWei(addr2Balance, 'ether');

        //     addr3Balance = await web3.eth.getBalance(addr3.address);
        //     addr3Balance = web3.utils.fromWei(addr3Balance, 'ether');

        //     assert.equal(10000, addr1Balance, addr2Balance, addr3Balance);
        // });

        it('liquidity address is flagged correctly', async () => {
            isLiquid = await umat._isLiquidityAddress(liquidityAddress.address);
            assert.equal(true, isLiquid);
        });
    });


    describe('Basic token transaction tests', () => {
        it('owner can transfer 100 UMAT wei and 5 go to charity wallet', async () => {
            
            ownerInitialBalance = await umat.connect(owner).balanceOf(owner.address);
            ownerInitialBalance = web3.utils.hexToNumberString(ownerInitialBalance);

            await umat.connect(owner).transfer(addr1.address, 100);

            addr1Balance = await umat.connect(owner).balanceOf(addr1.address)
            addr1Balance = web3.utils.hexToNumberString(addr1Balance);

            
            aidWalletBalance = await umat.connect(owner).balanceOf(aidWallet.address)
            aidWalletBalance = web3.utils.hexToNumberString(aidWalletBalance);

            ownerNewBalance = await umat.connect(owner).balanceOf(owner.address)
            ownerNewBalance = web3.utils.hexToNumberString(ownerNewBalance);
            // console.log('ownerInitialBalance: '+ownerInitialBalance);
            // console.log('aidWalletBalance: '+aidWalletBalance);
            // console.log('ownerNewBalance: '+ownerNewBalance);

            assert.equal(95, addr1Balance);
            assert.equal(5, aidWalletBalance);
            assert.equal(ownerInitialBalance - 100, ownerNewBalance);

        });

        it('liquidity address goes to liquidity and does not go to charity wallet', async () => {
            
            ownerInitialBalance = await umat.connect(owner).balanceOf(owner.address);
            ownerInitialBalance = web3.utils.hexToNumberString(ownerInitialBalance);

            await umat.connect(owner).transfer(liquidityAddress.address, 10000);

            liquidityAddressBalance = await umat.connect(owner).balanceOf(liquidityAddress.address);
            liquidityAddressBalance = web3.utils.hexToNumberString(liquidityAddressBalance);

            aidWalletBalance = await umat.connect(owner).balanceOf(aidWallet.address);
            aidWalletBalance = web3.utils.hexToNumberString(aidWalletBalance);

            ownerNewBalance = await umat.connect(owner).balanceOf(owner.address);
            ownerNewBalance = web3.utils.hexToNumberString(ownerNewBalance);

            console.log('ownerInitialBalance: '+ownerInitialBalance);
            console.log('liquidityAddressBalance: '+liquidityAddressBalance);
            console.log('ownerNewBalance: '+ownerNewBalance);
            // assert.equal(95, addr1Balance);
            assert.equal(0, aidWalletBalance);
            assert(liquidityAddressBalance > 0);
            // assert.equal(ownerInitialBalance - 100, ownerNewBalance);
            // assert(true);

        });
    });

    // describe('Uniswap implementation tests', () => {
    //     it('generic code testing', async () => {
    //         const uniswapV2Factory = await UniswapV2Factory.deploy(signers[0].address);
    //     });
    // });
});























