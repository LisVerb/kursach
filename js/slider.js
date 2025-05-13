(function () {
    const slides = Array.from(document.querySelectorAll('#slider .slide'));
    let current = 0;

    // Установить src для каждого слайда под текущую тему
    function applyTheme() {
        const dark = document.body.classList.contains('dark');
        slides.forEach(s => {
            s.src = dark ? s.dataset.dark : s.dataset.light;
        });
    }

    // Показать один слайд
    function showSlide(idx) {
        slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    }

    // Цикл
    function nextSlide() {
        showSlide(current);
        current = (current + 1) % slides.length;
    }

    document.addEventListener('DOMContentLoaded', () => {
        applyTheme();
        nextSlide();
        setInterval(nextSlide, 3500);

        // При смене темы обновляем src
        document.getElementById('theme-toggle').addEventListener('click', () => {
            setTimeout(applyTheme, 100);
        });
    });
})();