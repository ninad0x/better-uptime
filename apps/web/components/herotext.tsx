import React from 'react'
import { motion } from "motion/react"

export const HeroText = () => {

  return (
    <div className="hero-text max-w-7xl mx-auto text-center absolute left-[50%] -translate-x-[50%] top-[55%] z-10">
    <p className="font-bold lg:text-6xl md:text-5xl dark:text-white text-black text-shadow-lg">
        Better{" "}
        <span className="text-neutral-800 text-shadow-lg">
        {"Uptime".split("").map((letter, idx) => (
            <motion.span
              key={idx}
              className="inline-block"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
            {letter}
            </motion.span>
        ))}
        </span>
    </p>
    <p className="text-sm md:text-lg text-neutral-600 max-w-2xl mx-auto py-4">
        Monitor your website status across the globe.
    </p>

    <div className="flex text-sm  gap-3 lg:gap-5 justify-center">
      <button className="px-3 py-1.5 text-white bg-blue-500 rounded-md cursor-pointer">Hello</button>
      <button className="px-3 py-1.5 text-zinc-800 border border-blue-400 rounded-md cursor-pointer">Hello</button>
    </div>
    </div>
  )
}
