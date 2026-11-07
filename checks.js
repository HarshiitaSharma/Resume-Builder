// Resume checks: pure functions (no DOM) so they can be unit tested in Node.
(function (root) {
  const words = s => (String(s || '').trim().match(/\S+/g) || []).length;
  const bulletsOf = it => String((it && it.details) || '').split('\n').map(s => s.trim()).filter(Boolean);
  const used = (d, k) => (d[k] || []).filter(i => i && (i.role || i.org));
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const WEAK = /^(responsible for|worked on|helped with|helped|duties included|tasked with)\b/i;

  // Rough line count to guess whether the resume still fits on one A4 page.
  function estimateLines(d) {
    let n = 4;
    const sw = words(d.summary); if (sw) n += 2 + Math.ceil(sw / 18);
    const sk = String(d.skills || '').split(',').filter(s => s.trim()).length; if (sk) n += 2 + Math.ceil(sk / 6);
    ['exp', 'edu'].forEach(k => {
      const items = used(d, k); if (items.length) n += 2;
      items.forEach(it => { n += 3; bulletsOf(it).forEach(b => { n += Math.ceil(b.length / 95); }); });
    });
    return n;
  }

  // Returns [{ level: 'warn' | 'tip' | 'ok', msg }]
  function analyze(d) {
    const out = [], add = (level, msg) => out.push({ level, msg });
    if (!String(d.name || '').trim()) add('warn', 'Add your full name.');
    if (!d.email) add('warn', 'Add an email address so recruiters can reach you.');
    else if (!EMAIL.test(d.email)) add('warn', 'The email address does not look valid.');
    if (!d.phone) add('tip', 'Consider adding a phone number.');

    const sw = words(d.summary);
    if (!sw) add('tip', 'A 2 to 3 line summary helps a recruiter skim your resume.');
    else if (sw > 60) add('warn', `Your summary is ${sw} words. Aim for 60 or fewer.`);

    const skills = String(d.skills || '').split(',').filter(s => s.trim()).length;
    if (skills && skills < 5) add('tip', 'Most resumes list at least 5 relevant skills.');
    if (skills > 15) add('warn', `${skills} skills is a lot. Keep the most relevant 10 to 15.`);

    const jobs = used(d, 'exp');
    if (!jobs.length) add('tip', 'Add your experience, internships or projects.');
    let bullets = 0, quantified = 0;
    jobs.forEach(j => {
      const label = j.role || j.org, bs = bulletsOf(j);
      if (!bs.length) add('warn', `"${label}" has no details. Add 2 to 4 bullet points.`);
      if (bs.length > 6) add('warn', `"${label}" has ${bs.length} bullets. Keep the strongest 3 to 5.`);
      if (!/\d{4}/.test(j.dates || '')) add('tip', `Add a year to the dates for "${label}".`);
      bs.forEach(b => {
        bullets++; if (/\d/.test(b)) quantified++;
        if (b.length > 200) add('warn', `A bullet in "${label}" is over 200 characters. Split or shorten it.`);
        if (WEAK.test(b)) add('tip', `Start bullets with an action verb instead of "${b.split(' ').slice(0, 2).join(' ')}...".`);
      });
    });
    if (bullets >= 3 && quantified === 0) add('tip', 'Add numbers to your bullets (users, percent, time saved) to show impact.');

    if (estimateLines(d) > 58) add('warn', 'This may run past one page. Try the Compact layout or trim older details.');
    if (!out.some(o => o.level === 'warn')) add('ok', 'No problems found. Nice work.');
    return out;
  }

  const api = { analyze, estimateLines, words };
  if (typeof module !== 'undefined') module.exports = api; else root.ResumeChecks = api;
})(typeof window !== 'undefined' ? window : globalThis);
