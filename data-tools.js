// Safe loading, JSON export/import, clear, and a sample button that no longer
// wipes your work without asking. Works on top of script.js (shares its globals).
(() => {
  const str = v => (typeof v === 'string' ? v.slice(0, 5000) : '');

  // Turn any stored/imported value into a well-formed resume object.
  function normalize(raw) {
    const b = blank(), r = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    const out = { ...b };
    ['name', 'title', 'email', 'phone', 'location', 'link', 'summary', 'skills'].forEach(k => { out[k] = str(r[k]); });
    out.layout = (typeof r.layout === 'string' && r.layout.replace(/[^a-z]/g, '').slice(0, 20)) || 'classic';
    out.accent = /^#[0-9a-f]{6}$/i.test(r.accent) ? r.accent : b.accent;
    out.font = r.font === 'sans' ? 'sans' : '';
    ['exp', 'edu'].forEach(k => {
      const list = (Array.isArray(r[k]) ? r[k] : []).filter(x => x && typeof x === 'object').slice(0, 30)
        .map(x => ({ role: str(x.role), org: str(x.org), dates: str(x.dates), details: str(x.details) }));
      out[k] = list.length ? list : b[k];
    });
    return out;
  }
  window.normalizeResume = normalize;

  // Repair corrupt saved data (e.g. exp is not a list) before anything else uses it.
  data = normalize(data); fillForm(); refresh();

  const tools = document.createElement('div');
  tools.className = 'tools';
  tools.innerHTML = '<button type="button" class="ghost" id="exportJson">Export JSON</button>' +
    '<label class="btn ghost">Import JSON<input type="file" id="importJson" accept="application/json" hidden></label>' +
    '<button type="button" class="ghost" id="clearAll">Clear all</button>';
  document.querySelector('.bar').after(tools);

  const same = (a, b) => JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
  const untouched = () => same(data, blank()) || same(data, SAMPLE);
  const load = next => { data = normalize(next); fillForm(); refresh(); };

  $('#sample').onclick = () => {
    if (!untouched() && !confirm('Replace your current resume with the sample? This cannot be undone.')) return;
    load(structuredClone(SAMPLE));
  };
  $('#clearAll').onclick = () => {
    if (!confirm('Clear everything and start a blank resume? Export first if you want a copy.')) return;
    load(blank());
  };
  $('#exportJson').onclick = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    a.download = `${(data.name || 'resume').trim().replace(/\W+/g, '-').toLowerCase() || 'resume'}.json`;
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  $('#importJson').addEventListener('change', async e => {
    const file = e.target.files[0]; if (!file) return;
    try {
      const raw = JSON.parse(await file.text());
      if (!raw || typeof raw !== 'object' || Array.isArray(raw) || !('exp' in raw || 'name' in raw)) throw new Error('bad');
      if (!confirm('Replace your current resume with this file?')) return;
      load(raw);
    } catch { alert('That file does not look like a Resume Builder export.'); }
    finally { e.target.value = ''; }
  });
})();
