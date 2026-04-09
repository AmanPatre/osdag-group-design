import { useState, useEffect } from 'react';
import type { LocationState, LocationData } from '../types';
import { stateDistricts as staticDistricts, states as staticStates, getDistrictData } from '../data/locationData';
import { fetchLocations, fetchLocationData } from '../api';
import CustomParamsModal from './CustomParamsModal';
import CheckboxGroup from './ui/CheckboxGroup';
import SelectField from './ui/SelectField';
import '../styles/LocationSection.css';

interface Props {
  value: LocationState;
  onChange: (val: LocationState) => void;
  disabled: boolean;
}

export default function LocationSection({ value, onChange, disabled }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [apiStates, setApiStates] = useState<Record<string, string[]> | null>(null);
  const [stateListErr, setStateListErr] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [locErr, setLocErr] = useState('');

  useEffect(() => {
    fetchLocations()
      .then(res => setApiStates(res.states))
      .catch(() => setStateListErr(true));
  }, []);

  const stateMap = apiStates ?? staticDistricts;
  const stateNames = apiStates ? Object.keys(apiStates).sort() : staticStates;

  useEffect(() => {
    if (value.mode !== 'name' || !value.state || !value.district) return;

    let cancelled = false;
    setLocLoading(true);
    setLocErr('');

    fetchLocationData(value.state, value.district)
      .then(data => {
        if (cancelled) return;
        const resolved: LocationData = {
          windSpeed: data.wind_speed,
          seismicZone: data.seismic_zone,
          seismicFactor: data.seismic_factor,
          maxTemp: data.max_temp,
          minTemp: data.min_temp,
        };
        onChange({ ...value, resolved });
      })
      .catch(() => {
        if (cancelled) return;
        const fb = getDistrictData(value.district);
        if (fb) {
          onChange({ ...value, resolved: fb });
        } else {
          setLocErr('No data available for this district.');
        }
      })
      .finally(() => { if (!cancelled) setLocLoading(false); });

    return () => { cancelled = true; };

  }, [value.district, value.mode]);

  function setMode(mode: 'name' | 'custom' | null) {
    if (value.mode === mode) return;
    onChange({ mode, state: '', district: '', resolved: null });
    setLocErr('');
  }

  function setState_(s: string) {
    onChange({ ...value, state: s, district: '', resolved: null });
    setLocErr('');
  }

  function setDistrict(d: string) {
    onChange({ ...value, district: d, resolved: null });
    setLocErr('');
  }

  const districts = value.state ? (stateMap[value.state] ?? []) : [];
  const loc = value.resolved;

  return (
    <div className={`form-section ${disabled ? 'section-disabled' : ''}`}>
      <h3 className="section-title">Project Location</h3>

      <CheckboxGroup
        name="location-mode"
        disabled={disabled}
        value={value.mode}
        onChange={v => setMode(v as 'name' | 'custom' | null)}
        options={[
          { value: 'name', label: 'Enter Location Name' },
          { value: 'custom', label: 'Tabulate Custom Loading Parameters' },
        ]}
      />

      {value.mode === 'name' && (
        <div className="location-dropdowns" style={{ marginTop: '16px' }}>
          <SelectField
            id="state"
            label="State"
            disabled={disabled}
            value={value.state}
            onChange={e => setState_(e.target.value)}
          >
            <option value="">— Select State —</option>
            {stateNames.map(s => <option key={s} value={s}>{s}</option>)}
          </SelectField>

          <SelectField
            id="district"
            label="District"
            disabled={disabled || !value.state}
            value={value.district}
            onChange={e => setDistrict(e.target.value)}
          >
            <option value="">— Select District —</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </SelectField>

          {locLoading && <p className="location-loading">Fetching IS code data…</p>}
          {locErr && <p className="field-error">{locErr}</p>}
          {stateListErr && (
            <p className="field-error" style={{ marginTop: 4 }}>
              Could not load state list from server — using built-in data.
            </p>
          )}
        </div>
      )}

      {value.mode === 'custom' && (
        <div style={{ marginTop: '16px' }}>
          <button className="btn btn-secondary" disabled={disabled} onClick={() => setShowModal(true)}>
            Open Parameters
          </button>
        </div>
      )}

      {loc && (
        <div className="location-resolved">
          <div className="resolved-row">
            <span>Basic Wind Speed (m/s)</span>
            <span className="resolved-value">{loc.windSpeed} m/s</span>
          </div>
          <div className="resolved-row">
            <span>Seismic Zone</span>
            <span className="resolved-value">{loc.seismicZone}</span>
          </div>
          <div className="resolved-row">
            <span>Seismic Zone Factor (Z)</span>
            <span className="resolved-value">{loc.seismicFactor}</span>
          </div>
          <div className="resolved-row">
            <span>Max Shade Air Temperature</span>
            <span className="resolved-value">{loc.maxTemp}°C</span>
          </div>
          <div className="resolved-row">
            <span>Min Shade Air Temperature</span>
            <span className="resolved-value">{loc.minTemp}°C</span>
          </div>
        </div>
      )}

      {showModal && (
        <CustomParamsModal
          onConfirm={data => { onChange({ ...value, resolved: data }); setShowModal(false); }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
