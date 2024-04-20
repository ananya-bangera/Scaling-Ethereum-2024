"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ArrowRightIcon, BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import matches from "~~/data/matches.json";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [match, setMatch] = useState("");

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <div className="flex justify-around items-center py-4">
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
          <p className="text-center text-lg mb-10">
            {match ? "You've Selected" : "You Have Not Selected Any Match"}{" "}
            <code className="bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              {match}
            </code>
          </p>
          <div className="text-center text-lg">
            <button className="btn bg-accent" disabled={match === ""}>
              Play Match
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
