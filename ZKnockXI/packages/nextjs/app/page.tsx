"use client";

import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      {/* Hero section with header */}
      <div className="relative h-[70vh] md:min-h-screen flex flex-col">
        <div className="absolute h-1/4 w-full top-0 left-0 hero-top-gradient"></div>
        <div
          className="bg-[#EFFBCA] bg-cover md:bg-center bg-[position:40%_0] flex-grow"
          style={{ backgroundImage: "url(/assets/landing5.jpg)" }}
        >
          <div className="flex justify-center">
            <h1 className="text-center z-10 font-bold font-mono text-4xl max-w-xs lg:text-3xl lg:mt-8 lg:max-w-4xl px-3 text-white">
              A Privacy-Focused, Sybil-Resistant, Decentralized Fantasy Cricket Platform
            </h1>
          </div>
        </div>
      </div>

      {/* Start Using FairPlayXI */}
      <div className="bg-base-100" id="start-using-fairplayxi">
        <div className="container max-w-[90%] lg:max-w-6xl m-auto py-12 lg:py-20 lg:px-12 flex flex-col lg:flex-row items-center gap-5 lg:gap-0">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-5xl lg:w-3/4 text-center lg:text-left">
              Start Using ZKnockXI For Fantasy Cricket
            </h2>
            <ul className="list-disc list-inside flex flex-col space-y-3 m-auto lg:mx-0 max-w-[300px] lg:max-w-none">
              <li>
                <span className="font-bold">Fully Private Teams</span> - No more teams leaking before the match
              </li>
              <li>
                <span className="font-bold">Sybil-Resistant</span> - No bots competing with unfair teams
              </li>
              <li>
                <span className="font-bold">Fully Decentralized</span> - No concerns about transparency regarding
                scoring
              </li>
            </ul>
            <div className="text-center lg:text-left">
              <Link id="play-now" href="/play" className="btn btn-outline lg:self-start px-8 hover:opacity-100">
                Play Now!
              </Link>
            </div>
          </div>
          <div className="max-w-[300px] lg:max-w-none">
            <Image src="/logo.png" alt="hero" width={500} height={500} />
          </div>
        </div>
        <div className="bg-[url(/assets/sre-path.png)] bg-repeat-x h-32 relative bg-[35%_top]"></div>
      </div>
    </>
  );
};

export default Home;
