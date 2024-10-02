"use client";
import { useState, useEffect } from "react";
import WordTable from "@/components/WordTable";
import { IoIosSearch } from "react-icons/io";

export default function Words() {
  const [wordData, setWordData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch words from API
  useEffect(() => {
    const fetchWords = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/words"); // Adjust the endpoint URL to match your setup
        if (response.ok) {
          const data = await response.json();
          setWordData(data);
        } else {
          console.error("Failed to fetch words:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching words:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWords();
  }, []);

  return (
    <section className="flex w-full p-[30px] items-center z-20">
      <div className="w-full min-h-screen">
        <div className="mb-[30px]">
          <h1 className="text-[28px] mb-[16px]">Word list</h1>
          <form className="flex items-center">
            <input
              type="search"
              className="px-4 py-2 rounded-l h-10 w-[220px] md:w-[360px]"
              placeholder="word..."
            />
            <button
              type="submit"
              className="bg-white py-2 h-10 px-4 rounded-r "
            >
              <IoIosSearch className="text-[20px]" />
            </button>
          </form>
        </div>
        {isLoading ? <p>Loading...</p> : <WordTable data={wordData} />}
      </div>
    </section>
  );
}
