const seo = {
  es: {
    title: 'Finca en venta en San Ramón Costa Rica | 4,3 ha frente a Nectandra',
    description: 'Finca de 4,3 hectáreas en venta en Ángeles Norte, San Ramón, frente al bosque nuboso de Nectandra. Casa, 2 nacientes, pozo propio, energía solar y Starlink.',
    ogTitle: 'Finca en venta · San Ramón, Costa Rica | ₡115.000.000 · aprox. US$257.000',
    ogDescription: '4,3 hectáreas frente al bosque nuboso de Nectandra, con vista al Volcán Arenal, casa, 2 nacientes, pozo propio, energía solar y Starlink.',
    locale: 'es_CR',
    whatsapp: 'https://wa.me/50688266344?text=Quiero%20coordinar%20una%20visita%20a%20la%20finca%20de%20San%20Ram%C3%B3n'
  },
  en: {
    title: 'Costa Rica Mountain Property for Sale | 10.6 Acres in San Ramón',
    description: '10.6-acre mountain property for sale in San Ramón, Costa Rica, across from Nectandra Cloud Forest Reserve. Home, private well, two springs, solar power and Starlink.',
    ogTitle: '10.6-Acre Cloud-Forest Estate in Costa Rica | US$257,000',
    ogDescription: 'Across from Nectandra Cloud Forest Reserve, with Arenal Volcano views, an existing home, private well and two natural springs.',
    locale: 'en_US',
    whatsapp: 'https://wa.me/50688266344?text=I%20would%20like%20to%20schedule%20a%20visit%20to%20the%20San%20Ramon%20property'
  }
};

const setMeta = (selector, value) => document.querySelector(selector)?.setAttribute('content', value);

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
  button.addEventListener('click', () => setLanguage(button.dataset.langButton));
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

document.querySelectorAll('[data-half-loop]').forEach((video) => {
  const clipEnd = 2;
  video.muted = true;
  video.addEventListener('loadedmetadata', () => video.play().catch(() => {}));
  video.addEventListener('timeupdate', () => {
    if (video.currentTime >= clipEnd) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  });
});

