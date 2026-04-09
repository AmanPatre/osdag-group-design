import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  warning?: string;
  isValid?: boolean;
  helperText?: string;
}

export default function InputField({ label, id, error, warning, isValid, helperText, className = '', ...rest }: Props) {
  let cls = '';
  if (error)        cls = 'input-error';
  else if (warning) cls = 'input-warning';
  else if (isValid) cls = 'input-valid';

  return (
    <div className={`field-row ${className}`}>
      <label htmlFor={id}>{label}</label>
      <div className="input-with-feedback">
        <input id={id} className={cls} {...rest} />
        {error ? (
          <span className="field-error">{error}</span>
        ) : warning ? (
          <span className="field-warning">{warning}</span>
        ) : helperText ? (
          <span className="field-helper">{helperText}</span>
        ) : null}
      </div>
    </div>
  );
}
