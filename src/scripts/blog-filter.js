// Client-side topic filtering for the blog listing page.
document.addEventListener("DOMContentLoaded", () => {
  const chips = document.querySelectorAll(".filter-chip");
  const cards = document.querySelectorAll("[data-category]");
  const noResults = document.getElementById("blog-no-results");
  if (!chips.length || !cards.length) return;

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const filter = chip.getAttribute("data-filter");
      let shown = 0;

      cards.forEach((card) => {
        const match = filter === "all" || card.getAttribute("data-category") === filter;
        card.classList.toggle("is-hidden", !match);
        if (match) {
          shown++;
          card.classList.add("revealed");
        }
      });

      if (noResults) noResults.style.display = shown ? "none" : "block";
    });
  });
});
