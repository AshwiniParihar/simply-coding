let originalCodeBySection = {}; // Store original code per section
const switchTab = (tab) => {
  const tabs = ["html", "css", "js"];

  tabs.forEach((t) => {
    const input = document.getElementById(`${t}-input`);
    const tabButton = document.querySelector(
      `.editor-tab[onclick="switchTab('${t}')"]`
    );
    const lineNumbers = document.getElementById(`line-numbers-${t}`);

    if (input && tabButton && lineNumbers) {
      // Show or hide the textarea and line numbers for each tab
      if (t === tab) {
        input.classList.add("active"); // Show the active tab's textarea
        lineNumbers.style.display = "block"; // Show the line numbers
        tabButton.classList.add("active"); // Set the tab as active
      } else {
        input.classList.remove("active"); // Hide other textareas
        lineNumbers.style.display = "none"; // Hide other line numbers
        tabButton.classList.remove("active"); // Remove active state from other tabs
      }
    } else {
      console.log(`Element not found for: ${t}`);
    }
  });

  updateCopyButton(tab); // Update the copy button label
};

const updateCopyButton = (activeTab) => {
  const copyButton = document.getElementById("copyButton");
  if (copyButton) {
    copyButton.textContent = `Copy ${activeTab.toUpperCase()}`;
  }
};

const runCode = () => {
  const html = document.getElementById("html-input")?.value || "";
  const css = document.getElementById("css-input")?.value || "";
  const js = document.getElementById("js-input")?.value || "";

  const preview = document.getElementById("preview");

  // Validate the HTML syntax before running the code
  const validationErrors = validateHtmlSyntax(html);
  if (validationErrors.length > 0) {
    const escapedErrors = validationErrors.map((error) => escapeHtml(error));
    displayDebugMessage(
      "error",
      "HTML Syntax Error: " + escapedErrors.join(", ")
    );

    // Display a user-friendly error message in the preview
    if (preview) {
      preview.srcdoc = `
        <html>
          <body>
            <h1>HTML Syntax Error</h1>
            <p>Please check your HTML code for errors:</p>
            <ul>
              ${escapedErrors.map((error) => `<li>${error}</li>`).join("")}
            </ul>
          </body>
        </html>
      `;
    }
    return; // Stop execution if there are HTML syntax errors
  }

  if (preview) {
    // Sanitize the HTML to ensure it's well-formed
    const sanitizedHtml = sanitizeHtml(html);

    // Create the srcdoc content
    preview.srcdoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${sanitizedHtml}
          <script>
            ${setupErrorHandling()}
            ${setupConsoleInterception()}
            try {
              ${js}
            } catch (error) {
              console.error('Error:', error.message);
            }
          <\/script>
        </body>
      </html>`;
  }
};
const sanitizeHtml = (htmlString) => {
  // Use DOMParser to parse and sanitize the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // Remove any script tags to prevent unwanted code execution
  doc.querySelectorAll("script").forEach((script) => script.remove());

  // Return the sanitized HTML as a string
  return doc.body.innerHTML;
};
const validateHtmlSyntax = (htmlString) => {
  const parser = new DOMParser();
  const parsedDoc = parser.parseFromString(htmlString, "text/html");
  const errors = [];

  // Check for errors in the parsed HTML
  const parserErrors = parsedDoc.querySelectorAll("parsererror");
  if (parserErrors.length > 0) {
    errors.push("Invalid HTML structure");
  }

  // Check for unclosed tags
  const unclosedTags = findUnclosedTags(htmlString);
  errors.push(...unclosedTags.map((tag) => `Unclosed tag: <${tag}>`));

  return errors;
};
const findUnclosedTags = (htmlString) => {
  const openingTags = htmlString.match(/<\w+/g) || [];
  const closingTags = htmlString.match(/<\/\w+>/g) || [];
  const unclosedTags = [];

  openingTags.forEach((openTag) => {
    const tagName = openTag.slice(1);
    if (!closingTags.find((closeTag) => closeTag === `</${tagName}>`)) {
      unclosedTags.push(tagName);
    }
  });

  return unclosedTags;
};
const escapeHtml = (unsafeString) => {
  return unsafeString
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
// Reset code without asking for confirmation (used for loading sections)
const resetCodeWithoutConfirmation = (sectionName) => {
  const originalCode = originalCodeBySection[sectionName];

  if (!originalCode) {
    console.error(`No original code found for section: ${sectionName}`);
    const starterCode = lessonData.sections[sectionName]?.["starter-code"];
    if (starterCode) {
      updateEditor(starterCode);
      setOriginalCode(
        sectionName,
        starterCode.html,
        starterCode.css,
        starterCode.js
      );
    }
  } else {
    updateEditor(originalCode);
  }
};

// Ask for confirmation before resetting code (used when user presses reset button)
const resetCodeWithConfirmation = () => {
  if (!currentSection) {
    console.error("No section is currently active.");
    return;
  }

  const confirmReset = confirm(
    "Are you sure you want to reset the code? This will clear any changes you've made."
  );

  if (confirmReset) {
    console.log("Resetting code for section:", currentSection);
    const starterCode = lessonData.sections[currentSection]?.["starter-code"];
    updateEditor(starterCode);
    // resetCodeWithoutConfirmation(currentSection); // Reset the current section's code

    alert("Code has been reset to its original state.");
  }
};

const setOriginalCode = (sectionName, html, css, js) => {
  originalCodeBySection[sectionName] = { html, css, js };
  console.log(`Set original code for section: ${sectionName}`);
};

// Make sure to set the currentMainSection correctly
const switchSection = (sectionName) => {
  if (originalCodeBySection[sectionName]) {
    console.log("Switching to section:", sectionName);
    currentSection = sectionName; // Update the current active section
    resetCodeWithoutConfirmation(sectionName); // Reset to the original code when switching sections
    console.log("Switched to section:", sectionName);
  } else {
    console.error(`No original code found for section: ${sectionName}`);
  }
};
// Helper functions to handle error reporting and console interception in the code preview
const setupErrorHandling = () => `
  window.onerror = function (message, source, lineno, colno, error) {
    // Send error message to parent window for display in debug console
    window.parent.postMessage({
      type: 'console',
      method: 'error',
      message: 'Student Code Error: ' + message + ' at ' + source + ':' + lineno + ':' + colno
    }, '*');
    return true; // Prevent default error handling
  };
`;

const setupConsoleInterception = () => `
  (function() {
    const methods = ['log', 'info', 'warn', 'error'];
    const originalConsole = {};

    methods.forEach(method => {
      originalConsole[method] = console[method];
      console[method] = function(...args) {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : arg
        ).join(' ');

        // Send only student code logs to parent window
        window.parent.postMessage({ 
          type: 'console', 
          method: method, 
          message: message 
        }, '*');

        originalConsole[method].apply(console, args); 
      };
    });
  })();
`;

const copyCode = async () => {
  // Get the active tab (html, css, or js)
  const activeTabElement = document.querySelector(".editor-tab.active");
  if (!activeTabElement) {
    alert("No active tab selected.");
    return;
  }

  const activeTab = activeTabElement.textContent.toLowerCase();

  // Ensure the correct editor is targeted for the active tab
  const codeInput = document.getElementById(`${activeTab}-input`);

  if (codeInput && codeInput.value) {
    try {
      // Copy the code using the clipboard API
      await navigator.clipboard.writeText(codeInput.value);
      alert(`${activeTab.toUpperCase()} code copied to clipboard!`);
    } catch (err) {
      console.error("Failed to copy code: ", err);
      alert("Failed to copy code to clipboard.");
    }
  } else {
    console.log(`Active Tab: ${activeTab}`, codeInput); // Add a console log to check what's happening
    alert(
      `No code found for ${activeTab.toUpperCase()} or the editor is not available.`
    );
  }
};
const openFullScreen = () => {
  const html = document.getElementById("html-input")?.value || "";
  const css = document.getElementById("css-input")?.value || "";
  const js = document.getElementById("js-input")?.value || "";

  const newWindow = window.open("", "_blank");
  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}<\/script>
        </body>
      </html>
    `);
    newWindow.document.close();
  }
  if (typeof clearDebugConsole === "function") {
    clearDebugConsole();
  } else {
    console.warn("clearDebugConsole function not found");
  }
};

window.addEventListener("message", (event) => {
  const preview = document.getElementById("preview");
  // Check if the message is from the preview iframe
  if (!preview || event.source !== preview.contentWindow) {
    return; // Ignore messages not from the preview iframe
  }

  const debugContent = document.getElementById("debug-content");
  if (!debugContent) return;

  if (event.data && event.data.type) {
    let messageDiv = document.createElement("div");

    switch (event.data.type) {
      case "console":
        messageDiv.className = event.data.method || "log";
        messageDiv.textContent = event.data.message;
        break;
      case "error":
        messageDiv.className = "error";
        messageDiv.textContent = event.data.message;
        break;
      default:
        return; // Ignore unknown message types
    }

    debugContent.appendChild(messageDiv);
    debugContent.scrollTop = debugContent.scrollHeight; // Auto-scroll to the bottom
  }
});

// Export functions if using modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    switchTab,
    updateCopyButton,
    runCode,
    copyCode,
    openFullScreen,
    resetCodeWithConfirmation,
    setOriginalCode,
    switchSection, // Export switchSection to ensure it can be called when switching sections
    clearDebugConsole,
  };
}
document.addEventListener("DOMContentLoaded", function () {
  const editorContainer = document.querySelector(".editor-container");
  const sizeButtons = editorContainer.querySelectorAll(".editor-size-btn");
  const textareas = editorContainer.querySelectorAll(".code-input");
  const lineNumbersContainers = document.querySelectorAll(".line-numbers");

  function setEditorSize(size) {
    sizeButtons.forEach((btn) => btn.classList.remove("active"));
    event.target.classList.add("active");

    let newHeight;

    switch (size) {
      case "1x":
        newHeight = 300;

        break;
      case "2x":
        newHeight = 600;

        break;
      case "3x":
        newHeight = 900;

        break;
      default:
        newHeight = 300;
    }

    textareas.forEach((textarea) => {
      textarea.style.height = newHeight + "px";
      textarea.style.width = newWidth + "%";
    });
    lineNumbersContainers.forEach((lineNumbers) => {
      lineNumbers.style.height = newHeight + "px"; // Match height for line numbers
    });
    console.log(`Editor resized to ${size}: ${newHeight}px`);
  }

  sizeButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      const size = event.target.getAttribute("data-size");
      setEditorSize(size);
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const previewContainer = document.querySelector(".preview-container");
  const preview = document.getElementById("preview");
  const sizeButtons = document.querySelectorAll(".preview-size-btn");
  const video = document.getElementById("lesson-video");
  function setPreviewSize(size) {
    sizeButtons.forEach((btn) => btn.classList.remove("active"));
    event.target.classList.add("active");

    switch (size) {
      case "1x":
        preview.style.height = "300px";
        previewContainer.classList.remove("mobile-preview");
        break;
      case "2x":
        preview.style.height = "600px";
        previewContainer.classList.remove("mobile-preview");
        break;
      case "full":
        preview.style.height = "100vh";
        previewContainer.classList.remove("mobile-preview");
        break;
      case "mobile":
        preview.style.height = "667px"; // iPhone 8 height
        previewContainer.classList.add("mobile-preview");
        break;
    }
  }

  sizeButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      const size = event.target.getAttribute("data-size");
      setPreviewSize(size);
    });
  });
  video.addEventListener("dblclick", () => {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
      // Firefox
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
      // Chrome, Safari, and Opera
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      // IE/Edge
      video.msRequestFullscreen();
    }
  });
});
