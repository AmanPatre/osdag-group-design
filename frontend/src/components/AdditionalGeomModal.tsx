import { useState } from 'react';
import type { AdditionalGeometry } from '../types';
import { calculateGirder } from '../api';
import '../styles/Modal.css';

interface Props {
  carriagewayWidth: string;
  value: AdditionalGeometry;
  onConfirm: (val: AdditionalGeometry) => void;
  onClose: () => void;
}

type Field = 'girderSpacing' | 'numGirders' | 'deckOverhang';

export default function AdditionalGeomModal({ carriagewayWidth, value, onConfirm, onClose }: Props) {
  const [form, setForm] = useState<AdditionalGeometry>(value);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cw = parseFloat(carriagewayWidth);
  // IS 6 / IRC standard: overall width = carriageway + 5 m (kerbs + railings)
  const bw = !isNaN(cw) ? cw + 5 : null;

  // Live recalc on keystroke — backend call only happens on Apply
  function recalc(field: Field, raw: string): AdditionalGeometry {
    const next = { ...form, [field]: raw };
    if (!bw) return next;

    const gs = parseFloat(next.girderSpacing);
    const ng = parseInt(next.numGirders, 10);
    const dov = parseFloat(next.deckOverhang);

    if (field === 'girderSpacing') {
      if (!isNaN(gs) && !isNaN(ng) && ng > 0) {
        next.deckOverhang = (bw - ng * gs).toFixed(3);
      } else if (!isNaN(gs) && !isNaN(dov) && gs > 0) {
        next.numGirders = Math.round((bw - dov) / gs).toString();
      }
    } else if (field === 'numGirders') {
      if (!isNaN(ng) && !isNaN(gs) && ng > 0 && gs > 0) {
        next.deckOverhang = (bw - ng * gs).toFixed(3);
      } else if (!isNaN(ng) && !isNaN(dov) && ng > 0) {
        next.girderSpacing = ((bw - dov) / ng).toFixed(3);
      }
    } else if (field === 'deckOverhang') {
      if (!isNaN(dov) && !isNaN(ng) && ng > 0) {
        next.girderSpacing = ((bw - dov) / ng).toFixed(3);
      } else if (!isNaN(dov) && !isNaN(gs) && gs > 0) {
        next.numGirders = Math.round((bw - dov) / gs).toString();
      }
    }

    return next;
  }

  function handleChange(field: Field, val: string) {
    setForm(recalc(field, val));
    setError('');
  }

  async function handleConfirm() {
    if (!bw) {
      setError('Carriageway Width must be set before modifying geometry.');
      return;
    }

    const gs  = parseFloat(form.girderSpacing);
    const ng  = parseInt(form.numGirders, 10);
    const dov = parseFloat(form.deckOverhang);

    if (isNaN(gs) || gs <= 0)  { setError('Girder Spacing must be a positive number.'); return; }
    if (isNaN(ng) || ng < 1)   { setError('No. of Girders must be a positive integer.'); return; }
    if (isNaN(dov) || dov < 0) { setError('Deck Overhang must be ≥ 0.'); return; }

    setLoading(true);
    setError('');

    try {
      const res = await calculateGirder({ carriageway_width: cw, girder_spacing: gs, num_girders: ng });

      if (res.error) { setError(res.error); return; }
      if (!res.constraint_satisfied) {
        setError('Geometry constraint not satisfied. Adjust the values and try again.');
        return;
      }

      onConfirm({
        girderSpacing: String(res.girder_spacing ?? gs),
        numGirders:    String(res.num_girders    ?? ng),
        deckOverhang:  String(res.deck_overhang  ?? dov),
      });

    } catch {
      // API down — do local constraint check
      const expected = (bw - dov) / gs;
      if (Math.abs(expected - ng) > 0.05) {
        setError(`Constraint not satisfied: (${bw} − ${dov}) / ${gs} ≠ ${ng} (got ${expected.toFixed(2)}).`);
        return;
      }
      onConfirm(form);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h4>Modify Additional Geometry</h4>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {bw && (
            <p className="modal-hint">
              Overall Bridge Width = Carriageway ({cw} m) + 5 = <strong>{bw} m</strong>
            </p>
          )}
          <p className="modal-hint">
            Constraint: (Bridge Width − Deck Overhang) ÷ Girder Spacing = No. of Girders
          </p>

          <div className="geom-fields">
            <div className="field-row">
              <label>Girder Spacing (m)</label>
              <input
                type="number" step="0.1"
                value={form.girderSpacing}
                onChange={e => handleChange('girderSpacing', e.target.value)}
                placeholder="e.g. 2.5"
              />
            </div>
            <div className="field-row">
              <label>No. of Girders</label>
              <input
                type="number" step="1"
                value={form.numGirders}
                onChange={e => handleChange('numGirders', e.target.value)}
                placeholder="e.g. 5"
              />
            </div>
            <div className="field-row">
              <label>Deck Overhang Width (m)</label>
              <input
                type="number" step="0.1"
                value={form.deckOverhang}
                onChange={e => handleChange('deckOverhang', e.target.value)}
                placeholder="e.g. 1.0"
              />
            </div>
          </div>

          {parseFloat(form.deckOverhang) < 0 && (
            <div className="modal-errors">
              <p>Error: Computed deck overhang is negative. Reduce girder spacing or count.</p>
            </div>
          )}
          {error && parseFloat(form.deckOverhang) >= 0 && (
            <div className="modal-errors"><p>{error}</p></div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-primary" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Checking…' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
}
