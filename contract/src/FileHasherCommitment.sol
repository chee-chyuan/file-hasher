// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.17;

// import "@openzeppelin/access/Ownable.sol";
import "@openzeppelin/access/AccessControl.sol";

contract FileHasherCommitment is AccessControl {
    uint8 public constant RING_BUFFER_SIZE = 5;
    /// maps address of user to ring buffer
    mapping(address => uint256[RING_BUFFER_SIZE]) public fileHashRingBuffers;
    /// maps address of user to the current ring buffer index to store
    mapping(address => uint8) public ringBufferIndexes;

    event CommittedFile(address indexed user, uint256 hash);

    constructor () {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function commitFileHash(address user, uint256 hash) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint8 currentIndex = ringBufferIndexes[user];
        ringBufferIndexes[user] = (currentIndex + 1) % RING_BUFFER_SIZE;

        fileHashRingBuffers[user][currentIndex] = hash;

        emit CommittedFile(user, hash);
    }
}
