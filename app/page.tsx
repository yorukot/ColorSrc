"use client";

import { ColorConverter } from "@/components/ColorConverter";
import { motion } from "framer-motion";
import { Heart, Github } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <motion.div 
      className="min-h-screen p-4 md:p-8 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1 
        className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
      >
        ColorSrc
      </motion.h1>
      <ColorConverter />
      
      <div className="flex-grow" />
      
      <motion.footer
        className="w-full py-4 text-center text-sm text-gray-500 dark:text-gray-400 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex items-center gap-1">
            Made by{" "}
            <Link 
              href="https://github.com/yorukot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Yorukot
            </Link>{" "}
            with{" "}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Heart className="h-4 w-4 text-red-500 inline" fill="#ef4444" />
            </motion.div>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <Link 
              href="https://github.com/yorukot/colorsrc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
            >
              <Github className="h-4 w-4" />
              <span>View on GitHub</span>
            </Link>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
}
