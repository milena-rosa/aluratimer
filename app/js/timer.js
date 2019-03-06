const { ipcRenderer } = require('electron');
const moment = require('moment');

let segundos = 0;
let timer;
module.exports = {
    iniciar(elemento) {
        let tempo = moment.duration(elemento.textContent);
        segundos = tempo.asSeconds();
        clearInterval(timer);
        timer = setInterval(() => {
            segundos++;
            elemento.textContent = this.formatarTempo(segundos);
        }, 1000);
    },
    parar(curso) {
        clearInterval(timer);
        let tempoEstudado = this.formatarTempo(segundos);
        ipcRenderer.send('curso-parado', curso, tempoEstudado);
    },
    formatarTempo(segundos) {
        return moment().startOf('day').seconds(segundos).format('HH:mm:ss');
    }
}
// 
// wget https://dl.winehq.org/wine-builds/Release.key
//    sudo apt-key add Release.key
//    sudo apt-add-repository 'https://dl.winehq.org/wine-builds/ubuntu/'
