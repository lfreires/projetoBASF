const formulario = document.querySelector('.corpo__cartao__principal');
const loading = document.querySelector('.lds-dual-ring');
const botaoSubmit = document.querySelector('.cartao__main__botao__submeter');
const messageSuccess = document.querySelector('.cartao__main__message__submit__success');
const messageError = document.querySelector('.cartao__main__message__submit__error');

function confereCamposVazios() {
    /*Função para conferir se os campos obrigatórios do formulário estão completos */
    const camposObrigatorios = document.querySelectorAll('.campo__obrigatorio'); // Seleciona todos os campos obrigatórios
    const mensagemErroFormulario = document.querySelector('.cartao__main__message__error'); // Seleciono a mensagem de erro do formulario
    let camposVazios = false; // Variavel de controle para armazenar se foi encontrado ou não um campo obrigatorio vazio

    for (let i = 0; i < camposObrigatorios.length; i++) { // Percorro todos os campos obrigatórios
        const campo = camposObrigatorios[i]; // Armazeno o campo atual

        if (campo.value === '') { // Se o campo está vazio

            campo.addEventListener('input', () => { // Adiciono um event listener no campo para que caso haja um input, tire o erro
                camposObrigatorios[i].parentNode.classList.remove('error'); // Se houver um input, remova a classe de erro do elemento pai
                if (formulario.querySelector('.error') === null) mensagemErroFormulario.classList.remove('active'); // Se não tiver mais erros no formulario tiro a mensagem de erro
            });

            campo.parentNode.classList.add('error'); // Adiciona a classe 'error' ao elemento pai do campo
            camposVazios = true; // Variavel de controle como true para mostrar que foi encontrado um campo vazio
        }
    }

    const respostaAfirmativa = document.getElementById('respostaProdutoAfirmativa'); // Seleciono o input negativo para produtos
    if (!respostaAfirmativa.checked) {
        const descricaoFinalidadeTextBox = document.querySelector('.descrever__finalidade__input'); // Seleciono o input do campo de descricao de finalidade
        if (descricaoFinalidadeTextBox.value === '') { // Se o input for vazio
            camposVazios = true; // Variavel de controle como true para mostrar que foi encontrado um campo vazio
            descricaoFinalidadeTextBox.classList.add('error'); // Adiciono a classe erro ao input

            descricaoFinalidadeTextBox.addEventListener('input', () => { // Adiciono um event listener no campo para que caso haja um input, tire o erro
                descricaoFinalidadeTextBox.classList.remove('error'); // Se houver input, remova a classe de erro
                if (formulario.querySelector('.error') === null) mensagemErroFormulario.classList.remove('active'); // Se não tiver mais erros no formulario tiro a mensagem de erro
            })
        }
    }

    const termosDePrivacidade = document.querySelector('.termos__privacidade__input');
    if (termosDePrivacidade.checked === false) {
        camposVazios = true;
        const termosDePrivacidadeTexto = document.querySelector('.termos__privacidade__label');
        termosDePrivacidadeTexto.classList.add('error');

        termosDePrivacidade.addEventListener('click', () => {
            termosDePrivacidadeTexto.classList.remove('error');
            if (formulario.querySelector('.error') === null) mensagemErroFormulario.classList.remove('active'); // Se não tiver mais erros no formulario tiro a mensagem de erro
        })
    }

    return camposVazios; // Retorna se os campos estão vazios ou não
}

formulario.addEventListener('submit', event => {

    event.preventDefault(); //Previne o refresh da pagina
    messageSuccess.classList.remove('active');
    messageError.classList.remove('active');

    if (confereCamposVazios()) { // Se no confereCamposVazios retornar true, ou seja, há campos vazios
        const mensagemErroFormulario = document.querySelector('.cartao__main__message__error'); // Seleciono a mensagem de erro do formulario
        mensagemErroFormulario.classList.add('active'); // Adiciono a class active para que ela fique ativa.
        return // Retorno a function para que não se faça mais nada.
    }

    else { // Se não

        loading.classList.add('active');
        botaoSubmit.classList.add('disabled');
        botaoSubmit.disabled = true;

        let listaFormulario = {} // Crio um dicionario 
        listaFormulario['produtos'] = [] // Inicio a lista de produtos como vazio
        listaFormulario['descricao'] = '' // Descrição como vazia

        const informacoesClientes = document.querySelectorAll('.cartao__principal__info__cliente input'); // Seleciono a parte do formulario com as informações dos clientes
        for (let i = 0; i < informacoesClientes.length; i++) { // Percorro cada input
            const valorInput = informacoesClientes[i].value; // Armazeno o que está em cada input
            const nomeInput = informacoesClientes[i].id; // Armazeno o id de cada input
            listaFormulario[nomeInput] = valorInput; // Salvo no dicionario com chave e valor, onde id é a chave e o valor do input é o valor
        }

        const respostaAfirmativa = document.getElementById('respostaProdutoAfirmativa'); // Seleciono o input positivo para seleção produtos
        if (respostaAfirmativa.checked) { // Caso tenha sido selecionado a seleção de produtos

            const listaProdutos = document.querySelectorAll('.cartao__main__selecionar__produtos input') // Seleciono os inputs da lista de produtos
            for (let i = 0; i < listaProdutos.length; i++) { // Percorro os inputs da lista de produtos
                const valorInput = listaProdutos[i].checked; // Armazeno o valor do produto - se está checado ou não 
                const nomeInput = listaProdutos[i].id; // Armazeno o id do produto
                if (valorInput === true) { // Caso o produto tenha sido selecionado
                    listaFormulario['produtos'].push(nomeInput); // Insiro na lista do meu dicionario o produto selecionado
                }
            }

        } else { // Caso tenha sido selecionado que precisa de ajuda

            const descricaoFinalidade = document.querySelector('.cartao__main__descrever__finalidade textarea'); // Seleciono o textarea da descrição da necessidade do cliente
            listaFormulario['descricao'] = descricaoFinalidade.value; // Armazeno o que foi escrito pelo cliente na minha lista

        }

        fetch('http://localhost:3003/bd', { //Envio o meus dados ao servidor na porta 3003 na rota do banco de dados
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(listaFormulario)
        })
        .then(response => {

            setTimeout(function () {

                loading.classList.remove('active'); // Desabilita o loading
                botaoSubmit.classList.remove('disabled');
                botaoSubmit.disabled = false;
                messageSuccess.classList.add('active');

                if (!response.ok) {
                    throw new Error('Erro ao enviar os dados para o servidor.');
                }
            }, 1000);

        })
        .catch(error => {
            loading.classList.remove('active'); // Desabilita o loading
            messageError.classList.add('active');
            botaoSubmit.classList.remove('disabled');
            botaoSubmit.disabled = false;
        });

    }

});

// Parte do código responsavel por mostrar lista de produtos ou para mostrar a textBox de descrição de finalidade do cliente
const respostaNegativa = document.getElementById('respostaProdutoNegativa'); // Seleciono o input afirmativa para produtos 
const respostaAfirmativa = document.getElementById('respostaProdutoAfirmativa'); // Seleciono o input negativo para produtos

respostaNegativa.addEventListener('click', () => { // Event listener para click no input de resposta negativo
    respostaAfirmativa.checked = false; // Caso seja clicado, tira o checked do afirmativo

    const listaProdutos = document.querySelector('.cartao__main__selecionar__produtos'); // Seleciono a lista de produtos
    const descricaoFinalidade = document.querySelector('.cartao__main__descrever__finalidade'); // Seleciono a descricao de finalidade do cliente
    descricaoFinalidade.classList.add('active'); // Adiciono a classe active na descricao de finalidade do cliente
    listaProdutos.classList.remove('active'); // Removo a classe active na lista de produtos

})

respostaAfirmativa.addEventListener('click', () => { // Event listener para click no input de resposta afirmativo
    respostaNegativa.checked = false;// Caso seja clicado, tira o checked do negativo
    const listaProdutos = document.querySelector('.cartao__main__selecionar__produtos'); // Seleciono a lista de produtos
    const descricaoFinalidade = document.querySelector('.cartao__main__descrever__finalidade'); // Seleciono a descricao de finalidade do cliente
    const descricaoFinalidadeTextBox = document.querySelector('.descrever__finalidade__input');
    descricaoFinalidade.classList.remove('active'); // Removo a classe active na descricao de finalidade do cliente
    listaProdutos.classList.add('active'); // Adiciono a classe active na lista de produtos
    descricaoFinalidadeTextBox.classList.remove('error');
})

//Parte botao adicionar e diminuir do volume
const volumeInput = document.querySelector('.cartao__main__campo--volume input');
const botaoAumentar = document.querySelector('.button__mais');
const botaoDiminuir = document.querySelector('.button__menos');


botaoAumentar.addEventListener('click', () => {
    if (volumeInput.value === '') volumeInput.value = parseInt(0);
    volumeInput.value = parseInt(volumeInput.value) + 1;
});

botaoDiminuir.addEventListener('click', () => {
    if (parseInt(volumeInput.value) > 0) {
        volumeInput.value = parseInt(volumeInput.value) - 1;
    }
    if (parseInt(volumeInput.value) === 0) {
        volumeInput.value = '';
    }
});