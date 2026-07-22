const servicosDisponiveis =[
    {id:"o que é", nome: "O que é ser performática?", duração: "30 minutos"}, 
    {id:"surgimento ", nome: "quando surgiu?", duração: "15 minutos"}, 
    {id:"tipos", nome: "tipos de pessoas performáticas e quem você é", duração: "45 minutos"}
];

const dadosAgendamento = {
    nome: '',
    servicoTexto: '',
    data: '',
    hora: ''
};

const form = document.getElementById('agendamentoForm');
const inputCliente = document.getElementById('cliente');
const selectServico = document.getElementById('servico');
const inputData = document.getElementById('data');
const inputHora = document.getElementById('hora');

const etapa1 = document.getElementById('etapa1');
const etapa2 = document.getElementById('etapa2');
const btnProximo = document.getElementById('btnProximo');
const btnVoltar = document.getElementById('btnVoltar');

const msgPreview = document.getElementById('msgPreview');
const previewCard = document.getElementById('preview');

function carregarServicos(){
    selectServico.innerHTML = '<option value="" disabled selected> Escolha um serviço...</option>';
    
    servicosDisponiveis.forEach(servico => {
        const option = document.createElement('option');
        option.value = servico.id;
        option.textContent = `${servico.nome} (${servico.duração})`;
        selectServico.appendChild(option);
    });
}

function atualizarPreview(){
    dadosAgendamento.nome = inputCliente.value.trim();
    dadosAgendamento.servicoTexto = selectServico.options[selectServico.selectedIndex]?.text || '';
    dadosAgendamento.data = inputData.value;
    dadosAgendamento.hora = inputHora.value;

    let dataFormatada = '';
    if(dadosAgendamento.data){
        dataFormatada = dadosAgendamento.data.split('-').reverse().join('/');
    }

    if (dadosAgendamento.nome || selectServico.value || dadosAgendamento.data || dadosAgendamento.hora){
        msgPreview.innerHTML = `<strong> cliente: </strong> ${dadosAgendamento.nome || '...'} <br><br>
        <strong> Serviço: </strong> ${selectServico.value ? dadosAgendamento.servicoTexto : '...'} <br><br>
        <strong> Data: </strong> ${dataFormatada || '...'} <br><br>
        <strong> Horário: </strong> ${dadosAgendamento.hora || '...'}`;

        previewCard.style.borderLeft = "4px solid #f10f69";
    } else {
        msgPreview.textContent = "Aguardando dados...";
        previewCard.style.borderLeft = "none"; // Corrigido: 'nome' -> 'none'
    }
}

inputCliente.addEventListener('input', atualizarPreview);
selectServico.addEventListener('change', atualizarPreview);
inputData.addEventListener('change', atualizarPreview);
inputHora.addEventListener('change', atualizarPreview);

btnProximo.addEventListener('click', () => {
    // Corrigido: !selectServico.value (antes bloqueava se selecionasse o serviço)
    if(!inputCliente.value.trim() || !selectServico.value){
        alert("Por favor, preencha o nome e escolha o serviço antes de avançar.");
        return;
    }

    etapa1.style.display = 'none'; // Corrigido: 'nome' -> 'none'
    etapa2.style.display = 'block'; // Corrigido: virgula por ponto em 'style.display'

});

btnVoltar.addEventListener('click', () => {
     etapa2.style.display = 'none'; // Corrigido: 'nome' -> 'none'
     etapa1.style.display = "block";
});

form.addEventListener('submit', function(event){
    event.preventDefault();
    form.style.display = 'none'; // Corrigido: 'nome' -> 'none'
    gerarArquivoJSON();
    const nomeServicoLimpo = dadosAgendamento.servicoTexto.split('-')[0].trim(); // Corrigido: nomeServicoLimpo com 'L' maiúsculo
    const dataFormatadaFinal = dadosAgendamento.data.split('-').reverse().join('/');
    msgPreview.innerHTML = `
    <h3 style="color: #f41283;"> Tudo Certo! </h3>
    <p>E aí, <strong>${dadosAgendamento.nome}</strong>! Seu horário para <strong>${nomeServicoLimpo}</strong> está garantido.</p>
    <hr style="margin: 10px 0; border: 0; border-top: 1px solid #ccc;"> <!-- Corrigido: : por ; no CSS -->
    <p><strong>Quando:</strong> ${dataFormatadaFinal} às ${dadosAgendamento.hora}</p>
    <p style="font-size: 0.9em; color: #666;"><em>O arquivo agendamento.json foi baixado!</em></p>
    <button id="btnNovo" style="margin-top: 20px; padding: 10px; width: 100%;">Agendar outro cliente</button>`;

    document.getElementById('btnNovo').addEventListener('click', () => {
        form.reset(); // Corrigido: trocado requestFullscreen por reset para limpar formulário
        atualizarPreview();
        etapa2.style.display = 'none'; // Corrigido: 'nome' -> 'none'
        etapa1.style.display = 'block';
        form.style.display = 'block';
        inputCliente.focus();
    });
});

function gerarArquivoJSON() {
    const dadosString = JSON.stringify(dadosAgendamento, null, 2);
    const blob = new Blob ([dadosString], { type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'agendamento.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

carregarServicos();