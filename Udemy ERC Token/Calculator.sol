pragma solidity ^0.5.7;

contract CalculatorApp{
    
    string name = 'My Calculator';
    
    function Add(int num1, int num2) pure public returns(int) {
        int result = num1 + num2;
        return(result);
    }
}

// skipped the rest