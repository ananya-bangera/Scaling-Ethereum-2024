"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import BETTING_CONTRACT from "../../../../hardhat/deployments/arbitrumSepolia/Betting.json";
import { DndContext } from "./DndContext";
import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";

import { BigNumber, ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";

import { Alchemy, Network, Utils } from "alchemy-sdk";
import * as dotenv from "dotenv";
import { read } from "fs";
import { Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { parseEther } from "viem";
import { encodeAbiParameters, encodePacked, hexToBytes, keccak256, parseAbiParameters } from "viem";
import { useAccount } from "wagmi";
import { useWatchContractEvent } from "wagmi";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  ArrowRightCircleIcon,
  BanknotesIcon,
  CalculatorIcon,
  LockClosedIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { EtherInput } from "~~/components/scaffold-eth";
import match_players from "~~/data/match_players.json";
import matches from "~~/data/matches.json";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

dotenv.config();

interface MatchPlayers {
  id: number;
  title: string;
  components: {
    player_name: string;
    value: string;
    label: string;
    player_id: number;
  }[];
}

const Home = ({ params }: { params: { id: string } }) => {
  const [step, setStep] = useState(2);
  const [players, setPlayers] = useState([]);
  const [data, setData] = useState<MatchPlayers[] | []>([]);
  const [ethAmount, setEthAmount] = useState("0");
  const [logLevel, setLogLevel] = useState(1);
  const { writeContractAsync, isPending } = useScaffoldWriteContract("Betting");
  // console.log(BETTING_CONTRACT);
  const axios = require("axios").default;
  const [isWinner, setIsWinner] = useState(false);
  const { address: connectedAddress } = useAccount();
  const [logsAll, setLogsAll] = useState([
    "The Match Has Ended 🔚",
    "Calculating The Hash Squad 🔎",
    // "Signing The Proof With Aadhar Proof 💳",
    "Generating The ZK Proof 🧾",
    "Verifying Your Squad... 🕵️‍♂️",
    "Squad Verified, No Tampering Detected ✅",
    "Calculating Total Score 💯",
    // "Your Total Score is 200 🚀",
    // "You've Won, Please Claim Your Rewards 💸",
    // "You've Unfortunately Lost, Better Luck Next Time 😥",
  ]);

  function computeMerkleRoot(points) {
    const hashedValues = points.map(point => keccak256(`0x${point.toString(16)}`));
    // console.log(hashedValues);

    function recursiveMerkleRoot(hashes) {
      if (hashes.length === 1) {
        return hashes[0];
      }

      const nextLevelHashes = [];

      // Combine adjacent hashes and hash them together
      for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i];
        const right = i + 1 < hashes.length ? hashes[i + 1] : "0x";
        const combinedHash = keccak256(encodePacked(["bytes32", "bytes32"], [left, right]));
        nextLevelHashes.push(combinedHash);
      }

      // Recur for the next level
      return recursiveMerkleRoot(nextLevelHashes);
    }

    // Start the recursive computation
    return recursiveMerkleRoot(hashedValues);
  }
  function padArrayWithZeros(array) {
    const paddedLength = Math.pow(2, Math.ceil(Math.log2(array.length)));
    return array.concat(Array.from({ length: paddedLength - array.length }, () => 0));
  }

  const handleClaimReward = async squadHash => {
    try {
      await writeContractAsync(
        {
          functionName: "claimRewards",
          args: [params.id, squadHash],
        },
        {
          onBlockConfirmation: txnReceipt => {
            console.log("📦 Transaction blockHash", txnReceipt.blockHash);
          },
        },
      );
    } catch (e) {
      console.error("Error setting greeting", e);
    }
  };
  const handleSendRequest = async () => {
    try {
      await writeContractAsync(
        {
          functionName: "sendRequest",
          args: [
            BigInt(55),
            [
              params.id,
              data[1].components
                .map(player => {
                  return player.player_id.toString();
                })
                .join("P"),
            ],
          ],
        },
        {
          onBlockConfirmation: txnReceipt => {
            console.log("📦 Transaction blockHash", txnReceipt.blockHash);
          },
        },
      );
    } catch (e) {
      console.error("Error setting greeting", e);
    }
  };

  const handleSubmitSquad = async () => {
    try {
      const merkleRoot = computeMerkleRoot(
        padArrayWithZeros(
          data[1].components.map(player => {
            return player.player_id;
          }),
        ),
      );
      const timeconst = keccak256(`0x${Date.now().toString(16)}`);
      localStorage.setItem("timestamp_" + params.id, timeconst);
      const finalHash = keccak256(
        encodePacked(["bytes20", "bytes32", "bytes32"], [connectedAddress, merkleRoot, timeconst]),
      );

      //API

      await axios
        .post(
          "https://api.witness.co/postLeafHash",
          {
            leafHash: finalHash,
          },

          { headers: { Authorization: "Bearer zknockx_17_apr_2024_6L559IN6SpRTCKhw9I9USP1L9ov0GyeNbAJO" } },
        )
        .then(async function (response) {
          // handle success
          console.log("success");
          console.log(response.data.leafIndex);
          await createNotaryAttestation(response.data.leafIndex.toString());
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
      const provider = new ethers.JsonRpcProvider(
        "https://arb-sepolia.g.alchemy.com/v2/kP1dnGyS5Y5e0lbD2jNkd_qjXGUodbZ3",
      );
      const contract = new ethers.Contract(BETTING_CONTRACT.address, BETTING_CONTRACT.abi, provider);
      let score = await contract.score();

      console.log(score);

      await writeContractAsync(
        {
          functionName: "submitSquad",
          args: [params.id, params.id + connectedAddress, BigInt(score), finalHash],
          value: parseEther(ethAmount),
        },
        {
          onBlockConfirmation: txnReceipt => {
            console.log("📦 Transaction submit squad blockHash", txnReceipt.blockHash);
          },
        },
      );
    } catch (e) {
      console.error("Error setting greeting", e);
    }
  };

  const createNotaryAttestation = async leafIndex => {
    const client = new SignProtocolClient(SpMode.OnChain, {
      chain: EvmChains.arbitrumSepolia,
    });
    const res = await client.createAttestation({
      schemaId: "0x30",
      data: {
        leafIndex,
      },
      indexingValue: connectedAddress.toLowerCase() + params.id + leafIndex.toString(),
    });
    console.log(res);
  };

  const submitSquad = async () => {
    await handleSubmitSquad();
    console.log("squad submitted 2");
    setPlayers(data[1]);
    setStep(4);
  };

  const claimReward = async () => {
    const merkleRoot = computeMerkleRoot(
      padArrayWithZeros(
        data[1].components.map(player => {
          return player.player_id;
        }),
      ),
    );
    // console.log(merkleRoot);
    // console.log(address);
    const timeconst = localStorage.getItem("timestamp_" + params.id);
    const finalHash = keccak256(
      encodePacked(["bytes20", "bytes32", "bytes32"], [connectedAddress, merkleRoot, timeconst]),
    );
    // console.log(timeconst);
    // console.log(finalHash);

    await handleClaimReward(finalHash);
    setIsWinner(false);
  };

  async function makeAttestationRequest(endpoint: string, options: any) {
    const url = `https://testnet-rpc.sign.global/api/${endpoint}`;
    const res = await axios.request({
      url,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      ...options,
    });
    console.log(res.data);
    // throw API errors
    if (res.status !== 200) {
      throw new Error(JSON.stringify(res));
    }
    // return original response
    return res.data;
  }
  const queryAttestations = async(leafIndex) => {
    const response = await makeAttestationRequest(
      "index/attestations",
      {
        method: "GET",
        params: {
          mode: "onchain", // Data storage location
          schemaId: "onchain_evm_421614_0x30", // Your full schema's ID
          attester: connectedAddress, // Alice's address
          indexingValue: connectedAddress.toLowerCase() + params.id + leafIndex.toString(), // Bob's address
        },
      },
      // console.log("attestation response")
      // console.log(response)
    );

    // Make sure the request was successfully processed.
    if (!response.success) {
      return { success: false, message: response?.message ?? "Attestation query failed." };
    }

    // Return a message if no attestations are found.
    if (response.data?.total === 0) {
      return { success: false, message: "No attestation for this address found." };
    }

    // Return all attestations that match our query.
    return {
      success: true,
      attestations: response.data.rows,
    };
  }

  const betTeam = async () => {
    await handleSendRequest();
    console.log("req sent");
    const provider = new ethers.WebSocketProvider(
      `wss://arb-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
    );
    const contract = new ethers.Contract(BETTING_CONTRACT.address, BETTING_CONTRACT.abi, provider);
    contract.on("RequestFulfilled", () => {
      submitSquad();
    });
  };
  const verifyAndCalculatePoints = async () => {
    setLogLevel(2);
    const merkleRoot = computeMerkleRoot(
      padArrayWithZeros(
        players.components.map(player => {
          return player.player_id;
        }),
      ),
    );
    setLogLevel(3);
    const timestamp = localStorage.getItem("timestamp_" + params.id);
    const finalHash = keccak256(
      encodePacked(["bytes20", "bytes32", "bytes32"], [connectedAddress, merkleRoot, timestamp]),
    );
    //verify witness
    let attestations;

    await axios
      .get("https://api.witness.co/getLeafIndexByHash", {
        params: {
          leafHash: finalHash,
        },
      })
      .then(async function (response) {
        console.log(response.data.leafIndex);
        attestations = await queryAttestations(response.data.leafIndex);
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log("attestations ananya");
    console.log(attestations.attestations.length == 1);

    setLogLevel(5);
    const data = await axios(
      `https://puce-smoggy-clam.cyclic.app/scores/${params.id}/${players.components
        .map(player => {
          return player.player_id.toString();
        })
        .join("P")}`,
    );
    console.log(data.data);
    // const res = await data.json();
    // console.log(res);
    setLogsAll([...logsAll, `Your Total Score Is ${data.data.total_score}`]);
    setLogLevel(9);
    const provider = new ethers.JsonRpcProvider(
      "https://arb-sepolia.g.alchemy.com/v2/kP1dnGyS5Y5e0lbD2jNkd_qjXGUodbZ3",
    );
    const contract = new ethers.Contract(BETTING_CONTRACT.address, BETTING_CONTRACT.abi, provider);
    let winnerData = await contract.matchWinnerData(params.id);
    console.log("winnerdata");
    console.log(winnerData);

    console.log(winnerData[1]);
    console.log(connectedAddress);
    if (winnerData[1].toString() === connectedAddress?.toString()) {
      setLogsAll([...logsAll, "You've Won, Please Claim Your Rewards 💸"]);
      setLogLevel(10);
      setIsWinner(true);
    } else {
      setLogsAll([...logsAll, "You've Unfortunately Lost, Better Luck Next Time 😥"]);
      setLogLevel(10);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId !== destination.droppableId) {
      const newData = [...JSON.parse(JSON.stringify(data))]; //shallow copy concept
      const oldDroppableIndex = newData.findIndex(x => x.id == source.droppableId.split("droppable")[1]);
      const newDroppableIndex = newData.findIndex(x => x.id == destination.droppableId.split("droppable")[1]);
      const [item] = newData[oldDroppableIndex].components.splice(source.index, 1);
      newData[newDroppableIndex].components.splice(destination.index, 0, item);
      setData([...newData]);
      console.log(newData);
    } else {
      const newData = [...JSON.parse(JSON.stringify(data))]; //shallow copy concept
      const droppableIndex = newData.findIndex(x => x.id == source.droppableId.split("droppable")[1]);
      const [item] = newData[droppableIndex].components.splice(source.index, 1);
      newData[droppableIndex].components.splice(destination.index, 0, item);
      setData([...newData]);
      console.log(newData);
    }
  };

  const encryptionSignature = async () => {
    let provider = null;
    if (!window.ethereum) {
      provider = ethers.getDefaultProvider();
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);
    }
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data.message;
    const signedMessage = await signer.signMessage(messageRequested);
    return {
      signedMessage: signedMessage,
      publicKey: address,
    };
  };
  // https://gateway.lighthouse.storage/ipfs/QmWGaWkHTtmSk6PA1c3qnEytPevhVqPQTM17zXSgVRaC1A
  const IPFSFunction = async () => {
    console.log("Upload JSON to IPFS and return CID.");
    console.log(data);
    const json_data = data[1];
    console.log(json_data);
    const { publicKey, signedMessage } = await encryptionSignature();
    const output = await lighthouse.textUploadEncrypted(
      JSON.stringify(json_data),
      "fa7b0ca2.09bf273150fb4ce987f3401b7f99d5a9",//Place this in.env @ANI BANG
      publicKey,
      signedMessage,
    );
    console.log("Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash);
    localStorage.setItem(`Match-${params.id}`, output.data.Hash);
    decrypt();
  };
  const decrypt = async () => {
    // Fetch file encryption key
    // https://gateway.lighthouse.storage/ipfs/QmZA6rRymwTMAmPJe4zJ2DGU8cQLKcineTomtr37o4aFRL
    const cid = localStorage.getItem(`Match-${params.id}`); //replace with your IPFS CID
    console.log(cid);
    const { publicKey, signedMessage } = await encryptionSignature();
    /*
      fetchEncryptionKey(cid, publicKey, signedMessage)
        Parameters:
          CID: CID of the file to decrypt
          publicKey: public key of the user who has access to file or owner
          signedMessage: message signed by the owner of publicKey
    */
    const keyObject = await lighthouse.fetchEncryptionKey(cid, publicKey, signedMessage);

    // Decrypt file
    /*
      decryptFile(cid, key, mimeType)
        Parameters:
          CID: CID of the file to decrypt
          key: the key to decrypt the file
          mimeType: default null, mime type of file
    */

    const fileType = "plain/text";
    const decrypted = await lighthouse.decryptFile(cid, keyObject.data.key, fileType);
    const reader = new FileReader();
    reader.onload = function (event) {
      // The result attribute contains the data as a data URL
      const data = event.target.result;

      // Display the extracted data
      console.log(JSON.parse(data));
    };
    reader.readAsText(decrypted);
  };
  useEffect(() => {
    const temp = match_players[parseInt(params.id) - 1];

    const tempData: MatchPlayers[] = [
      { id: 0, title: "Batsmen", components: temp.batsmen },
      {
        id: 1,
        title: "All Players",
        components: [],
      },
      { id: 2, title: "Bowlers", components: temp.bowlers },
    ];
    setData(tempData);
    decrypt();
  }, []);

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="flex items-center flex-col flex-grow pt-10 w-full">
        <div className="mb-8">
          <h1 className="text-center">
            <span className="block text-2xl mb-2 font-bold">{matches[Number(params.id)].title}</span>{" "}
          </h1>
        </div>
        <div className="flex justify-center items-center w-full">
          <ul className="steps steps-vertical lg:steps-horizontal">
            <li className={"step " + (step >= 1 ? "step-accent" : "")}>Select A Match & Login To Play</li>
            <li className={"step " + (step >= 2 ? "step-accent" : "")}>Create A Squad</li>
            <li className={"step " + (step >= 3 ? "step-accent" : "")}>Submit Your Created Squad</li>
            <li className={"step " + (step >= 4 ? "step-accent" : "")}>Verification & Results</li>
          </ul>
        </div>
      </div>

      {step == 2 && (
        <div className="bg-base-300 w-full mt-16 px-8 py-12">
          <h1 className="text-center mt-8 mb-3 font-bold text-2xl">Select Your Team</h1>
          <div className="flex gap-4 justify-between mx-4 flex-col">
            {/* {data.map((val, index) => {
          return ( */}
            {data ? (
              <>
                <Droppable key={0} droppableId={`droppable${0}`}>
                  {provided => (
                    <>
                      <h2 className="text-center font-bold">Batsmen</h2>
                      <div
                        className="p-2 w-full flex items-center justify-center flex-wrap bg-base-100  border-gray-400 border border-dashed"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {data[0]?.components?.map((component, index) => (
                          <Draggable
                            key={component.player_id}
                            draggableId={component.player_id.toString() + "Batsmen"}
                            index={index}
                          >
                            {provided => (
                              <>
                                {/* <div >
                            <div className="flex bg-green-200 m-2 flex-col items-center justify-center w-24">
                              
                              <p className="font-semibold">{component.player_name}</p>
                            </div>
                          </div> */}

                                <div
                                  {...provided.dragHandleProps}
                                  {...provided.draggableProps}
                                  ref={provided.innerRef}
                                  className="m-2 bg-primary rounded-xl text-center"
                                >
                                  <Image
                                    alt="Player Image"
                                    src={`/assets/players/${component.value}.jpg`}
                                    height={95}
                                    width={95}
                                    className="rounded-t-xl w-full min-h-32 max-h-32 min-w-24 max-w-24"
                                  />
                                  <div>
                                    <p className="font-normal">{component.player_name.split(" ")[0]}</p>
                                  </div>
                                </div>
                              </>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </>
                  )}
                </Droppable>
                <Droppable key={1} droppableId={`droppable${1}`}>
                  {provided => (
                    <>
                      <div
                        className="p-2 w-full flex items-center justify-center flex-wrap bg-base-100  border-gray-400 border border-dashed min-h-96"
                        style={{
                          backgroundImage: "url(/assets/stadium.jpg)",
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center center",
                        }}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {data[1]?.components?.map((component, index) => (
                          <Draggable
                            key={component.player_id}
                            draggableId={component.player_id.toString() + "Players"}
                            index={index}
                          >
                            {provided => (
                              <>
                                {/* <div >
                            <div className="flex bg-green-200 m-2 flex-col items-center justify-center w-24">
                              
                              <p className="font-semibold">{component.player_name}</p>
                            </div>
                          </div> */}

                                <div
                                  {...provided.dragHandleProps}
                                  {...provided.draggableProps}
                                  ref={provided.innerRef}
                                  className="m-2 bg-primary rounded-xl text-center"
                                >
                                  <Image
                                    alt="Player Image"
                                    src={`/assets/players/${component.value}.jpg`}
                                    height={95}
                                    width={95}
                                    className="rounded-t-xl w-full min-h-32 max-h-32 min-w-24 max-w-24"
                                  />
                                  <div className="p-1">
                                    <p className="font-normal">{component.player_name.split(" ")[0]}</p>
                                  </div>
                                </div>
                              </>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </>
                  )}
                </Droppable>
                <Droppable key={2} droppableId={`droppable${2}`}>
                  {provided => (
                    <>
                      <h2 className="text-center font-bold">Bowlers</h2>
                      <div
                        className="p-2 w-full flex items-center justify-center flex-wrap bg-base-100  border-gray-400 border border-dashed"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {data[2]?.components?.map((component, index) => (
                          <Draggable
                            key={component.player_id}
                            draggableId={component.player_id.toString() + "Bowlers"}
                            index={index}
                          >
                            {provided => (
                              <>
                                {/* <div >
                            <div className="flex bg-green-200 m-2 flex-col items-center justify-center w-24">
                              
                              <p className="font-semibold">{component.player_name}</p>
                            </div>
                          </div> */}

                                <div
                                  {...provided.dragHandleProps}
                                  {...provided.draggableProps}
                                  ref={provided.innerRef}
                                  className="m-2 bg-primary rounded-xl text-center"
                                >
                                  <Image
                                    alt="Player Image"
                                    src={`/assets/players/${component.value}.jpg`}
                                    height={95}
                                    width={95}
                                    className="rounded-t-xl w-full min-h-32 max-h-32 min-w-24 max-w-24"
                                  />
                                  <div>
                                    <p className="font-normal">{component.player_name.split(" ")[0]}</p>
                                  </div>
                                </div>
                              </>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </>
                  )}
                </Droppable>
                <div className="text-center text-lg">
                  <button
                    className="btn bg-accent"
                    onClick={() => {
                      setStep(3);
                      console.log(data);
<<<<<<< HEAD
                      IPFSFunction();
=======
>>>>>>> b45ba9e6f18042834b5be66261c88111b03fd618
                    }}
                  >
                    Lock Team
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <></>
            )}
            {/* );
        })} */}
          </div>
        </div>
      )}

      {step == 3 && (
        <div className="bg-base-300 w-full mt-16 px-8 py-12">
          <h1 className="text-center mt-8 mb-3 font-bold text-2xl">Submit Your Team</h1>
          <div className="flex gap-4 justify-between mx-4 flex-col">
            {/* {data.map((val, index) => {
          return ( */}
            {data ? (
              <>
                <Droppable key={1} droppableId={`droppable${1}`}>
                  {provided => (
                    <>
                      <div
                        className="p-2 w-full flex items-center justify-center flex-wrap bg-base-100  border-gray-400 border border-dashed min-h-96"
                        style={{
                          backgroundImage: "url(/assets/stadium.jpg)",
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center center",
                        }}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {data[1]?.components?.map((component, index) => (
                          <Draggable
                            key={component.player_id}
                            draggableId={component.player_id.toString() + "Players"}
                            index={index}
                          >
                            {provided => (
                              <>
                                {/* <div >
                            <div className="flex bg-green-200 m-2 flex-col items-center justify-center w-24">
                              
                              <p className="font-semibold">{component.player_name}</p>
                            </div>
                          </div> */}

                                <div
                                  {...provided.dragHandleProps}
                                  {...provided.draggableProps}
                                  ref={provided.innerRef}
                                  className="m-2 bg-primary rounded-xl text-center"
                                >
                                  <Image
                                    alt="Player Image"
                                    src={`/assets/players/${component.value}.jpg`}
                                    height={95}
                                    width={95}
                                    className="rounded-t-xl w-full min-h-32 max-h-32 min-w-24 max-w-24"
                                  />
                                  <div className="p-1">
                                    <p className="font-normal">{component.player_name.split(" ")[0]}</p>
                                  </div>
                                </div>
                              </>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </>
                  )}
                </Droppable>
                <EtherInput value={ethAmount} onChange={amount => setEthAmount(amount)} />;
                <button
                  className="btn bg-accent"
                  onClick={() => {
                    setStep(3);
<<<<<<< HEAD
=======
                    betTeam();
>>>>>>> b45ba9e6f18042834b5be66261c88111b03fd618
                  }}
                >
                  Bet
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </>
            ) : (
              <></>
            )}
            {/* );
        })} */}
          </div>
        </div>
      )}

      {step == 4 && (
        <div className="container max-w-[100%] lg:max-w-7xl m-auto py-16 lg:py-20 xl:pl-24 lg:pl-16 flex flex-col-reverse lg:flex-row items-center gap-5 lg:gap-0 mb-10">
          <div className="space-y-6 lg:max-w-[55%] flex flex-col items-center lg:items-start">
            <div className="text-center px-1 max-w-lg lg:max-w-none lg:w-11/12 lg:px-0 lg:text-left">
              <h1 className="m-0 mb-3 text-3xl">View Your Results</h1>
              <p className="m-0 mb-3">
                We verify that you have not modified the team you are now revealing for calculating the points. We do
                this using <span className="font-bold">the squad hash</span> you previously submitted using{" "}
                <span className="font-bold">Zero Knowledge Proof</span>.
              </p>
              <p className="m-0 mb-3">
                The points are calculated via a <span className="font-bold">Decentralized Oracle Network</span> to
                ensure <span className="font-bold">transparency</span> in the scoring process.
              </p>
              <div className="m-0 mb-3 mt-10">
                <div className="m-0 mb-3 mt-10 flex items-center justify-evenly w-full">
                  <div className="text-center lg:text-left">
                    <button
                      className="btn btn-accent"
                      onClick={() => {
                        verifyAndCalculatePoints();
                      }}
                    >
                      Verify Squad & Calculate Points
                      <CalculatorIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-center lg:text-left">
                    <button className="btn btn-accent" disabled={!isWinner} onClick={() => claimReward()}>
                      Claim Rewards
                      <TrophyIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center px-1 max-w-lg lg:max-w-none lg:w-11/12 lg:px-0 lg:text-left">
              <div className="mockup-browser bg-accent">
                <div className="mockup-browser-toolbar">
                  <div className="input">Logs</div>
                </div>
                <div className="px-4 py-4 bg-neutral text-secondary h-52 overflow-y-scroll">
                  {logsAll.slice(0, logLevel).map((logStatement, i) => (
                    <div>{`[${i + 1}] ${logStatement}`}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>{/*  */}</div>
        </div>
      )}
    </DndContext>
  );
};

export default Home;
