pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract DispositionInt {
    function checkUserDisposition(address _user)
        public
        constant
        returns (bool isIndeed);

    function checkProjectDisposition(address _stoneCoin)
        public
        constant
        returns (bool isIndeed);

    function setUserDisposition(address _user, bool state)
        public
        returns (bool success);

    function setProjectDisposition(address _project, bool state)
        public
        returns (bool success);
}
