import React, { useState, useEffect, useRef, useCallback } from 'react';

const KeyboardLayout = () => {
  const [activeLayer, setActiveLayer] = useState('L1');
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  const [layoutName, setLayoutName] = useState('Default');
  const [savedLayouts, setSavedLayouts] = useState(['Default']);
  const [selectedLayout, setSelectedLayout] = useState('Default');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState(15);
  const [keyGrid, setKeyGrid] = useState(
    Array(5).fill(null).map(() => Array(15).fill(true))
  );
  const [speedAssign, setSpeedAssign] = useState(false);
  const [speedAssignQueue, setSpeedAssignQueue] = useState([]);

  // Reference to store all layouts in memory
  const layoutsRef = useRef({});

  // Initialize default keyboard layout with wide markers
  const getDefaultLayout = () => ({
    row1: [
      { id: 'key-backtick', L1: '~', L2: '`', L3: '', L4: '' },
      { id: 'key-1', L1: '!', L2: '1', L3: '', L4: '' },
      { id: 'key-2', L1: '@', L2: '2', L3: '', L4: '' },
      { id: 'key-3', L1: '#', L2: '3', L3: '', L4: '' },
      { id: 'key-4', L1: '$', L2: '4', L3: '', L4: '' },
      { id: 'key-5', L1: '%', L2: '5', L3: '', L4: '' },
      { id: 'key-6', L1: '^', L2: '6', L3: '', L4: '' },
      { id: 'key-7', L1: '&', L2: '7', L3: '', L4: '' },
      { id: 'key-8', L1: '*', L2: '8', L3: '', L4: '' },
      { id: 'key-9', L1: '(', L2: '9', L3: '', L4: '' },
      { id: 'key-0', L1: ')', L2: '0', L3: '', L4: '' },
      { id: 'key-minus', L1: '_', L2: '-', L3: '', L4: '' },
      { id: 'key-equals', L1: '+', L2: '=', L3: '', L4: '' },
      { id: 'key-backspace', L1: 'Backspace', L2: '', L3: '', L4: '', extraWide: true },
    ],
    row2: [
      { id: 'key-tab', L1: 'Tab', L2: '', L3: '', L4: '', medWide: true },
      { id: 'key-q', L1: 'Q', L2: '', L3: '', L4: '' },
      { id: 'key-w', L1: 'W', L2: '', L3: '', L4: '' },
      { id: 'key-e', L1: 'E', L2: '', L3: '', L4: '' },
      { id: 'key-r', L1: 'R', L2: '', L3: '', L4: '' },
      { id: 'key-t', L1: 'T', L2: '', L3: '', L4: '' },
      { id: 'key-y', L1: 'Y', L2: '', L3: '', L4: '' },
      { id: 'key-u', L1: 'U', L2: '', L3: '', L4: '' },
      { id: 'key-i', L1: 'I', L2: '', L3: '', L4: '' },
      { id: 'key-o', L1: 'O', L2: '', L3: '', L4: '' },
      { id: 'key-p', L1: 'P', L2: '', L3: '', L4: '' },
      { id: 'key-lbracket', L1: '{', L2: '[', L3: '', L4: '' },
      { id: 'key-rbracket', L1: '}', L2: ']', L3: '', L4: '' },
      { id: 'key-backslash', L1: '|', L2: '\\', L3: '', L4: '', wide: true },
    ],
    row3: [
      { id: 'key-caps', L1: 'Caps Lock', L2: '', L3: '', L4: '', extraWide: true },
      { id: 'key-a', L1: 'A', L2: '', L3: '', L4: '' },
      { id: 'key-s', L1: 'S', L2: '', L3: '', L4: '' },
      { id: 'key-d', L1: 'D', L2: '', L3: '', L4: '' },
      { id: 'key-f', L1: 'F', L2: '', L3: '', L4: '' },
      { id: 'key-g', L1: 'G', L2: '', L3: '', L4: '' },
      { id: 'key-h', L1: 'H', L2: '', L3: '', L4: '' },
      { id: 'key-j', L1: 'J', L2: '', L3: '', L4: '' },
      { id: 'key-k', L1: 'K', L2: '', L3: '', L4: '' },
      { id: 'key-l', L1: 'L', L2: '', L3: '', L4: '' },
      { id: 'key-semicolon', L1: ':', L2: ';', L3: '', L4: '' },
      { id: 'key-quote', L1: '"', L2: "'", L3: '', L4: '' },
      { id: 'key-return', L1: 'Return', L2: '', L3: '', L4: '', wide: true },
    ],
    row4: [
      { id: 'key-shift', L1: 'Shift', L2: '', L3: '', L4: '', xtraWide: true },
      { id: 'key-z', L1: 'Z', L2: '', L3: '', L4: '' },
      { id: 'key-x', L1: 'X', L2: '', L3: '', L4: '' },
      { id: 'key-c', L1: 'C', L2: '', L3: '', L4: '' },
      { id: 'key-v', L1: 'V', L2: '', L3: '', L4: '' },
      { id: 'key-b', L1: 'B', L2: '', L3: '', L4: '' },
      { id: 'key-n', L1: 'N', L2: '', L3: '', L4: '' },
      { id: 'key-m', L1: 'M', L2: '', L3: '', L4: '' },
      { id: 'key-comma', L1: '<', L2: ',', L3: '', L4: '' },
      { id: 'key-period', L1: '>', L2: '.', L3: '', L4: '' },
      { id: 'key-slash', L1: '?', L2: '/', L3: '', L4: '' },
      { id: 'key-rshift', L1: 'Shift', L2: '', L3: '', L4: '', xtraWide: true },
    ],
    row5: [
      { id: 'key-ctrl', L1: 'Control', L2: '', L3: '', L4: '', medWide: true },
      { id: 'key-win', L1: 'Win', L2: '', L3: '', L4: '', medWide: true },
      { id: 'key-alt', L1: 'Alt', L2: '', L3: '', L4: '', medWide: true },
      { id: 'key-space', L1: ' ', L2: '', L3: '', L4: '', widest: true },
      { id: 'key-ralt', L1: 'Alt', L2: '', L3: '', L4: '', medWide: true },
      { id: 'key-rwin', L1: 'Win', L2: '', L3: '', L4: '', medWide: true },
      { id: 'key-rctrl', L1: 'Control', L2: '', L3: '', L4: '', medWide: true },
    ],
  });

  const [keyLayout, setKeyLayout] = useState(() => {
    // Initialize with default layout
    const defaultLayout = getDefaultLayout();
    layoutsRef.current['Default'] = defaultLayout;
    return defaultLayout;
  });

  // Deep clone a layout
  const cloneLayout = (layout) => {
    return JSON.parse(JSON.stringify(layout));
  };

  // Generate a layout from the key grid (no wide markers, blank keys)
  const generateLayoutFromGrid = () => {
    const newLayout = {};
    keyGrid.forEach((row, rowIndex) => {
      const rowName = `row${rowIndex + 1}`;
      newLayout[rowName] = [];
      row.forEach((isActive, colIndex) => {
        newLayout[rowName].push({
          id: `key-r${rowIndex}-c${colIndex}`,
          L1: '',
          L2: '',
          L3: '',
          L4: '',
          enabled: isActive
        });
      });
    });
    return newLayout;
  };

  // Listen for keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey || e.ctrlKey) {
        e.preventDefault();
      }

      // Normalize the key: use the key code as identifier
      let keyIdentifier = e.code;

      setPressedKeys(prev => new Set(prev).add(keyIdentifier));

      if (modalOpen && selectedButton) {
        e.preventDefault();

        if (isMouseDown && e.key.length > 1) {
          return;
        }

        let keyToAssign = e.key;
        if (keyToAssign.length === 1 && keyToAssign.match(/[a-z]/i)) {
          keyToAssign = keyToAssign.toUpperCase();
        }

        updateKeyMapping(selectedButton.row, selectedButton.index, keyToAssign);

        if (speedAssign) {
          advanceToNextKey(selectedButton.row, selectedButton.index);
        } else {
          setModalOpen(false);
          setSelectedButton(null);
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.altKey || e.ctrlKey) {
        e.preventDefault();
      }

      // Use the same key code identifier
      let keyIdentifier = e.code;

      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(keyIdentifier);
        return newSet;
      });
    };

    const handleMouseDown = () => {
      setIsMouseDown(true);
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
    };

    const handleContextMenu = (e) => {
      if (modalOpen) {
        e.preventDefault();
        setModalOpen(false);
        setSelectedButton(null);
        setSpeedAssignQueue([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [modalOpen, selectedButton, activeLayer, isMouseDown, speedAssign, advanceToNextKey, updateKeyMapping]);

  const updateKeyMapping = useCallback((row, index, newKey) => {
    setKeyLayout(prev => {
      const newLayout = { ...prev };
      newLayout[row][index] = {
        ...newLayout[row][index],
        [activeLayer]: newKey
      };
      return newLayout;
    });
  }, [activeLayer]);
  const advanceToNextKey = useCallback((currentRow, currentIndex) => {
    // Close modal briefly to provide visual feedback
    setModalOpen(false);

    setTimeout(() => {
      const rowKeys = Object.keys(keyLayout);
      const currentRowIndex = rowKeys.indexOf(currentRow);
      const currentRowData = keyLayout[currentRow];

      // Try next key in current row
      let nextIndex = currentIndex + 1;
      while (nextIndex < currentRowData.length) {
        if (currentRowData[nextIndex].enabled !== false) {
          setSelectedButton({ row: currentRow, index: nextIndex });
          setModalOpen(true);
          return;
        }
        nextIndex++;
      }

      // Move to next row
      let nextRowIndex = currentRowIndex + 1;
      while (nextRowIndex < rowKeys.length) {
        const nextRowName = rowKeys[nextRowIndex];
        const nextRowData = keyLayout[nextRowName];

        // Find first enabled key in this row
        for (let i = 0; i < nextRowData.length; i++) {
          if (nextRowData[i].enabled !== false) {
            setSelectedButton({ row: nextRowName, index: i });
            setModalOpen(true);
            return;
          }
        }
        nextRowIndex++;
      }

      // No more keys, close modal
      setSelectedButton(null);
    }, 100); // 100ms delay for visual feedback
  }, [keyLayout]);

  const handleKeyClick = (row, index, keyData) => {
    if (keyData.enabled === false) {
      return;
    }
    setSelectedButton({ row, index });
    setModalOpen(true);
  };

  const resetKeys = () => {
    const defaultLayout = getDefaultLayout();
    setKeyLayout(defaultLayout);
    // Update the current layout in memory
    layoutsRef.current[selectedLayout] = defaultLayout;
  };

  const saveLayout = () => {
    const trimmedName = layoutName.trim();

    if (!trimmedName) {
      return;
    }

    // If saving as "Default", update the default layout
    if (trimmedName === 'Default') {
      layoutsRef.current['Default'] = cloneLayout(keyLayout);
      return;
    }

    // Save a copy of the current layout with the new name
    layoutsRef.current[trimmedName] = cloneLayout(keyLayout);

    // Add to saved layouts list if it's a new name
    if (!savedLayouts.includes(trimmedName)) {
      setSavedLayouts(prev => [...prev, trimmedName]);
    }

    // Switch to the newly saved layout
    setSelectedLayout(trimmedName);
  };

  const handleLayoutNameBlur = () => {
    saveLayout();
  };

  const handleLayoutChange = (newLayoutName) => {
    // Save current layout before switching
    layoutsRef.current[selectedLayout] = cloneLayout(keyLayout);

    // Load the selected layout
    setSelectedLayout(newLayoutName);
    setLayoutName(newLayoutName);

    if (layoutsRef.current[newLayoutName]) {
      setKeyLayout(cloneLayout(layoutsRef.current[newLayoutName]));
    }
  };

  const toggleKeyInGrid = (rowIndex, colIndex) => {
    setKeyGrid(prev => {
      const newGrid = prev.map(row => [...row]);
      newGrid[rowIndex][colIndex] = !newGrid[rowIndex][colIndex];
      return newGrid;
    });
  };

  const saveChanges = () => {
    // Generate new layout from the grid (blank keys, no wide markers)
    const newLayout = generateLayoutFromGrid();
    setKeyLayout(newLayout);
    // Don't save to layoutsRef yet - only when user explicitly saves the layout
    setSettingsOpen(false);
  };

  const isKeyHighlighted = (keyData) => {
    // Map key codes to their layer values (what appears on the keyboard)
    const keyCodeToLayerValues = {
      'KeyA': ['A'], 'KeyB': ['B'], 'KeyC': ['C'], 'KeyD': ['D'], 'KeyE': ['E'],
      'KeyF': ['F'], 'KeyG': ['G'], 'KeyH': ['H'], 'KeyI': ['I'], 'KeyJ': ['J'],
      'KeyK': ['K'], 'KeyL': ['L'], 'KeyM': ['M'], 'KeyN': ['N'], 'KeyO': ['O'],
      'KeyP': ['P'], 'KeyQ': ['Q'], 'KeyR': ['R'], 'KeyS': ['S'], 'KeyT': ['T'],
      'KeyU': ['U'], 'KeyV': ['V'], 'KeyW': ['W'], 'KeyX': ['X'], 'KeyY': ['Y'], 'KeyZ': ['Z'],
      'Digit0': [')', '0'], 'Digit1': ['!', '1'], 'Digit2': ['@', '2'],
      'Digit3': ['#', '3'], 'Digit4': ['$', '4'], 'Digit5': ['%', '5'],
      'Digit6': ['^', '6'], 'Digit7': ['&', '7'], 'Digit8': ['*', '8'], 'Digit9': ['(', '9'],
      'Minus': ['_', '-'], 'Equal': ['+', '='],
      'BracketLeft': ['{', '['], 'BracketRight': ['}', ']'],
      'Backslash': ['|', '\\'], 'Semicolon': [':', ';'],
      'Quote': ['"', "'"], 'Comma': ['<', ','],
      'Period': ['>', '.'], 'Slash': ['?', '/'],
      'Backquote': ['~', '`'],
      'Space': [' '],
      'Enter': ['Return'],
      'Backspace': ['Backspace'],
      'Tab': ['Tab'],
      'ShiftLeft': ['Shift'], 'ShiftRight': ['Shift'],
      'ControlLeft': ['Control'], 'ControlRight': ['Control'],
      'AltLeft': ['Alt'], 'AltRight': ['Alt'],
      'CapsLock': ['Caps Lock'],
      'MetaLeft': ['Win'], 'MetaRight': ['Win'],
    };

    for (const pressedKeyCode of pressedKeys) {
      const possibleValues = keyCodeToLayerValues[pressedKeyCode];
      if (!possibleValues) continue;

      const layers = [keyData.L1, keyData.L2, keyData.L3, keyData.L4];

      for (const layerValue of layers) {
        if (!layerValue) continue;

        // Check if this layer value matches any of the possible values from the pressed key
        for (const possibleValue of possibleValues) {
          if (layerValue === possibleValue) {
            return true;
          }
        }
      }
    }

    return false;
  };

  const renderKey = (keyData, rowName, index) => {
    const isHighlighted = isKeyHighlighted(keyData);
    const l1Value = keyData.L1 || '';
    const l2Value = keyData.L2 || '';
    const l3Value = keyData.L3 || '';
    const l4Value = keyData.L4 || '';
    const isDisabled = keyData.enabled === false;

    // Calculate minimum width based on content
    const allValues = [l1Value, l2Value, l3Value, l4Value];
    const maxLength = Math.max(...allValues.map(v => v.length), 0);

    // Determine width class based on wide markers or content length
    let widthClass = 'w-12';
    if (keyData.medWide) widthClass = 'w-14';
    if (keyData.wide) widthClass = 'w-20';
    if (keyData.extraWide) widthClass = 'w-24';
    if (keyData.xtraWide) widthClass = 'w-28';
    if (keyData.widest) widthClass = 'w-96';

    // Override with content-based width if no wide marker is set
    if (!keyData.medWide && !keyData.wide && !keyData.extraWide && !keyData.xtraWide && !keyData.widest) {
      if (maxLength > 8) widthClass = 'w-32';
      else if (maxLength > 6) widthClass = 'w-24';
      else if (maxLength > 4) widthClass = 'w-20';
      else if (maxLength > 2) widthClass = 'w-16';
      else widthClass = 'w-12';
    }

    return (
      <button
        key={keyData.id}
        onClick={() => handleKeyClick(rowName, index, keyData)}
        disabled={isDisabled}
        className={`${widthClass} h-12 rounded flex flex-col justify-between p-1 text-xs font-bold transition-colors ${isDisabled
          ? 'bg-black border border-gray-900 cursor-not-allowed'
          : `bg-gray-800 text-white hover:bg-gray-700 ${isHighlighted ? 'border-2 border-yellow-400' : 'border border-gray-600'
          }`
          }`}
      >
        {!isDisabled && (
          <>
            <div className="flex justify-between w-full">
              <span>{l1Value}</span>
              <span>{l2Value}</span>
            </div>
            <div className="flex justify-between w-full">
              <span>{l3Value}</span>
              <span>{l4Value}</span>
            </div>
          </>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center">
      {/* Top Controls */}
      <div className="mb-6 flex items-center gap-4">
        <select
          value={selectedLayout}
          onChange={(e) => handleLayoutChange(e.target.value)}
          className="px-6 py-3 bg-[#0a0a0a] text-white text-2xl font-semibold rounded-lg border-none outline-none"
        >
          {savedLayouts.map(layout => (
            <option key={layout} value={layout}>{layout}</option>
          ))}
        </select>
      </div>

      {/* Keyboard Layout */}
      <div className="flex gap-4">
        {/* Layer Controls */}
        <div className="flex flex-col gap-2">
          <button
            onClick={resetKeys}
            className="w-12 h-12 border border-gray-600 bg-gray-800 text-white rounded hover:bg-gray-700 font-bold"
          >
            R
          </button>
          {['L1', 'L2', 'L3', 'L4'].map(layer => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`w-12 h-12 border border-gray-600 rounded font-bold ${activeLayer === layer
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
            >
              {layer}
            </button>
          ))}
        </div>

        {/* Keyboard Keys */}
        <div className="flex flex-col gap-2">
          {Object.keys(keyLayout).map((rowName) => (
            <div key={rowName} className="flex gap-1">
              {keyLayout[rowName].map((key, i) => renderKey(key, rowName, i))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value)}
            onBlur={handleLayoutNameBlur}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            placeholder="Layout Name"
          />
          <button
            onClick={saveLayout}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all hover:bg-gray-700"
          >
            Save Layout
          </button>
          <label className="flex items-center gap-2 text-white cursor-pointer">
            <input
              type="checkbox"
              checked={speedAssign}
              onChange={(e) => setSpeedAssign(e.target.checked)}
              className="w-5 h-5 cursor-pointer"
            />
            <span className="font-semibold">Speed Assign</span>
          </label>
        </div>

        {/* Change Rows & Columns Button */}
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="px-6 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all hover:bg-gray-700"
        >
          Change Rows & Columns
        </button>

        {/* Settings Panel */}
        {settingsOpen && (
          <div className="flex flex-col items-center gap-4 p-6 border border-gray-700 bg-gray-800 rounded-lg">
            {/* Row and Column Inputs */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-white font-semibold">R</label>
                <input
                  type="number"
                  value={rows}
                  onChange={(e) => {
                    const newRows = parseInt(e.target.value) || 1;
                    setRows(newRows);
                    setKeyGrid(prev => {
                      const newGrid = Array(newRows).fill(null).map((_, i) =>
                        prev[i] ? [...prev[i]] : Array(columns).fill(true)
                      );
                      return newGrid;
                    });
                  }}
                  className="w-16 px-2 py-1 border border-gray-700 bg-gray-800 text-white rounded-lg text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  min="1"
                />
              </div>
              <span className="text-white">×</span>
              <div className="flex items-center gap-2">
                <label className="text-white font-semibold">C</label>
                <input
                  type="number"
                  value={columns}
                  onChange={(e) => {
                    const newCols = parseInt(e.target.value) || 1;
                    setColumns(newCols);
                    setKeyGrid(prev => prev.map(row => {
                      const newRow = Array(newCols).fill(true);
                      for (let i = 0; i < Math.min(row.length, newCols); i++) {
                        newRow[i] = row[i];
                      }
                      return newRow;
                    }));
                  }}
                  className="w-16 px-2 py-1 border border-gray-700 bg-gray-800 text-white rounded-lg text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  min="1"
                />
              </div>
            </div>

            {/* Grid of Squares */}
            <div className="p-4 border border-gray-700 rounded-lg bg-gray-900">
              <div className="flex flex-col gap-1">
                {keyGrid.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-1">
                    {row.map((isActive, colIndex) => (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => toggleKeyInGrid(rowIndex, colIndex)}
                        className={`w-8 h-8 rounded border transition-colors ${isActive
                          ? 'bg-gray-800 border-gray-600'
                          : 'bg-black border-gray-900'
                          }`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Save Changes Button */}
            <button
              onClick={saveChanges}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all hover:bg-gray-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && selectedButton && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Assigning: {keyLayout[selectedButton.row][selectedButton.index][activeLayer] || '(empty)'} ({activeLayer})
            </p>
            <p className="text-sm text-gray-600">
              Press key to change, Right click to exit...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyboardLayout;