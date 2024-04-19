/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  421614: {
    Betting: {
      address: "0x64Ac1C876861Bc4d72415fDF053Bee4F6c3BfB01",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "EmptyArgs",
          type: "error",
        },
        {
          inputs: [],
          name: "EmptySource",
          type: "error",
        },
        {
          inputs: [],
          name: "NoInlineSecrets",
          type: "error",
        },
        {
          inputs: [],
          name: "OnlyRouterCanFulfill",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "requestId",
              type: "bytes32",
            },
          ],
          name: "UnexpectedRequestID",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
          ],
          name: "OwnershipTransferRequested",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
          ],
          name: "OwnershipTransferred",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "id",
              type: "bytes32",
            },
          ],
          name: "RequestFulfilled",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "id",
              type: "bytes32",
            },
          ],
          name: "RequestSent",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "requestId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "string",
              name: "score",
              type: "string",
            },
            {
              indexed: false,
              internalType: "bytes",
              name: "response",
              type: "bytes",
            },
            {
              indexed: false,
              internalType: "bytes",
              name: "err",
              type: "bytes",
            },
          ],
          name: "Response",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "string",
              name: "match_id",
              type: "string",
            },
            {
              indexed: false,
              internalType: "string",
              name: "uuid",
              type: "string",
            },
            {
              indexed: false,
              internalType: "address",
              name: "user_address",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "betAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "int256",
              name: "total_points",
              type: "int256",
            },
            {
              indexed: false,
              internalType: "bytes32",
              name: "squadHash",
              type: "bytes32",
            },
          ],
          name: "SquadRegistered",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "string",
              name: "match_id",
              type: "string",
            },
            {
              indexed: false,
              internalType: "address",
              name: "user_address",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "rewardsClaimed",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "requestId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "int256",
              name: "_total",
              type: "int256",
            },
          ],
          name: "test",
          type: "event",
        },
        {
          inputs: [],
          name: "acceptOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "match_id",
              type: "string",
            },
            {
              internalType: "bytes32",
              name: "squadHash",
              type: "bytes32",
            },
          ],
          name: "claimRewards",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "uuid",
              type: "string",
            },
          ],
          name: "getMatchUserSquad",
          outputs: [
            {
              components: [
                {
                  internalType: "address",
                  name: "user_address",
                  type: "address",
                },
                {
                  internalType: "int256",
                  name: "total_points",
                  type: "int256",
                },
                {
                  internalType: "bytes32",
                  name: "squadHash",
                  type: "bytes32",
                },
              ],
              internalType: "struct Betting.MatchUserSquad",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "requestId",
              type: "bytes32",
            },
            {
              internalType: "bytes",
              name: "response",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "err",
              type: "bytes",
            },
          ],
          name: "handleOracleFulfillment",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          name: "matchWinnerData",
          outputs: [
            {
              internalType: "int256",
              name: "matchWinnerPoints",
              type: "int256",
            },
            {
              internalType: "address",
              name: "matchWinner",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "matchPrizePool",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "squadHash",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_lastError",
          outputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_lastRequestId",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "s_lastResponse",
          outputs: [
            {
              internalType: "bytes",
              name: "",
              type: "bytes",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "score",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint64",
              name: "subscriptionId",
              type: "uint64",
            },
            {
              internalType: "string[]",
              name: "args",
              type: "string[]",
            },
          ],
          name: "sendRequest",
          outputs: [
            {
              internalType: "bytes32",
              name: "requestId",
              type: "bytes32",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "match_id",
              type: "string",
            },
            {
              internalType: "string",
              name: "uuid",
              type: "string",
            },
            {
              internalType: "int256",
              name: "total_scores_players",
              type: "int256",
            },
            {
              internalType: "bytes32",
              name: "squadHash",
              type: "bytes32",
            },
          ],
          name: "submitSquad",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
          ],
          name: "transferOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      inheritedFunctions: {},
    },
    Protocol: {
      address: "0x652EF3aCf48B0000e6dfd55aAFD25BA872e6973B",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "id",
              type: "bytes32",
            },
          ],
          name: "ChainlinkCancelled",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "id",
              type: "bytes32",
            },
          ],
          name: "ChainlinkFulfilled",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "id",
              type: "bytes32",
            },
          ],
          name: "ChainlinkRequested",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "string",
              name: "match_id",
              type: "string",
            },
            {
              indexed: false,
              internalType: "string",
              name: "uuid",
              type: "string",
            },
            {
              indexed: false,
              internalType: "address",
              name: "user_address",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "betAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "int256",
              name: "total_points",
              type: "int256",
            },
            {
              indexed: false,
              internalType: "bytes32",
              name: "squadHash",
              type: "bytes32",
            },
          ],
          name: "SquadRegistered",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "string",
              name: "match_id",
              type: "string",
            },
            {
              indexed: false,
              internalType: "address",
              name: "user_address",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "rewardsClaimed",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "requestId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "int256",
              name: "_total",
              type: "int256",
            },
          ],
          name: "test",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "match_id",
              type: "string",
            },
            {
              internalType: "bytes32",
              name: "squadHash",
              type: "bytes32",
            },
          ],
          name: "claimRewards",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "_requestId",
              type: "bytes32",
            },
            {
              internalType: "int256",
              name: "_total_scores_players",
              type: "int256",
            },
          ],
          name: "fulfill",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "uuid",
              type: "string",
            },
          ],
          name: "getMatchUserSquad",
          outputs: [
            {
              components: [
                {
                  internalType: "address",
                  name: "user_address",
                  type: "address",
                },
                {
                  internalType: "int256",
                  name: "total_points",
                  type: "int256",
                },
                {
                  internalType: "bytes32",
                  name: "squadHash",
                  type: "bytes32",
                },
              ],
              internalType: "struct Protocol.MatchUserSquad",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "match_id",
              type: "string",
            },
          ],
          name: "isWinner",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          name: "matchWinnerData",
          outputs: [
            {
              internalType: "int256",
              name: "matchWinnerPoints",
              type: "int256",
            },
            {
              internalType: "address",
              name: "matchWinner",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "matchPrizePool",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "squadHash",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "api",
              type: "string",
            },
          ],
          name: "submitOracle",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "match_id",
              type: "string",
            },
            {
              internalType: "string",
              name: "uuid",
              type: "string",
            },
            {
              internalType: "bytes32",
              name: "squadHash",
              type: "bytes32",
            },
          ],
          name: "submitSquad",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "total_scores_players",
          outputs: [
            {
              internalType: "int256",
              name: "",
              type: "int256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      inheritedFunctions: {},
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
