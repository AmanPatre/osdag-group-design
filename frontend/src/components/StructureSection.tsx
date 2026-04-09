import type { StructureType } from '../types';
import RadioGroup from './ui/RadioGroup';
import '../styles/StructureSection.css';

interface Props {
  value: StructureType;
  onChange: (val: StructureType) => void;
}

export default function StructureSection({ value, onChange }: Props) {
  return (
    <div className="form-section">
      <h3 className="section-title">Type of Structure</h3>
      <RadioGroup
        name="structureType"
        value={value}
        onChange={(val) => onChange(val as StructureType)}
        options={[
          { value: 'highway', label: 'Highway' },
          { value: 'other', label: 'Other' }
        ]}
      />
      {value === 'other' && (
        <p className="other-notice">Other structures not included.</p>
      )}
    </div>
  );
}
