import { SelectHTMLAttributes, useId } from 'react';

type Option = {
  value: string;
  label: string;
};

type SelectInputProps = {
  label: string;
  options: Option[];
  placeholder?: string;
  error?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

function SelectInput({
  label,
  options,
  id,
  placeholder = 'Seleccione una opción',
  error,
  className = '',
  ...props
}: SelectInputProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const errorId = error ? `${selectId}-error` : undefined;
  return (
    <div className={`form-control ${className}`.trim()}>
      <label htmlFor={selectId}>{label}</label>
      <select
        id={selectId}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default SelectInput;
