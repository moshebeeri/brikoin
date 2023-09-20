pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../structures/SignedDocument.sol";

contract SignedDocumentFactory is Ownable {
    event SignedDocumentCreated(address SignedDocument);

    function createSignedDocument(bool _admin, bytes32 _url, bytes32 _urlMD5)
        public
        returns (address)
    {
        SignedDocument newContract = new SignedDocument(_admin, _urlMD5, _url);
        emit SignedDocumentCreated(address(newContract));
        return address(newContract);
    }

    function shouldSign(address signedDocument, address _user, bytes32 _role)
        public
        returns (bool success)
    {
        SignedDocument signedDocumentContract = SignedDocument(signedDocument);
        return signedDocumentContract.shouldSign(_user, _role);
    }

    function sign(address signedDocument) public returns (bool success) {
        SignedDocument signedDocumentContract = SignedDocument(signedDocument);
        return signedDocumentContract.sign(msg.sender);
    }

    function isSign(address signedDocument) public view returns (bool) {
        SignedDocument signedDocumentContract = SignedDocument(signedDocument);
        return signedDocumentContract.isSign();
    }

}
