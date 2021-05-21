const path = require('path'); // allows for cross-platform compatibility when looking through filepaths
const fs = require('fs-extra'); // filesystem extra: community maintained and has extra functions we want to use
const solc = require('solc'); // solidity compiler

// reset build folder
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath); // this is a fs-extra function that removes folder+included items
fs.ensureDirSync(buildPath); // rebuild directory if it doens't exist

// location of the contract
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol'); // dirname: main directory on all nodes
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source, 1).contracts;

for (let contract in output) { // a for-in loop iterates over the keys in an object, i.e. the contracts
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':','') + '.json'),
        output[contract] // the actual content of each compiled contract
    );
}