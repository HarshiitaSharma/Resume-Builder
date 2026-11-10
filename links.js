// Make email, phone and website in the preview clickable (also in the saved PDF).
(() => {
  const prev = renderPaper;
  renderPaper = function () {
    prev();
    document.querySelectorAll('#paper .contact span').forEach(span => {
      const t = span.textContent.trim(); let href = null;
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) href = 'mailto:' + t;
      else if (/^\+?[\d\s().-]{7,}$/.test(t)) href = 'tel:' + t.replace(/[^\d+]/g, '');
      else if (/^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(t)) {
        try { const u = new URL(/^https?:\/\//i.test(t) ? t : 'https://' + t); if (/^https?:$/.test(u.protocol)) href = u.href; } catch {}
      }
      if (!href) return;
      const a = document.createElement('a'); a.href = href; a.textContent = t;
      if (href.startsWith('http')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      span.replaceChildren(a);
    });
  };
  renderPaper();
})();
