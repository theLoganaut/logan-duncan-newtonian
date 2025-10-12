import { generate } from "random-words";
import React, { useEffect, useState, useCallback } from "react";

const MainView = () => {
  const symbolList = "!@#$%^&*()-_+=[]{}|;:'\",/?<>";

  const [endGoal, setEndGoal] = useState(60);
  const [programmerWordsLevel, setProgrammerWordsLevel] = useState(0);

  const [settings, setSettings] = useState({
    symbols: true,
  });

  const [letters, setLetters] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [correct, setCorrect] = useState(0);
  const [dailySeed, setDailySeed] = useState(null);
  const [dailyIndex, setDailyIndex] = useState(0);
  const [dailyProgrammerLevel, setDailyProgrammerLevel] = useState(0);
  const [dailyTimer, setDailyTimer] = useState(60);

  const [timeLeft, setTimeLeft] = useState(endGoal * 1000);
  const [isActive, setIsActive] = useState(false);
  const [activeTab, setActiveTab] = useState("infinite");

  const [totalCharactersTyped, setTotalCharactersTyped] = useState(0);
  const [correctCharacters, setCorrectCharacters] = useState(0);
  const [incorrectCharacters, setIncorrectCharacters] = useState(0);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showPressureStatsModal, setShowPressureStatsModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [isDailyCompleted, setIsDailyCompleted] = useState(false);
  const [allAttempts, setAllAttempts] = useState([]);

  const [statsData, setStatsData] = useState({
    todayBest: null,
    allTimeBest: null,
    averages: null,
    history: []
  });

  // Seeded random number generator
  const seededRandom = (seed) => {
    let state = seed;
    return () => {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    };
  };

  // Get today's seed (changes at midnight UTC)
  const getTodaysSeed = () => {
    const today = new Date();
    const dateStr = `${today.getUTCFullYear()}-${today.getUTCMonth() + 1}-${today.getUTCDate()}`;
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const getTodaysDateKey = () => {
    const today = new Date();
    return `${today.getUTCFullYear()}-${today.getUTCMonth() + 1}-${today.getUTCDate()}`;
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${month}/${day}/${year.slice(2)}`;
  };

  // Load all stats from localStorage
  const loadStatsData = useCallback(() => {
    const allStats = { history: [] };

    // Get all localStorage keys that start with 'daily-'
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('daily-')) {
        const dateKey = key.replace('daily-', '');
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');

          if (data.completed && data.bestAttempt) {
            allStats.history.push({
              date: dateKey,
              ...data.bestAttempt
            });
          }
        } catch (e) {
          console.error('Error parsing localStorage data:', e);
        }
      }
    }

    // Sort by date descending
    allStats.history.sort((a, b) => {
      const dateA = new Date(a.date.split('-').join('/'));
      const dateB = new Date(b.date.split('-').join('/'));
      return dateB - dateA;
    });

    // Calculate today's best
    const todayKey = getTodaysDateKey();
    const todayData = allStats.history.find(h => h.date === todayKey);
    allStats.todayBest = todayData || null;

    // Calculate all-time best for each category
    if (allStats.history.length > 0) {
      allStats.allTimeBest = {
        phraseCount: Math.max(...allStats.history.map(h => h.phraseCount)),
        characterCount: Math.max(...allStats.history.map(h => h.characterCount)),
        correctPercent: Math.max(...allStats.history.map(h => parseFloat(h.correctPercent))),
        cpm: Math.max(...allStats.history.map(h => h.cpm)),
      };

      allStats.allTimeBest.phraseCountDate = allStats.history.find(h => h.phraseCount === allStats.allTimeBest.phraseCount)?.date;
      allStats.allTimeBest.characterCountDate = allStats.history.find(h => h.characterCount === allStats.allTimeBest.characterCount)?.date;
      allStats.allTimeBest.correctPercentDate = allStats.history.find(h => parseFloat(h.correctPercent) === allStats.allTimeBest.correctPercent)?.date;
      allStats.allTimeBest.cpmDate = allStats.history.find(h => h.cpm === allStats.allTimeBest.cpm)?.date;

      // Save all-time best to localStorage
      localStorage.setItem('stats-allTimeBest', JSON.stringify(allStats.allTimeBest));
    }

    // Calculate averages
    if (allStats.history.length > 0) {
      const sum = allStats.history.reduce((acc, h) => ({
        phraseCount: acc.phraseCount + h.phraseCount,
        characterCount: acc.characterCount + h.characterCount,
        correctPercent: acc.correctPercent + parseFloat(h.correctPercent),
        cpm: acc.cpm + h.cpm,
      }), { phraseCount: 0, characterCount: 0, correctPercent: 0, cpm: 0 });

      allStats.averages = {
        phraseCount: Math.round(sum.phraseCount / allStats.history.length),
        characterCount: Math.round(sum.characterCount / allStats.history.length),
        correctPercent: (sum.correctPercent / allStats.history.length).toFixed(1),
        cpm: Math.round(sum.cpm / allStats.history.length),
      };

      // Save averages to localStorage
      localStorage.setItem('stats-averages', JSON.stringify(allStats.averages));
    }

    return allStats;
  }, []);

  // Check if daily challenge is already completed today
  const checkDailyStatus = useCallback(() => {
    const dateKey = getTodaysDateKey();
    const storedData = localStorage.getItem(`daily-${dateKey}`);
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        return data.completed || false;
      } catch (e) {
        console.error('Error parsing daily status:', e);
        return false;
      }
    }
    return false;
  }, []);

  // Get remaining attempts for today
  const getRemainingAttempts = useCallback(() => {
    const dateKey = getTodaysDateKey();
    const storedData = localStorage.getItem(`daily-${dateKey}`);
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        return data.attemptsLeft !== undefined ? data.attemptsLeft : 3;
      } catch (e) {
        console.error('Error parsing attempts:', e);
        return 3;
      }
    }
    return 3;
  }, []);

  // Get all attempts for today
  const getAllAttemptsForToday = useCallback(() => {
    const dateKey = getTodaysDateKey();
    const storedData = localStorage.getItem(`daily-${dateKey}`);
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        return data.attempts || [];
      } catch (e) {
        console.error('Error parsing attempts:', e);
        return [];
      }
    }
    return [];
  }, []);

  // Save attempt to localStorage
  const saveAttempt = (stats) => {
    const dateKey = getTodaysDateKey();
    const storedData = localStorage.getItem(`daily-${dateKey}`);
    let data = storedData ? JSON.parse(storedData) : { attempts: [], attemptsLeft: 3, completed: false };

    data.attempts.push(stats);
    data.attemptsLeft = attemptsLeft - 1;

    // Update best attempt for today
    if (!data.bestAttempt || stats.phraseCount > data.bestAttempt.phraseCount) {
      data.bestAttempt = stats;
    }

    localStorage.setItem(`daily-${dateKey}`, JSON.stringify(data));
  };

  // Mark daily as completed
  const markDailyCompleted = () => {
    const dateKey = getTodaysDateKey();
    const storedData = localStorage.getItem(`daily-${dateKey}`);
    let data = storedData ? JSON.parse(storedData) : { attempts: [], attemptsLeft: 0, completed: false };

    data.completed = true;

    localStorage.setItem(`daily-${dateKey}`, JSON.stringify(data));
    setIsDailyCompleted(true);

    // Reload stats
    setStatsData(loadStatsData());
  };

  // Initialize daily seed when component mounts or tab changes to daily
  useEffect(() => {
    if (activeTab === "daily" || activeTab === "pressure") {
      const seed = getTodaysSeed();
      setDailySeed(seed);
      setDailyIndex(0);

      const completed = checkDailyStatus();
      setIsDailyCompleted(completed);

      const remaining = getRemainingAttempts();
      setAttemptsLeft(remaining);

      const attempts = getAllAttemptsForToday();
      setAllAttempts(attempts);

      const rng = seededRandom(seed);
      const randomLevel = Math.floor(rng() * 11);
      setDailyProgrammerLevel(randomLevel);

      const randomTimer = 30 + Math.floor(rng() * 16);
      setDailyTimer(randomTimer);
      setTimeLeft(randomTimer * 1000);

      if (!completed && remaining > 0) {
        setTotalCharactersTyped(0);
        setCorrectCharacters(0);
        setIncorrectCharacters(0);
        setShowStatsModal(false);
      }
    } else if (activeTab === "stats") {
      setStatsData(loadStatsData());
    } else {
      setTimeLeft(endGoal * 1000);
    }
  }, [activeTab, endGoal, dailyTimer, checkDailyStatus, getRemainingAttempts, getAllAttemptsForToday, loadStatsData]);

  const endDailyChallenge = () => {
    setIsActive(false);
    setShowStatsModal(true);
  };

  const handleUserInput = (e) => {
    const newInput = e.target.value;
    const oldInput = userInput;

    if (!isActive && newInput.length > 0) {
      setIsActive(true);
    }

    if ((activeTab === "daily" || activeTab === "pressure") && newInput.length > oldInput.length) {
      const allText = letters.join(' ');
      const newCharIndex = oldInput.length;
      const typedChar = newInput[newCharIndex];
      const expectedChar = allText[newCharIndex];

      setTotalCharactersTyped(prev => prev + 1);

      if (typedChar === expectedChar) {
        setCorrectCharacters(prev => prev + 1);
      } else {
        setIncorrectCharacters(prev => prev + 1);
      }
    }

    React.startTransition(() => {
      setUserInput(newInput);
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();

      const allText = letters.join(' ');

      if (allText[userInput.length] === ' ' && allText.startsWith(userInput)) {
        if (activeTab === "daily" || activeTab === "pressure") {
          setTotalCharactersTyped(prev => prev + 1);
          setCorrectCharacters(prev => prev + 1);
        }

        const newText = allText.slice(userInput.length + 1);

        let newItem;
        if (activeTab === "daily" && dailySeed !== null) {
          newItem = getDailyItem(dailyIndex + letters.length);
          setDailyIndex(dailyIndex + 1);
        } else {
          const shouldAddProgrammerWord = Math.random() < (programmerWordsLevel / 10);
          newItem = shouldAddProgrammerWord ? generateProgrammerWord() : getRandomSymbol();
        }

        if (newText.length === 0) {
          const tempArray = [...letters.slice(1), newItem];

          setLetters(tempArray);
          React.startTransition(() => {
            setUserInput("");
          });
          setCorrect(prev => prev + 1);
        } else {
          const originalPhrases = letters.join(' ').split(' ');

          let charsProcessed = userInput.length + 1;
          let newLetters = [];
          let currentPhrase = '';

          for (let phrase of originalPhrases) {
            if (charsProcessed > 0) {
              if (charsProcessed >= phrase.length + 1) {
                charsProcessed -= phrase.length + 1;
              } else {
                currentPhrase = phrase.slice(charsProcessed);
                charsProcessed = 0;
                if (currentPhrase) newLetters.push(currentPhrase);
              }
            } else {
              newLetters.push(phrase);
            }
          }

          newLetters.push(newItem);

          setLetters(newLetters);
          React.startTransition(() => {
            setUserInput("");
          });
          setCorrect(prev => prev + 1);
        }
      }
    }
  };

  const renderCharacterFeedback = () => {
    const allText = letters.join(' ');
    const chars = [];

    for (let i = 0; i < allText.length; i++) {
      const typedChar = userInput[i];
      let color = "text-gray-700";
      let opacity = 1;

      if (typedChar !== undefined && i < userInput.length) {
        if (typedChar === allText[i]) {
          color = "text-green-600";
        } else {
          color = "text-red-600";
        }
      } else {
        const distanceFromCurrent = i - userInput.length;
        opacity = Math.max(0, 1 - (distanceFromCurrent * 0.05));
      }

      const displayChar = allText[i] === ' ' ? '\u00A0' : allText[i];

      chars.push(
        <span
          key={i}
          className={color}
          style={{ opacity }}
        >
          {displayChar}
        </span>
      );
    }

    return chars;
  };

  const generateProgrammerWord = (rng = null, seed = null) => {
    const random = rng || Math.random;

    const word = () => {
      if (seed !== null) {
        return generate({ exactly: 1, seed: `${seed}-${random()}` })[0];
      }
      return generate({ exactly: 1 })[0];
    };

    const operators = [' + ', ' - ', ' * ', ' / ', ' % ', ' === ', ' !== ', ' && ', ' || ', ' < ', ' > ', ' <= ', ' >= '];

    const templates = [
      () => `${word()}.${word()}`,
      () => `${word()}.${word()}.${word()}`,
      () => `${word()}[${word()}]`,
      () => `${word()}[${Math.floor(random() * 10)}]`,
      () => `${word()}(${word()})`,
      () => `${word()}()`,
      () => `${word()}(${word()}, ${word()})`,
      () => `${word()}${operators[Math.floor(random() * operators.length)]}${word()}`,
      () => `${word()}${operators[Math.floor(random() * operators.length)]}${Math.floor(random() * 100)}`,
      () => `${word()}[${word()}.${word()}]`,
      () => `${word()}(${word()}${operators[Math.floor(random() * operators.length)]}${word()})`,
      () => `${word()}[${word()}${operators[Math.floor(random() * operators.length)]}${Math.floor(random() * 10)}]`,
      () => `${word()}[${word()}.${word()}()]`,
      () => `${word()}(${word()}[${word()}])`,
      () => `${word()}[${word()}.${word()}[${Math.floor(random() * 10)}]]`,
      () => `${word()}${operators[Math.floor(random() * operators.length)]}${word()}[${word()}${operators[Math.floor(random() * operators.length)]}${word()}]`,
      () => `${word()}[${word()}.${word()}(${word()}${operators[Math.floor(random() * operators.length)]}${word()}.${word()})]`,
      () => `${word()}[Math.floor(Math.random() * ${word()}.length)]`,
      () => `${word()} + ${word()}[${word()} - ${word()}]`,
    ];

    const template = templates[Math.floor(random() * templates.length)];
    return template();
  };

  const getRandomSymbol = (rng = null) => {
    const random = rng || Math.random;
    return symbolList[Math.floor(random() * symbolList.length)];
  };

  const getDailyItem = useCallback((index) => {
    if (dailySeed === null) return getRandomSymbol();

    const rng = seededRandom(dailySeed + index);
    const shouldAddProgrammerWord = rng() < (dailyProgrammerLevel / 10);

    if (shouldAddProgrammerWord) {
      return generateProgrammerWord(rng, dailySeed + index);
    } else {
      return getRandomSymbol(rng);
    }
  }, [dailySeed, dailyProgrammerLevel]);

  const generateTypingArray = useCallback(() => {
    if (activeTab === "daily" && dailySeed !== null) {
      const array = [];
      const totalItems = 7;

      for (let i = 0; i < totalItems; i++) {
        array.push(getDailyItem(i));
      }

      setDailyIndex(totalItems);
      return array;
    }

    const array = [];
    const totalItems = 7;
    const programmerWordCount = Math.floor((programmerWordsLevel / 10) * totalItems);

    for (let i = 0; i < programmerWordCount; i++) {
      let newItem = generateProgrammerWord();
      while (array.includes(newItem)) {
        newItem = generateProgrammerWord();
      }
      array.push(newItem);
    }

    for (let i = programmerWordCount; i < totalItems; i++) {
      let newItem = getRandomSymbol();
      while (array.includes(newItem)) {
        newItem = getRandomSymbol();
      }
      array.push(newItem);
    }

    return array.sort(() => Math.random() - 0.5);
  }, [activeTab, dailySeed, programmerWordsLevel, getDailyItem]);

  useEffect(() => {
    if (letters.length === 0) {
      setLetters(generateTypingArray());
      setUserInput("");
    }
  }, [letters, generateTypingArray]);

  useEffect(() => {
    if (letters.length > 0) {
      setLetters(generateTypingArray());
      setUserInput("");
      setCorrect(0);
      setIsActive(false);
      const newTimeLimit = activeTab === "daily" ? dailyTimer : endGoal;
      setTimeLeft(newTimeLimit * 1000);
    }
  }, [programmerWordsLevel, activeTab, dailySeed, dailyTimer, endGoal, generateTypingArray, letters.length]);

  useEffect(() => {
    let timer;

    if (isActive && timeLeft > 0 && activeTab !== "infinite") {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 10;

          if (newTime <= 0 && activeTab === "daily") {
            endDailyChallenge();
          } else if (newTime <= 0 && activeTab === "pressure") {
            setIsActive(false);
            setShowPressureStatsModal(true);
          }

          return newTime;
        });
      }, 10);
    }

    return () => clearInterval(timer);
  }, [isActive, timeLeft, activeTab]);

  const handleRestart = () => {
    const newTimeLimit = activeTab === "daily" ? dailyTimer : endGoal;
    setTimeLeft(newTimeLimit * 1000);
    setIsActive(false);
    setCorrect(0);
    setLetters(generateTypingArray());
    setUserInput("");
    if (activeTab === "daily" || activeTab === "pressure") {
      setDailyIndex(0);
      setTotalCharactersTyped(0);
      setCorrectCharacters(0);
      setIncorrectCharacters(0);
      setShowStatsModal(false);
    } else if (activeTab === "pressure") {
      setShowPressureStatsModal(false);
    }
  };

  const handleRetry = () => {
    if (attemptsLeft > 1) {
      const stats = calculateStats();
      saveAttempt(stats);
      setAllAttempts([...allAttempts, stats]);
      setAttemptsLeft(attemptsLeft - 1);

      handleRestart();
    }
  };

  const handleSubmit = () => {
    const stats = calculateStats();
    saveAttempt(stats);

    markDailyCompleted();

    setShowStatsModal(false);
  };

  const calculateStats = () => {
    const timeElapsed = activeTab === "daily"
      ? (dailyTimer * 1000 - timeLeft) / 1000
      : (endGoal * 1000 - timeLeft) / 1000;

    const correctPercent = totalCharactersTyped > 0
      ? ((correctCharacters / totalCharactersTyped) * 100).toFixed(1)
      : "0.0";

    const cpm = timeElapsed > 0
      ? Math.round((totalCharactersTyped / timeElapsed) * 60)
      : 0;

    return {
      phraseCount: correct,
      correctPercent,
      characterCount: totalCharactersTyped,
      cpm
    };
  };

  const StatsModal = () => {
    const stats = calculateStats();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Daily Challenge Complete!</h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600 font-medium">Phrase Count:</span>
              <span className="text-2xl font-bold text-gray-800">{stats.phraseCount}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600 font-medium">Correct %:</span>
              <span className="text-2xl font-bold text-gray-800">{stats.correctPercent}%</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600 font-medium">Character Count:</span>
              <span className="text-2xl font-bold text-gray-800">{stats.characterCount}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600 font-medium">CPM:</span>
              <span className="text-2xl font-bold text-gray-800">{stats.cpm}</span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-all"
            >
              Submit
            </button>
            <button
              onClick={handleRetry}
              disabled={attemptsLeft <= 1}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${attemptsLeft <= 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              Retry? ({attemptsLeft - 1} left)
            </button>
          </div>
        </div>
      </div>
    );
  };
  const PressureStatsModal = () => {
    const stats = calculateStats();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Pressure Mode Complete!</h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600 font-medium">Phrase Count:</span>
              <span className="text-2xl font-bold text-gray-800">{stats.phraseCount}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600 font-medium">Correct %:</span>
              <span className="text-2xl font-bold text-gray-800">{stats.correctPercent}%</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600 font-medium">Character Count:</span>
              <span className="text-2xl font-bold text-gray-800">{stats.characterCount}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600 font-medium">CPM:</span>
              <span className="text-2xl font-bold text-gray-800">{stats.cpm}</span>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="w-full bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-all mt-6"
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  const InfoModal = () => {
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
    const [isPositioned, setIsPositioned] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
      keyboard: false,
      future: false
    });

    useEffect(() => {
      const button = document.querySelector('[data-info-button]');
      if (button) {
        const rect = button.getBoundingClientRect();
        setButtonPosition({
          top: rect.top + rect.height / 2,
          left: rect.right + 10
        });
        setIsPositioned(true);
      }
    }, []);

    const toggleSection = (section) => {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    };

    return (
      <div className="fixed inset-0 z-40 pointer-events-none">
        <div
          className="absolute bg-gray-800 text-white rounded-lg p-6 shadow-xl border-2 border-gray-600 max-w-md transition-opacity duration-150 pointer-events-auto"
          style={{
            top: `${buttonPosition.top - (buttonPosition.top * 0.25)}px`,
            left: `${buttonPosition.left}px`,
            opacity: isPositioned ? 1 : 0
          }}
        >
          <div className="space-y-3">
            <p>
              This is{' '}
              <span className="text-2xl font-bold">
                <span className="text-gray-700" style={{ textShadow: '1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white' }}>$</span>
                <span className="text-gray-600" style={{ textShadow: '1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white' }}>¥</span>
                <span className="text-gray-800" style={{ textShadow: '1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white' }}>₥</span>
                <span className="text-gray-700" style={{ textShadow: '1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white' }}>∂</span>
                <span className="text-gray-600" style={{ textShadow: '1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white' }}>|</span>
                <span className="text-gray-600" style={{ textShadow: '1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white' }}>£</span>
              </span>
              {' '}(Symdle)! It&apos;s a daily currently offline -dle to help you improve your symbol typing skills along with &apos;programmer&apos; word structures of arrays, objects, and references among others.
            </p>

            <p><strong>Infinite</strong> - Just zone out and hit some keys. No stat saving.</p>

            <p><strong>Pressure</strong> - Set a timer, get some stats for that. Good warmup for the daily.</p>

            <p><strong>Daily</strong> - A seeded daily challenge, everyone's list of words is the same no matter how long! Three tries per day but only one gets submitted. Stats tracked locally each day.</p>

            <p><strong>Stats</strong> - View all your daily stats, your average over time, and your best numbers and when you got them.</p>

            <div>
              <button
                onClick={() => toggleSection('keyboard')}
                className="font-bold hover:text-gray-300 cursor-pointer flex items-center gap-2 w-full"
              >
                <span>Keyboard Customizing</span>
                <span className="text-xs">{expandedSections.keyboard ? '▼' : '▲'}</span>
              </button>
              {expandedSections.keyboard && (
                <p className="mt-2 pl-4">
                  You can change the keys that light up at the bottom to common keyboard configurations, or set your own and change the grid to be your keyboard. Keyboard customizing supports up to 4 layers, with L1 and L2 across the top and L3 and L4 on the bottom. Assign new keys by clicking a key and pressing the new key you want there, check speed assign to continue reassigning until you cancel. Customize the exact layout by changing to your specific row and column amount, clicking keys you want disabled. Name, save, and switch between layouts you&apos;ve made.
                </p>
              )}
            </div>

            <div>
              <button
                onClick={() => toggleSection('future')}
                className="font-bold hover:text-gray-300 cursor-pointer flex items-center gap-2 w-full"
              >
                <span>Future</span>
                <span className="text-xs">{expandedSections.future ? '▼' : '▲'}</span>
              </button>
              {expandedSections.future && (
                <p className="mt-2 pl-4">
                  I&apos;ll probably drop this for a while but potentially an online mode for leaderboards and friend lists. Other languages and specific programming language challenges. More specific keyboard layouts.
                </p>
              )}
            </div>

            <div>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to remove all localStorage data? This cannot be undone.')) {
                    localStorage.clear();
                    alert('All localStorage data has been removed!');
                    window.location.reload();
                  }
                }}
                className="font-bold text-red-500 hover:text-red-400 cursor-pointer flex items-center gap-2 w-full"
              >
                <span>Delete Local Data Permanently</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const StatsTab = () => {
    const { todayBest, allTimeBest, averages } = statsData;

    return (
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="rounded-lg overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-4 border-b border-gray-700">
            <div className="p-4"></div>
            <div className="p-4 text-center">
              <div className="text-white font-bold text-xl">Today</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-white font-bold text-xl">Average</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-white font-bold text-xl">Best</div>
            </div>
          </div>

          {/* Phrase Count Row */}
          <div className="grid grid-cols-4 border-b border-gray-700">
            <div className="p-4 flex items-center">
              <span className="text-white font-medium text-lg">Phrase Count</span>
            </div>
            <div className="p-4 flex items-center justify-center">
              <span className="text-white text-xl">{todayBest?.phraseCount || '-'}</span>
            </div>
            <div className="p-4 flex items-center justify-center">
              <span className="text-white text-xl">{averages?.phraseCount || '-'}</span>
            </div>
            <div className="p-4 flex items-center justify-center gap-2">
              <span className="text-white text-xl">{allTimeBest?.phraseCount || '-'}</span>
              {allTimeBest?.phraseCountDate && (
                <span className="text-gray-400 text-sm">{formatDate(allTimeBest.phraseCountDate)}</span>
              )}
            </div>
          </div>

          {/* Character Count Row */}
          <div className="grid grid-cols-4 border-b border-gray-700">
            <div className="p-4 flex items-center">
              <span className="text-white font-medium text-lg">Character Count</span>
            </div>
            <div className="p-4 flex items-center justify-center">
              <span className="text-white text-xl">{todayBest?.characterCount || '-'}</span>
            </div>
            <div className="p-4 flex items-center justify-center">
              <span className="text-white text-xl">{averages?.characterCount || '-'}</span>
            </div>
            <div className="p-4 flex items-center justify-center gap-2">
              <span className="text-white text-xl">{allTimeBest?.characterCount || '-'}</span>
              {allTimeBest?.characterCountDate && (
                <span className="text-gray-400 text-sm">{formatDate(allTimeBest.characterCountDate)}</span>
              )}
            </div>
          </div>

          {/* Correct % Row */}
          <div className="grid grid-cols-4 border-b border-gray-700">
            <div className="p-4 flex items-center">
              <span className="text-white font-medium text-lg">Correct %</span>
            </div>
            <div className="p-4 flex items-center justify-center">
              <span className="text-white text-xl">{todayBest?.correctPercent || '-'}</span>
            </div>
            <div className="p-4 flex items-center justify-center">
              <span className="text-white text-xl">{averages?.correctPercent || '-'}</span>
            </div>
            <div className="p-4 flex items-center justify-center gap-2">
              <span className="text-white text-xl">{allTimeBest?.correctPercent || '-'}</span>
              {allTimeBest?.correctPercentDate && (
                <span className="text-gray-400 text-sm">{formatDate(allTimeBest.correctPercentDate)}</span>
              )}
            </div>
          </div>

          {/* Characters/Min Row */}
          <div className="grid grid-cols-4">
            <div className="p-4 flex items-center">
              <span className="text-white font-medium text-lg">Characters/Min</span>
            </div>
            <div className="p-4 flex items-center justify-center">
              <span className="text-white text-xl">{todayBest?.cpm || '-'}</span>
            </div>
            <div className="p-4 flex items-center justify-center">
              <span className="text-white text-xl">{averages?.cpm || '-'}</span>
            </div>
            <div className="p-4 flex items-center justify-center gap-2">
              <span className="text-white text-xl">{allTimeBest?.cpm || '-'}</span>
              {allTimeBest?.cpmDate && (
                <span className="text-gray-400 text-sm">{formatDate(allTimeBest.cpmDate)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {showStatsModal && <StatsModal />}
      {showPressureStatsModal && <PressureStatsModal />}
      {showInfoModal && <InfoModal />}

      <h1 className="text-8xl font-bold my-6 flex gap-2">
        <span className="text-gray-700" style={{ textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 0 2px 0 white, 0 -2px 0 white, 2px 0 0 white, -2px 0 0 white' }}>$</span>
        <span className="text-gray-600" style={{ textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 0 2px 0 white, 0 -2px 0 white, 2px 0 0 white, -2px 0 0 white', transform: 'rotate(-5deg)', display: 'inline-block' }}>¥</span>
        <span className="text-gray-800" style={{ textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 0 2px 0 white, 0 -2px 0 white, 2px 0 0 white, -2px 0 0 white', transform: 'scale(1.1)', display: 'inline-block' }}>₥</span>
        <span className="text-gray-700" style={{ textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 0 2px 0 white, 0 -2px 0 white, 2px 0 0 white, -2px 0 0 white', transform: 'rotate(3deg)', display: 'inline-block' }}>∂</span>
        <span className="text-gray-600" style={{ textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 0 2px 0 white, 0 -2px 0 white, 2px 0 0 white, -2px 0 0 white', transform: 'rotate(5deg)', display: 'inline-block' }}>|</span>
        <span className="text-gray-600" style={{ textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 0 2px 0 white, 0 -2px 0 white, 2px 0 0 white, -2px 0 0 white', transform: 'scale(0.95) translateY(-4px)', display: 'inline-block' }}>£</span>
        <span className="text-gray-800" style={{ textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 0 2px 0 white, 0 -2px 0 white, 2px 0 0 white, -2px 0 0 white', transform: 'rotate(-3deg)', display: 'inline-block' }}>!</span>
      </h1>

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab("infinite")}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === "infinite"
            ? "bg-gray-700 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          |nfinite
        </button>
        <button
          onClick={() => setActiveTab("pressure")}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === "pressure"
            ? "bg-gray-700 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          Pres.sure
        </button>
        <button
          onClick={() => setActiveTab("daily")}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === "daily"
            ? "bg-gray-700 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          D@ily
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === "stats"
            ? "bg-gray-700 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          $tats
        </button>
        <button
          data-info-button
          onClick={() => setShowInfoModal(!showInfoModal)}
          className="px-6 py-2 rounded-lg font-medium transition-all bg-gray-600 text-white hover:bg-gray-700"
        >
          What&apos;s this?
        </button>
      </div>

      {activeTab === "stats" ? (
        <StatsTab />
      ) : (
        <>
          {activeTab === "daily" && (
            <div className="text-sm text-gray-600 mb-4">
              {isDailyCompleted ? (
                <span className="text-red-600 font-bold">Daily challenge completed! Come back tomorrow.</span>
              ) : (
                <>Seed: {dailySeed} | Words: {dailyProgrammerLevel * 10}% | Time: {dailyTimer}s | Attempts: {attemptsLeft}</>
              )}
            </div>
          )}

          <div
            className="mb-12 w-full flex items-center"
            style={{
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            <div
              className="flex items-center text-7xl font-bold whitespace-nowrap"
              style={{
                transform: `translateX(calc(50vw - ${userInput.length * 2.5}rem - 1.25rem))`,
                marginLeft: 0,
                transition: 'transform 0s'
              }}
            >
              {renderCharacterFeedback()}
            </div>
          </div>

          <input
            type="text"
            className="border text-white bg-gray-800 p-2 text-center text-2xl mb-4 z-10"
            placeholder={!isActive ? (isDailyCompleted ? "Completed for today" : "Type to start...") : ""}
            onChange={handleUserInput}
            onKeyDown={handleKeyDown}
            value={userInput}
            disabled={showStatsModal || (activeTab === "daily" && isDailyCompleted)}
          />


          <div className="flex items-center gap-4">
            {activeTab === "pressure" ? (
              <div className="flex items-center gap-2">
                {!isActive ? (
                  <>
                    <button
                      onClick={() => {
                        const newVal = Math.max(15, endGoal - 5);
                        setEndGoal(newVal);
                        setTimeLeft(newVal * 1000);
                      }}
                      className="relative z-10 text-sm font-bold px-2 py-1 bg-gray-800 text-white rounded-lg border border-gray-700 hover:bg-gray-700 transition-all"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => {
                        const newVal = Math.max(15, endGoal - 1);
                        setEndGoal(newVal);
                        setTimeLeft(newVal * 1000);
                      }}
                      className="relative z-10 text-sm font-bold px-2 py-1 bg-gray-800 text-white rounded-lg border border-gray-700 hover:bg-gray-700 transition-all"
                    >
                      -1
                    </button>
                  </>
                ) : null}

                <div className="text-4xl font-mono p-4 rounded-lg shadow-lg text-gray-700 min-w-[150px] text-center -mx-6">
                  {timeLeft > 0 ? (timeLeft / 1000).toFixed(2) : `${correct * 2} spm`}
                </div>

                {!isActive ? (
                  <>
                    <button
                      onClick={() => {
                        const newVal = endGoal + 1;
                        setEndGoal(newVal);
                        setTimeLeft(newVal * 1000);
                      }}
                      className="relative z-10 text-sm font-bold px-2 py-1 bg-gray-800 text-white rounded-lg border border-gray-700 hover:bg-gray-700 transition-all"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => {
                        const newVal = endGoal + 5;
                        setEndGoal(newVal);
                        setTimeLeft(newVal * 1000);
                      }}
                      className="relative z-10 text-sm font-bold px-2 py-1 bg-gray-800 text-white rounded-lg border border-gray-700 hover:bg-gray-700 transition-all"
                    >
                      +5
                    </button>
                  </>
                ) : null}
              </div>
            ) : (
              <div className={`${activeTab === "infinite" ? "text-9xl -mb-12 -mt-20" : "text-4xl"} font-mono p-4 rounded-lg shadow-lg text-gray-700`}>
                {activeTab === "infinite" ? "∞" : (timeLeft > 0 ? (timeLeft / 1000).toFixed(2) : `${correct * 2} spm`)}
              </div>
            )}
          </div>

          <div className="mb-8 mx-auto">
            <div className="flex flex-col gap-2">
              <label className="flex items-center justify-between space-x-4">
                <span className="text-gray-700 font-medium mx-auto">
                  Words: {activeTab === "daily" ? dailyProgrammerLevel * 10 : programmerWordsLevel * 10}%
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="8"
                value={activeTab === "daily" ? dailyProgrammerLevel : programmerWordsLevel}
                onChange={(e) => setProgrammerWordsLevel(parseInt(e.target.value))}
                disabled={activeTab === "daily"}
                className={`w-64 h-2 bg-gray-200 rounded-lg appearance-none ${activeTab === "daily" ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MainView;