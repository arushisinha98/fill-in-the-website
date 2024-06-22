require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const apiURL = process.env.REACT_APP_API_URL;
const nodeEnv = process.env.NODE_ENV;

console.log(`API URL: ${apiURL}`);
console.log(`Node Environment: ${nodeEnv}`);

// Function to read .gitignore and return an array of patterns to ignore
function readGitIgnore(rootDir) {
  const gitIgnorePath = path.join(rootDir, '.gitignore');
  try {
    const data = fs.readFileSync(gitIgnorePath, 'utf8');
    return data.split('\n').filter(line => !!line && !line.startsWith('#')).map(line => line.trim());
  } catch (err) {
    console.error(`Error reading .gitignore: ${err}`);
    return [];
  }
}

// Function to check if a file or directory should be ignored based on patterns in .gitignore
function shouldIgnore(filePath, gitIgnorePatterns) {
  return gitIgnorePatterns.some(pattern => {
    // Convert gitignore-style pattern to RegExp pattern
    const regexPattern = pattern
      .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
      .replace(/\\\*/g, '.*')
      .replace(/\\\//g, '[\\\\/]+');
    const regex = new RegExp(`^${regexPattern}$`);
    return filePath.includes(pattern.trim());
  });
}

// Function to list files and directories recursively
function listFilesAndDirectories(rootDir, gitIgnorePatterns = []) {
  let results = [];
  try {
    const contents = fs.readdirSync(rootDir);
    contents.forEach(item => {
      const fullPath = path.join(rootDir, item);
      const relativePath = path.relative(path.resolve(__dirname, '../../'), fullPath);
      if (!shouldIgnore(fullPath, gitIgnorePatterns)) {
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          console.log(`Directory: ${relativePath}`);
          results.push({ type: 'directory', name: relativePath});
          results = results.concat(listFilesAndDirectories(fullPath, gitIgnorePatterns));
        } else {
          console.log(`File: ${relativePath}`);
          results.push({ type: 'file', name: relativePath});
        }
      }
    });
  } catch (err) {
    console.error(`Error reading directory ${rootDir}: ${err}`);
  }
  return results;
}

// Endpoint root handler
app.use(express.static(path.join(__dirname, '../../public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Endpoint to list directory contents
app.get('/list-directory/:directory?', (req, res) => {
  const directory = req.params.directory ? req.params.directory : '';
  const rootDir = path.resolve(__dirname, '../../', directory);
  const gitIgnorePatterns = readGitIgnore(rootDir);
  console.log(`Listing files and directories in ${rootDir}:`);
  const directoryContents = listFilesAndDirectories(rootDir, gitIgnorePatterns);
  res.json(directoryContents.map(item => item.name));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Main script execution
//function main() {
//  const rootDir = path.resolve(__dirname, '../../');
//  const gitIgnorePatterns = readGitIgnore(rootDir);
//  console.log(`Listing files and directories in ${rootDir}:`);
//  const directoryContents = listFilesAndDirectories(rootDir, gitIgnorePatterns);
//  directoryContents.forEach(item => {
//    console.log(`${item.type === 'directory' ? 'Directory' : 'File'}: ${item.name}`);
//  });
//}

// Run the main function (if needed)
//main();
