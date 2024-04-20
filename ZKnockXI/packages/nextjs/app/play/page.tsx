"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ArrowRightIcon, BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import matches from "~~/data/matches.json";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [match, setMatch] = useState("");
  const router = useRouter();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="flex items-center flex-col flex-grow pt-10 w-full">
          <div className="flex justify-center items-center w-full">
            <ul className="steps steps-vertical lg:steps-horizontal">
              <li className="step step-accent">Select A Match & Login To Play</li>
              <li className="step">Create A Squad</li>
              <li className="step">Submit Your Created Squad</li>
              <li className="step">Verification & Results</li>
            </ul>
          </div>
        </div>

        <div className="bg-base-300 w-full mt-16 px-8 py-12">
          <div>
            <div className="flex justify-center items-center py-4">
              <div className="block text-xl m-4">Select Match</div>
              <div>
                <select
                  className="select select-bordered w-full max-w-xs"
                  value={match}
                  onChange={e => setMatch(e.target.value)}
                >
                  <option disabled selected>
                    Select A Match To Play
                  </option>
                  {matches.map(matchItem => {
                    return <option key={matchItem.seasonTitle}>{matchItem.title}</option>;
                  })}
                </select>
              </div>
            </div>
          </div>
          <p className="text-center text-lg mb-10">
            {match ? "You've Selected" : "You Have Not Selected Any Match"}{" "}
            <code className="bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              {match}
            </code>
          </p>
          <div className="text-center text-lg">
            <button
              className="btn bg-accent"
              disabled={match === ""}
              onClick={() => {
                router.push(`/play/${match.split(" ")[1]}`);
              }}
            >
              Play Match
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
