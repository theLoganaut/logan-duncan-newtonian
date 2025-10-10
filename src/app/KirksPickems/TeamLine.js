import React from "react";
import "../globals.css";

export default function TeamLine({
  gameId,
  time,
  home,
  away,
  selected,
  handlePick,
  handleRank,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-3 mb-3 border border-gray-200">
      <p className="text-gray-500 mb-2 text-sm">Time: {time}</p>

      <div
        className="grid items-center mb-2 text-base"
        style={{
          gridTemplateColumns: "minmax(120px, 1fr) auto minmax(120px, 1fr)",
        }}
      >
        <label className="flex flex-col items-center gap-1 bg-gray-100 px-2 py-2 rounded">
          <span className="font-semibold text-center text-sm sm:text-base whitespace-nowrap">
            {away}
          </span>
          <input
            type="checkbox"
            checked={selected.pick === "away"}
            onChange={() => handlePick(gameId, "away")}
            className="w-5 h-5"
          />
          <span className="text-xs text-gray-500">Away</span>
        </label>

        <div className="text-center text-xs font-medium text-gray-600 px-2 select-none">
          at
        </div>

        <label className="flex flex-col items-center gap-1 bg-gray-100 px-2 py-2 rounded">
          <span className="font-semibold text-center text-sm sm:text-base whitespace-nowrap">
            {home}
          </span>
          <input
            type="checkbox"
            checked={selected.pick === "home"}
            onChange={() => handlePick(gameId, "home")}
            className="w-5 h-5"
          />
          <span className="text-xs text-gray-500">Home</span>
        </label>
      </div>

      <div className="w-3/4 mx-auto flex items-center justify-between gap-4 mt-2">
        <label className="text-gray-600 text-sm whitespace-nowrap">
          Tiebreaker:
        </label>

        <div className="flex justify-between flex-1">
          {[1, 2, 3, 4].map((val) => (
            <label
              key={val}
              className="flex flex-col items-center text-sm text-gray-700"
            >
              <input
                type="radio"
                name={`${gameId}-rank`}
                value={val}
                checked={selected.rank == val}
                onChange={() => handleRank(gameId, val)}
                className="w-4 h-4 mb-0.5"
              />
              <span>{val}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
