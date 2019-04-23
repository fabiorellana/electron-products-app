const {	app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');


if (process.env.NODE_ENV !==  'production') {
	require('electron-reload')(__dirname, {
		electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
	})
}


let mainWindow
let newProductWindow

app.on('ready', () => {
	mainWindow = new BrowserWindow({});
	mainWindow.loadURL(url.format({
		//Cargar el archivo principal
		pathname: path.join(__dirname, 'views/index.html'),
		protocol: 'file',
		slashes: true
	}))

	const mainMenu = Menu.buildFromTemplate(templateMenu);
	Menu.setApplicationMenu(mainMenu);

	mainWindow.on('closed', () => {
		app.quit();
	});

});

function createNewProductWindow() {
	newProductWindow = new BrowserWindow({
		width: 400,
		height: 330,
		title: 'Agregar nuevo producto'
	});

	newProductWindow.setMenu(null);
	newProductWindow.loadURL(url.format({
		//Cargar el archivo principal
		pathname: path.join(__dirname, 'views/new-product.html'),
		protocol: 'file',
		slashes: true
	}))

	newProductWindow.on('closed', () => {
		newProductWindow = null;
	});
}

ipcMain.on('product:new', (e, newProduct) => {
	mainWindow.webContents.send('product:new', newProduct);
	newProductWindow.close();
});

function aboutProductWindow() {
	newAboutProductWindow = new BrowserWindow({
		width: 430,
		height: 400,
		transparent: true,
		title: 'Acerca de'
	});

	newAboutProductWindow.setMenu(null);
	newAboutProductWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'views/about.html'),
		protocol: 'file',
		slashes: true
	}))

	newAboutProductWindow.on('closed', () => {
		newAboutProductWindow = null;
	});
}



const templateMenu = [
	{
		label: 'Archivo',
		submenu: [
			{
				label: 'Nuevo Producto',
				accelerator: 'Ctrl+N',
				click() {
					createNewProductWindow();
				}
			},
			{
				label: 'Remover Productos',
				click() {
					mainWindow.webContents.send('products:remove-all');
				}
			},
			{
				label: 'Salir',
				accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
				click() {
					app.quit();
				}
			}
		]
	}
];

if (process.platform === 'darwin') {
	templateMenu.unshift({
		label: app.getName()
	});
}

if (process.env.NODE_ENV !== 'production') {
	templateMenu.push({
		label: 'DevTools',
		submenu: [
			{
				label: 'Show/Hide Dev Tools',
				accelerator: 'Ctrl+D',
				click(item, focusetWindow) {
					focusetWindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}
		]
	},
	{
		label: 'Ayuda',
		submenu: [
			{
				label: 'Leer Mas',
				click() {
					require('electron').shell.openExternal('https://electronjs.org');
				}
			},
			{
				label: 'Acerca de',
				accelerator: 'Ctrl+F',
				click() {
					aboutProductWindow();
				}
			}
		]
	})
}