import { useState } from 'react';
import StructureSection from './components/StructureSection';
import LocationSection from './components/LocationSection';
import GeometrySection from './components/GeometrySection';
import MaterialSection from './components/MaterialSection';
import type { AppState } from './types';
import type { DesignResponse } from './api';
import { submitDesign } from './api';
import './styles/app.css';

const BRIDGE_IMG = '/bridge.png';

const defaultState: AppState = {
  structureType: 'highway',
  location: { mode: null, state: '', district: '', resolved: null },
  geometry: { span: '', carriagewayWidth: '', footpath: 'None', skewAngle: '' },
  additionalGeometry: { girderSpacing: '', numGirders: '', deckOverhang: '' },
  materials: { girderSteel: 'E250', crossBracingSteel: 'E250', deckConcrete: 'M30' },
};

type TabId = 'basic' | 'additional';

function buildPayload(s: AppState): Record<string, unknown> {
  return {
    structure_type: s.structureType,
    location: {
      state: s.location.state,
      district: s.location.district,
      wind_speed: s.location.resolved?.windSpeed,
      seismic_zone: s.location.resolved?.seismicZone,
      seismic_factor: s.location.resolved?.seismicFactor,
      max_temp: s.location.resolved?.maxTemp,
      min_temp: s.location.resolved?.minTemp,
    },
    span: parseFloat(s.geometry.span) || null,
    carriageway_width: parseFloat(s.geometry.carriagewayWidth) || null,
    footpath: s.geometry.footpath,
    skew_angle: parseFloat(s.geometry.skewAngle) || 0,
    girder_spacing: parseFloat(s.additionalGeometry.girderSpacing) || null,
    num_girders: parseInt(s.additionalGeometry.numGirders, 10) || null,
    deck_overhang: parseFloat(s.additionalGeometry.deckOverhang) || null,
    girder_steel: s.materials.girderSteel,
    cross_bracing_steel: s.materials.crossBracingSteel,
    deck_concrete: s.materials.deckConcrete,
  };
}

export default function App() {
  const [state, setState] = useState<AppState>(defaultState);
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const [designing, setDesigning] = useState(false);
  const [result, setResult] = useState<DesignResponse | null>(null);
  const [submitError, setSubmitError] = useState('');

  const isOther = state.structureType === 'other';

  async function handleDesign() {
    const span = parseFloat(state.geometry.span);
    const cw = parseFloat(state.geometry.carriagewayWidth);

    if (isNaN(span) || isNaN(cw)) {
      setSubmitError('Please enter Span and Carriageway Width before running Design.');
      return;
    }
    if (span < 20 || span > 45) {
      setSubmitError('Span must be between 20 m and 45 m.');
      return;
    }
    if (cw < 4.25 || cw >= 24) {
      setSubmitError('Carriageway width must be ≥ 4.25 m and < 24 m.');
      return;
    }

    setDesigning(true);
    setResult(null);
    setSubmitError('');
    try {
      const res = await submitDesign(buildPayload(state));
      if (res.errors) {
        const firstErr = Object.values(res.errors).flat().join(' ');
        setSubmitError(`Validation error: ${firstErr}`);
      } else {
        setResult(res);
      }
    } catch {
      setSubmitError('Could not reach the server. Make sure the backend is running on port 8000.');
    } finally {
      setDesigning(false);
    }
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-brand">
          <span className="header-title">Group Design</span>
          <span className="header-subtitle">Steel Bridge — Composite Girder</span>
        </div>
        <div className="header-meta">
          <span>FOSSEE Osdag</span>
          <span className="sep">·</span>
          <span>IRC 24:2010</span>
        </div>
      </header>

      <main className="app-main">
        <section className="left-panel">
          <div className="tab-bar">
            <button
              id="tab-basic"
              className={`tab-btn ${activeTab === 'basic' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              Basic Inputs
            </button>
            <button
              id="tab-additional"
              className={`tab-btn ${activeTab === 'additional' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('additional')}
            >
              Additional Inputs
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'basic' && (
              <div className="basic-inputs">
                <StructureSection
                  value={state.structureType}
                  onChange={val => setState(s => ({ ...s, structureType: val }))}
                />
                <LocationSection
                  value={state.location}
                  onChange={val => setState(s => ({ ...s, location: val }))}
                  disabled={isOther}
                />
                <GeometrySection
                  value={state.geometry}
                  additionalGeom={state.additionalGeometry}
                  onChange={val => setState(s => ({ ...s, geometry: val }))}
                  onAdditionalGeomChange={val => setState(s => ({ ...s, additionalGeometry: val }))}
                  disabled={isOther}
                />
                <MaterialSection
                  value={state.materials}
                  onChange={val => setState(s => ({ ...s, materials: val }))}
                  disabled={isOther}
                />

                <div className="form-actions">
                  <button
                    id="btn-design"
                    className="btn btn-primary btn-large"
                    disabled={isOther || designing}
                    onClick={handleDesign}
                  >
                    {designing ? 'Running…' : 'Design'}
                  </button>
                  <button
                    id="btn-reset"
                    className="btn btn-ghost"
                    disabled={designing}
                    onClick={() => { setState(defaultState); setResult(null); setSubmitError(''); }}
                  >
                    Reset
                  </button>
                  {submitError && <span className="submit-error">{submitError}</span>}
                </div>
              </div>
            )}

            {activeTab === 'additional' && (
              <div className="additional-placeholder">
                <p>Additional inputs will appear here in a future release.</p>
              </div>
            )}
          </div>
        </section>

        <section className="right-panel">
          {result ? (
            <ResultsPanel result={result} onClose={() => setResult(null)} />
          ) : (
            <div className="diagram-container">
              <p className="diagram-label">Bridge Cross-Section</p>
              <img
                src={BRIDGE_IMG}
                alt="Steel composite bridge cross-section diagram"
                className="bridge-diagram"
                onError={e => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://placehold.co/800x560/e8ecf0/374151?text=Bridge+Cross-Section';
                }}
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

interface ResultsPanelProps {
  result: DesignResponse;
  onClose: () => void;
}

function ResultsPanel({ result, onClose }: ResultsPanelProps) {
  const inp = result.inputs as Record<string, unknown>;

  return (
    <div className="results-panel">
      <div className="results-header">
        <span className={`results-badge ${result.ok ? 'badge-ok' : 'badge-err'}`}>
          {result.ok ? '✓ Valid' : '✗ Invalid'}
        </span>
        <span className="results-title">Design Summary</span>
        <button className="btn btn-ghost results-close" onClick={onClose}>← Back</button>
      </div>

      <div className="results-body">
        <p className="results-message">{result.message}</p>

        {result.warnings.length > 0 && (
          <div className="results-warnings">
            <p className="results-block-title">Warnings</p>
            {result.warnings.map((w, i) => (
              <p key={i} className="results-warning-item">⚠ {w}</p>
            ))}
          </div>
        )}

        <div className="results-block">
          <p className="results-block-title">Geometry</p>
          <ResultRow label="Span" value={`${inp.span_m} m`} />
          <ResultRow label="Carriageway Width" value={`${inp.carriageway_width_m} m`} />
          <ResultRow label="Overall Bridge Width" value={`${inp.overall_bridge_width_m} m`} />
          <ResultRow label="Footpath" value={String(inp.footpath)} />
          <ResultRow label="Skew Angle" value={`${inp.skew_angle_deg}°`} />
          {inp.girder_spacing_m && <ResultRow label="Girder Spacing" value={`${inp.girder_spacing_m} m`} />}
          {inp.num_girders && <ResultRow label="No. of Girders" value={String(inp.num_girders)} />}
          {inp.deck_overhang_m != null &&
            <ResultRow label="Deck Overhang" value={`${inp.deck_overhang_m} m`} />}
        </div>

        <div className="results-block">
          <p className="results-block-title">Materials</p>
          <ResultRow label="Girder Steel" value={String(inp.girder_steel)} />
          <ResultRow label="Cross Bracing Steel" value={String(inp.cross_bracing_steel)} />
          <ResultRow label="Deck Concrete" value={String(inp.deck_concrete)} />
        </div>

        {result.results === null && (
          <p className="results-engine-note">
            Design engine output will appear here once the Osdag calculation module is connected.
          </p>
        )}
      </div>
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="result-row">
      <span className="result-label">{label}</span>
      <span className="result-value">{value}</span>
    </div>
  );
}
