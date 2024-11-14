let currentState = 1; // 0: Both visible, 1: Only content, 2: Only editor
let currentSectionKey = null;
let highestStepUnlocked = 1;
let lessonData = {};
let doneCircle, toggleButton, sectionButtons;
let completedStepsByTab = {};
let editorStates = {};
let lastOpenedStepByTab = {};

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function wrapCodeBlock(content, language = "") {
  return `<pre><code class="language-${language}">${escapeHtml(
    content
  )}</code></pre>`;
}
function initializeTooltips() {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
}
function saveCurrentEditorState() {
  const activeTab = document.querySelector(".tab-button.menu__item.active");
  if (!activeTab) return;

  const sectionKey = activeTab.id.replace("toggle-", "");
  editorStates[sectionKey] = {
    html: htmlEditor.getValue(),
    css: cssEditor.getValue(),
    js: jsEditor.getValue(),
  };
}

let restoreTimeout;

function restoreEditorState(sectionKey) {
  clearTimeout(restoreTimeout);
  restoreTimeout = setTimeout(() => {
    if (editorStates[sectionKey]) {
      const { html, css, js } = editorStates[sectionKey];

      htmlEditor.setValue(html || "", -1);
      cssEditor.setValue(css || "", -1);
      jsEditor.setValue(js || "", -1);
    } else {
      console.warn(`No saved state found for section: ${sectionKey}`);
    }
  }, 300); // Debounce delay
}

function updateToggleNumber(state) {
  const toggleNumber = document.querySelector(".toggle-number");
  if (toggleNumber) {
    toggleNumber.textContent = state + 1;
  }
}
function toggleSection() {
  currentState = (currentState + 1) % 3;

  const leftSection = document.getElementById("left-section");
  const rightSection = document.getElementById("right-section");

  if (currentState === 0) {
    leftSection?.classList.remove("d-none", "col-12");
    rightSection?.classList.remove("d-none", "col-12");
    leftSection?.classList.add("col-6");
    rightSection?.classList.add("col-6");
  } else if (currentState === 1) {
    leftSection?.classList.add("d-none");
    rightSection?.classList.remove("d-none");
    rightSection?.classList.add("col-12");
  } else if (currentState === 2) {
    rightSection?.classList.add("d-none");
    leftSection?.classList.remove("d-none");
    leftSection?.classList.add("col-12");
  }

  updateToggleNumber(currentState);
}

function toggleStepContent(stepNumber) {
  const content = document.getElementById(`step-content-${stepNumber}`);
  const step = content?.parentElement;
  const stepCircle = step?.querySelector(".step-number-circle");
  const currentTab = window.currentSectionKey;

  if (!completedStepsByTab[currentTab]) {
    completedStepsByTab[currentTab] = new Set();
  }
  const completedSteps = completedStepsByTab[currentTab];

  // Determine if the step is clickable
  const isClickable =
    stepNumber === 1 ||
    completedSteps.has(stepNumber - 1) ||
    completedSteps.has(stepNumber);

  // If not clickable and not a restoration, prevent clicking
  if (!isClickable && !completedSteps.has(stepNumber)) {
    alert("Please complete the previous step first.");
    return;
  }

  const isExpanded = step?.classList.contains("expanded");
  if (isExpanded) {
    step.classList.remove("expanded");
    content.style.maxHeight = "0px";
  } else {
    step.classList.add("expanded", "completed");
    content.style.maxHeight = "none";
    const scrollHeight = content.scrollHeight;
    content.style.maxHeight = "0px"; // Reset to animate from 0
    requestAnimationFrame(() => {
      content.style.maxHeight = `${scrollHeight}px`;
    });
    stepCircle?.classList.add("bounce");
    setTimeout(() => stepCircle?.classList.remove("bounce"), 300);

    completedSteps.add(stepNumber);
    lastOpenedStepByTab[currentTab] = stepNumber;

    window.completeStep(currentTab, stepNumber);

    // Scroll to the opened step smoothly
    const stepTop = step.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: stepTop, behavior: "smooth" });
  }

  checkAndShowDoneButton();
}

function checkAndShowDoneButton() {
  const allSteps = document.querySelectorAll(".step");
  const completedSteps = document.querySelectorAll(".step.completed");

  if (allSteps.length > 0 && completedSteps.length === allSteps.length) {
    showDoneCircle();
  } else {
    if (doneCircle) {
      doneCircle.style.display = "none"; // Hide if not all steps are completed
    }
  }
}

function showDoneCircle() {
  if (!doneCircle) return;

  requestAnimationFrame(() => {
    doneCircle.style.display = "flex";
    doneCircle.classList.add("bounce");

    if (isLastTab()) {
      doneCircle.classList.remove("btn-warning");
      doneCircle.classList.add("btn-success", "completed-lesson");
      doneCircle.innerHTML = "Lesson Completed!";
    } else {
      doneCircle.classList.remove("btn-success", "completed-lesson");
      doneCircle.classList.add("btn-warning");
      doneCircle.innerHTML = "Done! Next Section";
    }
  });
}
async function loadLessonData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.sections) {
      throw new Error("No 'sections' found in the JSON data");
    }

    lessonData = data;
    createTabButtons(data.sections);

    const firstSectionKey = Object.keys(data.sections)[0];
    if (firstSectionKey) {
      currentSectionKey = firstSectionKey;

      activateButton(document.getElementById(`toggle-${firstSectionKey}`));
      switchToSection(firstSectionKey);
    } else {
      console.warn("No sections found in the lesson data");
    }
  } catch (error) {
    console.error("Error loading lesson data:", error);
  }
}

function initializeLayout() {
  toggleButton = document.querySelector(".btn-toggle");
  sectionButtons = document.getElementById("section-buttons");

  doneCircle = document.getElementById("done-circle");

  if (!doneCircle) {
    doneCircle = document.createElement("button");
    doneCircle.id = "done-circle";
    doneCircle.className = "done-circle btn-warning";
    doneCircle.style.display = "none";
    doneCircle.innerHTML = "Done! Next Section";
    document.body.appendChild(doneCircle);
  }

  if (toggleButton) {
    toggleButton.addEventListener("click", toggleSection);
  }

  setupDoneCircleHandler();

  document.querySelectorAll(".step").forEach((step, index) => {
    step.addEventListener("click", () => toggleStepContent(index + 1));
  });
  currentState = 1; // Assume state 1 is the editor-only view
  toggleSection(); // Adjust layout to display the editor
  updateToggleNumber(currentState);
}

function setupDoneCircleHandler() {
  doneCircle.addEventListener("click", function () {
    const currentTabButton = document.querySelector(
      ".tab-button.menu__item.active"
    );
    if (!currentTabButton) return;

    // Add checkmark overlay
    if (!currentTabButton.querySelector(".overlay-icon")) {
      const overlayIcon = document.createElement("span");
      overlayIcon.className = "overlay-icon";
      overlayIcon.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="green" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>`;
      currentTabButton.style.position = "relative";
      currentTabButton.appendChild(overlayIcon);
    }

    // Move to the next tab if not on the last tab
    if (!isLastTab()) {
      const allTabs = Array.from(
        document.querySelectorAll(".tab-button.menu__item")
      );
      const currentIndex = allTabs.indexOf(currentTabButton);
      const nextTab = allTabs[currentIndex + 1];
      if (nextTab) {
        nextTab.click();
      }
    }
  });
}

function isLastTab() {
  const allTabs = document.querySelectorAll(".tab-button.menu__item");
  const activeTab = document.querySelector(".tab-button.menu__item.active");

  if (!allTabs.length || !activeTab) return false;

  const activeIndex = Array.from(allTabs).indexOf(activeTab);
  return activeIndex === allTabs.length - 1;
}

async function loadStepContent(filePath, container) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load content from: ${filePath}`);
    }

    const content = await response.text();

    // Parse and load the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    container.innerHTML = doc.body.innerHTML;

    // Initialize tooltips and modals after the content is loaded
    initializeTooltips();

    // Reinitialize all modals within the newly loaded content
    const modalElements = container.querySelectorAll(".modal");
    console.log(modalElements);
    modalElements.forEach((modalEl) => {
      bootstrap.Modal.getOrCreateInstance(modalEl);
    });

    // Set max-height to ensure the step expands correctly
    const step = container.closest(".step");
    if (step?.classList.contains("expanded")) {
      container.style.maxHeight = `${container.scrollHeight}px`;
    }

    applyHighlighting();
  } catch (error) {
    console.error("Error loading step content:", error);
    container.innerHTML =
      "<p>Error loading content. Please try again later.</p>";
  }
}

function updateSteps(contentArray) {
  const stepperContainer = document.querySelector(".stepper-container");
  stepperContainer.innerHTML = "";

  if (doneCircle) {
    doneCircle.style.display = "none";
  }

  const currentTab = window.currentSectionKey;

  if (!completedStepsByTab[currentTab]) {
    completedStepsByTab[currentTab] = new Set();
  }

  contentArray.forEach((content, index) => {
    const currentStepNumber = index + 1;
    const stepDiv = document.createElement("div");
    stepDiv.className = "step";
    stepDiv.id = `step-${currentStepNumber}`;

    // Create step header
    const stepHeader = document.createElement("div");
    stepHeader.className = "step-header";

    // Step number circle
    const stepNumberCircle = document.createElement("div");
    stepNumberCircle.className = "step-number-circle";

    const stepNumberSpan = document.createElement("span");
    stepNumberSpan.className = "step-number";
    stepNumberSpan.textContent = currentStepNumber;
    stepNumberCircle.appendChild(stepNumberSpan);

    // Step title
    const stepTitle = document.createElement("div");
    stepTitle.className = "step-title";
    stepTitle.textContent = content.title || "Step Title";

    // Append to header
    stepHeader.appendChild(stepNumberCircle);
    stepHeader.appendChild(stepTitle);

    // Step line
    const stepLine = document.createElement("div");
    stepLine.className = "step-line";

    // Step content
    const stepContent = document.createElement("div");
    stepContent.className = "step-content";
    stepContent.id = `step-content-${currentStepNumber}`;
    stepContent.style.overflow = "hidden";
    stepContent.style.transition = "max-height 0.5s ease";
    stepContent.style.maxHeight = "0px";

    // Append elements
    stepDiv.appendChild(stepHeader);
    stepDiv.appendChild(stepLine);
    stepDiv.appendChild(stepContent);
    stepperContainer.appendChild(stepDiv);

    // Mark completed steps
    if (completedStepsByTab[currentTab].has(currentStepNumber)) {
      stepDiv.classList.add("completed");
      stepNumberCircle.classList.add("completed");
    }

    // Add click event
    stepHeader.addEventListener("click", () =>
      toggleStepContent(currentStepNumber)
    );

    // Load content
    loadStepContent(content.filePath, stepContent);
  });

  // Handle initial step expansion
  const lastOpenedStep = lastOpenedStepByTab[currentTab] || 1;
  toggleStepContent(lastOpenedStep);
}

function handleInitialStepExpansion(currentTab) {
  const lastOpenedStep = lastOpenedStepByTab[currentSectionKey];
  const completedSteps = completedStepsByTab[currentTab];

  if (lastOpenedStep && completedSteps?.has(lastOpenedStep)) {
    // Open the last opened step if it exists and was completed
    const stepContent = document.getElementById(
      `step-content-${lastOpenedStep}`
    );
    const step = stepContent?.parentElement;

    if (step) {
      step.classList.add("expanded", "completed");
      stepContent.style.maxHeight = `${stepContent.scrollHeight}px`;
    }

    // Also open any completed steps before the last opened step
    for (let i = 1; i < lastOpenedStep; i++) {
      if (completedSteps.has(i)) {
        const prevStepContent = document.getElementById(`step-content-${i}`);
        const prevStep = prevStepContent?.parentElement;

        if (prevStep) {
          prevStep.classList.add("expanded", "completed");
          prevStepContent.style.maxHeight = `${prevStepContent.scrollHeight}px`;
        }
      }
    }
  } else {
    // If no last opened step, just open the first step
    const firstStepContent = document.getElementById("step-content-1");
    const firstStep = firstStepContent?.parentElement;

    if (firstStep) {
      firstStep.classList.add("expanded", "completed");
      firstStepContent.style.maxHeight = `${firstStepContent.scrollHeight}px`;
      completedSteps?.add(1);
      lastOpenedStepByTab[currentSectionKey] = 1;
      window.completeStep(window.currentSectionKey, 1);
    }
  }
}
// Function to create tab buttons for each section with icons
function createTabButtons(sections) {
  const tabContainer = document.getElementById("section-buttons");

  // Clear existing buttons
  tabContainer.innerHTML = "";

  // Loop through each section in the JSON and create a button
  for (const section in sections) {
    if (sections.hasOwnProperty(section)) {
      const button = createSectionButton(section);
      tabContainer.appendChild(button);
    }
  }

  // Set underline width for active button after rendering
  setUnderlineWidth();
}

// Function to update the content area with the section title
function updateContentArea(sectionTitle) {
  const contentArea = document.getElementById("left-section-content");
}

// Helper function to get SVG icons based on section type
const getSectionSVG = (sectionType) => {
  const svgBase = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 179.1 145">`;
  const svgEnd = `</svg>`;

  switch (sectionType.toLowerCase()) {
    case "overview":
      return `${svgBase}
        <g id="home-anm">
          <path stroke-linejoin="round" stroke-linecap="round" d="M70.5,80.1h40.7" />
          <path d="M35,64v80" />
          <path d="M145.1,143V63" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M24.9,70l65.7-50.7L156.3,70" />
        </g>
        <path stroke-linejoin="round" d="M145.1,117.6v33.1c0,1.5-1.2,2.8-2.8,2.8h-28.4c-1.5,0-2.8-1.2-2.8-2.8V126c0-11.3-9.2-20.5-20.5-20.5l0,0
          c-11.3,0-20.5,9.2-20.5,20.5v27.5h16H37.8c-1.5,0-2.8-1.2-2.8-2.8v-34.2" />
      ${svgEnd}`;
    case "create":
      return `${svgBase}
        <g id="strategy-anm">
          <path d="M84.1,50.4L72,64.7c-2,2.4-5.2,3.5-8.3,3l-40.1-6.8c-3.2-0.6-5.8,2.4-4.8,5.5L42,127.9c1.2,3.6,4.6,6.1,8.4,6.1
            h81.6c3.9,0,7.3-2.6,8.5-6.3l21.5-61.4c0.9-3-1.7-6-4.9-5.4l-38.3,6.7c-3,0.6-6.2-0.5-8.2-2.8L97.4,50.2
            C93.8,46.3,87.6,46.3,84.1,50.4z" />
        </g>
        <path stroke-linecap="round" d="M38.8,153.5h105.5" />
        <path stroke-linecap="round" d="M66.8,112.5h49.5" />
      ${svgEnd}`;
    case "write":
      return `${svgBase}
        <g id="period-anm">
          <path stroke-linecap="round" d="M30.8,24.7h118.3 M117.3,71.2l9.7-6.7c0.7-0.4,1.1-1.1,1.1-1.9V24.7H50v37.8" />
          <path stroke-linecap="round" d="M149.4,153.3H30.6 M75.5,90.7l-23.1,21.2c-1.6,1.4-2.4,3.4-2.4,5.6v35.9h78.1V113" />
          <g id="period-line">
            <path stroke-linecap="round" d="M50,62.5l40,44.2" />
            <path stroke-linecap="round" d="M128.1,111.7L95.2,73.4" />
          </g>
        </g>
      ${svgEnd}`;
    case "read":
      return `${svgBase}
        <path stroke-linecap="round" d="M94,139c-4.8,1.3-8.8,1.7-11.4,1.8c0,0-18.3,1.1-36.9-11.6c-1.9-1.3-4.7-3.2-7.8-6.2c-1.7-1.6-2.9-2.9-3.4-3.6
          c0,0-3.6-4.2-6.1-8.6c-4.6-8.4-5.4-18.9-5.5-21l0,0V75.5v-39c0-0.7,0.5-1.3,1.2-1.5l58-14.2c0.2-0.1,0.5-0.1,0.7,0l57.9,14.7
          c0.7,0.2,1.1,0.8,1.1,1.5v29.7" />
        <path id="security-cir" stroke-linecap="round" d="M158.3,120.7c0,18.3-14.8,33.1-33.1,33.1s-33-14.8-33-33.1s14.8-33.1,33.1-33.1S158.3,102.4,158.3,120.7z" />
        <g id="security-strok">
          <path stroke-linecap="round" d="M151.1,104.5l-25,25c-1.3,1.3-3.5,1.3-4.9,0l-9.1-9.1" />
          <path stroke-linecap="round" d="M82.6,43L23.1,62.3" />
          <path stroke-linecap="round" d="M82.6,68.4L23.1,87.6" />
        </g>
      ${svgEnd}`;
    default:
      return `${svgBase}
        <circle cx="90.5" cy="90.2" r="19.7" />
        <g id="settings-anm">
          <path stroke-linejoin="round" d="M144.7,73.8l-6.2-1c-0.6-1.5-1.2-3-1.9-4.5l3.6-5.1c3.2-4.4,2.7-10.5-1.2-14.3l-7.4-7.4
            c-2.1-2.1-4.9-3.3-7.8-3.3c-2.3,0-4.5,0.7-6.4,2.1l-5.1,3.6c-1.6-0.7-3.2-1.4-4.8-2l-1-6.1c-0.9-5.4-5.5-9.3-10.9-9.3H85.1
            c-5.4,0-10,3.9-10.9,9.2L73.1,42c-1.5,0.6-3,1.2-4.5,1.9l-5-3.6c-1.9-1.4-4.1-2.1-6.5-2.1c-3,0-5.8,1.2-7.8,3.3l-7.4,7.4
            c-3.8,3.8-4.3,9.8-1.2,14.3l3.7,5.2c-0.7,1.5-1.3,3-1.8,4.5l-6.1,1c-5.4,0.9-9.3,5.5-9.3,10.9v10.5c0,5.4,3.9,10,9.2,10.9l6.3,1.1
            c0.6,1.5,1.2,3,1.9,4.5l-3.6,5c-3.2,4.4-2.7,10.5,1.2,14.3l7.4,7.4c2.1,2.1,4.9,3.3,7.8,3.3c2.3,0,4.5-0.7,6.4-2.1L69,136
            c1.4,0.6,2.8,1.2,4.2,1.7l1,6.2c0.9,5.4,5.5,9.3,10.9,9.3h10.5c5.4,0,10-3.9,10.9-9.2l1-6.2c1.5-0.6,3-1.2,4.5-1.9l5.1,3.6
            c1.9,1.4,4.1,2.1,6.5,2.1c3,0,5.7-1.2,7.8-3.3l7.4-7.4c3.8-3.8,4.3-9.8,1.2-14.3l-3.6-5.1c0.7-1.5,1.3-3,1.9-4.5l6.2-1
            c5.4-0.9,9.3-5.5,9.3-10.9V84.8C153.9,79.3,150.1,74.7,144.7,73.8z" />
        </g>
      ${svgEnd}`;
  }
};

// Function to create section button
function createSectionButton(sectionKey) {
  const button = document.createElement("button");
  button.id = `toggle-${sectionKey}`;
  button.classList.add("tab-button", "menu__item");

  const iconDiv = document.createElement("div");
  iconDiv.classList.add("menu__icon");
  iconDiv.innerHTML = getSectionSVG(sectionKey);

  const buttonText = document.createElement("strong");
  buttonText.classList.add("menu__text");
  buttonText.textContent = capitalizeFirstLetter(sectionKey);

  button.appendChild(iconDiv);
  button.appendChild(buttonText);

  button.onclick = () => {
    activateButton(button);
    switchToSection(sectionKey); // Ensure it loads the correct sectionKey
    updateContentArea(sectionKey);
  };

  return button;
}

function isLastTab() {
  const allTabs = document.querySelectorAll(".tab-button.menu__item");
  const activeTab = document.querySelector(".tab-button.menu__item.active");

  if (!allTabs.length || !activeTab) return false;

  const activeIndex = Array.from(allTabs).indexOf(activeTab);
  return activeIndex === allTabs.length - 1;
}
// Function to activate button and add animations
function activateButton(button) {
  const prevActiveButton = document.querySelector(
    ".tab-button.menu__item.active"
  );

  if (prevActiveButton) {
    // Save state of the current active section before switching
    saveCurrentEditorState();
    prevActiveButton.classList.remove("active");
  }

  button.classList.add("active");
  const sectionKey = button.id.replace("toggle-", "");
  switchToSection(sectionKey);
  window.updateMemoryState();
  setUnderlineWidth();
  updateDoneButtonState();
}

function updateDoneButtonState() {
  const doneCircle = document.getElementById("done-circle");
  if (!doneCircle) return;

  if (isLastTab()) {
    doneCircle.classList.remove("btn-warning");
    doneCircle.classList.add("btn-success", "completed-lesson");
    doneCircle.innerHTML = "Lesson Completed!";
  } else {
    doneCircle.classList.remove("btn-success", "completed-lesson");
    doneCircle.classList.add("btn-warning");
    doneCircle.innerHTML = "Done! Next Section";
  }
}
// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function to set underline width for active button
function setUnderlineWidth() {
  const activeButton = document.querySelector(".tab-button.menu__item.active");
  if (activeButton) {
    const text = activeButton.querySelector(".menu__text");
    const textWidth = text.offsetWidth;
    activeButton.style.setProperty("--text-width", `${textWidth}px`);
  }
}

// Load the lesson data

const style = document.createElement("style");
style.textContent = `
  .done-circle.completed-lesson {
    background-color: #28a745 !important;
    transition: background-color 0.3s ease;
  }
  .done-circle.btn-warning {
    background-color: #f8983c;
    color: #fff;
  }
  .done-circle.btn-success {
    background-color: #28a745;
    color: #fff;
  }
`;

function loadStarterCode(starterCode) {
  if (starterCode.html) htmlEditor.setValue(starterCode.html, -1);

  if (starterCode.css) cssEditor.setValue(starterCode.css, -1);

  if (starterCode.js) jsEditor.setValue(starterCode.js, -1);
}
function switchToSection(sectionKey) {
  console.log(`Switching to section: ${sectionKey}`);
  window.updateMemoryState();

  // Save current section's state before switching
  if (window.currentSectionKey) {
    const expandedSteps = document.querySelectorAll(".step.expanded");
    if (expandedSteps.length > 0) {
      const stepNumbers = Array.from(expandedSteps).map((step) =>
        parseInt(step.id.replace("step-", ""))
      );
      const highestStep = Math.max(...stepNumbers);
      lastOpenedStepByTab[window.currentSectionKey] = highestStep;
    }
  }

  // Update the current section key
  window.currentSectionKey = sectionKey;

  // Check if the section exists in the lesson data
  const sectionData = lessonData.sections[sectionKey];
  if (!sectionData) {
    console.error(`No data found for section: ${sectionKey}`);
    return;
  }

  // Restore editor state
  window.restoreEditorState(sectionKey);

  // Load starter code if available
  if (sectionData["starter-code"]) {
    loadStarterCode(sectionData["starter-code"]);
  }

  // Update content area and steps
  updateContentArea(sectionKey);
  updateSteps(sectionData.content);
  window.restoreCompletedSteps(sectionKey);

  // Open the last visited step or the first step
  const lastStep = lastOpenedStepByTab[sectionKey] || 1;
  setTimeout(() => toggleStepContent(lastStep), 100);

  // Apply highlighting and initialize tooltips

  initializeTooltips();
}
document.head.appendChild(style);
function setupStepNavigation() {
  const doneCircle = document.getElementById("done-circle");
  doneCircle.addEventListener("click", () => {
    const activeStep = document.querySelector(".step.active");
    if (!activeStep) return;

    const nextStep = activeStep.nextElementSibling;
    if (nextStep && nextStep.classList.contains("step")) {
      activeStep.classList.remove("active");
      nextStep.classList.add("active");
    } else {
      console.log("No more steps.");
    }
  });
}
window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);
  //todo: add fallback lesson here incase lesson is broke
  const lessonJsonUrl = urlParams.get("lesson") || "./main-content.json";

  if (lessonJsonUrl) {
    loadLessonData(lessonJsonUrl);
    initializeTooltips(); // Initialize tooltips after loading content
  } else {
    console.error("No lesson URL provided");
  }

  // Restore the editor state for the initial active section (if any)
  const activeTab = document.querySelector(".tab-button.menu__item.active");
  if (activeTab) {
    const sectionKey = activeTab.id.replace("toggle-", "");
    restoreEditorState(sectionKey);
  }
});
// Add this function to reset the code for the current section
function resetCodeToStarter() {
  // Check if the current section is valid
  if (!currentSectionKey || !lessonData.sections[currentSectionKey]) {
    console.error("No valid section to reset.");
    return;
  }

  const sectionData = lessonData.sections[currentSectionKey];
  const starterCode = sectionData["starter-code"];

  // Check if starter code exists for the current section
  if (starterCode) {
    loadStarterCode(starterCode);
  } else {
    console.warn(`No starter code found for section: ${currentSectionKey}`);
  }
}

document
  .getElementById("reset-btn")
  .addEventListener("click", resetCodeToStarter);

function loadTryItOut(html, css = "", js = "") {
  const starterCode = { html, css, js };
  tryItOut(starterCode);
  runCode();
}
function tryItOut(starterCode) {
  if (!starterCode) return;

  if (starterCode.html) htmlEditor.setValue(starterCode.html, -1);
  if (starterCode.css) cssEditor.setValue(starterCode.css, -1);
  if (starterCode.js) jsEditor.setValue(starterCode.js, -1);

  // Switch to the editor tab if needed
  currentState = 2; // Assume state 1 is the editor-only view
  toggleSection(); // Adjust layout to display the editor
}
function applyHighlighting() {
  document.querySelectorAll("pre code").forEach((block) => {
    // Get the raw text content
    let content = block.textContent;

    // Try to detect if it's HTML by looking for common patterns
    function looksLikeHTML(code) {
      const htmlPatterns = [
        /<\/?[a-z][\s\S]*>/i, // HTML tags
        /<!DOCTYPE/i, // DOCTYPE declaration
        /<!(--)?[^>]*>/, // HTML comments
      ];
      return htmlPatterns.some((pattern) => pattern.test(code));
    }

    // Determine language
    let result;
    if (looksLikeHTML(content)) {
      // Force HTML highlighting if it looks like HTML
      result = hljs.highlight(content, {
        language: "html",
        ignoreIllegals: true,
      });
    } else {
      // Let highlight.js auto-detect the language
      result = hljs.highlightAuto(content, [
        "javascript",
        "html",
        "css",
        "xml",
        "json",
        "python",
        "java",
        "cpp",
        "csharp",
      ]);
    }

    // Set the highlighted HTML
    block.innerHTML = result.value;

    // Add hljs class and detected language class
    block.classList.add("hljs");
    block.classList.add(`language-${result.language}`);

    // Log the detected language (helpful for debugging)
    console.log("Detected language:", result.language);
  });
}

// Setup function to handle HTML entities
function setupCodeBlocks() {
  document.querySelectorAll("pre code").forEach((block) => {
    block.textContent = block.textContent
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  });
}

document.addEventListener(
  "DOMContentLoaded",
  initializeLayout,

  () => {
    window.tryItOut = tryItOut;
    setupCodeBlocks();
    applyHighlighting();
  }
);
