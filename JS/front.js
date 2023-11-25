const protocolo = 'http://';
const baseURL = 'localhost:3000';
const lancesEndPoint = '/lances';




async function cadastrarUsuario() {
    const URLcompleta = `${protocolo}${baseURL}/signup`;
    let loginInput = document.querySelector('#loginInput');
    let emailInput = document.querySelector('#emailInput');
    let senhaInput = document.querySelector('#senhaInput');
    let login = loginInput.value;
    let email = emailInput.value;
    let senha = senhaInput.value;   
    const alert = document.querySelector('.alert');

try {
    const resposta = await fetch(URLcompleta, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, email, senha }),
    });

    if (resposta.ok) {
        alert.textContent = 'Usuário cadastrado com sucesso!';
        alert.classList.remove('alert-danger');
        alert.classList.add('alert-success');

        localStorage.removeItem('usuarioLogado');

        
        
    }
     else {
        alert.textContent = `Erro ao cadastrar usuário: ${resposta.statusText}`;
        alert.classList.remove('alert-success');
        alert.classList.add('alert-danger');
    }

    alert.style.display = 'flex'; 
    alert.classList.add('show');
    alert.style.position = 'fixed';
    alert.style.top = '50%';
    alert.style.left = '50%';
    alert.style.transform = 'translate(-50%, -50%)';

    setTimeout(() => {
        alert.classList.remove('show');
        alert.style.display = 'none'; 
    }, 5000);

} catch (erro) {
    console.error('Erro ao cadastrar usuário:', erro);
}

}


async function realizarLogin() {
    const URLcompleta = `${protocolo}${baseURL}/login`;
    let loginEmail = document.querySelector('#login-email');
    let loginSenha = document.querySelector('#login-senha');
    let email = loginEmail.value;
    let senha = loginSenha.value;

    const alert = document.querySelector('.alert');
    const userGreeting = document.getElementById('user-greeting');
    const logoutButton = document.getElementById('logout-button');

    try {
        const resposta = await fetch(URLcompleta, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });

        if (resposta.ok) {
            const { token, nome } = await resposta.json();
            console.log('Usuário logado:', nome); 
            alert.textContent = `Login realizado com sucesso, Olá ${nome}!`;
            alert.classList.remove('alert-danger');
            alert.classList.add('alert-success');

            
            const btnLogin = document.querySelector('.btnLogin-popup');
            btnLogin.style.display = 'none';

           
            userGreeting.textContent = `Olá, ${nome}!`;
            localStorage.setItem('usuarioLogado', JSON.stringify({ token, nome }));
            userGreeting.classList.remove('d-none');

            
            logoutButton.classList.remove('d-none');

        
            
        } else {
            const erro = await resposta.text();
            console.error('Erro ao realizar login:', erro);
            alert.textContent = 'Credenciais inválidas. Tente novamente.';
            alert.classList.remove('alert-success');
            alert.classList.add('alert-danger');
        }

        alert.style.display = 'flex';
        alert.classList.add('show');
        alert.style.position = 'fixed';
        alert.style.top = '50%';
        alert.style.left = '50%';
        alert.style.transform = 'translate(-50%, -50%)';

        setTimeout(() => {
            alert.classList.remove('show');
            alert.style.display = 'none';
        }, 5000);
    } catch (erro) {
        console.error('Erro ao realizar login:', erro);
    }
}



async function realizarLogout() {
    const logoutURL = `${protocolo}${baseURL}/logout`;

    try {
        const resposta = await fetch(logoutURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
    
        });

        if (resposta.ok) {
            console.log('Logout realizado com sucesso.');

            localStorage.removeItem('usuarioLogado');

            const userGreeting = document.getElementById('user-greeting');
            userGreeting.textContent = '';

            
            const logoutButton = document.getElementById('logout-button');
            logoutButton.classList.add('d-none');

            
            const btnLogin = document.querySelector('.btnLogin-popup');
            btnLogin.style.display = 'block';

            
            exibirMensagem('Logout realizado com sucesso!', 'alert-success');

            localStorage.removeItem('usuarioLogado');
        } else {
           
            const erro = await resposta.text();
            console.error('Erro ao realizar logout:', erro);

            
            exibirMensagem('Erro ao realizar logout. Tente novamente.', 'alert-danger');
        }
    } catch (erro) {
        console.error('Erro ao realizar logout:', erro);
    }
}




async function obterLances() {
    const URLcompleta = `${protocolo}${baseURL}${lancesEndPoint}`;

    try {
        
        const response = await axios.get(URLcompleta);
        const lances = response.data;

        
        lances.sort((a, b) => parseFloat(b.valor_lance) - parseFloat(a.valor_lance));

        
        let tabela = document.querySelector('.lances');
        let corpoTabela = tabela.getElementsByTagName('tbody')[0];

        
        if (!corpoTabela) {
            corpoTabela = tabela.createTBody();
        } else {
            corpoTabela.innerHTML = "";
        }

        
        const limiteLinhas = 5;
        const quantidadeExibida = Math.min(lances.length, limiteLinhas);

        for (let i = 0; i < quantidadeExibida; i++) {
            let linha = corpoTabela.insertRow();
            let celulaNome = linha.insertCell(0);
            let celulaValorLance = linha.insertCell(1);

            celulaNome.textContent = lances[i].nome || '';  
            celulaValorLance.textContent = `R$ ${lances[i].valor_lance}` || '';
        }
    } catch (error) {
        console.error('Erro ao obter lances:', error);
    }
}






async function cadastrarLance() {
    const URLcompleta = `${protocolo}${baseURL}${lancesEndPoint}`;
    let lanceInput = document.querySelector('#valor');
    let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (usuarioLogado && usuarioLogado.nome && lanceInput.value) {
        let valor_lance = parseFloat(lanceInput.value.replace('R$ ', '').replace(',', '.'));

        // Obter o maior lance no banco de dados
        const maiorLance = await obterMaiorLance();

        // Verificar se o novo lance é maior que o maior lance no banco de dados
        if (valor_lance > maiorLance) {
            lanceInput.value = "";
            try {
                await axios.post(URLcompleta, { usuarioLogado: usuarioLogado.nome, valor_lance });

                // Atualizar a exibição dos lances após cadastrar um novo lance
                await obterLances();
            } catch (error) {
                console.error('Erro ao cadastrar lance:', error);
            }
        } else {
            exibirMensagem('O lance deve ser maior que o maior lance atual.', 'alert-danger');
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

function exibirMensagem(mensagem, classe) {
    const alert = document.querySelector('.alert');
    alert.textContent = mensagem;
    alert.className = `alert ${classe} show`;

    alert.style.display = 'flex';
    alert.style.position = 'fixed';
    alert.style.top = '50%';
    alert.style.left = '50%';
    alert.style.transform = 'translate(-50%, -50%)';

    setTimeout(() => {
        alert.classList.remove('show');
        alert.style.display = 'none';
    }, 5000);
}


// Função para obter o maior lance no banco de dados
async function obterMaiorLance() {
    const URLcompleta = `${protocolo}${baseURL}${lancesEndPoint}`;

    try {
        const response = await axios.get(URLcompleta);
        const lances = response.data;

        // Ordenar os lances em ordem decrescente
        lances.sort((a, b) => parseFloat(b.valor_lance) - parseFloat(a.valor_lance));

        // Retornar o valor do maior lance (ou 0 se não houver lances)
        return lances.length > 0 ? parseFloat(lances[0].valor_lance) : 0;
    } catch (error) {
        console.error('Erro ao obter lances:', error);
        return 0;
    }
}

  



