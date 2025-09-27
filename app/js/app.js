document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".controls__tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove("active"));
      // Add active class to clicked tab
      this.classList.add("active");

      // Hide all content blocks
      contents.forEach((content) => (content.style.display = "none"));

      // Get target ID from class name (first, second, etc.)
      const targetId = [...this.classList].find((cls) =>
        ["first", "second", "third", "fourth"].includes(cls)
      );

      // Show corresponding content block
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.style.display = "block";
      }
    });
  });
});
