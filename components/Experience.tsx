"use client";
import React from "react";
import { motion } from "framer-motion";

import { workExperience } from "@/data";
import { Button } from "./ui/MovingBorders";
import Image from "next/image";

const Experience = () => {
  return (
    <div className="py-20 w-full" id="experience">
      <h1 className="heading">
        My <span className="text-purple">work experience</span>
      </h1>

      <div className="w-full max-w-6xl mx-auto mt-12 relative">
        {/* THE SPINE LINE (Mathematical Anchor) */}
        <div className="absolute left-[16px] md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple/50 via-blue-500/50 to-transparent pointer-events-none z-10" />

        <div className="flex flex-col gap-10 md:gap-20">
          {workExperience.map((card, index) => (
            <div
              key={card.id}
              className="relative grid grid-cols-[32px_1fr] md:grid-cols-[1fr_60px_1fr] items-center w-full"
            >
              {/* 1. THE DOT (Centered in the layout spine) */}
              <div className="flex items-center justify-center h-full relative z-20 md:col-start-2">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                  className="relative flex items-center justify-center"
                >
                  <div
                    className={`absolute w-10 h-10 md:w-12 md:h-12 rounded-full blur-lg opacity-20 ${
                      card.isCurrent ? "bg-green-500" : "bg-purple"
                    }`}
                  />
                  <div
                    className={`relative w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border-2 border-[#000319] ${
                      card.isCurrent
                        ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"
                        : "bg-purple shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                    }`}
                  />
                </motion.div>
              </div>

              {/* 2. THE CARD (Alternating for Desktop, Sequential for Mobile) */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className={`w-full ${
                  index % 2 === 0
                    ? "md:col-start-1 md:order-1 md:pr-8"
                    : "md:col-start-3 md:order-3 md:pl-8"
                } col-start-2 order-2 pl-4 md:pl-0`}
              >
                <Button
                  duration={Math.floor(Math.random() * 8000) + 8000}
                  borderRadius="1.5rem"
                  borderClassName={
                    card.isCurrent
                      ? "bg-[radial-gradient(#4ade80_30%,transparent_60%)]"
                      : "bg-[radial-gradient(#CBACF9_30%,transparent_60%)]"
                  }
                  style={{
                    background: "rgb(4,7,29)",
                    backgroundColor:
                      "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                    borderRadius: "1.5rem",
                  }}
                  className="w-full text-white border-[#1e1e2d] relative group/card"
                >
                  <div className="flex flex-col lg:flex-row gap-5 p-5 lg:p-8 text-left relative z-10">
                    <div className="flex-shrink-0 mx-auto lg:mx-0">
                      <div
                        className={`p-3 rounded-2xl bg-[#010319]/90 border border-white/10 transition-all duration-500 group-hover/card:scale-105 ${
                          card.isCurrent
                            ? "group-hover/card:border-green-500/40"
                            : "group-hover/card:border-purple/40"
                        }`}
                      >
                        <Image
                          src={card.thumbnail}
                          alt={card.title}
                          width={80}
                          height={80}
                          className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-lg text-[9px] uppercase font-black tracking-widest border ${
                            card.isCurrent
                              ? "bg-green-500/10 text-green-400 border-green-500/30"
                              : "bg-purple/10 text-purple border-purple/30"
                          }`}
                        >
                          {card.company}
                        </span>
                        {card.isCurrent && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-green-500/20 text-green-400 text-[9px] font-black animate-pulse border border-green-500/20">
                            LIVE
                          </span>
                        )}
                        <span className="md:hidden text-white-100/40 text-[9px] font-black tracking-tighter bg-white/5 py-0.5 px-2 rounded-md">
                          {card.duration}
                        </span>
                      </div>
                      <h3 className="text-xl lg:text-2xl font-bold text-white group-hover/card:text-purple transition duration-300">
                        {card.title}
                      </h3>
                      <p className="text-white-100 mt-3 font-semibold leading-relaxed text-xs lg:text-sm opacity-80 group-hover/card:opacity-100 transition duration-300">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </Button>
              </motion.div>

              {/* 3. THE YEAR (Opposite side of card on Desktop) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "backOut", delay: 0.2 }}
                className={`hidden md:flex h-full group/date ${
                  index % 2 === 0
                    ? "md:col-start-3 md:order-3 md:pl-8 md:justify-start"
                    : "md:col-start-1 md:order-1 md:pr-8 md:justify-end"
                }`}
              >
                <div className="relative">
                  <span
                    className={`text-5xl lg:text-6xl font-black italic tracking-tighter opacity-[0.05] transition-all duration-700 select-none group-hover/date:opacity-[0.15] ${
                      card.isCurrent ? "text-green-500" : "text-purple"
                    }`}
                  >
                    {card.duration}
                  </span>
                  <div
                    className={`flex items-center gap-3 mt-1 ${
                      index % 2 === 0 ? "" : "flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`h-[1px] w-8 rounded-full transition-all duration-700 opacity-20 group-hover/date:opacity-100 group-hover/date:w-16 ${
                        card.isCurrent ? "bg-green-500" : "bg-purple"
                      }`}
                    />
                    <span
                      className={`text-base lg:text-lg font-black tracking-widest transition-all duration-700 ${
                        card.isCurrent ? "text-green-400" : "text-purple"
                      }`}
                    >
                      {card.duration}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
