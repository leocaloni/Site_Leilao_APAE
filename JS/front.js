const protocolo = 'http://';
const baseURL = 'localhost:3000';
const lancesEndPoint = '/lances';



async function obterLances() {
    const URLcompleta = `${protocolo}${baseURL}${lancesEndPoint}`;
    const lances = (await axios.get(URLcompleta)).data;
    let tabela = document.querySelector('.lances');
    let corpoTabela = tabela.getElementsByTagName('tbody')[0];
    for (let lance of lances) {
        let linha = corpoTabela.insertRow(0);
        let celulaNome = linha.insertCell(0);
        let celulaValor_lance = linha.insertCell(1);
        celulaNome.innerHTML = lance.nome;
        celulaValor_lance.innerHTML = lance.valor_lance;
    }
}

async function cadastrarLance() {
    const URLcompleta = `${protocolo}${baseURL}${lancesEndPoint}`;
    let lanceInput = document.querySelector('#lanceInput');
    let valor_lance = lanceInput.value;
    if (valor_lance) {
        lanceInput.value = "";
        const lances = (await axios.post(URLcompleta, { nome: login, valor_lance })).data;
        let tabela = document.querySelector('.lances');
        let corpoTabela = tabela.getElementsByTagName('tbody')[0];
        for (let lance of lances) {
            let linha = corpoTabela.insertRow(0);
            let celulaNome = linha.insertCell(0);
            let celulaValor_lance = linha.insertCell(1);
            celulaNome.innerHTML = lance.nome;
            celulaValor_lance.innerHTML = lance.valor_lance;
        }
    } else {
        let alert = document.querySelector('.alert');
        alert.classList.add('show');
        alert.classList.remove('d-none');
        setTimeout(() => {
            alert.classList.add('d-none');
            alert.classList.remove('show');
        }, 2000);
    }
}

async function cadastrarUsuario() {
    const URLcompleta = `${protocolo}${baseURL}/signup`;
    let loginInput = document.querySelector('#loginInput');
    let emailInput = document.querySelector('#emailInput');
    let senhaInput = document.querySelector('#senhaInput');
    let login = loginInput.value;
    let email = emailInput.value;
    let senha = senhaInput.value;   
    try {
        const resposta = await fetch(URLcompleta, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, email, senha }),
        });

        if (resposta.ok) {
            console.log('Usuário cadastrado com sucesso!');
        } else {
            console.error('Erro ao cadastrar usuário:', resposta.statusText);
        }
    } catch (erro) {
        console.error('Erro ao cadastrar usuário:', erro);
    }
    
}


