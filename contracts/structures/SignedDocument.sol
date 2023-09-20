pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../interfaces/SignedDocumentInt.sol";

contract SignedDocument is Ownable, SignedDocumentInt {
    using SafeMath for uint256;
    event SignedDocumentCreated(address signedDocumentAddress);

    //enum Role{TRUSTEE, ESTIMATOR, ADMIN, INVESTOR, USER}

    struct Signature {
        bool signed;
        address user;
        bytes32 role;
        uint256 listPointer;
    }
    bool public adminApproval;
    bool public alreadyApproved;
    bytes32 public url;
    bytes32 public urlMD5;

    address[] public signatureList;
    mapping(address => Signature) public signatures;
    event ShouldSign(address by, bytes32 role);
    event Sign(address by);

    constructor(bool _adminApproval, bytes32 _url, bytes32 _urlMD5)
        public
        Ownable()
    {
        require(_url.length != 0);
        require(_urlMD5.length != 0);

        adminApproval = _adminApproval;
        alreadyApproved = false;
        url = _url;
        urlMD5 = _urlMD5;
    }

    function isSignature(address _user)
        public
        constant
        returns (bool isIndeed)
    {
        if (signatureList.length == 0) return false;
        return (signatureList[signatures[_user].listPointer] == _user);
    }

    function getSignatureCount()
        public
        constant
        returns (uint256 signatureCount)
    {
        return signatureList.length;
    }

    function shouldSign(address _user, bytes32 _role)
        public
        onlyOwner
        returns (bool success)
    {
        require(!isSignature(_user));
        signatures[_user].user = _user;
        signatures[_user].role = _role;
        signatures[_user].listPointer = signatureList.push(_user) - 1;
        emit ShouldSign(_user, _role);
        return true;
    }

    function sign() public returns (bool success) {
        require(signatures[msg.sender].user == msg.sender);
        signatures[msg.sender].signed = true;
        emit Sign(msg.sender);
        return true;
    }

    function sign(address _user) public returns (bool success) {
        require(signatures[_user].user == _user);
        signatures[_user].signed = true;
        emit Sign(_user);
        return true;
    }

    function approved() public returns (bool success) {
        require(isSign());
        alreadyApproved = true;
        return true;
    }

    function isSign() public view returns (bool success) {
        if (alreadyApproved) {
            return false;
        }
        bool result = true;
        bool adminApproved = false;
        for (uint256 i = 0; i < signatureList.length; i++) {
            if (signatures[signatureList[i]].signed == false) {
                return false;
            }
            if (signatures[signatureList[i]].role == "ADMIN") {
                adminApproved = true;
            }
        }

        if (adminApproval && !adminApproved) {
            return false;
        }
        return result;
    }

    function isSigneer(address _user) public view returns (bool) {
        if (signatures[_user].user == _user) return true;
        return false;
    }

    function isSignedBy(address user) public view returns (bool signed) {
        return signatures[user].signed;
    }
}
