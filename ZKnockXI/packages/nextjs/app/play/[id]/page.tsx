"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DndContext } from "./DndContext";
import { Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import match_players from "~~/data/match_players.json";
import matches from "~~/data/matches.json";

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
  const [data, setData] = useState<MatchPlayers[] | []>([]);
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
  useEffect(() => {
    const temp = match_players[parseInt(params.id) - 1];
    // setData([
    //   { id: 0, title: "Batsmen", components: temp.batsmen },
    //   // { id: 1, title: "All Players", components: [{player}] },
    //   { id: 2, title: "Bowlers", components: temp.bowlers },
    // ]);

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
                      console.log(data)
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
                <button
                    className="btn bg-accent"
                    onClick={() => {
                      setStep(3);
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
    </DndContext>
  );
};

export default Home;
