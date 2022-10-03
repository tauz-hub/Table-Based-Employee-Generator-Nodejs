import reader from 'xlsx'
import Leite from 'leite'
const leite = new Leite();

let cargos = [];

const file = reader.readFile('./base.xlsx');
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


  let obj
  let pass = false;
  do {
    const nRndCargo = Math.floor(Math.random() * cargos.length)
    obj = cargos[nRndCargo]

    const nomeObj = obj.CARGOS
    if (contador[nomeObj]) {
      if (contador[nomeObj].count != obj.QUANTIDADE_FUNCIONARIOS) {
        contador[nomeObj].count++;
        pass = true;
      }
    } else {
      contador[obj.CARGOS] = { count: 1 }
      pass = true;
    }

  } while (!pass)

  let nome;
  do {
    nome = obj.SEXO == "F" ? leite.pessoa.nome({ sexo: 'Feminino' }) : leite.pessoa.nome()
  } while (nome.includes("'"))

  const niveis = ['JUNIOR', 'PLENO', 'SENIOR'];
  const nRndNivel = Math.floor(Math.random() * 3);

  let nivel = obj[niveis[nRndNivel]] ? niveis[nRndNivel] : niveis[0]

  const nomecargo = obj.CARGOS

  const salario = obj[nivel]

  const vt = Math.floor(Math.random() * 2) == 0 ? "SIM" : "NÃO";
  const vc = vt == "NÃO" && Math.floor(Math.random() * 2) == 0 ? "SIM" : "NÃO";
  const va = obj.VA == "S" ? "SIM" : "NÃO";
  const vr = obj.VR == "S" ? "SIM" : "NÃO";

  if (obj.VARIACAO == "S") {
    nivel = "NÃO POSSUI"
  }

  const pessoa = {
    NOME: nome,
    CARGO: nomecargo,
    NIVEL: nivel,
    SALÁRIO: salario,
    VT: vt,
    VC: vc,
    VR: vr,
    VA: va,
    "PLANO DE SAÚDE": "SIM",
    "PLANO ODONTOLÓGICO": "SIM"
  }
  return pessoa

}
while (pessoas.length < 53) {

  const pessoa = criarPessoas()
  pessoasQuery.push(pessoa.nome)
  pessoas.push(pessoa)
}

const ws = reader.utils.json_to_sheet(pessoas)

reader.utils.book_append_sheet(file, ws, "FUNCIONARIOS")

reader.writeFile(file, './base.xlsx')

