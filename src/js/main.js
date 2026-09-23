import 'modern-normalize';
import '../scss/main.scss';

/* Обработчик для плавной прокрутки */
document.querySelectorAll('a[href*="#"]').forEach(a => {
    a.onclick = e => {
        const t = document.getElementById(a.hash.slice(1));
        if (!t) return;
        e.preventDefault();

        const start = scrollY, end = t.offsetTop, duration = 1000;
        const t0 = performance.now();

        (function step(now) {
            const p = Math.min((now - t0) / duration, 1);
            scrollTo(0, start + (end - start) * p * (2 - p));
            if (p < 1) requestAnimationFrame(step);
        })(t0);
    };
});

/* Переключение темы */
const toggle = document.getElementById('theme-toggle');

toggle.addEventListener('click', () => {
    const html = document.documentElement;
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    localStorage.setItem('theme', next);
});