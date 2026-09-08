const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('[data-half-loop]').forEach((video) => {
  const clipEnd = 2;
  video.muted = true;
  video.addEventListener('loadedmetadata', () => {
    video.play().catch(() => {});
  });
  video.addEventListener('timeupdate', () => {
    if (video.currentTime >= clipEnd) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  });
});

