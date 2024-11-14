### Teaching Template Setup Instructions

**Objective**: Learn how to set up your teaching template, access required repositories, upload and configure AWS resources, modify your lesson JSON URL, and create your own lesson JSON files. Additionally, learn to write content in markdown format and integrate HTML, CSS, and JavaScript within markdown.

**View README**:

- The best way to view this readme is with the builtin preview plugin in VS Code. If you do not have that installed you can download and use the Live Preview Extension.

---

### 1. **AWS Access**

Before setting up your teaching template, ensure you have access to your AWS account. Here’s how you can get started with AWS:

1. **Sign into AWS**: If you don't have an AWS account, create one at [AWS Console](https://aws.amazon.com/console/). Make sure you have S3 bucket permissions to upload files.
2. **Create an S3 Bucket**:
   - Navigate to S3 in the AWS Console.
   - Click on `Create Bucket`.
   - Name your bucket (e.g., `sc-course-materials`).
   - Set the Region (e.g., `us-west-2`).
   - Leave the remaining settings as default and click `Create Bucket`.
3. **Upload Lesson Files to S3**:
   - Open your created bucket and click on `Upload`.
   - Select the JSON and markdown files from your local machine.
   - After uploading, set permissions to ensure these files are publicly accessible:
     - Go to the file permissions and select `Public access`.
     - Click `Save`.

**Tip**: Every file you upload will have a unique URL (e.g., `https://sc-course-materials.s3.us-west-2.amazonaws.com/flexbox/read/flexbox-intro.md`). Use these URLs in your lesson JSON file.

### 2. **GitHub Access**

1. **Clone the Repository**:
   - Clone the teaching template repository to your local machine using the command:
     ```bash
     git clone https://github.com/Simply-Certification/teaching-template
     ```
2. **Navigate to the Project Directory**:

   - Use the command line or terminal to navigate to the cloned directory:
     ```bash
     cd teaching-template
     ```

3. **Install Required Dependencies (if any)**:
   - Open the project in your preferred editor (e.g., Visual Studio Code).
   - Make sure to install any dependencies if required (e.g., run `npm install` if the project uses npm).

### 3. **Running the `minimal-lesson-loader.html`**

1. Open the `minimal-lesson-loader.html` file in the project directory using your preferred code editor.
2. Run the `minimal-lesson-loader.html` file locally using a live server plugin (if using VS Code, right-click `minimal-lesson-loader.html` and select `Open with Live Server`).
3. If you don’t have a live server, double-click `minimal-lesson-loader.html` to open it in your default web browser.

**Important Note**: Ensure your browser allows local file execution to preview the content correctly.

Here's a detailed section for your README that outlines the file structure and instructions for adding new lessons:

## 4. Creating a New Lesson: Folder Structure and Guidelines

When creating a new lesson, follow the structure and naming conventions outlined below to ensure consistency and proper integration with the automated workflow.

### Folder Structure Overview

The `lessons` directory is organized into the following subfolders based on the type of lesson content:

```plaintext
lessons/
├── html/
│   ├── lesson-1/
│   │   ├── main-content.json
│   │   └── read/
│   │       ├── content.md
│   │       ├── content2.md
│   │       └── content3.html
│   ├── lesson-2/
│   └── lesson-3/
├── css/
│   ├── lesson-1/
│   ├── lesson-2/
│   └── lesson-3/
├── js/
│   ├── lesson-1/
│   ├── lesson-2/
│   └── lesson-3/
└── projects/
    ├── lesson-1/
    ├── lesson-2/
    └── lesson-3/
```

### Adding a New Lesson

To add a new lesson, follow these steps:

1. **Choose the Correct Folder:**

   - Determine the type of lesson you’re creating:
     - `html` – For lessons involving HTML concepts.
     - `css` – For lessons involving CSS concepts.
     - `js` – For lessons involving JavaScript concepts.
     - `projects` – For project-based lessons that combine multiple concepts.

2. **Create a New Lesson Folder:**

   - Create a new folder named `lesson-<number>-<topic>` (e.g., `lesson-4-imgtags`) inside the relevant directory (e.g., `lessons/html/lesson-4-imgtags`).

3. **Add `main-content.json` File:**

   - Inside your newly created `lesson-<number>-<topic>` folder, create a `main-content.json` file.
   - This file will contain the configuration for your lesson, including section names, starter code, and references to other content files (e.g., Markdown or HTML files).

   **Example `main-content.json` structure:**

   ```json
   {
     "title": "Understanding Flexbox",
     "lessonID": "lessonFlexbox004",
     "sections": {
       "read": {
         "starter-code": {
           "html": "<div class='flex-container'>\n  <div class='flex-item'>Item 1</div>\n  <div class='flex-item'>Item 2</div>\n  <div class='flex-item'>Item 3</div>\n</div>",
           "css": ".container { display: flex; }",
           "js": "console.log('Learning Flexbox');"
         },
         "content": [
           {
             "title": "Introduction to Flexbox",
             "fileType": "markdown",
             "filePath": "sectionfolder/content.md"
           },
           {
             "title": "Flexbox Properties",
             "fileType": "markdown",
             "filePath": "sectionfolder/content2.md"
           }
         ]
       }
     }
   }
   ```

4. **Create `sectionfolder` for Additional Content:**

   - Inside each `lesson-<number>-<topic>` folder, create a folder named `sectionfolder` (or a similar descriptive name).
   - Add any additional content files (Markdown or HTML) related to the lesson sections inside this folder. These content files will be referenced in the `main-content.json` file.

   **Example of section content files:**

   - `read/content.md` – Contains text or explanations for a lesson.
   - `read/content2.md` – Contains additional information or instructions.
   - `read/content3.html` – Contains HTML code examples or layouts for the lesson.

### Best Practices for Naming and Structuring Content

1. **Use Consistent Naming Conventions:**

   - Follow a consistent naming convention for all lesson folders (`lesson-1-topic`, `lesson-2-topic`, etc.) and section folders (`sectionfolder`, `subsection`, etc.) ex. `read` .

2. **Use Descriptive Names for Content Files:**

   - Name your content files (`content.md`, `content2.md`, etc.) descriptively so it’s clear what each file contains.

3. **Reference Content Correctly in `main-content.json`:**
   - When referencing content files in your `main-content.json`, use relative paths to ensure that the JSON file can locate the content within the same lesson folder.

### Example of Adding a New Lesson (HTML Lesson 4)

If you want to add a new HTML lesson (`lesson-4-imgtags`), follow these steps:

1. Navigate to the `lessons/html` folder.
2. Create a new folder named `lesson-4-imgtags`.
3. Inside `lesson-4-imgtags`, create a `main-content.json` file and add your lesson configuration.
4. Create a `sectionfolder` inside `lesson-4` and add the necessary Markdown or HTML files for your lesson.

After completing these steps, your `lessons/html/lesson-4-imgtags` folder might look like this:

```plaintext
lesson-4-imgtag/
├── main-content.json
└── read/
    ├── content.md
    ├── content2.md
    └── example.html
```

### 5. **Changing Values in `minimal-lesson-loader.html`**

1. Open the `minimal-lesson-loader.html` file in your code editor.
2. Locate the `lessonJsonUrl` variable (around line 202):
   ```javascript
   const lessonJsonUrl =
     "https://sc-course-materials.s3.us-west-2.amazonaws.com/frontend-course/lessons/flexbox/project-flexbox.json";
   ```
3. Replace the existing URL with your JSON file’s URL from AWS:
   ```javascript
   const lessonJsonUrl = "https://YOUR_AWS_BUCKET_URL/your-json-file.json";
   ```
4. Save the file and refresh the browser to see the updated lesson content.

### 6. **Creating Your Own JSON File**

Create a new JSON file following the template structure provided below. This file will define the title, lesson ID, video URL, and various sections like read, write, create, and project.

**Sample JSON Template**:

```json
{
  "title": "Mastering Flexbox",
  "lessonID": "lessonFlexbox001",
  "videoUrl": "https://example.com/flexbox-intro.mp4",
  "sections": {
    "read": {
      "starter-code": {
        "html": "<div class='flex-container'>\n  <div class='flex-item'>Item 1</div>\n  <div class='flex-item'>Item 2</div>\n  <div class='flex-item'>Item 3</div>\n</div>",
        "css": ".container { display: flex; }",
        "js": "console.log('Learning Flexbox');"
      },
      "content": [
        {
          "title": "Introduction to Flexbox",
          "fileType": "markdown",
          "filePath": "https://YOUR_AWS_BUCKET_URL/flexbox-intro.md"
        },
        {
          "title": "Flexbox Properties",
          "fileType": "markdown",
          "filePath": "https://YOUR_AWS_BUCKET_URL/flexbox-properties.md"
        }
      ]
    }
  }
}
```

- **Save the JSON File**: Save this file as `lesson-flexbox.json`.
- **Upload the JSON File to AWS S3**: Upload the file to your S3 bucket and set public access.

### 7. **Markdown Guide and Integrating HTML/CSS/JS**

Markdown is a lightweight markup language that provides easy-to-use syntax for formatting text, adding links, images, and more. Here’s a detailed guide on using markdown and embedding code:

#### **Basic Markdown Syntax**

1. **Headers**:

   - Use `#` for headers. The number of `#` defines the header level:

     ```markdown
     # Header 1

     ## Header 2

     ### Header 3
     ```

2. **Bold and Italic Text**:

   - Bold text: `**Bold**` or `__Bold__`
   - Italic text: `*Italic*` or `_Italic_`

3. **Lists**:

   - Unordered list: Use `-`, `*`, or `+`:
     ```markdown
     - Item 1
     - Item 2
     ```
   - Ordered list: Use numbers:
     ```markdown
     1. First Item
     2. Second Item
     ```

4. **Links**:

   - Use `[link text](URL)`:
     ```markdown
     [Visit SimplyCoding](https://simplycoding.org)
     ```

5. **Images**:
   - Use `![alt text](image URL)`:
     ```markdown
     ![SimplyCoding Logo](https://example.com/logo.png)
     ```

#### **Adding HTML in Markdown**

Markdown supports embedding HTML directly. This is useful for adding HTML elements like tables, divs, buttons, or more complex layouts.

```markdown
<div style="border: 1px solid black; padding: 10px;">
  <h3>This is a custom HTML block</h3>
  <p>You can embed HTML elements inside your markdown files.</p>
</div>
```

#### **Adding CSS in Markdown**

To add CSS styles to elements in markdown, you can use `<style>` tags or directly add styles to your HTML elements:

```html
<style>
  .highlight {
    background-color: yellow;
    font-weight: bold;
  }
</style>

<p class="highlight">This text is highlighted using CSS!</p>
```

#### **Adding JavaScript in Markdown**

You can add JavaScript within `<script>` tags in your markdown file to create interactive elements or run scripts:

```html
<button onclick="showAlert()">Click Me!</button>

<script>
  function showAlert() {
    alert("Hello! This is JavaScript inside markdown.");
  }
</script>
```

#### **Combining HTML, CSS, and JavaScript**

You can create complex layouts and styles by combining all three within your markdown file:

```markdown
<style>
  .box {
    width: 100px;
    height: 100px;
    background-color: lightblue;
    display: inline-block;
    margin: 5px;
  }
</style>

<div class="box" onclick="changeColor(this)"></div>
<div class="box" onclick="changeColor(this)"></div>
<div class="box" onclick="changeColor(this)"></div>

<script>
  function changeColor(element) {
    element.style.backgroundColor = element.style.backgroundColor === 'lightblue' ? 'lightcoral' : 'lightblue';
  }
</script>
```

### 7. **Testing and Validating Your Markdown and JSON Files**

1. After creating your markdown files and JSON structure, upload them to AWS S3.
2. Copy the URLs for each markdown file and update the `filePath` fields in your JSON file accordingly.
3. Update the `lessonJsonUrl` in `index.html` to point to your new JSON file.
4. Open `index.html` in your browser and verify that your lesson loads correctly.

**Troubleshooting**:

- If content does not load, check your JSON file structure for syntax errors.
- Ensure all markdown file URLs are correct and the files are publicly accessible.
- Use a browser developer console to identify errors or broken links.

---

### 8. **Adjusting Pre-existing HTML and CSS**

- In css\styles.css you can adjust any webpage styling needed.
- css/markdown.css directly styles the markdown we see in the lessons including the code styling. To control the styling you need to edit values in this file.
- For assitance creating new code or pushing new code reach out and ask. Or check out the documentation [ on W3Schools](https://www.w3schools.com/git/git_branch.asp)
- For any functionality or structure changes in index.html or in any of the javascript files please contanct [Zach](mailto:zachary@simplycoding.org) or directly on Slack and discuss, or put your changes on a new git branch and create a PR.
