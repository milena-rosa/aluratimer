const jsonfile = require('jsonfile-promised');
const fs = require('fs');

module.exports = {
    criaArquivoCurso(nomeArquivo, conteudoArquivo) {
        return jsonfile.writeFile(nomeArquivo, conteudoArquivo)
            .then(() => console.log('Arquivo criado.'))
            .catch(erro => console.log(erro));
    },
    salvaDados(curso, tempoEstudado) {
        let arquivoCurso = __dirname + '/data/' + curso + '.json';
        if (fs.existsSync(arquivoCurso)) {
            this.adicionaTempoAoCurso(arquivoCurso, tempoEstudado);
        } else {
            this.criaArquivoCurso(arquivoCurso, {})
                .then(() => {
                    this.adicionaTempoAoCurso(arquivoCurso, tempoEstudado);
                });
        }
    },
    adicionaTempoAoCurso(arquivoCurso, tempoEstudado) {
        let dados = {
            ultimoEstudo: new Date().toString(),
            tempo: tempoEstudado
        };

        jsonfile.writeFile(arquivoCurso, dados, { spaces: 2 })
            .then(() => console.log('Tempo salvo com sucesso'))
            .catch(erro => console.log(erro));
    },
    pegaDados(curso) {
        let arquivoCurso = __dirname + '/data/' + curso + '.json';
        return jsonfile.readFile(arquivoCurso);
    },
    pegaNomeCursos() {
        let arquivos = fs.readdirSync(__dirname + '/data/');
        return arquivos.map(arquivo => arquivo.substr(0, arquivo.lastIndexOf('.')));
    }
};
