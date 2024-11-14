// debugConsole.js

function clearDebugConsole() {
  const debugContent = document.getElementById("debug-content");
  if (debugContent) {
    debugContent.innerHTML = "";
  } else {
    console.warn("Debug content element not found");
  }
}

function toggleDebugConsole() {
  const debugConsole = document.getElementById("debug-console");
  const debugToggle = document.getElementById("debug-toggle");

  if (debugConsole && debugToggle) {
    debugConsole.classList.toggle("collapsed");
    debugToggle.textContent = debugConsole.classList.contains("collapsed")
      ? "▼"
      : "▲";
  } else {
    console.warn("Debug console or toggle button not found");
  }
}

function displayDebugMessage(type, ...args) {
  const debugContent = document.getElementById("debug-content");
  if (!debugContent) {
    console.warn("Debug content element not found");
    return;
  }

  const messageElement = document.createElement("div");
  messageElement.className = type;
  messageElement.textContent = args.join(" ");

  debugContent.appendChild(messageElement);
  debugContent.scrollTop = debugContent.scrollHeight;
}

(function () {
  const originalConsole = window.console;
  window.console = {
    log: function (...args) {
      // Only logs from your editor context should be shown in debug console
      if (
        document.activeElement === document.querySelector(".editor-container")
      ) {
        displayDebugMessage("log", ...args);
      }
    },
    warn: function (...args) {
      if (
        document.activeElement === document.querySelector(".editor-container")
      ) {
        displayDebugMessage("warn", ...args);
      }
      originalConsole.warn(...args);
    },
    error: function (...args) {
      if (
        document.activeElement === document.querySelector(".editor-container")
      ) {
        displayDebugMessage("error", ...args);
      }
      originalConsole.error(...args);
    },
  };
})();

// Window error handler to capture runtime errors from the editor
window.onerror = function (message, source, lineno, colno) {
  // Check if the error is from your editor code
  if (source.includes("editor-container")) {
    displayDebugMessage(
      "error",
      `Editor Error: ${message} at ${source}:${lineno}:${colno}`
    );
  }
  return false; // Let the browser handle errors from the main page
};

// Message listener for iframe
window.addEventListener("message", (event) => {
  const debugContent = document.getElementById("debug-content");

  if (!debugContent) {
    console.warn("Debug content element not found");
    return;
  }

  if (
    event.data &&
    event.data.type === "console" &&
    event.source === document.getElementById("preview").contentWindow
  ) {
    const messageElement = document.createElement("div");
    messageElement.textContent = event.data.message;
    messageElement.className = event.data.method || "log";
    debugContent.appendChild(messageElement);
    debugContent.scrollTop = debugContent.scrollHeight;
  }
});
