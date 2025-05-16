"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface Quote {
  text: string;
  author: string;
}

export default function AllQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://127.0.0.1:8000/quotes/all");
        setQuotes(res.data);
        setFilteredQuotes(res.data); // Initially show all quotes
      } catch {
        setError("Failed to load quotes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (searchQuery.trim() === "") {
      setFilteredQuotes(quotes); // Show all quotes if search is empty
    } else {
      const filtered = quotes.filter((quote) =>
        quote.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredQuotes(filtered);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-10">
          All Quotes
        </h1>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="mb-6 text-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by author..."
            className="p-3 rounded-lg border border-gray-300 w-full max-w-md mb-4"
          />
        </div>

        {filteredQuotes.length === 0 && !loading && (
          <p className="text-center text-gray-500">No quotes found.</p>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {filteredQuotes.map((quote, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <p className="text-lg italic text-indigo-700">`{quote.text}`</p>
              <p className="mt-2 text-sm text-gray-600">
                — {quote.author || "Unknown"}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
