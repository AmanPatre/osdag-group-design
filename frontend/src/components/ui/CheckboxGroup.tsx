import type { ReactNode } from 'react';

export interface CheckboxOption {
  value: string;
  label: string | ReactNode;
}

interface Props {
  name: string;
  options: CheckboxOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
}

export default function CheckboxGroup({ name, options, value, onChange, disabled }: Props) {
  return (
    <div className="checkbox-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {options.map(opt => (
        <label key={opt.value} className={`radio-label ${disabled ? 'disabled' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(value === opt.value ? null : opt.value)}
            disabled={disabled}
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
