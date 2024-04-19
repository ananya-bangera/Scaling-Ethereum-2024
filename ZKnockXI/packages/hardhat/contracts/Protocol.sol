//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

contract Betting is FunctionsClient, ConfirmedOwner {
	using FunctionsRequest for FunctionsRequest.Request;

	bytes32 public s_lastRequestId;
	bytes public s_lastResponse;
	bytes public s_lastError;
	error UnexpectedRequestID(bytes32 requestId);

	event Response(
		bytes32 indexed requestId,
		string score,
		bytes response,
		bytes err
	);
	address router = 0x234a5fb5Bd614a7AA2FfAB244D603abFA0Ac5C5C;

	string source =
		"const match_id = args[0];"
		"const players_id = args[1];"
		"const apiResponse = await Functions.makeHttpRequest({"
		"url: `https://puce-smoggy-clam.cyclic.app/scores/${match_id}/${players_id}/`"
		"});"
		"if (apiResponse.error) {"
		"throw Error('Request failed');"
		"}"
		"const { data } = apiResponse;"
		"return Functions.encodeString(data.total_score);";

	uint32 gasLimit = 300000;

	bytes32 donID =
		0x66756e2d617262697472756d2d7365706f6c69612d3100000000000000000000;

	string public score;

	constructor() FunctionsClient(router) ConfirmedOwner(msg.sender) {}

	struct MatchUserSquad {
		address user_address;
		int256 total_points;
		bytes32 squadHash;
	}

	struct WinnerData {
		int256 matchWinnerPoints;
		address matchWinner;
		uint256 matchPrizePool;
		bytes32 squadHash;
	}

	// match id to winner
	mapping(string => WinnerData) public matchWinnerData;
	mapping(string => MatchUserSquad) matchUserData;

	//events
	event SquadRegistered(
		string match_id,
		string uuid,
		address user_address,
		uint256 betAmount,
		int256 total_points,
		bytes32 squadHash
	);
	event rewardsClaimed(string match_id, address user_address, uint256 amount);
	event test(bytes32 indexed requestId, int256 _total);

	//functions

	function sendRequest(
		uint64 subscriptionId,
		string[] calldata args
	) external returns (bytes32 requestId) {
		FunctionsRequest.Request memory req;
		req.initializeRequestForInlineJavaScript(source);
		if (args.length > 0) req.setArgs(args);

		s_lastRequestId = _sendRequest(
			req.encodeCBOR(),
			subscriptionId,
			gasLimit,
			donID
		);

		return s_lastRequestId;
	}

	function submitSquad(
		string memory match_id,
		string memory uuid,
		int256 total_scores_players,
		bytes32 squadHash
	) public payable {
		matchUserData[uuid] = MatchUserSquad(
			msg.sender,
			total_scores_players,
			squadHash
		);
		if (
			matchWinnerData[match_id].matchWinnerPoints < total_scores_players
		) {
			matchWinnerData[match_id].matchWinnerPoints = total_scores_players;
			matchWinnerData[match_id].matchWinner = msg.sender;
			matchWinnerData[match_id].squadHash = squadHash;
		}
		matchWinnerData[match_id].matchPrizePool += msg.value;
		emit SquadRegistered(
			match_id,
			uuid,
			msg.sender,
			msg.value,
			total_scores_players,
			squadHash
		);
	}

	function fulfillRequest(
		bytes32 requestId,
		bytes memory response,
		bytes memory err
	) internal override {
		if (s_lastRequestId != requestId) {
			revert UnexpectedRequestID(requestId);
		}

		s_lastResponse = response;
		score = string(response);
		s_lastError = err;

		emit Response(requestId, score, s_lastResponse, s_lastError);
	}

	function getMatchUserSquad(
		string memory uuid
	) public view returns (MatchUserSquad memory) {
		return matchUserData[uuid];
	}


	function claimRewards(string memory match_id, bytes32 squadHash) public {
		//verification using squadHash, merklePath

		// if verified
		if (
			address(matchWinnerData[match_id].matchWinner) ==
			address(msg.sender) &&
			matchWinnerData[match_id].squadHash == squadHash
		) {
			uint256 amount = matchWinnerData[match_id].matchPrizePool;
			payable(msg.sender).transfer(amount);

			emit rewardsClaimed(match_id, msg.sender, amount);
		}
	}
}
