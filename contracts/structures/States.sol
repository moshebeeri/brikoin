pragma solidity ^0.4.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./../interfaces/Ownables.sol";

contract States is
    Ownables //, StatesInt{
{
    using SafeMath for uint256;

    address project;

    struct State {
        string name;
        address executor;
        bool executed;
        bool isValue;
    }

    mapping(uint256 => State) public states;
    uint256 insertIndex;
    uint256 currentState = 0;
    bool finalized = false;

    constructor(address _project) public Ownables() {
        insertIndex = 0;
        project = _project;
    }

    function updateState(uint256 _index, string _name, address _executor)
        public
        onlyOwner
    {
        require(states[_index].isValue);
        states[insertIndex].name = _name;
        states[insertIndex].executor = _executor;
    }

    function finalize() public onlyOwner {
        require(insertIndex > 0);
        finalized = true;
    }

    function addState(string _name, address _executor) public onlyOwner {
        require(!finalized);
        states[insertIndex].name = _name;
        states[insertIndex].executor = _executor;
        states[insertIndex].executed = false;
        states[insertIndex].isValue = true;
        insertIndex = insertIndex + 1;
    }

    function removeState() public onlyOwner {
        require(!finalized);
        require(states[insertIndex - 1].isValue);
        states[insertIndex - 1].isValue = false;
        insertIndex = insertIndex - 1;
    }

    function getStateStatus(uint256 _index)
        public
        view
        returns (string, address, bool, bool)
    {
        require(finalized);
        require(states[_index].isValue);
        return (
            states[_index].name,
            states[_index].executor,
            states[_index].executed,
            states[_index].isValue
        );
    }

    function advanceState(address _executor) public onlyOwner {
        require(finalized);
        require(states[currentState].isValue);
        states[currentState].executor = _executor;
        states[currentState].executed = true;
        currentState = currentState + 1;
    }

    function isLastState() public view onlyOwner returns (bool) {
        uint256 items = insertIndex;
        return currentState + 1 >= items;
    }

    function getNextState() public view returns (string, address, bool, bool) {
        require(finalized);
        require(states[currentState].isValue);
        return (
            states[currentState].name,
            states[currentState].executor,
            states[currentState].executed,
            states[currentState].isValue
        );
    }
}
