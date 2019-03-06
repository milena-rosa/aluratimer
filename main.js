const { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut } = require('electron');
const data = require('./data');
const template = require('./template');

let tray = null;
let mainMenu = null;
app.on('ready', () => {
    console.log('App iniciado');
    mainWindow = new BrowserWindow({
        width: 600,
        height: 400
    });

    tray = new Tray(__dirname + '/app/img/icon-tray.png');
    let trayMenu = Menu.buildFromTemplate(template.geraTrayTemplate(mainWindow));
    tray.setContextMenu(trayMenu);

    let templateMenu = template.geraMenuPrincipalTemplate(app.getName());
    let menuPrincipal = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(menuPrincipal);

    globalShortcut.register('CmdOrCtrl+Shift+S', () => mainWindow.send('atalho-iniciar-parar'));

    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
});

app.on('window-all-closed', () => {
    app.quit();
});

let sobreWindow = null;
ipcMain.on('abrir-janela-sobre', () => {
    if (sobreWindow === null) {
        sobreWindow = new BrowserWindow({
            width: 300,
            height: 220,
            alwaysOnTop: true,
            visibleOnAllWorkspaces: true,
            frame: false
        });

        sobreWindow.on('closed', () => sobreWindow = null);
    };
    sobreWindow.loadURL(`file://${__dirname}/app/sobre.html`);
});

ipcMain.on('fechar-janela-sobre', () => {
    sobreWindow.close();
});

ipcMain.on('curso-parado', (event, curso, tempoEstudado) => {
    console.log(`O curso ${curso} foi estudado por ${tempoEstudado}`);
    data.salvaDados(curso, tempoEstudado);
});

ipcMain.on('curso-adicionado', (event, novoCurso) => {
    let novoTemplate = template.adicionaCursoTray(novoCurso, mainWindow);
    let novoTrayTemplate = Menu.buildFromTemplate(novoTemplate);
    tray.setContextMenu(novoTrayTemplate);
});
