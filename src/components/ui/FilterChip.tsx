import { FiX } from 'react-icons/fi';
import './FilterChip.css';

interface FilterChipProps {
  label: string;
  value: string;
  onRemove: (value: string) => void;
  icon?: React.ReactNode;
}

export function FilterChip({ label, value, onRemove, icon }: FilterChipProps) {
  return (
    <div className="filter-chip">
      {icon && <span className="filter-chip__icon">{icon}</span>}
      <span className="filter-chip__label">{label}</span>
      <button
        className="filter-chip__remove"
        onClick={() => onRemove(value)}
        aria-label={`Remove ${label} filter`}
      >
        <FiX />
      </button>
    </div>
  );
}

interface FilterChipsProps {
  filters: Array<{ label: string; value: string; icon?: React.ReactNode }>;
  onRemove: (value: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function FilterChips({
  filters,
  onRemove,
  onClearAll,
  className = '',
}: FilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className={`filter-chips ${className}`}>
      <div className="filter-chips__list">
        {filters.map((filter) => (
          <FilterChip
            key={filter.value}
            label={filter.label}
            value={filter.value}
            onRemove={onRemove}
            icon={filter.icon}
          />
        ))}
      </div>
      {onClearAll && filters.length > 1 && (
        <button className="filter-chips__clear" onClick={onClearAll}>
          Limpiar todos
        </button>
      )}
    </div>
  );
}
