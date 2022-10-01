import reader from 'xlsx'
import Leite from 'leite'
const leite = new Leite();

let cargos = [];

const file = reader.readFile('./test.xlsx');
const sheets = file.SheetNames;

for (let i = 0; i < sheets.length; i++) {

  const temp = reader.utils.sheet_to_json(
    file.Sheets[file.SheetNames[i]])
  temp.forEach((res) => {

    if (res.CARGOS) {
      cargos.push(res)
    }
  })
}

let contador = {}

const pessoas = [];
const pessoasQuery = []

function criarPessoas() {
  let nome;
  do {
    nome = leite.pessoa.nome()
  } while (nome.includes("'"))

  let obj
  let pass = false;
  do {
    const nRndCargo = Math.floor(Math.random() * cargos.length)
    obj = cargos[nRndCargo]

    const nomeObj = obj.CARGOS
    if (contador[nomeObj]) {
      if (contador[nomeObj].count != obj.QUANTIDADEFUNCIONÁRIOS) {
        contador[nomeObj].count++;
        pass = true;
      }
    } else {
      contador[obj.CARGOS] = { count: 1 }
      pass = true;
    }

  } while (!pass)

  const niveis = ['JUNIOR', 'PLENO', 'SENIOR'];
  const nRndNivel = Math.floor(Math.random() * 3);

  const nivel = obj[niveis[nRndNivel]] ? niveis[nRndNivel] : niveis[0]

  const nomecargo = obj.CARGOS

  const salario = obj[nivel]

  const pessoa = {
    NOME: nome,
    CARGO: nomecargo,
    NIVEL: nivel,
    SALARIO: salario
  }
  return pessoa

}
while (pessoas.length < 21) {

  const pessoa = criarPessoas()
  pessoasQuery.push(pessoa.nome)
  pessoas.push(pessoa)
}

const ws = reader.utils.json_to_sheet(pessoas)

reader.utils.book_append_sheet(file, ws, "FUNCIONARIOS")

reader.writeFile(file, './test.xlsx')

