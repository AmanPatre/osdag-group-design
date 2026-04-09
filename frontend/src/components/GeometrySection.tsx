import { useState, useEffect, useRef } from 'react';
import type { GeometryInputs, AdditionalGeometry, FootpathOption } from '../types';
import { validateGeometry } from '../api';
import AdditionalGeomModal from './AdditionalGeomModal';
import InputField from './ui/InputField';
import SelectField from './ui/SelectField';
import '../styles/GeometrySection.css';

interface Props {
  value: GeometryInputs;
  additionalGeom: AdditionalGeometry;
  onChange: (val: GeometryInputs) => void;
  onAdditionalGeomChange: (val: AdditionalGeometry) => void;
  disabled: boolean;
}

const footpathOpts: FootpathOption[] = ['None', 'Single-sided', 'Both'];

export default function GeometrySection({
  value, additionalGeom, onChange, onAdditionalGeomChange, disabled
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function setField(field: keyof GeometryInputs, val: string) {
    onChange({ ...value, [field]: val });
  }

  useEffect(() => {
    if (disabled) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const span = parseFloat(value.span);
    const cw = parseFloat(value.carriagewayWidth);
    const skew = parseFloat(value.skewAngle);

    if (isNaN(span) || isNaN(cw) || isNaN(skew)) {
      setServerErrors([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const r = await validateGeometry(span, cw, skew);
        setServerErrors(r.errors);
      } catch {
        setServerErrors([]);
      }
    }, 600);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.span, value.carriagewayWidth, value.skewAngle, disabled]);

  const span = parseFloat(value.span);
  const cw = parseFloat(value.carriagewayWidth);
  const skew = parseFloat(value.skewAngle);

  const spanErr = value.span !== '' && !isNaN(span) && (span < 20 || span > 45)
    ? 'Outside the software range.' : '';
  const cwErr = value.carriagewayWidth !== '' && !isNaN(cw) && (cw < 4.25 || cw >= 24)
    ? 'Must be ≥ 4.25 m and < 24 m.' : '';
  const skewWarn = value.skewAngle !== '' && !isNaN(skew) && (skew < -15 || skew > 15)
    ? 'IRC 24 (2010) requires detailed analysis.' : '';

  const extraErrs = serverErrors.filter(m => !spanErr && !cwErr && !skewWarn && m.length > 0);

  const geomSummary = additionalGeom.girderSpacing
    ? `Girder Spacing: ${additionalGeom.girderSpacing} m | Girders: ${additionalGeom.numGirders} | Overhang: ${additionalGeom.deckOverhang} m`
    : null;

  return (
    <div className={`form-section ${disabled ? 'section-disabled' : ''}`}>
      <h3 className="section-title">Geometric Details</h3>

      <InputField
        id="span"
        label="Span (m)"
        type="number"
        step="0.5"
        disabled={disabled}
        value={value.span}
        onChange={e => setField('span', e.target.value)}
        placeholder="e.g. 30"
        error={spanErr}
        isValid={value.span !== '' && !spanErr}
        helperText="≥ 20 m, ≤ 45 m"
      />

      <InputField
        id="cw-width"
        label="Carriageway Width (m)"
        type="number"
        step="0.25"
        disabled={disabled}
        value={value.carriagewayWidth}
        onChange={e => setField('carriagewayWidth', e.target.value)}
        placeholder="e.g. 7.5"
        error={cwErr}
        isValid={value.carriagewayWidth !== '' && !cwErr}
        helperText="≥ 4.25 m, < 24 m"
      />

      <SelectField
        id="footpath"
        label="Footpath"
        disabled={disabled}
        value={value.footpath}
        onChange={e => setField('footpath', e.target.value as FootpathOption)}
      >
        {footpathOpts.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </SelectField>

      <InputField
        id="skew-angle"
        label="Skew Angle (°)"
        type="number"
        step="1"
        disabled={disabled}
        value={value.skewAngle}
        onChange={e => setField('skewAngle', e.target.value)}
        placeholder="e.g. 0"
        warning={skewWarn}
        isValid={value.skewAngle !== '' && !skewWarn}
        helperText="Preferably within -15° to +15°"
      />

      {extraErrs.length > 0 && (
        <div className="server-errors">
          {extraErrs.map((e, i) => <p key={i} className="field-error">{e}</p>)}
        </div>
      )}

      <div className="geom-action-row">
        <button
          className="btn btn-primary"
          style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
          disabled={disabled}
          onClick={() => setShowModal(true)}
        >
          Modify Additional Geometry
        </button>
        {geomSummary && <span className="geom-summary">{geomSummary}</span>}
      </div>

      {showModal && (
        <AdditionalGeomModal
          carriagewayWidth={value.carriagewayWidth}
          value={additionalGeom}
          onConfirm={val => { onAdditionalGeomChange(val); setShowModal(false); }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
