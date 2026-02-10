import { InputHTMLAttributes, useId } from 'react';

type TextInputProps = {
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

function TextInput({ label, id, error, className = '', ...props }: TextInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <div className={`form-control ${className}`.trim()}>
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        {...props}
      />
      {error && (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default TextInput;
