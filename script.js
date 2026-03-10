// ================================
// Configurações principais
// ================================

// Número de WhatsApp (somente dígitos, com DDI e DDD)
const WHATSAPP_NUMBER = "51997565042";

// Mensagem padrão para contato rápido
const WHATSAPP_MESSAGE =
  "Olá, gostaria de solicitar um orçamento de segurança eletrônica com a Osório Security em Osório/RS.";

// ================================
// Funções utilitárias
// ================================

/**
 * Cria a URL de WhatsApp com base no número e mensagem padrão.
 */
function buildWhatsAppUrl(extraInfo) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  const msg = extraInfo ? `${WHATSAPP_MESSAGE} ${extraInfo}` : WHATSAPP_MESSAGE;
  const encoded = encodeURIComponent(msg);
  return `${base}?text=${encoded}`;
}

/**
 * Scroll suave para âncoras internas.
 */
function smoothScrollTo(targetId) {
  const target = document.querySelector(targetId);
  if (!target) return;

  const headerOffset = document.querySelector(".header")?.offsetHeight || 0;
  const elementPosition = target.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = elementPosition - headerOffset - 12;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}

// ================================
// Menu mobile (hambúrguer)
// ================================

(function initMobileMenu() {
  const toggle = document.querySelector(".nav__toggle");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav__link");

  if (!toggle || !nav) return;

  function closeMenu() {
    nav.classList.remove("nav--open");
    toggle.classList.remove("nav__toggle--open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav--open");
    toggle.classList.toggle("nav__toggle--open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu();
    }
  });
})();

// ================================
// Scroll suave para links do menu
// ================================

(function initSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      if (href.startsWith("#")) {
        event.preventDefault();
        smoothScrollTo(href);
      }
    });
  });
})();

// ================================
// Efeito no header ao rolar
// ================================

(function initHeaderScrollEffect() {
  const header = document.querySelector(".header");
  if (!header) return;

  const onScroll = () => {
    const scrolled = window.scrollY > 10;
    header.classList.toggle("header--scrolled", scrolled);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// ================================
// Animação leve ao exibir seções
// ================================

(function initRevealAnimations() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || revealEls.length === 0) {
    revealEls.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealEls.forEach((el) => observer.observe(el));
})();

// ================================
// Botões de WhatsApp
// ================================

(function initWhatsAppButtons() {
  const buttons = document.querySelectorAll(".js-whatsapp");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const extraInfo = button.dataset?.context || "";
      const url = buildWhatsAppUrl(extraInfo);
      window.open(url, "_blank");
    });
  });
})();

// ================================
// Accordion de FAQ
// ================================

(function initFaqAccordion() {
  const items = document.querySelectorAll(".faq__item");
  if (!items.length) return;

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const isExpanded = item.getAttribute("aria-expanded") === "true";
      items.forEach((other) => other.setAttribute("aria-expanded", "false"));
      item.setAttribute("aria-expanded", String(!isExpanded));
    });
  });
})();

// ================================
// Validação simples do formulário
// ================================

(function initContactForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const fields = Array.from(
    form.querySelectorAll("input[required], select[required], textarea[required]")
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let isValid = true;

    fields.forEach((field) => {
      const errorSpan = field.parentElement.querySelector(".form__error");
      if (!errorSpan) return;

      if (!field.value.trim()) {
        isValid = false;
        errorSpan.textContent = "Campo obrigatório.";
      } else {
        errorSpan.textContent = "";
      }
    });

    if (!isValid) return;

    const nome = form.querySelector("#nome")?.value.trim();
    const telefone = form.querySelector("#telefone")?.value.trim();
    const tipoImovel = form.querySelector("#tipo-imovel")?.value.trim();
    const mensagem = form.querySelector("#mensagem")?.value.trim();

    // Monta mensagem complementar com base no que o usuário preencheu
    const detalhes = `
Nome: ${nome || "Não informado"}
Telefone/WhatsApp: ${telefone || "Não informado"}
Tipo de imóvel: ${tipoImovel || "Não informado"}
Necessidade: ${mensagem || "Não informado"}
`;

    const url = buildWhatsAppUrl(
      "\n\nDados enviados pelo formulário:\n" + detalhes
    );

    window.open(url, "_blank");
  });
})();

// ================================
// Ano do rodapé
// ================================

(function fillCurrentYear() {
  const yearEl = document.getElementById("year");
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
})();