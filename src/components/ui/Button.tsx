import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ children, variant = 'primary', fullWidth = false, className = '', type = 'button', ...props }: ButtonProps) {
  const widthClass = fullWidth ? 'btn-full-width' : '';
  return (
    <button type={type} className={`btn btn-${variant} ${widthClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export default Button;
export { Button };
