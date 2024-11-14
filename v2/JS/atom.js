// Initialize Ace Editors
const htmlEditor = ace.edit("editor-html");
const cssEditor = ace.edit("editor-css");
const jsEditor = ace.edit("editor-js");

htmlEditor.session.on("change", saveCurrentEditorState);
cssEditor.session.on("change", saveCurrentEditorState);
jsEditor.session.on("change", saveCurrentEditorState);

htmlEditor.setTheme("ace/theme/monokai");
cssEditor.setTheme("ace/theme/monokai");
jsEditor.setTheme("ace/theme/monokai");

htmlEditor.session.setMode("ace/mode/html");
cssEditor.session.setMode("ace/mode/css");
jsEditor.session.setMode("ace/mode/javascript");

htmlEditor.setOptions({
  fontSize: "14px",
  minLines: 10,
  maxLines: 1000,
  autoScrollEditorIntoView: true,
  wrap: true,
  showPrintMargin: false,
});
cssEditor.setOptions({
  fontSize: "14px",
  minLines: 10,
  maxLines: 1000,
  autoScrollEditorIntoView: true,
  showPrintMargin: false,
});
jsEditor.setOptions({
  fontSize: "14px",
  minLines: 10,
  maxLines: 1000,
  autoScrollEditorIntoView: true,
  showPrintMargin: false,
});

const consoleElement = document.getElementById("console");
const previewFrame = document.getElementById("preview");

// Helper function to update button states
function updateButtonStates(section, activeSize) {
  const buttonGroup = document.querySelector(`[data-section="${section}"]`);
  if (buttonGroup) {
    buttonGroup.querySelectorAll(".btn").forEach((btn) => {
      btn.classList.remove("btn-primary", "btn-info");
      btn.classList.add("btn-secondary");
      if (btn.getAttribute("data-size") === activeSize) {
        btn.classList.remove("btn-secondary");
        btn.classList.add(activeSize === "mobile" ? "btn-info" : "btn-primary");
      }
    });
  }
}

// Function to resize sections and Ace editors
// Function to resize sections and Ace editors
// Function to resize sections and Ace editors
// Function to resize sections and Ace editors
function resizeSection(section, size) {
  const element = document.getElementById(section);
  if (element.classList.contains("minimized")) {
    return;
  }

  // Convert size to a numerical value (default height per unit size)
  const sizeValue = size === "mobile" ? 667 : parseInt(size, 10) * 150;

  // Adjust the container's height
  element.style.height = `${sizeValue}px`;

  // Handle resizing of the editor container
  if (section === "editor-container") {
    // Set the height of each editor element
    document.getElementById("editor-html").style.height = `${sizeValue}px`;
    document.getElementById("editor-css").style.height = `${sizeValue}px`;
    document.getElementById("editor-js").style.height = `${sizeValue}px`;

    // Resize each Ace editor instance to match the new height
    htmlEditor.resize();
    cssEditor.resize();
    jsEditor.resize();
  }

  // Adjust preview and console sizes
  if (section === "preview" || section === "console") {
    element.style.height = `${sizeValue}px`;
  }

  // Update the dropdown button text to reflect the current size
  const dropdownButton = document.querySelector(
    `button[data-bs-target="#${section}SizeDropdown"]`
  );
  if (dropdownButton) {
    dropdownButton.textContent = size;
  }
}

// Ensure editors are resized on default size setting
function setDefaultSize() {
  resizeSection("editor-container", "2X");
  resizeSection("preview", "2X");
  resizeSection("console", "2X");
}

// Ensure the editors resize when dropdown options are selected
document.querySelectorAll(".dropdown-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const size = e.target.getAttribute("data-size");
    const section = e.target
      .closest("[data-section]")
      .getAttribute("data-section");
    resizeSection(section, size);

    // Resize Ace editors if the container changes
    if (section === "editor-container") {
      htmlEditor.resize();
      cssEditor.resize();
      jsEditor.resize();
    }
  });
});

// Call setDefaultSize when the page loads
document.addEventListener("DOMContentLoaded", () => {
  // Set default sizes
  setDefaultSize();

  // Add event listeners to all dropdown items
  document.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const size = e.target.getAttribute("data-size");
      const section = e.target
        .closest("[data-section]")
        .getAttribute("data-section");

      // Resize the corresponding section
      resizeSection(section, size);

      // Update the dropdown button text
      const dropdownButton = e.target
        .closest(".dropdown")
        .querySelector("button.dropdown-toggle");
      if (dropdownButton) {
        dropdownButton.textContent = size; // Set the button text to the selected size
      }
    });
  });
});

// Function to set default sizes
function setDefaultSize() {
  resizeSection("editor-container", "2X");
  resizeSection("preview", "2X");
  resizeSection("console", "2X");
}

// Function to resize sections
function resizeSection(section, size) {
  const element = document.getElementById(section);

  if (!element || element.classList.contains("minimized")) return;

  // Define mobile dimensions
  const mobileHeight = 667; // Example mobile height (iPhone 6/7/8 size)
  const mobileWidth = 375; // Example mobile width

  // Determine the size in pixels
  const sizeValue = size === "mobile" ? mobileHeight : parseInt(size, 10) * 300;

  // Adjust the section's height
  element.style.height = `${sizeValue}px`;

  // Handle mobile-specific dimensions for the preview
  if (section === "preview" && size === "mobile") {
    element.style.height = `${mobileHeight}px`;
    element.style.width = `${mobileWidth}px`;
  } else {
    // Reset width to 100% for non-mobile sizes
    element.style.width = "100%";
  }

  // Resize the Ace editors if it's the editor-container
  if (section === "editor-container") {
    document.getElementById("editor-html").style.height = `${sizeValue}px`;
    document.getElementById("editor-css").style.height = `${sizeValue}px`;
    document.getElementById("editor-js").style.height = `${sizeValue}px`;

    htmlEditor.resize();
    cssEditor.resize();
    jsEditor.resize();
  }

  // Adjust height for console as well
  if (section === "console") {
    element.style.height = `${sizeValue}px`;
  }
}
// Ensure editors are resized on default size setting
function setDefaultSize() {
  resizeSection("editor-container", "2X");
  resizeSection("preview", "2X");
  resizeSection("console", "2X");
}

// Ensure the editors resize when dropdown options are selected
document.querySelectorAll(".dropdown-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const size = e.target.getAttribute("data-size");
    const section = e.target
      .closest("[data-section]")
      .getAttribute("data-section");
    resizeSection(section, size);

    // Ensure Ace editors are resized
    if (section === "editor-container") {
      htmlEditor.resize();
      cssEditor.resize();
      jsEditor.resize();
    }
  });
});

// Call setDefaultSize when the page loads
document.addEventListener("DOMContentLoaded", () => {
  setDefaultSize();
});

// Ensure editors are resized on default size setting
function setDefaultSize() {
  resizeSection("editor-container", "2X");
  resizeSection("preview", "2X");
  resizeSection("console", "2X");
}

// Function to minimize/maximize sections
function toggleMinimize(section, button) {
  console.log(`Toggling minimize for section: ${section}`);

  const element = document.getElementById(section);

  if (element && button) {
    const isMinimized = element.classList.toggle("minimized");
    button.classList.toggle("minimized", isMinimized);

    if (isMinimized) {
      element.style.display = "none";
    } else {
      element.style.display = "block";
      const size = element.dataset.lastSize || "2X";
      resizeSection(section, size);
    }

    if (section === "editor-container" && !isMinimized) {
      setTimeout(() => {
        [htmlEditor, cssEditor, jsEditor].forEach((editor) => editor.resize());
      }, 300);
    }
  } else {
    console.error(`Element with ID '${section}' or button not found.`);
  }
}

// Function to log messages to the custom console
function logToCustomConsole(message, type = "log") {
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  messageElement.style.color = type === "error" ? "red" : "white";
  consoleElement.appendChild(messageElement);
  consoleElement.scrollTop = consoleElement.scrollHeight;
}

// Function to set default size (2x) on page load
function setDefaultSize() {
  resizeSection("editor-container", "2X");
  resizeSection("preview", "2X");
  resizeSection("console", "2X");
}

// Event listener for dropdown resizing
document.addEventListener("DOMContentLoaded", () => {
  // Add event listeners to dropdown items for resizing
  document.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const size = e.target.getAttribute("data-size");
      const section = e.target
        .closest("[data-section]")
        .getAttribute("data-section");
      resizeSection(section, size);

      // Additional call to resize Ace editors
      if (section === "editor-container") {
        htmlEditor.resize();
        cssEditor.resize();
        jsEditor.resize();
      }
    });
  });

  // Set default size for each section (editor, preview, console) on page load
  setDefaultSize();

  // Event listeners for Clear buttons
  document.getElementById("clear-editor-btn").addEventListener("click", () => {
    htmlEditor.setValue("");
    cssEditor.setValue("");
    jsEditor.setValue("");
    console.log("Editors cleared");
  });

  document.getElementById("clear-preview-btn").addEventListener("click", () => {
    previewFrame.srcdoc = "";
    console.log("Preview cleared");
  });

  document.getElementById("clear-console-btn").addEventListener("click", () => {
    consoleElement.innerHTML = "";
    console.log("Console cleared");
  });
});
function runCode() {
  const htmlCode = htmlEditor.getValue();
  const cssCode = `<style>${cssEditor.getValue()}</style>`;
  const jsCode = `
    <script>
      (function() {
        var oldLog = console.log;
        var oldError = console.error;
        
        console.log = function(message) {
          parent.postMessage({ type: 'log', message: message }, '*');
          oldLog.apply(console, arguments);
        };
        
        console.error = function(message) {
          parent.postMessage({ type: 'error', message: message }, '*');
          oldError.apply(console, arguments);
        };

        window.onerror = function(msg, url, lineNo, columnNo, error) {
          console.error(\`Error: \${msg} at line \${lineNo}, column \${columnNo}\`);
        };

        try {
          ${jsEditor.getValue()}
        } catch (err) {
          console.error(err.message);
        }
      })();
    <\/script>`;

  consoleElement.innerHTML = "Console Output:\n";
  const previewContent = htmlCode + cssCode + jsCode;
  previewFrame.srcdoc = previewContent;
}

// Run Code Button
document.getElementById("run-btn").addEventListener("click", runCode);

window.addEventListener("message", function (event) {
  if (event.data.type === "log") {
    logToCustomConsole(event.data.message, "log");
  } else if (event.data.type === "error") {
    logToCustomConsole(event.data.message, "error");
  }
});
