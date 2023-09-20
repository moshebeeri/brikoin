pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../structures/Terms.sol";
contract TermsFactory is Ownable {
    using SafeMath for uint256;
    mapping(address => bool) terms;
    event TermsRoleCreated(address terms);
    event TermsCreated(address terms);
    address public _terms;

    modifier onlyTerms() {
        require(terms[msg.sender] == true || owner == msg.sender);
        _;
    }

    function createTerms(
        bytes32 _name,
        bytes32 _holdingYears,
        bytes32 _sellPercentage,
        bytes32 _rental,
        bytes32 _url,
        bytes32 _urlMD5
    ) public onlyTerms returns (address) {
        Terms newContract = new Terms(
            _name,
            _holdingYears,
            _sellPercentage,
            _rental,
            _url,
            _urlMD5
        );
        emit TermsCreated(address(newContract));
        return address(newContract);
    }

    function addTerms(address newTerms) public onlyOwner {
        require(terms[newTerms] != true);
        terms[newTerms] = true;
        emit TermsRoleCreated(newTerms);
    }
}
