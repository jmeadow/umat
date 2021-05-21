const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider())

const compiledFactory = require('../ethereum/build/CampaignFactory.json'); // whole file, not just interface/bytecode
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;


beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({
            from: accounts[0]
            ,gas: 1000000
        });

    await factory.methods.createCampaign('100').send({ // '100' is the minimum variable from the function
        from: accounts[0]
        ,gas: 1000000
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); // es2016 syntax to pull array item[0]
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface)
        ,campaignAddress // instructs web3 to load a contract that has already been deployed
    );
});

describe('Campaigns', () => {
    it('deploys a factory and campaign', () => {
        assert.ok(factory.options.address); // confirms that an address exists
        assert.ok(campaign.options.address); // confirms that an address exists
    });


    it('marks caller as campaign manager', async () => {
        const campaignManager = await campaign.methods.manager().call(); // default method for manager variable

        assert.equal(accounts[0], campaignManager);
    });


    it('people can send money and become approvers', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1]
            ,value: web3.utils.toWei('1', 'ether')
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call(); // pull mapping value
        assert(isContributor);
    });


    it('below minimum contributions are rejected', async () => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[1]
                ,value: '1'
            });
            assert(false);
        } catch (err) {
            assert(true);
        }
    });


    it('a manager can make a payment request', async () => {
        await campaign.methods.createRequest( // submitting multiple variables into a struct
            'large stapler'
            ,'500'
            ,accounts[2]
        ).send({
            from: accounts[0]
            ,gas: 1000000
        });
        const request = await campaign.methods.requests(0).call();
        assert.equal('large stapler',request.description); // confirm the value of a struct
    });


    it('end-to-end: contribution>request>approve>payments disbursed', async () => {
        await campaign.methods.contribute().send({ // send money
            from: accounts[1]
            ,value: web3.utils.toWei('2', 'ether')
        });

        await campaign.methods.createRequest( // manager makes reqyest
            'large stapler'
            ,web3.utils.toWei('1', 'ether')
            ,accounts[2]
        ).send({
            from: accounts[0]
            ,gas: 1000000
        });

        await campaign.methods.approveRequest(0).send({
            from: accounts[1]
            ,gas: 1000000
        });

        const initialBalance = await web3.eth.getBalance(accounts[2]); // balance before approval

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0]
            ,gas: 1000000
        });

        const finalBalance = await web3.eth.getBalance(accounts[2]); // balance after approval
        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei('0.8', 'ether')); // confirm the balnances are about 2 eth different

    });
});

