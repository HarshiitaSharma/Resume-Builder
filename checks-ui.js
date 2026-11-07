// "Resume check" panel in the editor. Rules live in checks.js.
(() => {
  const fs = document.createElement('fieldset');
  fs.innerHTML = '<legend>Resume check</legend><ul id="checks" class="checks" aria-live="polite"></ul>';
  document.getElementById('editor').append(fs);
  const icons = { warn: '⚠', tip: '💡', ok: '✓' };

  function show() {
    const ul = document.getElementById('checks'); ul.replaceChildren();
    ResumeChecks.analyze(data).forEach(c => {
      const li = document.createElement('li'); li.className = 'lvl-' + c.level;
      li.textContent = `${icons[c.level]} ${c.msg}`; ul.append(li);
    });
  }
  const prev = renderPaper;
  renderPaper = function () { prev(); show(); };
  renderPaper();
})();
