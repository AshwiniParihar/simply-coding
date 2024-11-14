// toggleColumn.js

function toggleColumn(section) {
  const sections = {
    video: document.getElementById("video-player"),
    lesson: document.getElementById("lesson-content"),
    editor: document.getElementById("code-editor"),
  };

  const element = sections[section];
  const toggleButton = document.getElementById(`toggle-${section}`);

  if (!element || !toggleButton) {
    console.error(`Element or button not found for section: ${section}`);
    return;
  }

  const wasCollapsed = element.classList.contains("collapsed");

  // Check the number of visible sections to prevent collapsing the last one
  const visibleSections = Object.values(sections).filter(
    (el) => el && !el.classList.contains("collapsed")
  ).length;

  if (visibleSections === 1 && !wasCollapsed) {
    console.log("Can't close the last visible section");
    showWarning(toggleButton); // Optional: Show a warning to the user
    return;
  }

  // Toggle the collapsed class on the section
  element.classList.toggle("collapsed");
  const isCollapsed = element.classList.contains("collapsed");

  // Update button text and active class
  toggleButton.textContent = isCollapsed
    ? `Show ${capitalize(section)}`
    : `Hide ${capitalize(section)}`;
  toggleButton.classList.toggle("active", !isCollapsed);

  // Handle additional behaviors when toggling the editor
  if (section === "editor") {
    toggleEditorElements(isCollapsed); // Call the helper function
  }

  // Trigger layout recalculation after toggling
  window.dispatchEvent(new Event("resize"));
}

function toggleEditorElements(isCollapsed) {
  const codeEditor = document.querySelector(".code-editor");

  if (isCollapsed) {
    // Collapse the code editor with a smooth transition
    codeEditor.classList.remove("expanded");
  } else {
    // Expand the code editor with a smooth transition
    codeEditor.classList.add("expanded");
  }
}

function showWarning(button) {
  // Implement a visual warning (e.g., briefly changing button color or showing a tooltip)
  button.classList.add("warning");
  setTimeout(() => button.classList.remove("warning"), 500);
}

// Helper to capitalize the first letter of a string
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Export functions if using modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    toggleColumn,
    capitalize,
  };
}
