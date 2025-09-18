// Base Sepolia.
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NODE_ENV === "production" ? "0xE44698648Be31fB23Fa1bb0075dE768fc566401D" : "0x7cb954F1abCc246e320a53353Ec439f0f8c483c2"

export const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "agentCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "agents",
		"outputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint32",
				"name": "tournamentId",
				"type": "uint32"
			},
			{
				"internalType": "uint8",
				"name": "compliance",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "creativity",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "unhingedness",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "motivation",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "isAlive",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "agentId",
				"type": "uint256"
			}
		],
		"name": "getAgentDetails",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTournamentStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalMints",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalGraveCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalSurvivedGames",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalGames",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "getUserActiveAgentId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "getUserStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalMints",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalKills",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalSurvivals",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "agentIds",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "agentId",
				"type": "uint256"
			}
		],
		"name": "killAgent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "summonBubbaAgentWithRandomTraits",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "agentId",
				"type": "uint256"
			}
		],
		"name": "surviveAgent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalGraves",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSurvivalCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userActiveAgentId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalMints",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalKills",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalSurvivals",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
