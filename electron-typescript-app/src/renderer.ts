import { ipcRenderer } from 'electron';

// Function to capture screenshot when button is clicked
const captureButton = document.getElementById('capture-button');
captureButton?.addEventListener('click', async () => {
  // Send request to main process to capture screenshot
  const filePath = await ipcRenderer.invoke('capture-screenshot');
  alert(`Screenshot saved at: ${filePath}`);
});
