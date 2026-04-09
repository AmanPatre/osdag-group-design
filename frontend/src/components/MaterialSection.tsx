import type { MaterialInputs, SteelGrade, ConcreteGrade } from '../types';
import SelectField from './ui/SelectField';
interface Props {
  value: MaterialInputs;
  onChange: (val: MaterialInputs) => void;
  disabled: boolean;
}

const steelGrades: SteelGrade[]    = ['E250', 'E350', 'E450'];
const concreteGrades: ConcreteGrade[] = ['M25', 'M30', 'M35', 'M40', 'M45', 'M50', 'M55', 'M60'];

export default function MaterialSection({ value, onChange, disabled }: Props) {
  function set(field: keyof MaterialInputs, val: string) {
    onChange({ ...value, [field]: val as SteelGrade & ConcreteGrade });
  }

  return (
    <div className={`form-section ${disabled ? 'section-disabled' : ''}`}>
      <h3 className="section-title">Material Inputs</h3>

      <SelectField id="girder-steel" label="Girder Steel" disabled={disabled}
        value={value.girderSteel} onChange={e => set('girderSteel', e.target.value)}>
        {steelGrades.map(g => <option key={g} value={g}>{g}</option>)}
      </SelectField>

      <SelectField id="bracing-steel" label="Cross Bracing Steel" disabled={disabled}
        value={value.crossBracingSteel} onChange={e => set('crossBracingSteel', e.target.value)}>
        {steelGrades.map(g => <option key={g} value={g}>{g}</option>)}
      </SelectField>

      <SelectField id="deck-concrete" label="Deck Concrete" disabled={disabled}
        value={value.deckConcrete} onChange={e => set('deckConcrete', e.target.value)}>
        {concreteGrades.map(g => <option key={g} value={g}>{g}</option>)}
      </SelectField>
    </div>
  );
}
