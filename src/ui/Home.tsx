import React from "react";
import Hero2 from "./Hero2";
import Hero1 from "./Hero1";
import HomeMap from "./HomeMap";
import HomeCharts from "./HomeCharts";
import { HomeMembers } from "./HomeMembers";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <Hero1 />
      <Hero2 />
      <HomeMap />
      <HomeCharts />
      <HomeMembers />
    </div>
  );
}
