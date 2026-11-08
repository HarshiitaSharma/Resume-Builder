# Changelog

## Unreleased
### Fixed
- `.gitignore` was saved as `gitignore` (no dot), so it did nothing
- "Load sample" replaced your resume without asking; it now confirms
- Corrupt or old saved data (for example `exp` not a list) could blank the page; data is now repaired on load
- Entries could be split across pages when printing; they now stay together
### Added
- Compact and Modern layouts, font choice
- Resume check panel (with unit tests)
- Multiple saved resumes, JSON export/import, Clear all
- Clickable contact links
- Installable offline PWA, GitHub Pages and test workflows, MIT license

## 1.0.0
- Live preview, single column and sidebar layouts, accent color, localStorage, print to PDF
