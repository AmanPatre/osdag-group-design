import type { ReactNode } from 'react';

export interface RadioOption {
  value: string;
  label: string | ReactNode;
}

interface Props {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function RadioGroup({ name, options, value, onChange, disabled }: Props) {
  return (
    <div className="radio-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {options.map(opt => (
        <label key={opt.value} className={`radio-label ${disabled ? 'disabled' : ''}`}>
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
