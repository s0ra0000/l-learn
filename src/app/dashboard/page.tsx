"use client";
import InfoCard from "@/components/InfoCard";
import WordTable from "@/components/WordTable";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { useState, useEffect } from "react";

// Register the required Chart.js components
ChartJS.register(
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);

export default function StudentDashboard() {
  const [summaryData, setSummaryData] = useState({
    totalWords: 0,
    wordsLastWeek: 0,
    totalQuizzes: 0,
    quizzesLastWeek: 0,
  });
  const [pieData, setPieData] = useState({
    labels: ["Not Yet", "In Progress", "Completed"],
    datasets: [
      {
        label: "Words Status",
        data: [0, 0, 0], // Placeholder data
        backgroundColor: ["#FF9999", "#E5B265", "#8AD866"],
        hoverBackgroundColor: ["#FF9999", "#E5B265", "#8AD866"],
      },
    ],
  });
  const [lineData, setLineData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // Placeholder labels
    datasets: [
      {
        label: "Weekly new words",
        data: [0, 0, 0, 0, 0, 0, 0], // Placeholder data
        fill: true,
        backgroundColor: "rgba(71, 81, 205, 0.2)",
        borderColor: "rgba(71, 81, 205, 1)",
        pointBorderColor: "#4751CD",
        pointBackgroundColor: "rgba(71, 81, 205, 1)",
        pointRadius: 3,
        tension: 0.4,
      },
    ],
  });
  const [wordData, setWordData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPieLoading, setPieIsLoading] = useState(true);
  const [isLineLoading, setLineIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        const response = await fetch("/api/dashboard/summary");
        if (response.ok) {
          const data = await response.json();
          setSummaryData(data);
        } else {
          console.error(
            "Failed to fetch dashboard summary:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      }
    };

    const fetchPieData = async () => {
      setPieIsLoading(true);
      try {
        const response = await fetch("/api/dashboard/pie");
        if (response.ok) {
          const data = await response.json();
          setPieData((prev) => ({
            ...prev,
            datasets: [
              {
                ...prev.datasets[0],
                data: [data.notYet, data.inProgress, data.completed],
              },
            ],
          }));
          setPieIsLoading(false);
        } else {
          console.error("Failed to fetch pie chart data:", response.statusText);
          setPieIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
        setPieIsLoading(false);
      }
    };

    const fetchLineData = async () => {
      setLineIsLoading(true);
      try {
        const response = await fetch("/api/dashboard/line");
        if (response.ok) {
          const data = await response.json();
          setLineData((prev) => ({
            ...prev,
            datasets: [
              {
                ...prev.datasets[0],
                data: data.wordCounts,
              },
            ],
          }));
          setLineIsLoading(false);
        } else {
          setLineIsLoading(false);
          console.error(
            "Failed to fetch line chart data:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching line chart data:", error);
        setLineIsLoading(false);
      }
    };

    const fetchWords = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/words");
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

    fetchDashboardSummary();
    fetchPieData();
    fetchLineData();
    fetchWords();
  }, []);

  return (
    <section className="flex w-full p-[30px] items-center h-full">
      <div className="w-[1200px] w-full">
        <h1 className="text-[28px] mb-[16px]">Dashboard</h1>
        <div className="w-full flex gap-[10px] md:gap-[30px] flex-row flex-wrap">
          <InfoCard text="All words" count={summaryData.totalWords} />
          <InfoCard
            text="This week's words"
            count={summaryData.wordsLastWeek}
          />
          <InfoCard text="All Quizzes" count={summaryData.totalQuizzes} />
          <InfoCard
            text="This week's quizzes"
            count={summaryData.quizzesLastWeek}
          />
        </div>

        {/* Progress Pie Chart and Weekly Line Chart in a row */}
        <div className="flex gap-[30px] mt-6 flex-wrap">
          {/* Pie Chart */}
          <div
            style={{ width: "300px", height: "300px" }}
            className="bg-white p-[30px] rounded-xl"
          >
            <h2 className="text-[20px] font-light">Progress statistics</h2>
            {isPieLoading ? <p>Loading...</p> : <Pie data={pieData} />}
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-xl p-[30px] w-[300px] h-[200px] md:w-[600px] md:h-[300px]">
            <h2 className="text-[20px] font-light rounded-xl">
              Weekly new words
            </h2>
            {isLineLoading ? <p>Loading...</p> : <Line data={lineData} />}
          </div>
        </div>

        <div className="w-full bg-white mt-[30px] rounded-xl py-4 px-6 mt-[30px]">
          <h1 className="text-[20px] text-[#4b4b4b] font-light mb-6 mt-2">
            Recently added words
          </h1>
          {isLoading ? <p>Loading...</p> : <WordTable data={wordData} />}
        </div>
      </div>
    </section>
  );
}
