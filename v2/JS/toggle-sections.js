document.addEventListener("DOMContentLoaded", function () {
  const leftSection = document.getElementById("left-section");
  const rightSection = document.getElementById("right-section");
  const editorContainer = document.getElementById("editor-container");
  const previewFrame = document.getElementById("preview");
  const consoleLog = document.getElementById("console");
  const toggleButton = document.querySelector(".btn-toggle");
  const toggleNumber = toggleButton.querySelector(".toggle-number");

  let currentState = 0; // 0: Both visible, 1: Only content, 2: Only editor

  function updateToggleNumber(state) {
    toggleNumber.textContent = state + 1; // Display numbers 1 to 3
  }

  function toggleSection() {
    currentState = (currentState + 1) % 3; // Cycle through 0, 1, 2

    if (currentState === 0) {
      // Show both sections side by side
      leftSection.classList.remove("d-none", "col-12");
      rightSection.classList.remove("d-none", "col-12");
      leftSection.classList.add("col-6");
      rightSection.classList.add("col-6");
    } else if (currentState === 1) {
      // Show only the right section (content)
      leftSection.classList.add("d-none");
      rightSection.classList.remove("d-none", "col-6");
      rightSection.classList.add("col-12");
    } else if (currentState === 2) {
      // Show only the left section (editor)
      rightSection.classList.add("d-none");
      leftSection.classList.remove("d-none", "col-6");
      leftSection.classList.add("col-12");
    }

    updateToggleNumber(currentState); // Update the toggle number
  }

  // Attach toggle function to the button
  toggleButton.addEventListener("click", toggleSection);

  // Initialize layout
  updateToggleNumber(currentState); // Start with both sections visible
});
