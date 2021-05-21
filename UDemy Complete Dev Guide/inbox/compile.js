// compile code will go here
const path = require('path'); // allows for cross-platform compatibility when looking through filepaths
const fs = require('fs'); // filesystem
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol') // dirname: constant location of main directory on all nodes
const source = fs.readFileSync(inboxPath, 'utf8') 

module.exports = solc.compile(source, 1).contracts[':Inbox']; 
// module.exports sets it up so that we're exporting the compiled code with all included contracts
// 1 is the number of files we are trying to compile
// .contracts[''] calls the specific relevant contracts out ot the full compiled code