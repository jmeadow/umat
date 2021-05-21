pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns; // this will track all deployed campaigns
    // uint public minimumContribution;
    
    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender); // stores the address of the newly deployed campaign
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (address[]) { // view because we are not. changing anything, just looking data up
        return deployedCampaigns;
    }
}


contract Campaign {
    struct Request { // note that this defines a struct definition, and it later needs to be declared as a variable
        string description; // defines new field in the struct and sets its type
        uint value; // how much the donation will be
        address recipient; // who we will send the donation to
        bool complete; // has the request been completed?
        uint approvalCount; // how many yes votes we've received, we don't check "no" votes because this contract is supposed to check if 50% of total contributors have voted, not if 50% of the votes are "yes"s
        mapping(address => bool) approvals;
    }    
    
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount; // this will be how many approvers are in the mapping

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint minimum, address creator) public {
        manager = creator; // this remains assigned to the 
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value >= minimumContribution);
        
        approvers[msg.sender] = true; // adds a new key of this address to the approvers mapping, but remember that the address does not get stored in the mapping
        approversCount++; // add one approver to the count
    }
    
    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
            description: description
            ,value: value
            ,recipient: recipient
            ,complete: false
            ,approvalCount: 0 // we start with 0 approvals
        });

        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public { // the capital Request says "we are making a Request struct"; allows a contributor to approva a request
        Request storage request = requests[index]; // we use "storage" because we want to permanently modify the request mapping data
    
        require(approvers[msg.sender]); // returns true if this person is in the approvers mapping
        require(!request.approvals[msg.sender]); // if the address has already voted, break function
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index]; // the capital Request says "we are making a Request struct"
        
        require(request.approvalCount > (approversCount / 2));
        require(!request.complete); // confirm the request hasn't already been completed
        
        request.recipient.transfer(request.value); // it has a transfer method because all addresses come with that
        request.complete = true; // mark the uncompleted request as completed
    }
}





// example contract to introduct storage vs memory
// contract Numbers { 
//     int[] public numbers;
    
//     function Numbers() public {
//         numbers.push(20);
//         numbers.push(32);
        
//         // int[] storage myArray = numbers;
//         // myArray[0] = 1;
//         changeArray(numbers);
//     }
    
//     function changeArray(int[] storage myArray) private {
//         myArray[0] = 1;
//     }
// }