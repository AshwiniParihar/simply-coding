// Function to initialize "Next Section" buttons dynamically
const initializeNextButtons = () => {
  // Find all "Next Section" buttons in the content
  const nextButtons = document.querySelectorAll(".next-btn");
  console.log(nextButtons);
  nextButtons.forEach((button) => {
    // Attach the goToNextSection function to each button
    button.addEventListener("click", () => goToNextSection(button));
  });
};

// Function to navigate to the next section based on the current section
const goToNextSection = (buttonElement) => {
  // Find the currently active section button (the one highlighted as active)
  const activeButton = document.querySelector(".section-button.active");

  if (!activeButton) {
    console.error("No active section button found.");
    return;
  }

  // Get the section name from the active button's ID (e.g., "toggle-Read")
  const currentSectionId = activeButton.id;
  const currentSectionName = currentSectionId.replace("toggle-", "");

  // Get the list of section names in the order they are displayed
  const sectionNames = Object.keys(lessonData.sections);

  // Find the index of the current section
  const currentIndex = sectionNames.indexOf(currentSectionName);

  // Check if there's a next section available
  if (currentIndex >= 0 && currentIndex < sectionNames.length - 1) {
    // Get the name of the next section
    const nextSectionName = sectionNames[currentIndex + 1];

    // Simulate a click on the corresponding section toggle button
    const nextSectionButton = document.getElementById(
      `toggle-${nextSectionName}`
    );
    if (nextSectionButton) {
      nextSectionButton.click(); // Trigger the click event on the next section button
    } else {
      console.error(`No button found for next section: ${nextSectionName}`);
    }
  } else {
    console.log("No more sections available.");
  }
};

// Initialize the buttons after the lesson content is loaded
