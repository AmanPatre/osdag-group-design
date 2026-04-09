import { useState } from 'react';
import type { LocationData } from '../types';
import '../styles/Modal.css';

interface Props {
  onConfirm: (data: LocationData) => void;
  onClose: () => void;
}

const empty = { windSpeed: '', seismicZone: '', seismicFactor: '', maxTemp: '', minTemp: '' };

export default function CustomParamsModal({ onConfirm, onClose }: Props) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<string[]>([]);

  function set(field: keyof typeof empty, val: string) {
    setForm(prev => ({ ...prev, [field]: val }));
    setErrors([]);
  }

  function handleConfirm() {
    const errs: string[] = [];
    const ws  = parseFloat(form.windSpeed);
    const sf  = parseFloat(form.seismicFactor);
    const tmax = parseFloat(form.maxTemp);
    const tmin = parseFloat(form.minTemp);

    if (isNaN(ws) || ws <= 0)   errs.push('Basic Wind Speed must be a positive number.');
    if (!form.seismicZone.trim()) errs.push('Seismic Zone is required.');
    if (isNaN(sf) || sf <= 0)   errs.push('Seismic Zone Factor must be a positive number.');
    if (isNaN(tmax))             errs.push('Max Temperature must be a number.');
    if (isNaN(tmin))             errs.push('Min Temperature must be a number.');
    if (!isNaN(tmax) && !isNaN(tmin) && tmin >= tmax)
      errs.push('Min temperature must be less than Max temperature.');

    if (errs.length) { setErrors(errs); return; }

    onConfirm({ windSpeed: ws, seismicZone: form.seismicZone.trim(), seismicFactor: sf, maxTemp: tmax, minTemp: tmin });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h4>Custom Loading Parameters</h4>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p className="modal-hint">Enter site-specific values per IS codes.</p>

          <table className="params-table">
            <thead>
              <tr><th>Parameter</th><th>Value</th><th>Unit</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Basic Wind Speed</td>
                <td><input type="number" value={form.windSpeed} onChange={e => set('windSpeed', e.target.value)} placeholder="e.g. 44" /></td>
                <td>m/s</td>
              </tr>
              <tr>
                <td>Seismic Zone</td>
                <td><input type="text" value={form.seismicZone} onChange={e => set('seismicZone', e.target.value)} placeholder="e.g. Zone III" /></td>
                <td>—</td>
              </tr>
              <tr>
                <td>Seismic Zone Factor (Z)</td>
                <td><input type="number" step="0.01" value={form.seismicFactor} onChange={e => set('seismicFactor', e.target.value)} placeholder="e.g. 0.16" /></td>
                <td>—</td>
              </tr>
              <tr>
                <td>Max Shade Air Temp</td>
                <td><input type="number" value={form.maxTemp} onChange={e => set('maxTemp', e.target.value)} placeholder="e.g. 45" /></td>
                <td>°C</td>
              </tr>
              <tr>
                <td>Min Shade Air Temp</td>
                <td><input type="number" value={form.minTemp} onChange={e => set('minTemp', e.target.value)} placeholder="e.g. 10" /></td>
                <td>°C</td>
              </tr>
            </tbody>
          </table>

          {errors.length > 0 && (
            <div className="modal-errors">
              {errors.map((e, i) => <p key={i}>{e}</p>)}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
