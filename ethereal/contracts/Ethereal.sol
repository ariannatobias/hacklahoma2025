// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Ethereal is ERC721URIStorage, Ownable {
    struct FocusSession {
        uint256 startTime;
        uint256 duration;
        uint256 stake;
        address user;
        bool completed;
    }

    mapping(address => FocusSession) public sessions;
    mapping(address => bool) public hasNFT;
    uint256 public nftTokenCounter;

    event FocusStarted(address indexed user, uint256 stake, uint256 duration);
    event FocusCompleted(address indexed user);
    event FocusExitedEarly(address indexed user, uint256 penalty);
    event NFTRewarded(address indexed user, uint256 tokenId);

    constructor() ERC721("Ethereal Focus NFT", "ETHFOCUS") Ownable(msg.sender) {
        nftTokenCounter = 1;
    }

    /**
     * @dev Start a focus session by staking ETH.
     */
    function startSession(uint256 duration) external payable {
        require(msg.value > 0, "Must stake ETH");
        require(sessions[msg.sender].startTime == 0, "Session already active");

        sessions[msg.sender] = FocusSession(block.timestamp, duration, msg.value, msg.sender, false);
        emit FocusStarted(msg.sender, msg.value, duration);
    }

    /**
     * @dev Check if a session is active.
     */
    function isSessionActive(address user) public view returns (bool) {
        return sessions[user].startTime > 0 && !sessions[user].completed && block.timestamp < sessions[user].startTime + sessions[user].duration;
    }

    /**
     * @dev Complete a session and claim back the staked ETH.
     */
        function completeSession() external {
        FocusSession storage session = sessions[msg.sender];
        require(session.startTime > 0, "No active session");
        require(!session.completed, "Session already completed");
        require(block.timestamp >= session.startTime + session.duration, "Session not finished");

        uint256 amount = session.stake;

        // 🛠️ Ensure session data is fully reset BEFORE transferring ETH
        session.startTime = 0;
        session.duration = 0;
        session.stake = 0;
        session.completed = true; 

        // Transfer ETH after resetting session
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed.");

        emit FocusCompleted(msg.sender);

        if (!hasNFT[msg.sender]) {
            _mintNFT(msg.sender);
        }
    }

     function resetSession() external {
        sessions[msg.sender].startTime = 0;
        sessions[msg.sender].duration = 0;
        sessions[msg.sender].stake = 0;
        sessions[msg.sender].completed = false;
    }


    /**
     * @dev Exit a focus session early, losing 25% of staked ETH.
     */
    function exitEarly() external {
        FocusSession storage session = sessions[msg.sender];
        require(session.startTime > 0, "No active session");

        uint256 penalty = session.stake / 4;
        uint256 refundAmount = session.stake - penalty;

        session.startTime = 0;
        session.duration = 0;
        session.stake = 0;
        session.completed = true;

        (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Transfer failed.");

        emit FocusExitedEarly(msg.sender, penalty);
    }

    

    /**
     * @dev Mint an NFT to reward a user for completing a session.
     */
    function _mintNFT(address user) private {
        uint256 tokenId = nftTokenCounter;
        _mint(user, tokenId);
        _setTokenURI(tokenId, "ipfs://QmNFTMetadataHash"); // Replace with actual IPFS hash
        nftTokenCounter++;
        hasNFT[user] = true;

        emit NFTRewarded(user, tokenId);
    }

    /**
     * @dev Withdraw contract balance (admin only).
     */
    function withdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdraw failed.");
    }
}