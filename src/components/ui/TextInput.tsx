import { InputHTMLAttributes } from 'react';

type TextInputProps = {
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

function TextInput({ label, id, error, className = '', ...props }: TextInputProps) {
  return (
    <div className={`form-control ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

export default TextInput;
