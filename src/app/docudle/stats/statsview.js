"use client"
import { useState, useEffect } from 'react';

export default function StatsView({ data }) {
  const [allStats, setAllStats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('played');

  const capitalizeWords = (str) => {
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  useEffect(() => {
    // Load all stats from localStorage
    const stats = [];
    
    if (data?.categories) {
      data.categories.forEach(category => {
        category.subcategories?.forEach(subcategory => {
          subcategory.pages?.forEach(page => {
            // Use same key generation logic as MainView
            const cleanKey = `${category.name}_${subcategory.name}_${page.name}`
              .toLowerCase()
              .replace(/\s+/g, '_')
              .replace(/[^a-z0-9_]/g, '');
            const statsKey = `docudle_stats_${cleanKey}`;
            const stored = localStorage.getItem(statsKey);
            
            if (stored) {
              const parsedStats = JSON.parse(stored);
              if (parsedStats.gamesPlayed > 0) {
                stats.push({
                  category: category.name,
                  subcategory: subcategory.name,
                  title: page.name,
                  ...parsedStats
                });
              }
            }
          });
        });
      });
    }
    
    setAllStats(stats);
  }, [data]);

  // Filter and sort stats
  const filteredStats = allStats
    .filter(stat => {
      const searchLower = searchTerm.toLowerCase();
      return stat.category.toLowerCase().includes(searchLower) ||
             stat.subcategory.toLowerCase().includes(searchLower) ||
             stat.title.toLowerCase().includes(searchLower);
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'played':
          return b.gamesPlayed - a.gamesPlayed;
        case 'winRate':
          return parseFloat(b.winRate) - parseFloat(a.winRate);
        case 'streak':
          return b.currentStreak - a.currentStreak;
        default:
          return 0;
      }
    });

  if (allStats.length === 0) {
    return (
      <div className="flex-1 bg-black flex items-center justify-center p-8">
        <p className="text-white text-4xl text-center">
          Looks like you haven't played yet... pick one and get started!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-black p-8 overflow-y-auto">
      {/* Search and Sort Controls */}
      <div className="flex gap-8 items-center mb-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <span className="text-white text-xl">Search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-white bg-black text-white px-4 py-2 rounded"
            placeholder="Filter stats..."
          />
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-white text-xl">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-white bg-black text-white px-4 py-2 rounded"
          >
            <option value="played">Played</option>
            <option value="winRate">Win Rate</option>
            <option value="streak">Streak</option>
          </select>
        </div>
      </div>

      {/* Stats Display */}
      <div className="space-y-8 max-w-6xl mx-auto">
        {filteredStats.map((stat, index) => {
          const maxGuessCount = Math.max(...Object.values(stat.guessDistribution));
          
          return (
            <div key={index} className="border-l-8 border-b-4 border-white pl-8 pb-6">
              {/* Title Section */}
              <div className="mb-6">
                <h2 className="text-white text-3xl font-bold mb-2">
                  {capitalizeWords(stat.category)}
                </h2>
                <h3 className="text-white text-2xl">
                  {capitalizeWords(stat.subcategory)}
                </h3>
                <h4 className="text-white text-xl">
                  {capitalizeWords(stat.title)}
                </h4>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-6 mb-6">
                <div className="text-white">
                  <div className="text-sm text-gray-400">Played</div>
                  <div className="text-2xl font-bold">{stat.gamesPlayed}</div>
                </div>
                <div className="text-white">
                  <div className="text-sm text-gray-400">Won</div>
                  <div className="text-2xl font-bold">{stat.gamesWon}</div>
                </div>
                <div className="text-white">
                  <div className="text-sm text-gray-400">Win rate</div>
                  <div className="text-2xl font-bold">{stat.winRate}%</div>
                </div>
                <div className="text-white">
                  <div className="text-sm text-gray-400">Streak</div>
                  <div className="text-2xl font-bold">{stat.currentStreak}</div>
                </div>
              </div>

              {/* Guess Distribution */}
              <div className="text-white">
                <h5 className="text-lg mb-4">Guess Distribution</h5>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map(guessNum => {
                    const count = stat.guessDistribution[guessNum] || 0;
                    const width = maxGuessCount > 0 ? (count / maxGuessCount) * 100 : 0;
                    
                    return (
                      <div key={guessNum} className="flex items-center gap-4">
                        <span className="w-4">{guessNum}</span>
                        <div className="flex-1 relative">
                          <div 
                            className="bg-white h-8 flex items-center justify-end pr-2"
                            style={{ width: `${Math.max(width, count > 0 ? 10 : 0)}%` }}
                          >
                            <span className="text-black font-bold">{count}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom border placeholder for spacing */}
              <div className="mt-6 border-t border-white w-full opacity-0"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}