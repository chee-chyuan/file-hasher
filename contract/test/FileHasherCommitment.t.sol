pragma solidity 0.8.17;

import "forge-std/console2.sol";
import "forge-std/Test.sol";
import "./utils/Utilities.sol";
import "../src/FileHasherCommitment.sol";

contract FileHasherCommitmentTest is Test {
    Utilities internal utils;
    FileHasherCommitment public fileHashCommitment;

    function setUp() public {
        utils = new Utilities();
        fileHashCommitment = new FileHasherCommitment();
    }

    // // test only owner
    // function testCannotCommitForNonOwner() public {
    //     address ownerAddr = fileHashCommitment.owner();
    //     console2.log("ownerAddr: %s", ownerAddr);

    //     address aliceAddr = utils.createUsers(1)[0];
    //     assertTrue(ownerAddr != aliceAddr);

    //     vm.prank(address(aliceAddr));
    //     vm.expectRevert("Ownable: caller is not the owner");
    //     fileHashCommitment.commitFileHash(aliceAddr, 1);
    // }

    // test able to store and get hash correctly
    function testStoreHashCorrectly() public {
        address aliceAddr = utils.createUsers(1)[0];
        uint8 currentIndex = fileHashCommitment.ringBufferIndexes(aliceAddr);
        assertEq(currentIndex, 0);
        assertEq(fileHashCommitment.fileHashRingBuffers(aliceAddr, currentIndex), 0);

        uint256 hashToStore = 1;
        fileHashCommitment.commitFileHash(aliceAddr, hashToStore);

        uint8 newCurrentIndex = fileHashCommitment.ringBufferIndexes(aliceAddr);
        assertEq(newCurrentIndex, currentIndex + 1);
        assertEq(fileHashCommitment.fileHashRingBuffers(aliceAddr, currentIndex), hashToStore);
    }

    // test hash is wrapped around when index is full
    function testRingBufferWrapAround() public {
        address aliceAddr = utils.createUsers(1)[0];
        uint256 hashToStore = 100;
        for (uint256 i = 0; i < fileHashCommitment.RING_BUFFER_SIZE(); ++i) {
            uint8 currentIndex = fileHashCommitment.ringBufferIndexes(aliceAddr);
            assertEq(currentIndex, i);
            fileHashCommitment.commitFileHash(aliceAddr, hashToStore);
        }

        uint8 currentIndex = fileHashCommitment.ringBufferIndexes(aliceAddr);
        assertEq(currentIndex, 0);
    }
}
