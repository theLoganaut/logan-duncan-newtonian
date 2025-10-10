"use client";

import React, { useEffect, useState } from "react";
import TeamLine from "./TeamLine";
import SendingModal from "./SendingModal";
import UnderConstruction from "../UnderConstruction";

export default function Page() {
  const [ready, setReady] = useState(false)
  const [picks, setPicks] = useState({});
  const [thisWeek, setThisWeek] = useState();
  const [mockDate, setMockDate] = useState(getAnchorDate); // Used for testing different weeks
  const [thisWeekMessage, setThisWeekMessage] = useState("Getting Schedule...");
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalStatus, setModalStatus] = useState("loading"); // "loading" | "success"

  const isValid = name.trim().length > 0;

  const handlePick = (gameId, pick) => {
    setPicks((prev) => ({ ...prev, [gameId]: { ...prev[gameId], pick } }));
  };

  const handleRank = (gameId, rank) => {
    setPicks((prev) => {
      const updated = { ...prev };
      for (const id in updated) {
        if (updated[id].rank === rank) {
          updated[id] = { ...updated[id], rank: undefined };
        }
      }
      updated[gameId] = { ...updated[gameId], rank };
      return updated;
    });
  };

  function getAnchorDate() {
    const today = new Date();

    // If it's January, treat it as part of the previous year's season
    const seasonYear =
      today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();

    // Step 1: Find Labor Day (first Monday of September)
    const septemberFirst = new Date(seasonYear, 8, 1); // September = month 8
    const dayOfWeek = septemberFirst.getDay(); // 0 (Sun) - 6 (Sat)
    const laborDayOffset = (8 - dayOfWeek) % 7;
    const laborDay = new Date(septemberFirst);
    laborDay.setDate(septemberFirst.getDate() + laborDayOffset);

    // Step 2: First Thursday after Labor Day
    const seasonStart = new Date(laborDay);
    const daysUntilThursday = (4 - laborDay.getDay() + 7) % 7;
    seasonStart.setDate(laborDay.getDate() + daysUntilThursday);

    // Step 3: Subtract 7 days for anchor date and set to 10:00 AM
    const anchorDate = new Date(seasonStart);
    anchorDate.setDate(seasonStart.getDate() - 7);
    anchorDate.setHours(10, 0, 0, 0); // 10:00 AM local time
    return anchorDate;
  }

  const getOrdinal = (n) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const formatGamesByDate = (games) => {
    const dateMap = new Map();
    for (const game of games) {
      const rawDate = game.dateEventLocal;
      const rawTime = game.strTimeLocal;
      const dateObj = new Date(`${rawDate}T${rawTime}`);
      const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" });
      const month = dateObj.toLocaleDateString("en-US", { month: "long" });
      const day = dateObj.getDate();
      const ordinal = getOrdinal(day);
      const formattedDate = `${weekday}, ${month} ${day}${ordinal}`;
      const formattedTime = dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const gameEntry = {
        time: formattedTime,
        home: game.strHomeTeam,
        away: game.strAwayTeam,
      };
      if (!dateMap.has(formattedDate)) {
        dateMap.set(formattedDate, []);
      }
      dateMap.get(formattedDate).push(gameEntry);
    }
    return Array.from(dateMap.entries()).map(([date, games]) => ({
      date,
      games,
    }));
  };

  const getCurrentNFLWeekIndex = (date = new Date(), offset = 1) => {
    const week1Start = new Date("2025-09-04T10:00:00-05:00");
    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    const diffMs = date.getTime() - week1Start.getTime();
    const weeksPassed = Math.floor(diffMs / msInWeek);
    const targetWeek = weeksPassed + offset;
    return targetWeek > 18 ? null : targetWeek;
  };

  useEffect(() => {
    async function fetchWeekData() {
      const now = mockDate ? new Date(mockDate) : new Date();
      const week = getCurrentNFLWeekIndex(now);

      // 👇 Calculate correct NFL season year
      const seasonYear =
        now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

      if (!week) {
        setThisWeekMessage("Season over, see ya next year!");
        setThisWeek(null);
        return;
      }

      try {
        const res = await fetch(
          `https://www.thesportsdb.com/api/v1/json/123/eventsround.php?id=4391&r=${week}&s=${seasonYear}`
        );
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        if (!data.events || data.events.length === 0) {
          setThisWeekMessage("Schedule not yet available.");
          setThisWeek(null);
        } else {
          setThisWeekMessage("");
          setThisWeek(formatGamesByDate(data.events));
        }
      } catch (error) {
        console.error("Unable to fetch data:", error);
        setThisWeekMessage("Error loading schedule.");
      }
    }

    fetchWeekData();
  }, [mockDate]);

  const formatPicksRow = async (fullName, gameGroups, picks) => {
    const now = mockDate ? new Date(mockDate) : new Date();
    const week = getCurrentNFLWeekIndex(now);
    const row = [fullName];

    gameGroups.forEach((group) => {
      group.games.forEach((game, i) => {
        const gameId = `${group.date}-${i}`;
        const pick = picks[gameId];
        const teamCode =
          pick?.pick === "home" ? "h" : pick?.pick === "away" ? "g" : "";
        const rank = pick?.rank ?? "";
        row.push(teamCode, rank);
      });
    });

    row.push("UNPAID");

    setModalVisible(true);
    setModalStatus("loading");

    try {
      const res = await fetch("/api/send-to-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row, week }),
      });

      if (!res.ok) throw new Error("Failed to send");
      setPicks({})
      setModalStatus("success");
      setTimeout(() => setModalVisible(false), 1000);
    } catch (err) {
      console.error("Send failed:", err);
      setModalStatus("error");
      setTimeout(() => setModalVisible(false), 5000);
    }
  };

  const handleSubmit = () => {
    if (!thisWeek) return;

    const expectedIds = thisWeek.flatMap(({ date, games }) =>
      games.map((_, i) => `${date}-${i}`)
    );

    const allPicked = expectedIds.every(
      (id) => picks[id]?.pick === "home" || picks[id]?.pick === "away"
    );

    const ranks = Object.values(picks)
      .map((p) => p.rank)
      .filter((r) => r !== undefined);

    const nameValid = name.trim().length > 0;

    const allValid = allPicked && ranks.length >= 4 && nameValid;

    if (!allValid) {
      setErrorMessage(
        "Make sure every game has a pick and you've got your tiebreakers!"
      );
      return;
    }

    setErrorMessage(""); // Clear error before submitting
    formatPicksRow(name.trim(), thisWeek, picks);
  };

  return (
    <>
      {ready ? (
        <div className="p-4 max-w-md mx-auto text-sm">
          <SendingModal visible={modalVisible} status={modalStatus} />
          <h1 className="text-2xl font-bold mb-4 text-center">
            Kirk&apos;s NFL Pickems
          </h1>
          {thisWeekMessage && (
            <p className="text-center text-gray-500 mb-4">{thisWeekMessage}</p>
          )}
          {thisWeek?.map(({ date, games }) => (
            <div key={date} className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">{date}</h2>
              {games.map(({ time, home, away }, idx) => {
                const gameId = `${date}-${idx}`;
                const selected = picks[gameId] || {};
                return (
                  <TeamLine
                    key={gameId}
                    gameId={gameId}
                    time={time}
                    home={home}
                    away={away}
                    selected={selected}
                    handlePick={handlePick}
                    handleRank={handleRank}
                  />
                );
              })}
            </div>
          ))}

          {thisWeekMessage === "" && (
            <>
              <input
                id="displayName"
                type="text"
                placeholder="Name/Nickname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched(true)}
                className={`w-full mb-3 px-4 border text-base rounded-xl shadow-sm focus:outline-none focus:ring-2 transition ${!isValid && touched
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-300"
                  }`}
              />
              {!isValid && touched && (
                <p className="text-red-500 text-sm mt-1">
                  Please enter a name or nickname to continue.
                </p>
              )}
              {errorMessage && (
                <p className="text-red-500 text-sm text-center">{errorMessage}</p>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-700 to-red-600 text-white font-extrabold uppercase tracking-wider rounded-xl shadow-lg hover:from-blue-800 hover:to-red-700 transition-all duration-200"
              >
                🏈 Submit Picks
              </button>
            </>
          )}

          {[...Array(18).keys()].map((i) => (
            <button
              key={i + 1}
              type="button"
              onClick={() => {
                const mock = new Date("2025-09-04T10:00:00-05:00");
                mock.setDate(mock.getDate() + i * 7);
                setMockDate(mock.toISOString());
              }}
              className="w-full py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              Simulate Week {i + 1} (Thursday 10am)
            </button>
          ))}
        </div>
      ) : (
        <UnderConstruction />
      )}
    </>
  );
}
