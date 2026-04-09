import type { SelectHTMLAttributes, ReactNode } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  helperText?: string;
  children: ReactNode;
}

export default function SelectField({ label, id, error, helperText, className = '', children, ...rest }: Props) {
  return (
    <div className={`field-row ${className}`}>
      <label htmlFor={id}>{label}</label>
      <div className="input-with-feedback">
        <select id={id} className={error ? 'input-error' : ''} {...rest}>
          {children}
        </select>
        {error ? (
          <span className="field-error">{error}</span>
        ) : helperText ? (
          <span className="field-helper">{helperText}</span>
        ) : null}
      </div>
    </div>
  );
}
