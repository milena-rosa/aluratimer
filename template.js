const data = require('./data');
const { ipcMain } = require('electron');

module.exports = {
    templateInicial: null,
    geraTrayTemplate(window) {
        let template = [
            { label: 'Cursos' },
            { type: 'separator' }
        ];

        let cursos = data.pegaNomeCursos();
        cursos.forEach(curso => {
            let menuItem = {
                label: curso,
                type: 'radio',
                click: () => window.send('curso-trocado', curso)
            };
            template.push(menuItem);
        });
        this.templateInicial = template;
        return template;
    },
    geraMenuPrincipalTemplate(nomeApp) {
        let templateMenu = [
            {
                label: 'View',
                submenu: [
                    {
                        role: 'reload'
                    },
                    {
                        role: 'toggledevtools'
                    }
                ]
            },
            {
                label: 'Window',
                submenu: [
                    {
                        role: 'minimize',
                        accelerator: 'CmdOrCtrl+M'
                    },
                    {
                        role: 'close'
                    }
                ]
            },
            {
                label: 'Sobre',
                click: () => ipcMain.emit('abrir-janela-sobre'),
                accelerator: 'CmdOrCtrl+I'
            }
        ];
        if (process.platform == 'darwin') {
            templateMenu.unshift(
                {
                    label: nomeApp,
                    submenu: [
                        {
                            label: 'Estou rodando no Mac'
                        }
                    ]
                }
            )
        }
        return templateMenu;
    },
    adicionaCursoTray(curso, window) {
        this.templateInicial.push({
            label: curso,
            type: 'radio',
            checked: true,
            click: () => window.send('curso-trocado', curso)
        });
        console.log(this.templateInicial);
        return this.templateInicial;
    }
};
