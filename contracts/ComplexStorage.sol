pragma solidity ^0.4.24;

contract ComplexStorage {
    uint256 public storeduint1 = 15;
    uint256 public constant constuint = 16;
    uint128 public investmentsLimit = 17055;
    uint32 public investmentsDeadlineTimeStamp = uint32(now);

    bytes16 public string1 = "test1";
    bytes32 public string2 = "test1236";
    string public string3 = "lets string something";

    mapping(address => uint256) uints1;
    mapping(address => DeviceData) structs1;

    uint256[] public uintarray;
    DeviceData[] public deviceDataArray;
    DeviceData public singleDD;

    struct DeviceData {
        string deviceBrand;
        string deviceYear;
        string batteryWearLevel;
    }

    constructor() public {}
}
