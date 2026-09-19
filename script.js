const seo = {
  es: {
    title: 'Finca en venta en San Ramón Costa Rica | 4,3 ha frente a Nectandra',
    description: 'Finca de 4,3 hectáreas en venta en Ángeles Norte, San Ramón, frente al bosque nuboso de Nectandra. Casa, 2 nacientes, pozo propio, energía solar y Starlink.',
    ogTitle: 'Finca en venta · San Ramón, Costa Rica | ₡115.000.000 · aprox. US$257.000',
    ogDescription: '4,3 ha frente a Nectandra, con casa, 2 nacientes, pozo propio, energía solar, Starlink y vista al Volcán Arenal. Acceso directo por calle pública pavimentada.',
    locale: 'es_CR',
    whatsapp: 'https://wa.me/50688266344?text=Quiero%20coordinar%20una%20visita%20a%20la%20finca%20de%20San%20Ram%C3%B3n'
  },
  en: {
    title: 'Costa Rica Mountain Property for Sale | 10.6 Acres in San Ramón',
    description: '10.6-acre mountain property for sale in San Ramón, Costa Rica, across from Nectandra Cloud Forest Reserve. Home, private well, two springs, solar power and Starlink.',
    ogTitle: '10.6-Acre Cloud-Forest Estate in Costa Rica | US$257,000',
    ogDescription: '10.6 acres across from Nectandra, with a home, 2 natural springs, private well, solar power, Starlink, Arenal Volcano views and direct paved-road access.',
    locale: 'en_US',
    whatsapp: 'https://wa.me/50688266344?text=I%20would%20like%20to%20schedule%20a%20visit%20to%20the%20San%20Ramon%20property'
  }
};

const setMeta = (selector, value) => document.querySelector(selector)?.setAttribute('content', value);
const trackEvent = (name, parameters = {}) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, parameters);
  }
};

function setLanguage(lang, updateUrl = true) {
  const selected = seo[lang] ? lang : 'es';
  document.documentElement.lang = selected;
  document.body.dataset.lang = selected;
  document.title = seo[selected].title;
  setMeta('meta[name="description"]', seo[selected].description);
  setMeta('meta[property="og:title"]', seo[selected].ogTitle);
  setMeta('meta[property="og:description"]', seo[selected].ogDescription);
  setMeta('meta[property="og:locale"]', seo[selected].locale);
  setMeta('meta[name="twitter:title"]', seo[selected].ogTitle);
  setMeta('meta[name="twitter:description"]', seo[selected].ogDescription);

  document.querySelectorAll('[data-es][data-en]').forEach((element) => {
    element.textContent = element.dataset[selected];
  });
  document.querySelectorAll('[data-alt-es][data-alt-en]').forEach((image) => {
    image.alt = image.dataset[`alt${selected === 'es' ? 'Es' : 'En'}`];
  });
  document.querySelectorAll('[data-aria-es][data-aria-en]').forEach((element) => {
    element.setAttribute('aria-label', element.dataset[`aria${selected === 'es' ? 'Es' : 'En'}`]);
  });
  document.querySelectorAll('.whatsapp-link').forEach((link) => { link.href = seo[selected].whatsapp; });
  document.querySelectorAll('[data-lang-button]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.langButton === selected));
  });
  localStorage.setItem('finca-language', selected);
  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', selected);
    history.replaceState({}, '', url);
  }
}

document.querySelectorAll('[data-lang-button]').forEach((button) => {
  button.addEventListener('click', () => {
    const fromLanguage = document.body.dataset.lang || 'es';
    const toLanguage = button.dataset.langButton;
    if (fromLanguage !== toLanguage) {
      trackEvent('language_change', {
        from_language: fromLanguage,
        to_language: toLanguage
      });
    }
    setLanguage(toLanguage);
  });
});

const requestedLanguage = new URLSearchParams(location.search).get('lang');
const savedLanguage = localStorage.getItem('finca-language');
setLanguage(requestedLanguage || savedLanguage || 'es', Boolean(requestedLanguage));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('.whatsapp-link').forEach((link) => {
  link.addEventListener('click', () => {
    trackEvent('whatsapp_click', {
      link_text: link.textContent.trim(),
      language: document.body.dataset.lang || 'es',
      page_section: link.closest('[id]')?.id || 'global'
    });
  });
});

const visitSection = document.querySelector('#visita');
if (visitSection) {
  let visitSectionTracked = false;
  const visitObserver = new IntersectionObserver((entries) => {
    if (!visitSectionTracked && entries.some((entry) => entry.isIntersecting)) {
      visitSectionTracked = true;
      trackEvent('visit_section_view', {
        language: document.body.dataset.lang || 'es'
      });
      visitObserver.disconnect();
    }
  }, { threshold: 0.35 });
  visitObserver.observe(visitSection);
}

document.querySelectorAll('[data-half-loop]').forEach((video) => {
  const clipEnd = 2;
  let videoStartTracked = false;
  let videoInteractionTracked = false;
  video.muted = true;
  video.addEventListener('play', () => {
    if (!videoStartTracked) {
      videoStartTracked = true;
      trackEvent('video_start', {
        video_name: 'recorrido_finca',
        autoplay: true,
        language: document.body.dataset.lang || 'es'
      });
    }
  });
  video.addEventListener('pointerup', () => {
    if (!videoInteractionTracked) {
      videoInteractionTracked = true;
      trackEvent('video_interaction', {
        video_name: 'recorrido_finca',
        language: document.body.dataset.lang || 'es'
      });
    }
  });
  video.addEventListener('loadedmetadata', () => video.play().catch(() => {}));
  video.addEventListener('timeupdate', () => {
    if (video.currentTime >= clipEnd) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  });
});
