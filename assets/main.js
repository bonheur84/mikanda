const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(envtry.target);
        }
    });
}, { threshold: 0.15});

document.querySelectorAll(".reveal").forEach((section) => {
    observer.observe(section);
})
