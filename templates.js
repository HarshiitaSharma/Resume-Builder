// Two extra layouts (Compact, Modern) and a font choice. Styles live in addons.css.
(() => {
  const layout = document.querySelector('select[data-k="layout"]');
  [['compact', 'Compact (fits more)'], ['modern', 'Modern']].forEach(([v, t]) => {
    const o = document.createElement('option'); o.value = v; o.textContent = t; layout.append(o);
  });
  const lab = document.createElement('label');
  lab.innerHTML = 'Font <select data-k="font"><option value="">Serif (default)</option><option value="sans">Sans-serif</option></select>';
  layout.closest('.row').append(lab);
  layout.value = data.layout; lab.querySelector('select').value = data.font || '';

  const prev = renderPaper;
  renderPaper = function () {
    prev();
    const p = document.getElementById('paper');
    if (data.layout && data.layout !== 'classic' && data.layout !== 'side') p.classList.add('tpl-' + data.layout.replace(/[^a-z]/g, ''));
    if (data.font === 'sans') p.classList.add('font-sans');
  };
  renderPaper();
})();
