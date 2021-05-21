pragma solidity ^0.4.25;

contract FirstContract{

    int number;
    string name;

    constructor() public {
        number = 50;
        name = 'Our First Smart Contract';
    }
    
    function getNumber() view public returns(int) {
        return number;
    }
 
    function getName() view public returns(string) {
        return name;
    }
}