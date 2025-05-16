"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  const [quote, setQuote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [author, setAuthor] = useState<string>("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/quotes/random`);

      setQuote(res.data.quote.text);
      setAuthor(res.data.quote.author);
    } catch {
      setQuote("Failed to load quote. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 text-white px-6">
      <div className="max-w-3xl text-center space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-bold"
        >
          Get Inspired. One Quote at a Time.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-lg md:text-xl text-white/80"
        >
          Discover meaningful quotes, share them with friends, and start your
          day with motivation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <button
            onClick={fetchQuote}
            className="text-lg px-6 py-4 rounded-xl shadow-xl bg-white text-indigo-700 hover:bg-indigo-100 transition"
          >
            {loading ? "Loading..." : "Generate a Quote"}
          </button>
        </motion.div>

        {quote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 bg-white text-indigo-800 rounded-lg p-4 shadow-md"
          >
            <p className="italic">
  {`"${quote}" Written By: `}<b>{author}</b>
</p>

          </motion.div>
        )}
        <Link href="/quotes">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 text-base px-5 py-2 rounded-lg bg-indigo-100 text-indigo-800 font-medium hover:bg-white transition"
          >
            View All Quotes
          </motion.button>
        </Link>
      </div>
    </section>
  );
}
