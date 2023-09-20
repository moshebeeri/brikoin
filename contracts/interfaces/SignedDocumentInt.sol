pragma solidity ^0.4.24;

contract SignedDocumentInt {
    function isSignature(address _user) public constant returns (bool isIndeed);
    function getSignatureCount()
        public
        constant
        returns (uint256 signatureCount);

    function shouldSign(address _user, bytes32 _role)
        public
        returns (bool success);

    function sign() public returns (bool success);

    function sign(address _user) public returns (bool success);

    function approved() public returns (bool success);

    function isSign() public view returns (bool success);

    function isSigneer(address _user) public view returns (bool);

    function isSignedBy(address user) public view returns (bool signed);
}
