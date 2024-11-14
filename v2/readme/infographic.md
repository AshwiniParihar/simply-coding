# HTML Infographic Creation Guide

## Overview

This guide explains how to create consistent, visually appealing infographics for educational content using our standardized HTML/CSS framework. Each infographic follows a modular structure and uses predefined styles for consistency.

## Basic Structure

Every infographic follows this basic structure:

```html
<section class="infographic">
  <div class="container">
    <!-- 1. Header Section -->
    <header class="header">
      <h1 class="title"><span class="highlight">Primary</span> Topic Name</h1>
      <p class="subtitle">Brief description of the topic and its importance</p>
    </header>

    <!-- 2. Main Content -->
    <main class="grid">
      <!-- Content Cards Go Here -->
    </main>

    <!-- 3. Footer -->
    <footer class="footer">
      <div class="try-it-section">
        <!-- Interactive Elements -->
      </div>
    </footer>
  </div>
</section>
```

## Components

### 1. Feature Card

Use for introducing main concepts:

```html
<div class="card feature-card">
  <div class="card-icon">🔍</div>
  <h2 class="card-title">Main Concept</h2>
  <div class="card-content">
    <p>Main explanation</p>
    <ul class="feature-list">
      <li>Key point 1</li>
      <li>Key point 2</li>
    </ul>
  </div>
</div>
```

### 2. Code Example Card

Use for showing syntax and code examples:

```html
<div class="card syntax-card">
  <div class="card-icon">{ }</div>
  <h2 class="card-title">Code Example</h2>
  <div class="example-container">
    <pre class="glow-box"><code>Your code here</code></pre>
    <div class="example-notes">
      <span class="tag-note">Note 1</span>
      <span class="required-note">Note 2</span>
    </div>
  </div>
</div>
```

### 3. Standard Content Card

Use for regular content sections:

```html
<div class="card">
  <div class="card-icon">📝</div>
  <h2 class="card-title">Section Title</h2>
  <div class="card-content">
    <p>Content description</p>
    <div class="example-box">
      <code>Example code or content</code>
    </div>
    <span class="best-practice">Best practice tip</span>
  </div>
</div>
```

### 4. Best Practices Grid

Use for showing multiple related tips or concepts:

```html
<div class="card best-practices-card">
  <div class="card-icon">★</div>
  <h2 class="card-title">Best Practices</h2>
  <div class="best-practices-grid">
    <div class="practice-item">
      <h4>Practice Title</h4>
      <p>Practice description</p>
    </div>
    <!-- Add more practice-items as needed -->
  </div>
</div>
```

## Color Themes

You can use different themes by adding these classes to the container:

- Default (Blue): No additional class needed
- Pink Theme: Add `.pink` class
- Cyan Theme: Add `.cyan` class
- Yellow Theme: Add `.yellow` class

## Best Practices

1. **Content Organization**

   - Start with a clear introduction
   - Use progressive disclosure (simple to complex)
   - Group related information in cards
   - Include practical examples

2. **Visual Elements**

   - Use appropriate icons for each section
   - Include live examples where possible
   - Keep code samples concise and clear
   - Use consistent spacing

3. **Interactive Elements**
   - Add "Try it" buttons for code examples
   - Include tooltips for technical terms
   - Use hover effects for additional information

## Code Examples and Live Demos

### Adding a Try It Button

```html
<div class="try-it-section">
  <h3>Ready to Practice?</h3>
  <button class="try-it-out" onclick='loadTryItOut("your-code-here")'>
    Try it →
  </button>
</div>
```

### Adding a Tooltip

```html
<span class="tooltip" data-tooltip="Tooltip text here">Hover over me</span>
```

## Mobile Responsiveness

The framework is mobile-responsive by default. Cards will stack on smaller screens, and font sizes will adjust automatically.

## Tips for Creating New Infographics

1. **Planning**

   - Outline your content first
   - Identify key concepts and examples
   - Plan your code samples
   - Consider the logical flow of information

2. **Implementation**

   - Start with the basic structure
   - Add content progressively
   - Test responsiveness
   - Verify all interactive elements

3. **Quality Check**
   - Ensure all code examples are correct
   - Check spelling and grammar
   - Test on different screen sizes
   - Verify all links and buttons work

## Troubleshooting

Common issues and solutions:

1. **Cards not aligning properly**

   - Check grid classes
   - Verify card structure
   - Ensure proper closing tags

2. **Icons not displaying correctly**

   - Verify card-icon class
   - Check icon content
   - Ensure proper character encoding

3. **Code examples not formatting correctly**
   - Use proper escape characters
   - Check glow-box implementation
   - Verify pre and code tags

## Need Help?

If you need assistance or have questions about creating infographics, please contact the development team or refer to our internal documentation.

---

Remember to maintain consistency across all infographics to provide a unified learning experience for our users.
