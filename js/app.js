// ========================================
// ORÇAPRO
// DASHBOARD
// ========================================

/* ========================================
   DADOS INICIAIS
======================================== */

const orcamentosIniciais = [
    {
        id: 1024,
        cliente: "João Silva",
        data: "16/09/2026",
        valor: 2450,
        status: "Em aberto"
    },
    {
        id: 1023,
        cliente: "Maria Souza",
        data: "15/09/2026",
        valor: 1800,
        status: "Aprovado"
    },
    {
        id: 1022,
        cliente: "Carlos Oliveira",
        data: "14/09/2026",
        valor: 3200,
        status: "Em aberto"
    },
    {
        id: 1021,
        cliente: "Fernanda Lima",
        data: "13/09/2026",
        valor: 4750,
        status: "Aprovado"
    }
];


/* ========================================
   CONFIGURAÇÃO
======================================== */

const CHAVE_STORAGE = "orcamentos";


/* ========================================
   ELEMENTOS
======================================== */

const elementoTotalOrcamentos =
    document.querySelector("#total-orcamentos");

const elementoOrcamentosAbertos =
    document.querySelector("#orcamentos-abertos");

const elementoOrcamentosAprovados =
    document.querySelector("#orcamentos-aprovados");

const elementoValorAprovado =
    document.querySelector("#valor-aprovado");

const listaOrcamentos =
    document.querySelector("#orcamentos-lista");

const botaoNovoOrcamento =
    document.querySelector("#novo-orcamento");

const modalOrcamento =
    document.querySelector("#modal-orcamento");

const formularioOrcamento =
    document.querySelector("#form-orcamento");

const fecharModal =
    document.querySelector("#fechar-modal");

const cancelarModal =
    document.querySelector("#cancelar-modal");

const campoCliente =
    document.querySelector("#cliente");

const campoData =
    document.querySelector("#data");

const campoValor =
    document.querySelector("#valor");

const campoStatus =
    document.querySelector("#status");

const modalVisualizar =
    document.querySelector("#modal-visualizar");

const fecharVisualizacao =
    document.querySelector("#fechar-visualizacao");

const fecharDetalhes =
    document.querySelector("#fechar-detalhes");

const visualizarId =
    document.querySelector("#visualizar-id");

const visualizarCliente =
    document.querySelector("#visualizar-cliente");

const visualizarData =
    document.querySelector("#visualizar-data");

const visualizarValor =
    document.querySelector("#visualizar-valor");

const visualizarStatus =
    document.querySelector("#visualizar-status");


let orcamentoEmEdicao = null;


/* ========================================
   LOCAL STORAGE
======================================== */

function carregarOrcamentos() {

    try {

        const dadosSalvos =
            localStorage.getItem(
                CHAVE_STORAGE
            );

        if (!dadosSalvos) {

            const dadosIniciais =
                orcamentosIniciais.map(
                    (orcamento) => ({
                        ...orcamento,
                        itens: orcamento.itens || []
                    })
                );

            localStorage.setItem(
                CHAVE_STORAGE,
                JSON.stringify(dadosIniciais)
            );

            return dadosIniciais;
        }

        const dados =
            JSON.parse(dadosSalvos);

        if (!Array.isArray(dados)) {
            return [];
        }

        return dados;

    } catch (erro) {

        console.error(
            "Erro ao carregar orçamentos:",
            erro
        );

        return [];
    }
}


function salvarOrcamentos() {

    try {

        localStorage.setItem(
            CHAVE_STORAGE,
            JSON.stringify(orcamentos)
        );

        return true;

    } catch (erro) {

        console.error(
            "Erro ao salvar orçamentos:",
            erro
        );

        return false;
    }
}


/* ========================================
   ESTADO
======================================== */

let orcamentos =
    carregarOrcamentos();


/* ========================================
   UTILITÁRIOS
======================================== */

function normalizarNumero(valor) {

    const numero =
        Number(valor);

    return Number.isFinite(numero)
        ? numero
        : 0;
}


function formatarMoeda(valor) {

    return normalizarNumero(
        valor
    ).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


function obterClasseStatus(status) {

    return status === "Aprovado"
        ? "status-approved"
        : "status-pending";
}


function gerarNovoId() {

    if (orcamentos.length === 0) {
        return 1001;
    }

    const maiorId =
        orcamentos.reduce(
            (maior, orcamento) =>
                Math.max(
                    maior,
                    normalizarNumero(
                        orcamento.id
                    )
                ),
            1000
        );

    return maiorId + 1;
}


function formatarData(dataISO) {

    if (!dataISO) {
        return "";
    }

    const partes =
        dataISO.split("-");

    if (partes.length !== 3) {
        return dataISO;
    }

    const [ano, mes, dia] =
        partes;

    return `${dia}/${mes}/${ano}`;
}


function converterDataParaInput(dataBR) {

    if (!dataBR) {
        return "";
    }

    const partes =
        dataBR.split("/");

    if (partes.length !== 3) {
        return "";
    }

    const [dia, mes, ano] =
        partes;

    return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}


function bloquearScrollModal() {

    document.body.classList.add(
        "modal-open"
    );
}


function liberarScrollModal() {

    if (
        !modalOrcamento?.classList.contains("active") &&
        !modalVisualizar?.classList.contains("active")
    ) {

        document.body.classList.remove(
            "modal-open"
        );
    }
}


/* ========================================
   CONTADORES
======================================== */

function contarOrcamentos() {

    return orcamentos.length;
}


function contarAprovados() {

    return orcamentos.filter(
        (orcamento) =>
            orcamento.status ===
            "Aprovado"
    ).length;
}


function contarEmAberto() {

    return orcamentos.filter(
        (orcamento) =>
            orcamento.status ===
            "Em aberto"
    ).length;
}


function calcularValorAprovado() {

    return orcamentos
        .filter(
            (orcamento) =>
                orcamento.status ===
                "Aprovado"
        )
        .reduce(
            (total, orcamento) =>
                total +
                normalizarNumero(
                    orcamento.valor
                ),
            0
        );
}


/* ========================================
   ATUALIZAR DASHBOARD
======================================== */

function atualizarDashboard() {

    if (elementoTotalOrcamentos) {

        elementoTotalOrcamentos.textContent =
            contarOrcamentos();
    }


    if (elementoOrcamentosAbertos) {

        elementoOrcamentosAbertos.textContent =
            contarEmAberto();
    }


    if (elementoOrcamentosAprovados) {

        elementoOrcamentosAprovados.textContent =
            contarAprovados();
    }


    if (elementoValorAprovado) {

        elementoValorAprovado.textContent =
            formatarMoeda(
                calcularValorAprovado()
            );
    }
}


/* ========================================
   CRIAR CÉLULA
======================================== */

function criarCelula(texto) {

    const celula =
        document.createElement("td");

    celula.textContent =
        texto ?? "—";

    return celula;
}


/* ========================================
   CRIAR AÇÕES
======================================== */

function criarAcao(
    texto,
    id,
    acao
) {

    const link =
        document.createElement("a");

    link.href = "#";

    link.className =
        "table-action";

    link.dataset.id =
        id;

    link.dataset.action =
        acao;

    link.textContent =
        texto;

    return link;
}


/* ========================================
   RENDERIZAR ORÇAMENTOS
======================================== */

function renderizarOrcamentos() {

    if (!listaOrcamentos) {
        return;
    }

    listaOrcamentos.innerHTML = "";


    if (orcamentos.length === 0) {

        const linha =
            document.createElement("tr");

        const celula =
            document.createElement("td");

        celula.colSpan = 6;

        celula.textContent =
            "Nenhum orçamento encontrado.";

        celula.style.textAlign =
            "center";

        celula.style.padding =
            "32px";

        linha.appendChild(
            celula
        );

        listaOrcamentos.appendChild(
            linha
        );

        return;
    }


    const orcamentosOrdenados =
        [...orcamentos].sort(
            (a, b) =>
                normalizarNumero(b.id) -
                normalizarNumero(a.id)
        );


    orcamentosOrdenados.forEach(
        (orcamento) => {

            const linha =
                document.createElement("tr");


            linha.appendChild(
                criarCelula(
                    `#${orcamento.id}`
                )
            );


            linha.appendChild(
                criarCelula(
                    orcamento.cliente
                )
            );


            linha.appendChild(
                criarCelula(
                    orcamento.data
                )
            );


            linha.appendChild(
                criarCelula(
                    formatarMoeda(
                        orcamento.valor
                    )
                )
            );


            const celulaStatus =
                document.createElement("td");

            const status =
                document.createElement("span");

            status.className =
                `status ${obterClasseStatus(
                    orcamento.status
                )}`;

            status.textContent =
                orcamento.status ||
                "Em aberto";

            celulaStatus.appendChild(
                status
            );

            linha.appendChild(
                celulaStatus
            );


            const celulaAcoes =
                document.createElement("td");


            celulaAcoes.appendChild(
                criarAcao(
                    "Visualizar",
                    orcamento.id,
                    "visualizar"
                )
            );


            celulaAcoes.appendChild(
                criarAcao(
                    "Editar",
                    orcamento.id,
                    "editar"
                )
            );


            celulaAcoes.appendChild(
                criarAcao(
                    "Excluir",
                    orcamento.id,
                    "excluir"
                )
            );


            linha.appendChild(
                celulaAcoes
            );


            listaOrcamentos.appendChild(
                linha
            );
        }
    );
}


/* ========================================
   MODAL — NOVO / EDIÇÃO
======================================== */

function abrirModal() {

    if (!modalOrcamento) {
        return;
    }

    orcamentoEmEdicao =
        null;

    formularioOrcamento?.reset();


    const titulo =
        modalOrcamento.querySelector(
            ".modal-header h2"
        );

    const descricao =
        modalOrcamento.querySelector(
            ".modal-header p"
        );

    const botaoSalvar =
        formularioOrcamento?.querySelector(
            'button[type="submit"]'
        );


    if (titulo) {

        titulo.textContent =
            "Novo orçamento";
    }


    if (descricao) {

        descricao.textContent =
            "Preencha os dados para criar um novo orçamento.";
    }


    if (botaoSalvar) {

        botaoSalvar.textContent =
            "Salvar orçamento";
    }


    if (campoData) {

        campoData.valueAsDate =
            new Date();
    }


    modalOrcamento.classList.add(
        "active"
    );

    bloquearScrollModal();

    campoCliente?.focus();
}


/* ========================================
   ABRIR EDIÇÃO
======================================== */

function abrirModalEdicao(id) {

    const orcamento =
        orcamentos.find(
            (item) =>
                normalizarNumero(
                    item.id
                ) ===
                normalizarNumero(id)
        );


    if (
        !orcamento ||
        !modalOrcamento
    ) {

        return;
    }


    orcamentoEmEdicao =
        orcamento;


    const titulo =
        modalOrcamento.querySelector(
            ".modal-header h2"
        );

    const descricao =
        modalOrcamento.querySelector(
            ".modal-header p"
        );

    const botaoSalvar =
        formularioOrcamento?.querySelector(
            'button[type="submit"]'
        );


    if (titulo) {

        titulo.textContent =
            `Editar orçamento #${orcamento.id}`;
    }


    if (descricao) {

        descricao.textContent =
            "Atualize os dados deste orçamento.";
    }


    if (botaoSalvar) {

        botaoSalvar.textContent =
            "Salvar alterações";
    }


    if (campoCliente) {

        campoCliente.value =
            orcamento.cliente || "";
    }


    if (campoData) {

        campoData.value =
            converterDataParaInput(
                orcamento.data
            );
    }


    if (campoValor) {

        campoValor.value =
            normalizarNumero(
                orcamento.valor
            );
    }


    if (campoStatus) {

        campoStatus.value =
            orcamento.status ||
            "Em aberto";
    }


    modalOrcamento.classList.add(
        "active"
    );

    bloquearScrollModal();

    campoCliente?.focus();
}


/* ========================================
   FECHAR MODAL
======================================== */

function fecharModalOrcamento() {

    if (!modalOrcamento) {
        return;
    }

    modalOrcamento.classList.remove(
        "active"
    );

    orcamentoEmEdicao =
        null;

    formularioOrcamento?.reset();

    liberarScrollModal();
}


/* ========================================
   SALVAR ORÇAMENTO
======================================== */

function salvarOrcamento(evento) {

    evento.preventDefault();


    if (!formularioOrcamento) {
        return;
    }


    const cliente =
        campoCliente?.value.trim() ||
        "";

    const data =
        formatarData(
            campoData?.value || ""
        );

    const valor =
        normalizarNumero(
            campoValor?.value
        );

    const status =
        campoStatus?.value ||
        "Em aberto";


    if (!cliente) {

        campoCliente?.focus();

        return;
    }


    if (!data) {

        campoData?.focus();

        return;
    }


    if (valor < 0) {

        campoValor?.focus();

        return;
    }


    if (orcamentoEmEdicao) {

        orcamentoEmEdicao.cliente =
            cliente;

        orcamentoEmEdicao.data =
            data;

        orcamentoEmEdicao.valor =
            valor;

        orcamentoEmEdicao.status =
            status;

    } else {

        orcamentos.push({

            id: gerarNovoId(),

            cliente,

            data,

            valor,

            status,

            itens: []
        });
    }


    const salvo =
        salvarOrcamentos();


    if (!salvo) {
        return;
    }


    fecharModalOrcamento();

    atualizarDashboard();

    renderizarOrcamentos();
}


/* ========================================
   MODAL — VISUALIZAÇÃO
======================================== */

function preencherStatusVisualizacao(
    status
) {

    if (!visualizarStatus) {
        return;
    }


    visualizarStatus.className =
        `status ${obterClasseStatus(
            status
        )}`;


    visualizarStatus.textContent =
        status ||
        "Em aberto";
}


/* ========================================
   ABRIR VISUALIZAÇÃO
======================================== */

function abrirVisualizacao(id) {

    const orcamento =
        orcamentos.find(
            (item) =>
                normalizarNumero(
                    item.id
                ) ===
                normalizarNumero(id)
        );


    if (
        !orcamento ||
        !modalVisualizar
    ) {

        return;
    }


    if (visualizarId) {

        visualizarId.textContent =
            `#${orcamento.id}`;
    }


    if (visualizarCliente) {

        visualizarCliente.textContent =
            orcamento.cliente ||
            "—";
    }


    if (visualizarData) {

        visualizarData.textContent =
            orcamento.data ||
            "—";
    }


    if (visualizarValor) {

        visualizarValor.textContent =
            formatarMoeda(
                orcamento.valor
            );
    }


    preencherStatusVisualizacao(
        orcamento.status
    );


    const listaItens =
        modalVisualizar.querySelector(
            "#visualizar-itens"
        );


    const totalVisualizacao =
        modalVisualizar.querySelector(
            "#visualizar-total"
        );


    if (listaItens) {

        listaItens.innerHTML = "";


        const itens =
            Array.isArray(
                orcamento.itens
            )
                ? orcamento.itens
                : [];


        if (itens.length === 0) {

            const linha =
                document.createElement("tr");

            const celula =
                document.createElement("td");

            celula.colSpan = 4;

            celula.textContent =
                "Nenhum item adicionado a este orçamento.";

            celula.style.textAlign =
                "center";

            celula.style.padding =
                "24px";

            linha.appendChild(
                celula
            );

            listaItens.appendChild(
                linha
            );

        } else {

            itens.forEach(
                (item) => {

                    const linha =
                        document.createElement(
                            "tr"
                        );


                    const produto =
                        item.produto ||
                        "—";


                    const quantidade =
                        normalizarNumero(
                            item.quantidade
                        );


                    const valorUnitario =
                        normalizarNumero(
                            item.valorUnitario
                        );


                    const subtotal =
                        normalizarNumero(
                            item.subtotal ??
                            quantidade *
                            valorUnitario
                        );


                    linha.appendChild(
                        criarCelula(
                            produto
                        )
                    );


                    linha.appendChild(
                        criarCelula(
                            quantidade
                        )
                    );


                    linha.appendChild(
                        criarCelula(
                            formatarMoeda(
                                valorUnitario
                            )
                        )
                    );


                    linha.appendChild(
                        criarCelula(
                            formatarMoeda(
                                subtotal
                            )
                        )
                    );


                    listaItens.appendChild(
                        linha
                    );
                }
            );
        }
    }


    if (totalVisualizacao) {

        const itens =
            Array.isArray(
                orcamento.itens
            )
                ? orcamento.itens
                : [];


        const totalItens =
            itens.reduce(
                (total, item) =>
                    total +
                    normalizarNumero(
                        item.subtotal ??
                        normalizarNumero(
                            item.quantidade
                        ) *
                        normalizarNumero(
                            item.valorUnitario
                        )
                    ),
                0
            );


        totalVisualizacao.textContent =
            formatarMoeda(
                itens.length > 0
                    ? totalItens
                    : orcamento.valor
            );
    }


    modalVisualizar.classList.add(
        "active"
    );

    bloquearScrollModal();
}


/* ========================================
   FECHAR VISUALIZAÇÃO
======================================== */

function fecharModalVisualizacao() {

    if (!modalVisualizar) {
        return;
    }


    modalVisualizar.classList.remove(
        "active"
    );


    liberarScrollModal();
}


/* ========================================
   EVENTOS — NOVO ORÇAMENTO
======================================== */

botaoNovoOrcamento?.addEventListener(
    "click",
    (evento) => {

        evento.preventDefault();

        abrirModal();
    }
);


fecharModal?.addEventListener(
    "click",
    fecharModalOrcamento
);


cancelarModal?.addEventListener(
    "click",
    fecharModalOrcamento
);


formularioOrcamento?.addEventListener(
    "submit",
    salvarOrcamento
);


/* ========================================
   EVENTOS — VISUALIZAÇÃO
======================================== */

fecharVisualizacao?.addEventListener(
    "click",
    fecharModalVisualizacao
);


fecharDetalhes?.addEventListener(
    "click",
    fecharModalVisualizacao
);


/* ========================================
   FECHAR CLICANDO FORA
======================================== */

modalOrcamento?.addEventListener(
    "click",
    (evento) => {

        if (
            evento.target ===
            modalOrcamento
        ) {

            fecharModalOrcamento();
        }
    }
);


modalVisualizar?.addEventListener(
    "click",
    (evento) => {

        if (
            evento.target ===
            modalVisualizar
        ) {

            fecharModalVisualizacao();
        }
    }
);


/* ========================================
   ESC FECHA MODAIS
======================================== */

document.addEventListener(
    "keydown",
    (evento) => {

        if (evento.key !== "Escape") {
            return;
        }


        if (
            modalOrcamento?.classList.contains(
                "active"
            )
        ) {

            fecharModalOrcamento();
        }


        if (
            modalVisualizar?.classList.contains(
                "active"
            )
        ) {

            fecharModalVisualizacao();
        }
    }
);


/* ========================================
   EXCLUIR ORÇAMENTO
======================================== */

function excluirOrcamento(id) {

    const orcamento =
        orcamentos.find(
            (item) =>
                normalizarNumero(
                    item.id
                ) ===
                normalizarNumero(id)
        );


    if (!orcamento) {

        console.error(
            "Orçamento não encontrado:",
            id
        );

        return;
    }


    const confirmar =
        confirm(
            `Deseja realmente excluir o orçamento #${orcamento.id} de ${orcamento.cliente}?`
        );


    if (!confirmar) {
        return;
    }


    orcamentos =
        orcamentos.filter(
            (item) =>
                normalizarNumero(
                    item.id
                ) !==
                normalizarNumero(id)
        );


    const salvo =
        salvarOrcamentos();


    if (!salvo) {
        return;
    }


    atualizarDashboard();

    renderizarOrcamentos();
}


/* ========================================
   AÇÕES DA TABELA
======================================== */

listaOrcamentos?.addEventListener(
    "click",
    (evento) => {

        const botao =
            evento.target.closest(
                "[data-action]"
            );


        if (!botao) {
            return;
        }


        evento.preventDefault();


        const id =
            Number(
                botao.dataset.id
            );


        if (!Number.isFinite(id)) {
            return;
        }


        const acao =
            botao.dataset.action;


        if (acao === "excluir") {

            excluirOrcamento(id);

            return;
        }


        if (acao === "visualizar") {

            abrirVisualizacao(id);

            return;
        }


        if (acao === "editar") {

            abrirModalEdicao(id);
        }
    }
);


/* ========================================
   EXPOR FUNÇÕES
======================================== */

window.abrirVisualizacao =
    abrirVisualizacao;

window.abrirModalEdicao =
    abrirModalEdicao;

window.abrirModal =
    abrirModal;

window.fecharModalOrcamento =
    fecharModalOrcamento;

window.fecharModalVisualizacao =
    fecharModalVisualizacao;


/* ========================================
   INICIALIZAÇÃO
======================================== */

atualizarDashboard();

renderizarOrcamentos();