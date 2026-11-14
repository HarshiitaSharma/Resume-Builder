# Resume Builder

A simple resume/CV generator that runs entirely in the browser. Fill in the form, see a live preview, and save it as a PDF.

## Features
- Live preview as you type
- Two layouts: single column and sidebar
- Custom accent color
- Add or remove jobs and schools
- Auto-saves in your browser (localStorage)
- Download as PDF with your browser's print dialog
- **More layouts**: Compact (fits more on a page) and Modern, plus a serif or sans-serif font
- **Resume check**: tips on summary length, action verbs, numbers, dates and an estimate of whether it fits one page
- **Multiple saved resumes**: keep a separate version per job type
- **Export and import** your resume as JSON, and a confirm before anything is overwritten
- Clickable email, phone and website in the preview and the saved PDF
- Installable offline PWA

## Run it
Open `index.html` in a browser. No install or build step.

## Deploy on GitHub Pages
Repo **Settings → Pages → Deploy from a branch → main / (root)**.

## Files

```
index.html  style.css  script.js           # the original app
addons.css  data-tools.js  templates.js  links.js  profiles.js  checks.js  checks-ui.js
test/checks.test.js  package.json
manifest.webmanifest  sw.js  pwa.js  icon.svg
.github/workflows/{pages,test}.yml
```

## Download as PDF
Click **Download PDF**, choose **Save as PDF** as the destination, and turn off "Headers and footers".

## Tests

```bash
npm test    # unit tests for the resume checks (Node 18+)
```

## Ideas for next steps
- Photo upload
- More templates (two-column with a photo, academic CV)
- Cover letter generator
- Per-section reordering
