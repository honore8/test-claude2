const observer =
  typeof IntersectionObserver !== "undefined"
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      )
    : null;

export const reveal = {
  mounted(el) {
    el.classList.add("reveal");
    if (observer) {
      observer.observe(el);
    } else {
      el.classList.add("is-visible");
    }
  },
  unmounted(el) {
    observer?.unobserve(el);
  },
};
