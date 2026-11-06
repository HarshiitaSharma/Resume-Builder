const KEY = "resume-builder-v1";
const SAMPLE = {
  name: "Priya Sharma", title: "Frontend Developer",
  email: "priya@example.com", phone: "+91 98765 43210",
  location: "Ludhiana, Punjab", link: "github.com/priya",
  summary: "Frontend developer with 3 years of experience building fast, accessible web apps with JavaScript and React.",
  skills: "JavaScript, React, HTML, CSS, Git, REST APIs",
  layout: "classic", accent: "#17496b",
  exp: [{ role: "Frontend Developer", org: "Acme Tech", dates: "2023 – Present",
    details: "Built a dashboard used by 10,000+ customers\nCut page load time by 40%" }],
  edu: [{ role: "B.Tech, Computer Science", org: "Punjab Technical University", dates: "2019 – 2023", details: "" }]
};
const blank = () => ({ name:"", title:"", email:"", phone:"", location:"", link:"", summary:"",
  skills:"", layout:"classic", accent:"#17496b", exp:[{role:"",org:"",dates:"",details:""}], edu:[{role:"",org:"",dates:"",details:""}] });

let data;
try { data = JSON.parse(localStorage.getItem(KEY)) || SAMPLE; } catch { data = SAMPLE; }
data = { ...blank(), ...data };

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {} };

function renderList(kind) {
  const labels = kind === "exp" ? ["Job title","Company"] : ["Degree","School"];
  $("#" + kind + "-list").innerHTML = data[kind].map((it, i) => `
    <div class="item" data-kind="${kind}" data-i="${i}">
      <label>${labels[0]} <input data-f="role" value="${esc(it.role)}"></label>
      <div class="row">
        <label>${labels[1]} <input data-f="org" value="${esc(it.org)}"></label>
        <label>Dates <input data-f="dates" value="${esc(it.dates)}"></label>
      </div>
      <label>Details, one per line <textarea data-f="details" rows="3">${esc(it.details)}</textarea></label>
      <button type="button" class="rm" data-rm>Remove</button>
    </div>`).join("");
}

function entry(it) {
  const bullets = it.details.split("\n").map(s => s.trim()).filter(Boolean);
  return `<div class="job"><div class="head"><span>${esc(it.role)}</span><span>${esc(it.dates)}</span></div>
    <div class="sub">${esc(it.org)}</div>
    ${bullets.length ? "<ul>" + bullets.map(b => `<li>${esc(b)}</li>`).join("") + "</ul>" : ""}</div>`;
}

function renderPaper() {
  const d = data, p = $("#paper");
  p.className = "paper" + (d.layout === "side" ? " side" : "");
  p.style.setProperty("--accent", d.accent);
  const skills = d.skills.split(",").map(s => s.trim()).filter(Boolean);
  const contact = [d.email, d.phone, d.location, d.link].filter(Boolean).map(c => `<span>${esc(c)}</span>`).join("");
  const exp = d.exp.filter(e => e.role || e.org).map(entry).join("");
  const edu = d.edu.filter(e => e.role || e.org).map(entry).join("");
  const sk = skills.length ? `<h2>SKILLS</h2><div class="chips">${skills.map(s => `<span>${esc(s)}</span>`).join("")}</div>` : "";
  const sum = d.summary ? `<h2>SUMMARY</h2><p>${esc(d.summary)}</p>` : "";
  const head = `<h1>${esc(d.name) || "Your Name"}</h1><div class="title">${esc(d.title)}</div><div class="contact">${contact}</div>`;
  const ex = exp ? `<h2>EXPERIENCE</h2>${exp}` : "", ed = edu ? `<h2>EDUCATION</h2>${edu}` : "";
  p.innerHTML = d.layout === "side"
    ? `<div class="top">${head}</div><aside>${sk}${ed}</aside><main>${sum}${ex}</main>`
    : `${head}${sum}${sk}${ex}${ed}`;
  document.title = (d.name || "Resume") + " – Resume";
}

function fillForm() {
  document.querySelectorAll("[data-k]").forEach(el => el.value = data[el.dataset.k] ?? "");
  renderList("exp"); renderList("edu");
}

const refresh = () => { save(); renderPaper(); };

$("#editor").addEventListener("input", e => {
  const el = e.target;
  if (el.dataset.k) data[el.dataset.k] = el.value;
  else if (el.dataset.f) {
    const box = el.closest(".item");
    data[box.dataset.kind][box.dataset.i][el.dataset.f] = el.value;
  }
  refresh();
});

$("#editor").addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  if (add) { data[add.dataset.add].push({role:"",org:"",dates:"",details:""}); renderList(add.dataset.add); refresh(); }
  if (e.target.matches("[data-rm]")) {
    const box = e.target.closest(".item");
    data[box.dataset.kind].splice(box.dataset.i, 1);
    renderList(box.dataset.kind); refresh();
  }
});

$("#sample").onclick = () => { data = structuredClone(SAMPLE); fillForm(); refresh(); };
$("#print").onclick = () => window.print();

fillForm(); renderPaper();
