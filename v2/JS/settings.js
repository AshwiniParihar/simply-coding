function applySettings() {
  // Get selected font sizes
  const leftFontSize = document.getElementById("leftFontSize").value;
  const editorFontSize = document.getElementById("editorFontSize").value;

  // Update left section font size
  document.getElementById("left-section").style.fontSize = leftFontSize + "px";

  // Update Ace editors' font size
  htmlEditor.setOption("fontSize", editorFontSize + "px");
  cssEditor.setOption("fontSize", editorFontSize + "px");
  jsEditor.setOption("fontSize", editorFontSize + "px");

  // Close the modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("settingsModal")
  );
  modal.hide();
}

// Ensure the settings modal applies correctly on page load
document.addEventListener("DOMContentLoaded", () => {
  // Set initial values to match default settings
  document.getElementById("leftFontSize").value = "16";
  document.getElementById("editorFontSize").value = "14";
});
