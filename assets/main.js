const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15});

document.querySelectorAll(".reveal").forEach((section) => {
    observer.observe(section);
})

document.querySelectorAll(".partners-track").forEach((track) => {
  const group = track.querySelector(".partners-group");
  if (!group) return;

  const duplicate = group.cloneNode(true);
  duplicate.setAttribute("aria-hidden", "true");
  duplicate.querySelectorAll("img").forEach((image) => {
    image.alt = "";
  });

  track.append(duplicate);
});
