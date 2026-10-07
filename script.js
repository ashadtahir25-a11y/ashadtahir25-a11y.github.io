// =========================================================
// 1. MOBILE NAVIGATION MENU
// =========================================================
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

function openMenu() {
  navMenu.classList.add("open");
  navToggle.classList.add("active");
  document.body.classList.add("menu-open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close menu");
}

function closeMenu() {
  navMenu.classList.remove("open");
  navToggle.classList.remove("active");
  document.body.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
}

navToggle.addEventListener("click", () => {
  navMenu.classList.contains("open") ? closeMenu() : openMenu();
});

// Link click par menu band
navLinks.forEach((link) => link.addEventListener("click", closeMenu));

// Escape key se menu band
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navMenu.classList.contains("open")) {
    closeMenu();
    navToggle.focus();
  }
});

// Screen bari ho jaye to menu reset
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) closeMenu();
});

// =========================================================
// 2. HEADER BACKGROUND + SCROLL PROGRESS BAR
// =========================================================
const header = document.getElementById("site-header");
const progress = document.getElementById("scroll-progress");

function onScroll() {
  header.classList.toggle("scrolled", window.scrollY > 20);

  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  progress.style.transform = `scaleX(${ratio})`;
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// =========================================================
// 3. ACTIVE NAV LINK (jo section screen par ho)
// =========================================================
const sections = document.querySelectorAll("main section[id]");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

// =========================================================
// 4. SCROLL REVEAL (thore thore farq se ek ke baad ek)
// =========================================================
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      // Ek hi parent ke andar wale items ko chhota sa delay
      const siblings = [...entry.target.parentElement.children].filter((el) =>
        el.classList.contains("reveal")
      );
      const index = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${Math.min(index, 5) * 80}ms`;

      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// =========================================================
// 5. HERO TILT (mouse ke saath halka 3D jhukao)
// =========================================================
const stage = document.getElementById("hero-stage");
const stageInner = stage ? stage.querySelector(".stage-inner") : null;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

if (stage && stageInner && !reduceMotion && finePointer) {
  const hero = document.getElementById("home");

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 se 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    stageInner.style.setProperty("--rx", `${x * 10}deg`);
    stageInner.style.setProperty("--ry", `${y * -8}deg`);
  });

  hero.addEventListener("mouseleave", () => {
    stageInner.style.setProperty("--rx", "0deg");
    stageInner.style.setProperty("--ry", "0deg");
  });
}

// =========================================================
// 6. CONTACT FORM VALIDATION
// =========================================================
const form = document.getElementById("contact-form");
const statusText = document.getElementById("form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = form.elements.name;
  const email = form.elements.email;
  const message = form.elements.message;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const problems = [];

  [name, email, message].forEach((field) => field.classList.remove("error"));

  if (name.value.trim() === "") {
    name.classList.add("error");
    problems.push("your name");
  }
  if (!emailPattern.test(email.value.trim())) {
    email.classList.add("error");
    problems.push("a valid email");
  }
  if (message.value.trim().length < 10) {
    message.classList.add("error");
    problems.push("a message of at least 10 characters");
  }

  if (problems.length) {
    statusText.textContent = `Please add ${problems.join(", ")}.`;
    statusText.className = "form-status fail";
    form.querySelector(".error").focus();
    return;
  }

  // Abhi backend nahi hai. Asli email ke liye Formspree ya EmailJS laga sakte ho.
  statusText.textContent = `Thanks, ${name.value.trim()}. This form is not connected yet, so please message me on LinkedIn for now.`;
  statusText.className = "form-status success";
  form.reset();
});

// =========================================================
// 7. FOOTER YEAR
// =========================================================
document.getElementById("year").textContent = new Date().getFullYear();
