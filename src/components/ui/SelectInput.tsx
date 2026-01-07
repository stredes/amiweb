import { SelectHTMLAttributes } from 'react';

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
  return (
    <div className={`form-control ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      <select id={id} {...props}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

export default SelectInput;
