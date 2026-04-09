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
        const flatten = (errs: any): string[] => {
          if (typeof errs === 'string') return [errs];
          if (Array.isArray(errs)) return errs.flatMap(flatten);
          if (typeof errs === 'object' && errs !== null) {
            return Object.values(errs).flatMap(flatten);
          }
          return [];
        };
        const errorMsg = flatten(res.errors).join(' ');
        setSubmitError(`Validation error: ${errorMsg}`);
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
        <div className="header-meta">
          <span>FOSSEE Osdag</span>
        </div>
        <div className="header-brand">
          <span className="header-title">Group Design</span>
          <span className="header-subtitle">Steel Bridge — Composite Girder</span>
        </div>
        <div className="header-meta">
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
          <DynamicSummaryPanel state={state} />
        </section>
      </main>
    </div>
  );
}

interface DynamicSummaryProps {
  state: AppState;
}

function DynamicSummaryPanel({ state }: DynamicSummaryProps) {
  const cw = parseFloat(state.geometry.carriagewayWidth);
  const bw = !isNaN(cw) ? cw + 5.0 : null;

  const fmt = (val: string | number | null | undefined, suffix = '') => {
    if (val === null || val === undefined || val === '') return '-';
    if (typeof val === 'number' && isNaN(val)) return '-';
    return `${val}${suffix}`;
  };

  return (
    <div className="form-section" style={{ width: 'calc(100% - 40px)', maxWidth: '800px', margin: '20px auto' }}>
      <div className="section-title">Design Summary</div>
        <div className="results-blocks-row">
          <div className="results-block">
            <ResultRow label="Structure Type" value={fmt(state.structureType)} />
            <ResultRow label="Span" value={fmt(state.geometry.span, ' m')} />
            <ResultRow label="Carriageway Width" value={fmt(state.geometry.carriagewayWidth, ' m')} />
            <ResultRow label="Overall Bridge Width" value={fmt(bw, ' m')} />
            <ResultRow label="Footpath" value={fmt(state.geometry.footpath)} />
            <ResultRow label="Skew Angle" value={fmt(state.geometry.skewAngle, '°')} />
          </div>
          <div className="results-block">
            <ResultRow label="Girder Spacing" value={fmt(state.additionalGeometry.girderSpacing, ' m')} />
            <ResultRow label="No. of Girders" value={fmt(state.additionalGeometry.numGirders)} />
            <ResultRow label="Deck Overhang" value={fmt(state.additionalGeometry.deckOverhang, ' m')} />
            <ResultRow label="Girder Steel" value={fmt(state.materials.girderSteel)} />
            <ResultRow label="Cross Bracing Steel" value={fmt(state.materials.crossBracingSteel)} />
            <ResultRow label="Deck Concrete" value={fmt(state.materials.deckConcrete)} />
          </div>
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
