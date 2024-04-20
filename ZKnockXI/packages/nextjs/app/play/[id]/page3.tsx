"use client";

import { useState } from "react";
import Link from "next/link";
import { Draggable } from "./components/Draggable";
import { Axis } from "./components/Draggable";
import { Droppable } from "./components/Droppable";
import { Wrapper } from "./components/Wrapper";
import {
  DndContext,
  KeyboardSensor,
  Modifiers,
  MouseSensor,
  PointerActivationConstraint,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { UniqueIdentifier } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import type { Coordinates } from "@dnd-kit/utilities";
import { element } from "@rainbow-me/rainbowkit/dist/css/reset.css";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import match_players from "~~/data/match_players.json";
import matches from "~~/data/matches.json";

const defaultCoordinates = {
  x: 0,
  y: 0,
};

interface DraggableItemProps {
  label: string;
  handle?: boolean;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  axis?: Axis;
  top?: number;
  left?: number;
  draggableId: number;
}

function DraggableItem({ axis, label, style, top, left, handle, buttonStyle, draggableId }: DraggableItemProps) {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useDraggable({
    id: draggableId,
  });

  return (
    <Draggable
      ref={setNodeRef}
      dragging={isDragging}
      handle={handle}
      label={label}
      listeners={listeners}
      style={{ ...style, top, left }}
      buttonStyle={buttonStyle}
      transform={transform}
      axis={axis}
      {...attributes}
    />
  );
}

const Home: NextPage = ({ params }: { params: { id: string } }) => {
  const { address: connectedAddress } = useAccount();
  const [{ x, y }, setCoordinates] = useState<Coordinates>(defaultCoordinates);
  const mouseSensor = useSensor(MouseSensor, {});
  const touchSensor = useSensor(TouchSensor, {});
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);
  const [isDragging, setIsDragging] = useState(false);
  const [parent, setParent] = useState<UniqueIdentifier | null>(null);
  const [draggingElement, setdraggingElement] = useState(-1);
  const item = <DraggableItem label="" draggableId={0} />;
  let items_batsmen: any[] = [];
  match_players[parseInt(params.id) - 1].batsmen.forEach((player, index) => {
    // console.log(index)
    items_batsmen.push({
      id: index,
      item: (
        <DraggableItem
          label={`${player.player_name}:${player.value}:${player.label}:${player.player_id}`}
          draggableId={index}
        />
      ),
    });
  });
  return (
    <DndContext
      sensors={sensors}
      onDragStart={active => {
        setIsDragging(true);
        setdraggingElement(active.active.id);
        console.log(active.active.id);
      }}
      onDragEnd={({ over }) => {
        setParent(over ? draggingElement : null);
        setIsDragging(false);
      }}
      onDragCancel={() => setIsDragging(false)}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="flex items-center flex-col flex-grow pt-10 w-full">
        <div className="mb-8">
          <h1 className="text-center">
            <span className="block text-2xl mb-2 font-bold">{matches[Number(params.id)].title}</span>{" "}
          </h1>
        </div>
        <div className="flex justify-center items-center w-full">
          <ul className="steps steps-vertical lg:steps-horizontal">
            <li className="step step-accent">Select A Match & Login To Play</li>
            <li className="step step-accent">Create A Squad</li>
            <li className="step">Submit Your Created Squad</li>
            <li className="step">Verification & Results</li>
          </ul>
        </div>
      </div>

      <div className="bg-base-300 w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center flex-col gap-12">
          <div className="bg-base-100 text-center items-center rounded-3xl w-full">
            <h1 className="pt-2 font-bold text-lg">Available Batsmen</h1>
            <Wrapper>
              {items_batsmen.map(element => {
                // return  <Draggable ></Draggable>
                return <div className="flex gap-2 flex-wrap items-center justify-center w-full">{element.item}</div>;
              })}
              {/* <div className="flex gap-2 flex-wrap items-center justify-center w-full">{item2.item}</div> */}
              {/* <div className="flex gap-2 flex-wrap items-center justify-center w-full">{item1.item}</div> */}
            </Wrapper>
          </div>
          <div
            className="flex flex-col bg-base-100 px-10 py-10 text-center items-center w-full rounded-3xl"
            style={{
              backgroundImage: "url(/assets/stadium.jpg)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
            }}
          >
            <Droppable key={1} id={2} dragging={isDragging}>
              <div className="flex gap-2 flex-wrap items-center justify-center w-full">
                {parent === null ? item : items_batsmen[draggingElement].item}

                {/* {parent === 1 ? item : null} */}
              </div>
            </Droppable>
          </div>
          <div className="bg-base-100 text-center items-center rounded-3xl w-full">
            <h1 className="pt-2 font-bold text-lg">Available Bowlers</h1>
            <Wrapper>
              <div className="flex gap-2 flex-wrap items-center justify-center w-full">
                {parent === null ? item : null}
              </div>
            </Wrapper>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default Home;
