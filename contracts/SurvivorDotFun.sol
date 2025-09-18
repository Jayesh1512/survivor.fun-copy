// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SurvivorDotFunS1 is Ownable {

    // Tournament Stats
    uint256 public agentCount;
    uint256 public totalGraves;
    uint256 public totalSurvivalCount;

    // The struct `Bubba` holds the attributes for an agent.
    struct Bubba {
        address owner;
        uint32 tournamentId;
        uint8 compliance;
        uint8 creativity;
        uint8 unhingedness;
        uint8 motivation;
        bool isAlive;
    }

    // User stats per tournament
    struct UserTournamentStats {
        uint256 totalMints;
        uint256 totalKills;
        uint256 totalSurvivals;
        uint256[] bubbaIds;
    }

    // Mapping from agent ID to the agent's struct
    mapping(uint256 => Bubba) public agents;
    // Mapping from user address to their current active agent ID
    mapping(address => uint256) public userActiveAgentId;
    // Mapping from user address to their tournament stats
    mapping(address => UserTournamentStats) public userStats;

    constructor(address owner) Ownable(owner){}

    function summonBubbaAgentWithRandomTraits(address userAddress) external {
        uint256 currentAgentId = userActiveAgentId[userAddress];
        require(!agents[currentAgentId].isAlive, "User agent is already alive.");

        agentCount = agentCount + 1;
        // Initialize agent with request ID as the unique ID
        agents[agentCount].owner = userAddress;
        agents[agentCount].isAlive = true;
        userActiveAgentId[userAddress] = agentCount;

        uint256 randomness = uint256(block.timestamp);

        agents[agentCount].compliance = uint8(randomness % 100);
        randomness /= 100;

        agents[agentCount].creativity = uint8(randomness % 100);
        randomness /= 100;

        agents[agentCount].unhingedness = uint8(randomness % 100);
        randomness /= 100;

        agents[agentCount].motivation = uint8(randomness % 100);

        userStats[userAddress].totalMints++;
        userStats[userAddress].bubbaIds.push(agentCount);
    }

    function killAgent(uint256 agentId) external onlyOwner {
        require(agents[agentId].isAlive, "Agent is not alive.");
        address agentOwner = agents[agentId].owner;
        userStats[agentOwner].totalKills++;
        agents[agentId].isAlive = false;
        totalGraves++;
    }

    function surviveAgent(uint256 agentId) external onlyOwner {
        require(agents[agentId].isAlive, "Agent is not alive.");
        address agentOwner = agents[agentId].owner;
        userStats[agentOwner].totalSurvivals++;
        totalSurvivalCount++;
    }

    // --- Getter Functions ---

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

    function getUserStats(address userAddress) external view returns (
        uint256 totalMints,
        uint256 totalKills,
        uint256 totalSurvivals,
        uint256[] memory agentIds
    ) {
        UserTournamentStats memory stats = userStats[userAddress];
        return (
            stats.totalMints,
            stats.totalKills,
            stats.totalSurvivals,
            stats.bubbaIds
        );
    }

    function getTournamentStats() external view returns (uint256 totalMints, uint256 totalGraveCount, uint256 totalSurvivedGames, uint256 totalGames) {
        return (
            agentCount,
            totalGraves,
            totalSurvivalCount,
            totalGraves + totalSurvivalCount
        );
    }

    function getUserActiveAgentId(address userAddress) external view returns (uint256) {
        return userActiveAgentId[userAddress];
    }
}
