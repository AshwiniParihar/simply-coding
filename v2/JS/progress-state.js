// progress-state.js

// Initialize global state variables
window.currentSectionKey = null;
window.editorStates = {};
window.completedStepsByTab = {};
window.highestStepUnlocked = 1;

// Function to update the state in memory
window.updateMemoryState = function () {
  if (window.currentSectionKey) {
    // Save the editor state for the current section
    window.editorStates[window.currentSectionKey] = {
      html: htmlEditor.getValue(),
      css: cssEditor.getValue(),
      js: jsEditor.getValue(),
    };
  }

  // Save step completion status for the current section
  const activeTab = document.querySelector(".tab-button.menu__item.active");
  if (activeTab) {
    const sectionKey = activeTab.id.replace("toggle-", "");
    if (sectionKey && !window.completedStepsByTab[sectionKey]) {
      window.completedStepsByTab[sectionKey] = new Set();
    }
  }
};

// Function to restore the editor state for a given section
window.restoreEditorState = function (sectionKey) {
  if (window.editorStates[sectionKey]) {
    const { html, css, js } = window.editorStates[sectionKey];
    htmlEditor.setValue(html || "", -1);
    cssEditor.setValue(css || "", -1);
    jsEditor.setValue(js || "", -1);
  }
};

// Function to handle state restoration for completed steps
window.restoreCompletedSteps = function (sectionKey) {
  const completedSteps = window.completedStepsByTab[sectionKey] || new Set();

  // Mark steps as completed in the UI
  completedSteps.forEach((stepNumber) => {
    const stepDiv = document.getElementById(`step-${stepNumber}`);
    if (stepDiv) {
      stepDiv.classList.add("completed");
    }
  });
};

// Function to update the completed steps for a given step
window.completeStep = function (sectionKey, stepNumber) {
  if (!window.completedStepsByTab[sectionKey]) {
    window.completedStepsByTab[sectionKey] = new Set();
  }
  window.completedStepsByTab[sectionKey].add(stepNumber);

  window.updateMemoryState(); // Update the state in memory
};
