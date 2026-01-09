import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import './SearchBar.css';

interface SearchSuggestion {
  id: string;
  label: string;
  category?: string;
  icon?: React.ReactNode;
}

interface SearchBarProps {
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  onSearch: (query: string) => void;
  onSuggestionClick?: (suggestion: SearchSuggestion) => void;
  debounceMs?: number;
  minChars?: number;
  showClearButton?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({
  placeholder = 'Buscar...',
  suggestions = [],
  onSearch,
  onSuggestionClick,
  debounceMs = 300,
  minChars = 2,
  showClearButton = true,
  autoFocus = false,
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value.length >= minChars) {
      debounceTimer.current = setTimeout(() => {
        onSearch(value);
        setShowSuggestions(true);
      }, debounceMs);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else {
        onSearch(query);
        setShowSuggestions(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.label);
    setShowSuggestions(false);
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    } else {
      onSearch(suggestion.label);
    }
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} className="search-bar__highlight">{part}</mark>
        : part
    );
  };

  return (
    <div ref={wrapperRef} className={`search-bar ${className}`}>
      <form onSubmit={handleSubmit} className="search-bar__form">
        <FiSearch className="search-bar__icon" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= minChars && setShowSuggestions(true)}
          placeholder={placeholder}
          className="search-bar__input"
          autoFocus={autoFocus}
        />
        {showClearButton && query && (
          <button
            type="button"
            onClick={handleClear}
            className="search-bar__clear"
            aria-label="Clear search"
          >
            <FiX />
          </button>
        )}
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-bar__suggestions">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              type="button"
              className={`search-bar__suggestion ${
                index === selectedIndex ? 'search-bar__suggestion--selected' : ''
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {suggestion.icon && (
                <span className="search-bar__suggestion-icon">{suggestion.icon}</span>
              )}
              <div className="search-bar__suggestion-content">
                <div className="search-bar__suggestion-label">
                  {highlightMatch(suggestion.label, query)}
                </div>
                {suggestion.category && (
                  <div className="search-bar__suggestion-category">
                    {suggestion.category}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
