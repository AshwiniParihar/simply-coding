// const fs = require("fs");
// const path = require("path");

// // Base S3 URL for your bucket (adjust this if necessary)
// const bucketUrl =
//   "https://sc-course-materials.s3.us-west-2.amazonaws.com/frontend-course/";

// // Function to update file paths in the JSON file
// function updateJsonFilePaths(jsonFilePath) {
//   // Load the existing JSON file
//   const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

//   // Determine the lesson or asset type based on the path
//   const filePathParts = jsonFilePath.split(path.sep);
//   const lessonOrAssetTypeIndex =
//     filePathParts.indexOf("lessons") !== -1
//       ? filePathParts.indexOf("lessons") + 1
//       : filePathParts.indexOf("assets") + 1;
//   const lessonOrAssetType = filePathParts[lessonOrAssetTypeIndex]; // e.g., html, css, js, projects
//   const lessonOrAssetName = filePathParts[lessonOrAssetTypeIndex + 1]; // e.g., lesson-demo-1

//   // Determine if this is an asset or a lesson
//   const isAsset = jsonFilePath.includes("assets");
//   const isProject = lessonOrAssetType === "projects";

//   // Construct the base URL for the file path
//   const baseS3Url = isAsset
//     ? `${bucketUrl}assets/${lessonOrAssetType}/${lessonOrAssetName}/`
//     : isProject
//     ? `${bucketUrl}lessons/projects/${lessonOrAssetName}/`
//     : `${bucketUrl}lessons/${lessonOrAssetType}/${lessonOrAssetName}/`;

//   // Traverse through the JSON structure and update URLs
//   for (const section in jsonData.sections) {
//     const contentArray = jsonData.sections[section]?.content;
//     if (contentArray) {
//       contentArray.forEach((item) => {
//         if (item.filePath) {
//           // Extract the subfolder path from the original filePath
//           const originalSubfolder = path
//             .dirname(item.filePath)
//             .split(path.sep)
//             .pop();

//           // Extract the file name (e.g., content.md)
//           const fileName = path.basename(item.filePath);

//           // Construct the new S3 URL with the correct subfolder
//           // Ensuring that `originalSubfolder` is used as the final directory before the file name
//           item.filePath = `${baseS3Url}${originalSubfolder}/${fileName}`;
//         }
//       });
//     }
//   }

//   // Save the updated JSON back to the file
//   fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
//   console.log(`Updated file paths in: ${jsonFilePath}`);
// }

// // Get all `main-content.json` files in the lessons and assets folders
// function updateAllJsonFiles(basePath) {
//   const jsonFiles = [];

//   // Recursively find all `main-content.json` files in a given directory
//   function findJsonFiles(dir) {
//     const files = fs.readdirSync(dir);
//     for (const file of files) {
//       const fullPath = path.join(dir, file);
//       if (fs.statSync(fullPath).isDirectory()) {
//         findJsonFiles(fullPath);
//       } else if (file === "main-content.json") {
//         jsonFiles.push(fullPath);
//       }
//     }
//   }

//   // Find all JSON files in the lessons and assets directories
//   findJsonFiles(path.join(basePath, "lessons"));
//   findJsonFiles(path.join(basePath, "assets"));

//   // Update each JSON file found
//   jsonFiles.forEach((filePath) => {
//     updateJsonFilePaths(filePath);
//   });
// }

// // Run the update for the entire lessons and assets directories
// updateAllJsonFiles(path.join(__dirname, ".."));
