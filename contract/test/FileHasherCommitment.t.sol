pragma solidity 0.8.17;

import "forge-std/Test.sol";
import "../src/FileHasherCommitment.sol";

contract FileHasherCommitmentTest is Test {
    FileHasherCommitment public fileHashCommitment;

    function setUp() public {
        fileHashCommitment = new FileHasherCommitment();
    }

    // test only owner

    // test able to store and get hash correctly

    // test hash is wrapped around when index is full
}
