const { ipcRenderer } = require('electron');
const timer = require('./timer');
const data = require('../../data');

let linkSobre = document.querySelector('#link-sobre');
let botaoPlay = document.querySelector('.botao-play');
let tempo = document.querySelector('.tempo');
let curso = document.querySelector('.curso');
let botaoAdicionar = document.querySelector('.botao-adicionar');
let campoAdicionar = document.querySelector('.campo-adicionar');

linkSobre.addEventListener('click' , function(){
    ipcRenderer.send('abrir-janela-sobre');
});

let imgs = ['img/play-button.svg', 'img/stop-button.svg'];
let play = false;
botaoPlay.addEventListener('click', function() {
    iniciarParar();
});

window.onload = function() {
    data.pegaDados(curso.textContent)
        .then(dados => tempo.textContent = dados.tempo);
}

ipcRenderer.on('curso-trocado', (event, nomeCurso) => {
    timer.parar(curso.textContent);
    data.pegaDados(nomeCurso)
        .then(dados => tempo.textContent = dados.tempo)
        .cath(() => {
            console.log('curso não possui json.');
            tempo.textContent = '00:00:00';
        })
    curso.textContent = nomeCurso;
});

botaoAdicionar.addEventListener('click', function() {
    if (campoAdicionar.value == '') {
        console.log('nome do curso vazio.');
        return;
    }
    let novoCurso = campoAdicionar.value;
    curso.textContent = novoCurso;
    tempo.textContent = '00:00:00';
    campoAdicionar.value = '';
    ipcRenderer.send('curso-adicionado', novoCurso);
});

ipcRenderer.on('atalho-iniciar-parar', () => iniciarParar());
    // let click = new MouseEvent('click');
    // botaoPlay.dispatchEvent(click);

function iniciarParar() {
    if (play) {
        timer.parar(curso.textContent);
        play = false;
        new Notification('Alura Timer', {
            body: `Curso ${curso.textContent} parado!`,
            icon: 'img/stop-button.png'
        });
    } else {
        timer.iniciar(tempo)
        play = true;
        new Notification('Alura Timer', {
            body: `Curso ${curso.textContent} iniciado!`,
            icon: 'img/play-button.png'
        });
    }
    imgs = imgs.reverse();
    botaoPlay.src = imgs[0];
}
