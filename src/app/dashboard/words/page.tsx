"use client";
import { useState, useEffect } from "react";
import WordTable from "@/components/WordTable";
import { IoIosSearch } from "react-icons/io";

export default function Words() {
  const [wordData, setWordData] = useState([]); // Stores the original word data
  const [filteredWords, setFilteredWords] = useState([]); // Stores the filtered words
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Search input value

  // Fetch words from API
  useEffect(() => {
    const fetchWords = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/words"); // Adjust the endpoint URL to match your setup
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched words:", data);
          setWordData(data);
          setFilteredWords(data); // Initialize with full data
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

  // Handle search input change
  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    // Immediately filter words based on the search value
    if (searchValue === "") {
      setFilteredWords(wordData);
    } else {
      const filtered = wordData.filter((word) =>
        word.word.toLowerCase().includes(searchValue.toLowerCase())
      );
      console.log("Filtered words:", filtered);
      setFilteredWords(filtered);
    }
  };

  // Handle form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
  };

  return (
    <section className="flex w-full p-[30px] items-center z-20">
      <div className="w-full min-h-screen">
        <div className="mb-[30px]">
          <h1 className="text-[28px] mb-[16px]">Word list</h1>
          <form className="flex items-center" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              className="px-4 py-2 rounded-l h-10 w-[220px] md:w-[360px]"
              placeholder="Search word..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button type="submit" className="bg-white py-2 h-10 px-4 rounded-r">
              <IoIosSearch className="text-[20px]" />
            </button>
          </form>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <WordTable key={filteredWords.length} data={filteredWords} /> // Display the filtered words
        )}
      </div>
    </section>
  );
}
