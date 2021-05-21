const assert = require('assert'); // allows us to make assertions about values in the code
const ganache = require('ganache-cli'); // serves as our local test ethereum network
const Web3 = require('web3'); // web3 constructor function (can be used to make an instance of web3)
const web3 = new Web3(ganache.provider()) // the instance of web3 we will be using; each instance will connect to a specific ethereum network via ganache

class Car {
    park() {
        return 'stopped';
    }

    drive() {
        return 'vroom';
    }
}

let car; // ensures that car exists for the entire scope of the file

beforeEach(() => { // initialization code that will happen before each test is run
    car = new Car(); // this assigns a value to the full scope empty car variable
});

describe('Car class', () => { // first argument can be anything, it's just an output label
    it('Test of park function', () => { // first argument can be anything, it's just an output label
        assert.equal(car.park(), 'stopped'); // (the value produced by our code), (the value that it should equal)
    }); 

    it('Test of drive function', () => {
        assert.equal(car.drive(), 'vroom');
    });
});