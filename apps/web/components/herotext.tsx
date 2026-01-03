import React from 'react'
import { motion } from "motion/react"

export const HeroText = () => {
  return (
    <div className="hero-text max-w-7xl text-7xl mx-auto text-center absolute left-[50%] -translate-x-[50%] top-[55%] z-10">
    <p className="font-bold text-xl md:text-5xl dark:text-white text-black text-shadow-lg">
        Better{" "}
        <span className="text-neutral-800 text-shadow-lg">
        {"Uptime".split("").map((letter, idx) => (
            <motion.span
            key={idx}
            className="inline-block"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.04 }}
            >
            {letter}
            </motion.span>
        ))}
        </span>
    </p>
    <p className="text-sm md:text-lg text-neutral-600 max-w-2xl mx-auto py-4">
        Break free from traditional boundaries. Work from anywhere, at the
        comfort of your own studio apartment. Perfect for Nomads and
        Travellers.
    </p>
    </div>
  )
}
