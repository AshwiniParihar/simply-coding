// Utility functions
const safelyGetElement = (id, parent = document) =>
    parent.getElementById(id) ||
    parent.querySelector(`#${id}`) ||
    console.error(`Element with id "${id}" not found`);

// State management
let lessonData = {
  title: "Loading...",
  videoUrl: "",
  sections: {},
};
let currentSection = ""; // Track the current active section

let userCode = JSON.parse(localStorage.getItem("userCode") || "{}");

// Main functions
const loadLessonData = () => {
  return fetch(lessonJsonUrl)
      .then((response) =>
          response.ok
              ? response.json()
              : Promise.reject(`HTTP error! status: ${response.status}`)
      )
      .then((data) => {
        lessonData = data;
        loadLesson();
        setupLessonStructure();
        return data;
      })
      .catch((error) => {
        console.error("Failed to load lesson data:", error);
        safelyGetElement("lesson-title").textContent = "Error Loading Lesson";
        throw error;
      });
};

// Main toggleContentSection function
const toggleContentSection = (sectionName, subSectionIndex = 0) => {
  // Save the user's current code before switching sections
  if (currentSection) {
    saveUserCode(currentSection);
  }

  safelyGetElement("lesson-content").innerHTML = "";

  // Highlight the active section button
  Object.keys(lessonData.sections).forEach((section) => {
    const button = safelyGetElement(`toggle-${section}`);
    if (button) {
      button.classList.toggle("active", section === sectionName);
    }
  });

  loadSection(lessonData.sections, sectionName, subSectionIndex);

  // Check if attempting to close all sections
  const allSections = document.querySelectorAll(".section-all-content");
  const visibleSections = Array.from(allSections).filter(
      (section) => section.style.maxHeight !== "0px"
  );

  if (visibleSections.length === 1 && currentSection === sectionName) {
    // Apply the shake effect to the toggle button if this is the last visible section
    const toggleButton = document.getElementById(`toggle-${sectionName}`);
    if (toggleButton) {
      toggleButton.classList.add("shake-effect");

      // Remove the shake effect after the animation completes (500ms)
      setTimeout(() => {
        toggleButton.classList.remove("shake-effect");
      }, 500);
      return; // Do not allow closing the last section
    }
  }

  // Update current section only if it's different
  if (currentSection !== sectionName) {
    currentSection = sectionName;
    loadUserCodeOrStarterCode(sectionName);
    switchSection(sectionName);
  }

  localStorage.setItem(
      "activeSection",
      JSON.stringify({ sectionName, subSectionIndex })
  );
};

const loadLesson = () => {
  safelyGetElement("lesson-title").textContent =
      lessonData.title || "Untitled Lesson";
  const videoElement = safelyGetElement("lesson-video");
  if (videoElement && lessonData.videoUrl)
    videoElement.src = lessonData.videoUrl;
};

const setupLessonStructure = () => {
  const sectionButtons = safelyGetElement("section-buttons");
  if (!sectionButtons) {
    return console.error("Required container not found.");
  }

  sectionButtons.innerHTML = "";
  const savedActiveSection =
      JSON.parse(localStorage.getItem("activeSection")) || null;

  Object.entries(lessonData.sections).forEach(([sectionType]) => {
    if (lessonData.sections[sectionType]) {
      // Ensure section exists
      const button = createSectionButton(sectionType, savedActiveSection);
      sectionButtons.appendChild(button);
    }
  });

  if (!savedActiveSection && sectionButtons.firstChild) {
    sectionButtons.firstChild.click();
  }
};

const createSectionButton = (sectionType, savedActiveSection) => {
  const button = document.createElement("button");
  button.id = `toggle-${sectionType}`;
  button.textContent =
      sectionType.charAt(0).toUpperCase() + sectionType.slice(1);
  button.classList.add("section-button");
  button.onclick = () => toggleContentSection(sectionType, 0);

  if (savedActiveSection?.sectionName === sectionType) {
    toggleContentSection(
        savedActiveSection.sectionName,
        savedActiveSection.subSectionIndex
    );
    button.classList.add("active");
  }

  return button;
};
const createCollapsibleSectionElement = (title, content) => {
  const sectionElement = document.createElement("div");
  sectionElement.className = "collapsible-section";

  // Create the header for the collapsible section
  const header = document.createElement("h3");
  header.className = "collapsible-header";

  // Create the arrow icon (initially down)
  const arrow = document.createElement("span");
  arrow.className = "toggle-arrow";
  arrow.innerHTML = "&#9660;"; // Down arrow when closed
  arrow.style.marginLeft = "auto"; // Ensures max space between title and arrow

  // Set the header text and append the arrow
  const titleText = document.createElement("span");
  titleText.textContent = title;

  header.appendChild(titleText); // Add title
  header.appendChild(arrow); // Add arrow after title with max space

  // Create the content area and wrap it in the markdown-body class
  const contentArea = document.createElement("div");
  contentArea.className = "collapsible-content markdown-body";
  contentArea.innerHTML = content;

  // Initially hide the content
  contentArea.style.maxHeight = "0px";
  contentArea.style.overflow = "hidden";
  contentArea.style.padding = "0px";
  contentArea.style.transition = "max-height 0.5s ease, padding 0.5s ease";

  // Add click event to toggle the collapsible section
  header.addEventListener("click", () => {
    const isVisible = contentArea.style.maxHeight !== "0px";
    if (isVisible) {
      contentArea.style.maxHeight = "0px"; // Close the section
      contentArea.style.padding = "0px";
      contentArea.style.overflow = "hidden";
      arrow.innerHTML = "&#9660;"; // ▼ down arrow
    } else {
      var extraheight = 2000 + contentArea.scrollHeight; /* added by Steve to make sure we don't accidentally hide the bottom of some content */
      contentArea.style.maxHeight = extraheight + "px"; // Fully expand content
      contentArea.style.padding = "0px";
      contentArea.style.overflow = "visible";
      arrow.innerHTML = "&#9650;"; // ▲ up arrow
    }
  });

  sectionElement.appendChild(header);
  sectionElement.appendChild(contentArea);

  return sectionElement;
};

const loadSection = async (sections, sectionName, subSectionIndex = 0) => {
  const section = sections[sectionName];
  if (!section) {
    return console.log(`Section ${sectionName} not found or empty.`);
  }

  const contentArea = safelyGetElement("lesson-content");
  contentArea.innerHTML = ""; // Clear the content area before loading

  let firstSectionElement = null;

  // Sequentially load each content block
  for (let index = 0; index < section.content.length; index++) {
    const contentBlock = section.content[index];

    if (contentBlock.filePath && contentBlock.fileType) {
      try {
        const sectionContent = await loadFileContent(
          contentBlock.filePath,
          contentBlock.fileType
        );

        // Create the collapsible section for each content block
        const sectionElement = createCollapsibleSectionElement(
          contentBlock.title,
          sectionContent
        );

        if (index === subSectionIndex) {
          firstSectionElement = sectionElement; // Save the first section element
        }

        contentArea.appendChild(sectionElement);

        // Execute any scripts in the loaded content
        executeScripts(sectionElement);
      } catch (error) {
        console.error("Error loading section content:", error);
      }
    }
  }

  initializeNextButtons();

  // Simulate a click to open the first section by default
  if (firstSectionElement) {
    const firstHeader = firstSectionElement.querySelector(
      ".collapsible-header"
    );
    firstHeader.click(); // Simulate a click to open the first section
  }
};
function executeScripts(element) {
  const scripts = element.getElementsByTagName("script");
  for (let script of scripts) {
    eval(script.innerHTML);
  }
}
// Fetch content from either Markdown or HTML file
marked.setOptions({
  highlight: function (code, lang) {
    // Check if the language is valid for highlight.js
    const validLang = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(validLang, code).value;
  },
});
const loadFileContent = (filePath, fileType) => {
  return fetch(filePath)
      .then((response) => {
        console.log("Response is happening");
        if (!response.ok) {
          throw new Error(`Failed to load file: ${filePath}`);
        }
        console.log("File fetched successfully:", response);
        return response.text();
      })
      .then((content) => {
        console.log("Content:", content);
        let parsedContent;
        if (fileType === "markdown") {
          parsedContent = marked.parse(content); // Parse Markdown into HTML
        } else if (fileType === "html") {
          parsedContent = content; // HTML content is returned directly
        } else {
          throw new Error(`Unsupported file type: ${fileType}`);
        }

        // After rendering the content, highlight the code
        setTimeout(() => {
          hljs.highlightAll(); // Ensure highlight.js runs after the markdown is added to the DOM
        }, 0);

        return parsedContent;
      })
      .catch((error) =>
          console.error(`Error loading content file: ${error.message}`)
      );
};
// const createSectionElement = (content, sectionTitle) => {
//   const sectionElement = document.createElement("div");
//   sectionElement.className = "section";

//   // Create the section title and content
//   let sectionHTML = `
//     <h2 class="section-title">${sectionTitle}</h2>
//     <div class="section-all-content" style="max-height: auto; overflow: visible;">
//       ${content} <!-- Directly use the loaded content -->
//     </div>
//   `;

//   sectionElement.innerHTML = sectionHTML;
//   return sectionElement;
// };

const updateEditor = (code) => {
  ["html", "css", "js"].forEach((lang) => {
    const input = safelyGetElement(`${lang}-input`);
    if (input) input.value = code[lang] || "";
  });
  saveUserCode(currentSection);
  switchTab("html");
};

const loadUserCodeOrStarterCode = (sectionName) => {
  const starterCode = lessonData.sections[sectionName]?.["starter-code"];
  let codeToLoad = { html: "", css: "", js: "" };

  if (starterCode) {
    // Load starter code if no user code exists
    updateEditor(starterCode);
    setOriginalCode(
        sectionName,
        starterCode.html || "",
        starterCode.css || "",
        starterCode.js || ""
    );
    codeToLoad = starterCode;
  } else {
    // Default: Empty editor if no starter code exists
    updateEditor(codeToLoad);
    setOriginalCode(sectionName, "", "", "");
  }

  // Remove localStorage saving
  // userCode[sectionName] = codeToLoad;
  // localStorage.setItem(userCodeKey, JSON.stringify(userCode[sectionName])); // Remove this line
};
const saveUserCode = (sectionName) => {
  // const lessonId = lessonData.lessonId || lessonData.title;
  // const userCodeKey = `${lessonId}_${sectionName}`;

  userCode[sectionName] = {
    html: safelyGetElement("html-input")?.value || "",
    css: safelyGetElement("css-input")?.value || "",
    js: safelyGetElement("js-input")?.value || "",
  };

  // localStorage.setItem(userCodeKey, JSON.stringify(userCode[sectionName]));
  // const saveCurrentSection = () => {
  //   if (currentSection) {
  //     saveUserCode(currentSection); // Reuse the existing save function
  //     alert("Code saved successfully!");
  //   } else {
  //     console.error("No section is currently active.");
  //   }
  // };
  function updateLineNumbers(editorType) {
    const textarea = document.getElementById(`${editorType}-input`);
    const lineNumbersDiv = document.getElementById(
        `line-numbers-${editorType}`
    );

    const numberOfLines = textarea.value.split("\n").length;
    let lineNumbersHtml = "";

    for (let i = 1; i <= numberOfLines; i++) {
      lineNumbersHtml += `${i}<br>`;
    }

    lineNumbersDiv.innerHTML = lineNumbersHtml;
  }

  // Synchronize scrolling of textarea and line numbers
  function syncScroll(editorType) {
    const textarea = document.getElementById(`${editorType}-input`);
    const lineNumbersDiv = document.getElementById(
        `line-numbers-${editorType}`
    );

    textarea.addEventListener("scroll", () => {
      lineNumbersDiv.scrollTop = textarea.scrollTop;
    });
  }

  // Initialize scroll syncing for each editor type
  ["html", "css", "js"].forEach((editorType) => {
    syncScroll(editorType); // Sync scroll for each editor
    updateLineNumbers(editorType); // Ensure line numbers are initialized
  });
  // Event listeners
  window.addEventListener("load", () => {
    const savedActiveSection = JSON.parse(
        localStorage.getItem("activeSection")
    );
    updateLineNumbers("html");
    updateLineNumbers("css");
    updateLineNumbers("js");
    // loadLessonData()
    //   .then(() => {
    //     if (savedActiveSection) {
    //       toggleContentSection(
    //         savedActiveSection.sectionName,
    //         savedActiveSection.subSectionIndex
    //       );
    //     } else {
    //       const firstSection = Object.keys(lessonData.sections)[0];
    //       if (firstSection) {
    //         toggleContentSection(firstSection, 0);
    //       }
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error loading lesson data:", error);
    //   });
  });

  // Export functions if using modules
  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      loadLessonData,
      loadLesson,
      setupLessonStructure,
      toggleContentSection,
      loadSection,
      updateEditor,
      saveUserCode,
      safelyGetElement,
    };
  }
};