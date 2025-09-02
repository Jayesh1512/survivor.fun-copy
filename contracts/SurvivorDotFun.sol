// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import {RandomnessReceiverBase} from "randomness-solidity/src/RandomnessReceiverBase.sol";

contract SurvivorDotFun is RandomnessReceiverBase {

    // The struct `Bubba` holds the attributes for an agent.
    struct Bubba {
        address owner;
        uint256 compliance;
        uint256 creativity;
        uint256 unhingedness;
        uint256 motivation;
        bool isAlive;
    }

    // Mapping from agent ID to the agent's struct
    mapping(uint256 => Bubba) public agents;
    // Mapping from user address to their current active agent ID
    mapping(address => uint256) public userActiveAgentId;

    constructor(address randomnessSender, address owner) RandomnessReceiverBase(randomnessSender, owner) {}

    /**
     * @notice Summons a new Bubba agent with random traits.
     * @param callbackGasLimit The gas limit for the randomness callback.
     * @return The request ID and the price paid for the randomness.
     */
    function summonBubbaAgentWithRandomTraits(uint32 callbackGasLimit) external payable returns (uint256, uint256) {
        uint256 currentAgentId = userActiveAgentId[msg.sender];
        require(!agents[currentAgentId].isAlive, "User agent is already alive.");

        (uint256 requestID, uint256 requestPrice) = _requestRandomnessPayInNative(callbackGasLimit);

        // Initialize agent with request ID as the unique ID
        agents[requestID].owner = msg.sender;
        agents[requestID].isAlive = true;
        userActiveAgentId[msg.sender] = requestID;
        
        return (requestID, requestPrice);
    }

    /**
     * @notice This function is called by the Randomness Sender service with the requested randomness.
     * @param requestID The ID of the randomness request.
     * @param _randomness The random value.
     */
    function onRandomnessReceived(uint256 requestID, bytes32 _randomness) internal override {

        uint256 randomness = uint256(_randomness);

        agents[requestID].compliance = randomness % 100;
        randomness /= 100;

        agents[requestID].creativity = randomness % 100;
        randomness /= 100;

        agents[requestID].unhingedness = randomness % 100;
        randomness /= 100;

        agents[requestID].motivation = randomness % 100;
    }

    function killAgent(uint256 agentId) external onlyOwner {
        require(agents[agentId].isAlive, "Agent is not alive.");
        
        agents[agentId].isAlive = false;
    }

    // --- Getter Functions ---

    /**
     * @notice Gets the details of an agent by their ID.
     * @param agentId The ID of the agent.
     * @return The agent's owner, traits, and status.
     */
    function getAgentDetails(uint256 agentId) external view returns (address, uint256, uint256, uint256, uint256, bool) {
        Bubba memory agent = agents[agentId];
        return (
            agent.owner,
            agent.compliance,
            agent.creativity,
            agent.unhingedness,
            agent.motivation,
            agent.isAlive
        );
    }

    /**
     * @notice Gets the current active agent ID for a user.
     * @param userAddress The address of the user.
     * @return The ID of the user's active agent.
     */
    function getUserActiveAgentId(address userAddress) external view returns (uint256) {
        return userActiveAgentId[userAddress];
    }
}