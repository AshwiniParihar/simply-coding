# Teaching Template README

## Getting Started

This README provides a comprehensive guide to setting up and managing the Simply Certification Teaching Template.

### Required Extensions

Ensure the following VS Code extensions are installed:

- **Better Comments**: For improved code annotation.
- **Live Preview**: Quick preview of HTML pages.
- **Live Server**: Launch a local server with live-reload capability.
- **Prettier**: Code formatter for consistent style across files.

### Repository

GitHub Repository: [Simply-Certification Teaching Template](https://github.com/Simply-Certification/teaching-template)

### AWS Resources

AWS S3 Bucket: [SC Course Materials](https://us-west-2.console.aws.amazon.com/s3/buckets/sc-course-materials?prefix=frontend-course/&region=us-west-2&bucketType=general)

- **Project Files**: Organized within `frontend-course/`
- **Core Template Files**: Contains core CSS, JavaScript, and HTML templates.
- **Lessons Folder**: Holds all lesson files.
- **Assets Folder**: Contains lesson images and other resources.

---

## Explanation of Folders and Files

### v1/

The original codebase, containing the first iteration of our teaching template.

### v2/ (Current Template)

**The following sections outline the main directories and files within `v2/`:**

#### v2/css

Contains core CSS files for styling across the entire template.

#### v2/vendor

Holds external packages and libraries stored locally for environments with restricted internet access. All required files are hosted on AWS to ensure availability during lessons.

#### v2/js

Contains JavaScript files responsible for handling core template logic.

#### v2/index.html

Main structural file for the teaching interface. It should be identical to `local-index.html` except for import paths:

- **AWS Paths**: `index.html` uses AWS-hosted resources.
- **Local Paths**: `local-index.html` uses local paths for development.

> **Note**: When making changes, start with `local-index.html` to avoid introducing breaking changes. Test locally, and if stable, create a new branch and push to GitHub.

#### v2/local-index.html

A local version of `index.html` with relative import paths, allowing for testing without AWS dependencies.

- **Testing Lessons Locally**: Update `local-index.html` by modifying the lesson JSON URL around line 592:

  ```html
  const lessonJsonUrl =
  "/lessons/html/lesson-14-html-boilerplate/local-main-content.json";
  ```

  Run the updated `local-index.html` file with Live Server to preview your lesson locally.

#### v2/loader.html

A lightweight file used to upload new lessons to SimplyCoding.org. It loads both `index.html` and the `main-content.json` for the target lesson.

**Important Variables for Uploading a New Lesson:**

```html
// AWS URL of index.html template const templateUrl =
"https://sc-course-materials.s3.us-west-2.amazonaws.com/frontend-course/Main+Core+Template+Files/index.html";
// URL of the lesson JSON file const lessonJsonUrl =
"https://sc-course-materials.s3.us-west-2.amazonaws.com/frontend-course/lessons/js/lesson-1-local-storage/main-content.json";
```

This approach allows us to externally build lessons and upload them to SimplyCoding without direct integration—though integration may be implemented in the future.

---

Here’s a more detailed and organized version of this section, adding key details and clarifying the structure for easier understanding:

---

## Templates, Lessons & Projects

All teaching materials are stored in the `lessons/` directory, organized into distinct sections and templates to streamline lesson creation and updates.

### Structure of the `lessons/` Directory

- **Folder Organization**:
  - **html/**, **css/**, and **js/**: Contain individual lessons, organized by lesson number.
  - **projects/**: Holds project lessons by topic and number.
  - **templates/**: Contains structured demo templates for creating new lessons, broken down by section (e.g., `html-lesson-template`, `css-lesson-template`).

> **Note**: Our design and lesson flow are not final, so if you see an improvement opportunity, please suggest it!

---

### Using the Templates

Each template folder provides a starting point for lesson parts, such as overview, read, write, and create. To quickly preview changes during lesson development, follow these steps:

1. **Previewing with `try-it-lesson-file.html`**:

   - Open the `try-it-lesson-file.html` file and delete any content between the `<body>` tags.
   - Copy the code from your chosen template and paste it between the `<body>` tags in this file.
   - Run `try-it-lesson-file.html` with Live Server in VS Code. This file includes all necessary imports, so it will render similarly to the lesson interface.

   > **Tip**: Once you pull this file, add it to your `.gitignore` to avoid committing local changes.

2. **Finding Assets for Lessons**:
   - **Icons & Images**: We use [Flaticon](https://www.flaticon.com/) for animations, stickers, images, and icons. If you find assets you’d like to use, let us know so they can be added to AWS for lesson compatibility.
   - **Alternative Image Sources**: You’re free to use images from other sources, provided there are no copyright issues. All images must be uploaded to AWS for use in restricted environments.

---

### Using `main-content.json` and `local-main-content.json`

Each lesson is structured with four main sections, and these JSON files ensure compatibility across local and live environments:

1. **Directory Structure**:

   - Every lesson includes folders for `overview/`, `read/`, `write/`, and `create/` sections.
   - Inside each section folder, you’ll find HTML, CSS, or JavaScript files for that specific part of the lesson.

2. **Content Files**:

   - **`local-main-content.json`**:

     - References local file paths for testing purposes.
     - Use this file for previewing lessons locally with Live Server.

   - **`main-content.json`**:
     - References AWS URLs for all lesson files.
     - This version is used for deploying the lesson on SimplyCoding.org to ensure remote accessibility.

   > **Workflow**:
   >
   > 1. Create and test files locally using `local-main-content.json`.
   > 2. Once complete, upload the lesson files to AWS.
   > 3. Update `main-content.json` with the AWS URLs and use this version for the live lesson.

---
