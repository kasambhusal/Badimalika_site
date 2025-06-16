import Image from "next/image";
import React from "react";

export default function TopNav() {
  return (
    <div className="w-full flex justify-center top-nav">
      <div className="w-8/10 flex items-center h-[100px] justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/images/nepal_logo.png"
            width={100}
            height={84}
            alt="Nepal Logo"
          />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center municipality-text">
            हरिपुर नगरपालिका
          </h2>
        </div>
        <div className="w-[70px] h-[50px] relative">
          <Image
            src="/assets/images/nepal_flag.gif"
            alt="Nepal Flag"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
