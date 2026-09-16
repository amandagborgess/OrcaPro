/* ========================================
   CLIENTES — MÓDULO
======================================== */

const CHAVE_STORAGE = "clientes";

let clientes = [];
let clienteEmEdicao = null;


/* ========================================
   ELEMENTOS
======================================== */

const listaClientes =
    document.querySelector("#clientes-lista");

const resultadoClientes =
    document.querySelector("#resultado-clientes");

const campoBusca =
    document.querySelector("#buscar-cliente");

const botaoNovo =
    document.querySelector("#novo-cliente");

const modalCliente =
    document.querySelector("#modal-cliente");

const formulario =
    document.querySelector("#form-cliente");

const modalTitulo =
    document.querySelector("#modal-titulo-cliente");

const campoNome =
    document.querySelector("#cliente-nome");

const campoTelefone =
    document.querySelector("#cliente-telefone");

const campoEmail =
    document.querySelector("#cliente-email");

const campoCidade =
    document.querySelector("#cliente-cidade");

const campoEstado =
    document.querySelector("#cliente-estado");

const campoEndereco =
    document.querySelector("#cliente-endereco");

const campoObservacoes =
    document.querySelector("#cliente-observacoes");

const botaoFecharModal =
    document.querySelector("#fechar-modal-cliente");

const botaoCancelarModal =
    document.querySelector("#cancelar-modal-cliente");


/* ========================================
   LOCAL STORAGE
======================================== */

function carregarClientes() {

    try {

        const dadosSalvos =
            localStorage.getItem(CHAVE_STORAGE);

        if (!dadosSalvos) {
            return [];
        }

        const dados =
            JSON.parse(dadosSalvos);

        return Array.isArray(dados)
            ? dados
            : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar clientes:",
            erro
        );

        return [];
    }
}


function salvarClientes() {

    try {

        localStorage.setItem(
            CHAVE_STORAGE,
            JSON.stringify(clientes)
        );

        return true;

    } catch (erro) {

        console.error(
            "Erro ao salvar clientes:",
            erro
        );

        return false;
    }
}


/* ========================================
   UTILITÁRIOS
======================================== */

function normalizarTexto(valor) {

    return String(valor ?? "")
        .trim()
        .toLowerCase();
}


function obterProximoId() {

    if (clientes.length === 0) {
        return 1;
    }

    const maiorId =
        clientes.reduce(
            (maior, cliente) => {

                const id =
                    Number(cliente.id);

                return Number.isFinite(id)
                    ? Math.max(maior, id)
                    : maior;

            },
            0
        );

    return maiorId + 1;
}


/* ========================================
   FORMATAÇÃO
======================================== */

function formatarTelefone(telefone) {

    if (!telefone) {
        return "—";
    }

    return String(telefone);
}


/* ========================================
   RENDERIZAR CLIENTES
======================================== */

function renderizarClientes() {

    if (!listaClientes) {
        return;
    }

    const busca =
        normalizarTexto(
            campoBusca?.value
        );

    const resultados =
        clientes.filter((cliente) => {

            const id =
                String(cliente.id ?? "");

            const nome =
                normalizarTexto(cliente.nome);

            const telefone =
                normalizarTexto(cliente.telefone);

            const email =
                normalizarTexto(cliente.email);

            return (
                id.includes(busca) ||
                nome.includes(busca) ||
                telefone.includes(busca) ||
                email.includes(busca)
            );
        });


    listaClientes.innerHTML = "";


    /* ========================================
       NENHUM RESULTADO
    ======================================== */

    if (resultados.length === 0) {

        const linha =
            document.createElement("tr");

        const celula =
            document.createElement("td");

        celula.colSpan = 6;
        celula.textContent =
            "Nenhum cliente encontrado.";

        celula.style.textAlign = "center";
        celula.style.padding = "32px";

        linha.appendChild(celula);
        listaClientes.appendChild(linha);

    } else {

        /* ========================================
           LISTA DE CLIENTES
        ======================================== */

        resultados.forEach((cliente) => {

            const linha =
                document.createElement("tr");


            /* ID */

            const celulaId =
                document.createElement("td");

            celulaId.textContent =
                `#${cliente.id}`;

            linha.appendChild(celulaId);


            /* NOME */

            const celulaNome =
                document.createElement("td");

            celulaNome.textContent =
                cliente.nome || "—";

            linha.appendChild(celulaNome);


            /* TELEFONE */

            const celulaTelefone =
                document.createElement("td");

            celulaTelefone.textContent =
                formatarTelefone(
                    cliente.telefone
                );

            linha.appendChild(celulaTelefone);


            /* E-MAIL */

            const celulaEmail =
                document.createElement("td");

            celulaEmail.textContent =
                cliente.email || "—";

            linha.appendChild(celulaEmail);


            /* CIDADE / ESTADO */

            const celulaLocalizacao =
                document.createElement("td");

            if (cliente.cidade) {

                celulaLocalizacao.textContent =
                    cliente.estado
                        ? `${cliente.cidade} - ${cliente.estado}`
                        : cliente.cidade;

            } else {

                celulaLocalizacao.textContent =
                    "—";
            }

            linha.appendChild(
                celulaLocalizacao
            );


            /* AÇÕES */

            const celulaAcoes =
                document.createElement("td");


            const botaoEditar =
                document.createElement("a");

            botaoEditar.href = "#";
            botaoEditar.className =
                "table-action";
            botaoEditar.dataset.id =
                cliente.id;
            botaoEditar.dataset.action =
                "editar";
            botaoEditar.textContent =
                "Editar";


            const botaoExcluir =
                document.createElement("a");

            botaoExcluir.href = "#";
            botaoExcluir.className =
                "table-action";
            botaoExcluir.dataset.id =
                cliente.id;
            botaoExcluir.dataset.action =
                "excluir";
            botaoExcluir.textContent =
                "Excluir";


            celulaAcoes.appendChild(
                botaoEditar
            );

            celulaAcoes.appendChild(
                botaoExcluir
            );

            linha.appendChild(
                celulaAcoes
            );


            listaClientes.appendChild(
                linha
            );

        });
    }


    /* ========================================
       CONTADOR
    ======================================== */

    if (resultadoClientes) {

        resultadoClientes.textContent =
            `${resultados.length} ${
                resultados.length === 1
                    ? "cliente"
                    : "clientes"
            } encontrados`;
    }
}


/* ========================================
   NOVO CLIENTE
======================================== */

function abrirModalNovo() {

    clienteEmEdicao = null;


    if (modalTitulo) {

        modalTitulo.textContent =
            "Novo cliente";
    }


    formulario?.reset();


    abrirModal(modalCliente);


    campoNome?.focus();
}


/* ========================================
   EDITAR CLIENTE
======================================== */

function abrirModalEdicao(id) {

    const cliente =
        clientes.find(
            (item) =>
                Number(item.id) === Number(id)
        );


    if (!cliente) {
        return;
    }


    clienteEmEdicao =
        Number(cliente.id);


    if (modalTitulo) {

        modalTitulo.textContent =
            "Editar cliente";
    }


    if (campoNome) {
        campoNome.value =
            cliente.nome || "";
    }

    if (campoTelefone) {
        campoTelefone.value =
            cliente.telefone || "";
    }

    if (campoEmail) {
        campoEmail.value =
            cliente.email || "";
    }

    if (campoCidade) {
        campoCidade.value =
            cliente.cidade || "";
    }

    if (campoEstado) {
        campoEstado.value =
            cliente.estado || "";
    }

    if (campoEndereco) {
        campoEndereco.value =
            cliente.endereco || "";
    }

    if (campoObservacoes) {
        campoObservacoes.value =
            cliente.observacoes || "";
    }


    abrirModal(modalCliente);


    campoNome?.focus();
}


/* ========================================
   EXCLUIR CLIENTE
======================================== */

function excluirCliente(id) {

    const cliente =
        clientes.find(
            (item) =>
                Number(item.id) === Number(id)
        );


    if (!cliente) {
        return;
    }


    const confirmar =
        confirm(
            `Deseja realmente excluir o cliente "${cliente.nome}"?`
        );


    if (!confirmar) {
        return;
    }


    clientes =
        clientes.filter(
            (item) =>
                Number(item.id) !== Number(id)
        );


    salvarClientes();

    renderizarClientes();
}


/* ========================================
   SALVAR CLIENTE
======================================== */

formulario?.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const nome =
            campoNome?.value.trim() || "";

        const telefone =
            campoTelefone?.value.trim() || "";

        const email =
            campoEmail?.value.trim() || "";

        const cidade =
            campoCidade?.value.trim() || "";

        const estado =
            campoEstado?.value || "";

        const endereco =
            campoEndereco?.value.trim() || "";

        const observacoes =
            campoObservacoes?.value.trim() || "";


        /* ========================================
           VALIDAÇÃO
        ======================================== */

        if (!nome || !telefone) {

            if (!nome) {
                campoNome?.focus();
            } else {
                campoTelefone?.focus();
            }

            return;
        }


        /* ========================================
           EDITAR CLIENTE
        ======================================== */

        if (clienteEmEdicao !== null) {

            const indice =
                clientes.findIndex(
                    (item) =>
                        Number(item.id) ===
                        Number(clienteEmEdicao)
                );


            if (indice === -1) {
                return;
            }


            clientes[indice] = {

                ...clientes[indice],

                nome,
                telefone,
                email,
                cidade,
                estado,
                endereco,
                observacoes
            };


        /* ========================================
           NOVO CLIENTE
        ======================================== */

        } else {

            const novoId =
                obterProximoId();


            clientes.push({

                id: novoId,

                nome,
                telefone,
                email,
                cidade,
                estado,
                endereco,
                observacoes
            });
        }


        /* ========================================
           FINALIZAÇÃO
        ======================================== */

        const salvo =
            salvarClientes();


        if (!salvo) {
            return;
        }


        renderizarClientes();

        fecharModal(modalCliente);
    }
);


/* ========================================
   AÇÕES DA TABELA
======================================== */

listaClientes?.addEventListener(
    "click",
    (event) => {

        const botao =
            event.target.closest(
                "[data-action]"
            );


        if (!botao) {
            return;
        }


        event.preventDefault();


        const id =
            Number(botao.dataset.id);


        if (!Number.isFinite(id)) {
            return;
        }


        const acao =
            botao.dataset.action;


        switch (acao) {

            case "editar":
                abrirModalEdicao(id);
                break;

            case "excluir":
                excluirCliente(id);
                break;

        }
    }
);


/* ========================================
   NOVO CLIENTE
======================================== */

botaoNovo?.addEventListener(
    "click",
    abrirModalNovo
);


/* ========================================
   FECHAR MODAL
======================================== */

botaoFecharModal?.addEventListener(
    "click",
    () => fecharModal(modalCliente)
);


botaoCancelarModal?.addEventListener(
    "click",
    () => fecharModal(modalCliente)
);


/* ========================================
   FECHAR CLICANDO FORA
======================================== */

modalCliente?.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            modalCliente
        ) {

            fecharModal(
                modalCliente
            );
        }
    }
);


/* ========================================
   ESC
======================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            modalCliente?.classList.contains("active")
        ) {

            fecharModal(
                modalCliente
            );
        }
    }
);


/* ========================================
   BUSCA
======================================== */

campoBusca?.addEventListener(
    "input",
    renderizarClientes
);


/* ========================================
   MODAL
======================================== */

function abrirModal(modal) {

    if (!modal) {
        return;
    }


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );
}


function fecharModal(modal) {

    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
       Só remove o bloqueio do body quando
       não houver outro modal aberto.
    */

    const outroModalAberto =
        document.querySelector(
            ".modal-overlay.active"
        );


    if (!outroModalAberto) {

        document.body.classList.remove(
            "modal-open"
        );
    }


    clienteEmEdicao = null;
}


/* ========================================
   INICIALIZAÇÃO
======================================== */

clientes =
    carregarClientes();


if (!Array.isArray(clientes)) {
    clientes = [];
}


renderizarClientes();