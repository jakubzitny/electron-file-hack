// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const electron = require('electron')
const { ipcRenderer, remote } = electron

const fileInput = document.getElementById('file')
const hiddenFileInput = document.getElementById('file__hidden')
const hiddenFileInputForMenu = document.getElementById('file__hidden2')

const hiddenFileInputOpenButton = document.getElementById('file__dialog_hack')
const showOpenDialogRendererButton = document.getElementById('file__dialog_r')
const showOpenDialogMainButton = document.getElementById('file__dialog_m')

fileInput.addEventListener('change', (e) => {
  console.log('RENDERER: Files from file input', fileInput.files)
})

hiddenFileInput.addEventListener('change', (e) => {
  console.log('RENDERER: Files from hidden file input', hiddenFileInput.files)
})

hiddenFileInputForMenu.addEventListener('change', (e) => {
  console.log('MAIN: Files from hidden file input from menu', hiddenFileInputForMenu.files)
})

showOpenDialogRendererButton.addEventListener('click', (e) => {
  const dialogProps = {
    properties: [
      'openFile',
      'openDirectory',
      'multiSelections'
    ]
  }
  files = remote.dialog.showOpenDialog(dialogProps)
  console.log('RENDERER: File paths from dialog', files)
})

showOpenDialogMainButton.addEventListener('click', (e) => {
  console.log('sending')
  ipcRenderer.send('file__dialog', 'ping')
})

hiddenFileInputOpenButton.addEventListener('click', () => {
  hiddenFileInput.click()
})

ipcRenderer.on('main-process-files', (e, msg, files) => {
  console.log(msg, files)
})

ipcRenderer.on('hidden-file-input-open', (e, args) => {
  hiddenFileInput.click() // not working

  // working (suggested in https://git.io/v6xjU)
  const code = 'document.getElementById("file__hidden2").click()'
  electron.webFrame.executeJavaScript(code, true)
})

// menus
const menu = new remote.Menu()
menu.append(new remote.MenuItem({
  label: 'open hidden file input',
  click() {
    console.log('item 1 clicked')
    hiddenFileInput.click()
  }
}))

window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  menu.popup(remote.getCurrentWindow())
}, false)
