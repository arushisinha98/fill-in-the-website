// src/client/index.js
async function fetchDirectoryContents() {
  try {
    const response = await fetch('/list-directory');
    if (!response.ok) {
      throw new Error('Failed to fetch directory listing');
    }
    const contents = await response.json();
    displayDirectoryContents(contents);
  } catch (error) {
    console.error('Error fetching directory contents:', error);
  }
}

function displayDirectoryContents(contents) {
  const directoryListing = document.getElementById('directory-listing');
  contents.forEach(item => {
    const div = document.createElement('div');
    div.textContent = item;
    div.className = item.startsWith('Directory:') ? 'directory' : 'file';
    directoryListing.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchDirectoryContents();
});

