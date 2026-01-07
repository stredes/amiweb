import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ children, variant = 'primary', fullWidth = false, className = '', ...props }: ButtonProps) {
  const widthClass = fullWidth ? 'btn-full-width' : '';
  return (
    <button className={`btn btn-${variant} ${widthClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export default Button;
export { Button };
