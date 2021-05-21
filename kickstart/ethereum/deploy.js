const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider( // this is a test wallet with only 1 account that only contains rinkeby ether
    'arrange total useful zoo must vast swing swap smoke gown gap session'
    ,'https://rinkeby.infura.io/v3/9cedd9a200d44dff9c7d7422f0e4dccb'
);
const web3 = new Web3(provider);

const deploy = async () => { // dummy function because you can only use the async/await syntax inside of functions
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0])

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)) // remember that the interface is the ABI
        .deploy({
            data: compiledFactory.bytecode
        })
        .send({
             gas: 1000000
            ,from: accounts[0]
        });

    console.log('Contract deployed to', result.options.address);
};
deploy();

// deployed to 0xe24F944b32b9f02F94f5A2Ae1cc012dF9ed767Dd