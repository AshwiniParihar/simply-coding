function applyHighlighting() {
  document.querySelectorAll("pre code").forEach((block) => {
    // Decode HTML entities for proper rendering
    block.innerHTML = block.innerHTML
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");

    // Get the language from the class, or set to 'plaintext' by default
    const langClass = Array.from(block.classList).find((cls) =>
      cls.startsWith("language-")
    );
    const lang = langClass ? langClass.replace("language-", "") : "plaintext";

    // Use highlight.js to highlight the code block
    const validLang = hljs.getLanguage(lang) ? lang : "plaintext";
    const highlightedCode = hljs.highlight(
      validLang,
      block.textContent,
      true
    ).value;

    block.innerHTML = highlightedCode;
    block.classList.add("hljs"); // Add hljs class for styling
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyHighlighting();
});
