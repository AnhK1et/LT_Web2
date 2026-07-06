import { forwardRef, type InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, ...props }, ref) => {
    return (
      <label className={`inline-flex items-center cursor-pointer ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          className="w-5 h-5 rounded border-accent-300 text-primary focus:ring-primary cursor-pointer"
          {...props}
        />
        {label && <span className="ml-2 text-sm text-accent-700">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
