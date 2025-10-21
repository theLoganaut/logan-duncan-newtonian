"use client"
import { useState, useEffect } from 'react';

export default function MainView({ currentPage, isHome, subcategoryName, pageName, categoryName }) {
  const [userInput, setUserInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameState, setGameState] = useState('playing'); // playing, correct, giveup, failed
  const [mode, setMode] = useState('daily'); // daily or practice
  const [guessCount, setGuessCount] = useState(0);
  const [dailyComplete, setDailyComplete] = useState(false);

  // Generate unique key for this specific category path
  const getStatsKey = () => {
    if (!categoryName || !subcategoryName || !pageName) return null;
    // Decode URI components first, then create clean key
    const cleanKey = `${decodeURIComponent(categoryName)}_${decodeURIComponent(subcategoryName)}_${decodeURIComponent(pageName)}`
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
    return `docudle_stats_${cleanKey}`;
  };

  // Initialize or load stats from localStorage
  const loadStats = () => {
    const statsKey = getStatsKey();
    if (!statsKey) return null;
    
    const stored = localStorage.getItem(statsKey);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default stats structure
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      winRate: 0,
      averageGuesses: 0,
      guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      lastPlayedDate: null
    };
  };

  const saveStats = (stats) => {
    const statsKey = getStatsKey();
    if (!statsKey) return;
    localStorage.setItem(statsKey, JSON.stringify(stats));
  };

  // Check if daily was already completed today
  useEffect(() => {
    if (mode === 'daily') {
      const stats = loadStats();
      const today = new Date().toISOString().split('T')[0];
      
      if (stats && stats.lastPlayedDate === today) {
        setDailyComplete(true);
        setGameState('completed');
      } else {
        setDailyComplete(false);
        setGameState('playing');
      }
    }
  }, [mode, categoryName, subcategoryName, pageName]);

  // Seeded random function for consistent daily questions
  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const getDailyQuestionIndex = (questionsLength) => {
    // Create seed from today's date and category path
    const today = new Date().toISOString().split('T')[0];
    const seedString = `${today}_${categoryName}_${subcategoryName}_${pageName}`;
    
    // Convert string to number seed
    let seed = 0;
    for (let i = 0; i < seedString.length; i++) {
      seed = ((seed << 5) - seed) + seedString.charCodeAt(i);
      seed = seed & seed; // Convert to 32-bit integer
    }
    
    // Use seeded random to get consistent index
    const random = seededRandom(Math.abs(seed));
    return Math.floor(random * questionsLength);
  };

  // Set question on initial load - random for practice, seeded daily for daily mode
  useEffect(() => {
    if (currentPage?.questions && currentPage.questions.length > 0) {
      if (mode === 'daily') {
        const dailyIndex = getDailyQuestionIndex(currentPage.questions.length);
        setCurrentQuestionIndex(dailyIndex);
      } else {
        const randomIndex = Math.floor(Math.random() * currentPage.questions.length);
        setCurrentQuestionIndex(randomIndex);
      }
    }
  }, [currentPage, mode]);

  if (isHome) {
    return (
      <div className="flex-1 bg-black flex flex-col items-center justify-center p-8">
        <h1 className="text-white text-6xl font-bold mb-4">Docudle!</h1>
        <p className="text-white text-2xl mb-8">Title Edition</p>
        <div className="text-white text-center max-w-2xl">
          <p className="text-xl mb-4">Welcome to Docudle!</p>
          <p className="mb-4">
            Test your knowledge of programming documentation. Navigate the sidebar to choose a category, 
            subcategory, and page to start playing.
          </p>
          <p>
            Read the definition and try to guess the correct function, method, or term from the documentation.
          </p>
        </div>
      </div>
    );
  }

  if (!currentPage || !currentPage.questions || currentPage.questions.length === 0) {
    return (
      <div className="flex-1 bg-black flex items-center justify-center">
        <p className="text-white text-xl">No questions available for this page.</p>
      </div>
    );
  }

  const currentQuestion = currentPage.questions[currentQuestionIndex];

  const capitalizeWords = (str) => {
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const handleSubmit = () => {
    if (mode === 'daily' && dailyComplete) return;
    
    const newGuessCount = guessCount + 1;
    setGuessCount(newGuessCount);

    if (userInput.trim().toLowerCase() === currentQuestion.answer.toLowerCase()) {
      // Correct answer
      setGameState('correct');
      
      if (mode === 'daily') {
        // Update stats for daily mode
        const stats = loadStats();
        const today = new Date().toISOString().split('T')[0];
        const isNewDay = stats.lastPlayedDate !== today;
        
        stats.gamesPlayed += 1;
        stats.gamesWon += 1;
        
        // Update streak
        if (isNewDay) {
          stats.currentStreak += 1;
        }
        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
        
        // Update guess distribution
        stats.guessDistribution[newGuessCount] = (stats.guessDistribution[newGuessCount] || 0) + 1;
        
        // Calculate average guesses
        const totalGuesses = Object.entries(stats.guessDistribution).reduce((sum, [guess, count]) => {
          return sum + (parseInt(guess) * count);
        }, 0);
        stats.averageGuesses = (totalGuesses / stats.gamesWon).toFixed(2);
        
        // Update win rate
        stats.winRate = ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(1);
        
        stats.lastPlayedDate = today;
        
        saveStats(stats);
        
        setDailyComplete(true);
      }
      
      setTimeout(() => {
        // In practice mode, move to next random question
        if (mode === 'practice') {
          handleNext();
        }
      }, 2000);
    } else if (mode === 'daily' && newGuessCount >= 5) {
      // Failed daily - out of guesses
      setGameState('failed');
      
      const stats = loadStats();
      const today = new Date().toISOString().split('T')[0];
      const isNewDay = stats.lastPlayedDate !== today;
      
      stats.gamesPlayed += 1;
      
      // Break streak on loss
      stats.currentStreak = 0;
      
      if (isNewDay) {
        // No need to track totalDaysPlayed anymore
      }
      
      // Update win rate
      stats.winRate = ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(1);
      
      stats.lastPlayedDate = today;
      
      saveStats(stats);
      
      setDailyComplete(true);
    }
  };

  const handleGiveUp = () => {
    setGameState('giveup');
  };

  const handleNext = () => {
    // Get a random question that's different from the current one
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * currentPage.questions.length);
    } while (newIndex === currentQuestionIndex && currentPage.questions.length > 1);
    
    setCurrentQuestionIndex(newIndex);
    setUserInput('');
    setGameState('playing');
  };

  return (
    <div className="flex-1 bg-black flex flex-col items-center justify-center p-8">
      {/* Header */}
      <h1 className="text-white text-6xl font-bold mb-2">Docudle!</h1>
      <p className="text-white text-2xl mb-8">
        {capitalizeWords(subcategoryName)} {capitalizeWords(pageName)} Edition
      </p>

      {/* Mode Buttons */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setMode('daily')}
          className={`border border-white text-white px-6 py-2 rounded-lg hover:bg-gray-900 ${mode === 'daily' ? 'bg-gray-800' : ''}`}
        >
          Daily
        </button>
        <button 
          onClick={() => setMode('practice')}
          className={`border border-white text-white px-6 py-2 rounded-lg hover:bg-gray-900 ${mode === 'practice' ? 'bg-gray-800' : ''}`}
        >
          Practice
        </button>
      </div>

      {/* Definition Box */}
      <div className="border border-white rounded-lg shadow-lg shadow-white/20 w-full max-w-2xl mb-8 p-8 min-h-[200px] flex items-center justify-center">
        <p className="text-white text-center text-lg">
          {gameState === 'giveup' ? `Answer: ${currentQuestion.answer}` : 
           gameState === 'failed' ? `Out of guesses! Answer: ${currentQuestion.answer}` :
           gameState === 'completed' ? 'You already completed today\'s daily challenge! Come back tomorrow or try Practice mode.' :
           currentQuestion.definition}
        </p>
      </div>

      {gameState === 'correct' && (
        <div className="text-green-500 text-xl mb-4">
          Correct! 🎉 {mode === 'daily' ? `(${guessCount} ${guessCount === 1 ? 'guess' : 'guesses'})` : ''}
        </div>
      )}

      {gameState === 'failed' && (
        <div className="text-red-500 text-xl mb-4">Better luck tomorrow!</div>
      )}

      {/* User Input Box */}
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="User Input Box"
        disabled={gameState !== 'playing' || (mode === 'daily' && dailyComplete)}
        className="border border-white rounded-lg bg-black text-white px-6 py-3 mb-8 w-full max-w-md text-center placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
      />

      {/* Guess Counter for Daily Mode */}
      {mode === 'daily' && !dailyComplete && gameState === 'playing' && (
        <div className="text-white mb-4">
          Guesses remaining: {5 - guessCount}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {mode === 'practice' && (
          <button
            onClick={handleGiveUp}
            disabled={gameState !== 'playing'}
            className="border border-white text-white px-6 py-2 rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Give Up
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={gameState !== 'playing' || (mode === 'daily' && dailyComplete)}
          className="border border-white text-white px-6 py-2 rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
        {mode === 'practice' && (
          <button
            onClick={handleNext}
            className="border border-white text-white px-6 py-2 rounded-lg hover:bg-gray-900"
          >
            Next
          </button>
        )}
      </div>

      {/* Question counter */}
      <div className="text-white mt-8">
        Question {currentQuestionIndex + 1} of {currentPage.questions.length}
      </div>
    </div>
  );
}