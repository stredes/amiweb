import { useTheme } from '../../contexts/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import './ThemeToggle.css';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="theme-toggle__track">
        <div className="theme-toggle__thumb">
          {theme === 'light' ? (
            <FiSun className="theme-toggle__icon" />
          ) : (
            <FiMoon className="theme-toggle__icon" />
          )}
        </div>
      </div>
    </button>
  );
}
