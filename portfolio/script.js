const pages = [...document.querySelectorAll(".page")];
const navLinks = [...document.querySelectorAll(".nav-link")];
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const root = document.documentElement;

// Replace these two values with your own details.
const CONTACT_EMAIL = "omtiw1209@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/moaum/"; 

document.getElementById("year").textContent = new Date().getFullYear();

function showPage(pageId) {
  pages.forEach((page) => {
    const isActive = page.id === pageId;
    page.hidden = !isActive;
    page.classList.toggle("active", isActive);
  });

  navLinks.forEach((link) => {
    const isActive = link.dataset.page === pageId;
    link.classList.toggle("active", isActive);
    link.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => showPage(link.dataset.page));
});

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.go));
});

function pageFromHash() {
  const requested = window.location.hash.slice(1);
  showPage(["home", "projects", "contact"].includes(requested) ? requested : "home");
}
window.addEventListener("hashchange", pageFromHash);
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    history.replaceState(null, "", `#${link.dataset.page}`);
  });
});
document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => {
    history.replaceState(null, "", `#${button.dataset.go}`);
  });
});
pageFromHash();

function setTheme(theme) {
  root.dataset.theme = theme;
  const isLight = theme === "light";
  themeIcon.textContent = isLight ? "☾" : "☼";
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  document.querySelector('meta[name="theme-color"]').content = isLight ? "#f3f3f0" : "#111111";
  try { localStorage.setItem("portfolio-theme", theme); } catch (_) {}
}

let savedTheme = "dark";
try { savedTheme = localStorage.getItem("portfolio-theme") || "dark"; } catch (_) {}
setTheme(savedTheme);
themeToggle.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

function applyProfileLinks() {
  if (!LINKEDIN_URL) return;
  ["linkedinLink", "linkedinContact"].forEach((id) => {
    const link = document.getElementById(id);
    link.href = LINKEDIN_URL;
    link.textContent = id === "linkedinLink" ? "LinkedIn ↗" : "LinkedIn ↗";
    link.classList.remove("muted");
  });
}
applyProfileLinks();

const contactForm = document.getElementById("contactForm");
const formHint = document.getElementById("formHint");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (CONTACT_EMAIL === "YOUR_EMAIL@example.com") {
    formHint.textContent = "Before using this form, open script.js and replace YOUR_EMAIL@example.com with your email address.";
    formHint.setAttribute("role", "status");
    return;
  }

  const name = document.getElementById("senderName").value.trim();
  const senderEmail = document.getElementById("senderEmail").value.trim();
  const subject = document.getElementById("messageSubject").value.trim();
  const message = document.getElementById("messageBody").value.trim();

  const body = `Hi Om,\n\n${message}\n\n— ${name}\nReply to: ${senderEmail}`;
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  formHint.textContent = "Opening your email app… review the message and press Send there.";
  window.location.href = mailto;
});
