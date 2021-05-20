pragma solidity ^0.4.17;

contract Lottery {
    address public manager; // this can later be called with "await lottery.methods.manager().call();"
    address[] public players; // creates dynamic array that can only contain addresses
    
    function Lottery() public {
        manager = msg.sender;
    }
    
    function enter() public payable { // payable indicates that they are allowed to send money
        require(msg.value > 10000000000000000); // 0.01 ether
        // require(msg.sender != manager); // would prevent the manager from entering the lottery (not in lesson)
        
        players.push(msg.sender);
    }
    
    function random() private view returns (uint) {
        return uint(sha3(block.difficulty, now, players)); // uint converts the hash into an integer
    }
    
    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(this.balance); // the address of the player who won the lottery
        players = new address[](0); // creates new dynamic address array, that has an initial size of 0
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }

    function getManager() public view returns (address) {
        return manager;
    }


}