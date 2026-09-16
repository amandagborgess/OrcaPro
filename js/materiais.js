/* ========================================
   MATERIAIS — MÓDULO
======================================== */

const CHAVE_MATERIAIS = "materiais";

let materiais = [];
let materialEmEdicao = null;


/* ========================================
   ELEMENTOS
======================================== */

const listaMateriais =
    document.querySelector("#materiais-lista");

const resultadoMateriais =
    document.querySelector("#resultado-materiais");

const campoBusca =
    document.querySelector("#buscar-material");

const filtroCategoria =
    document.querySelector("#filtro-categoria");

const botaoNovo =
    document.querySelector("#novo-material");

const modalMaterial =
    document.querySelector("#modal-material");

const formulario =
    document.querySelector("#form-material");

const modalTitulo =
    document.querySelector("#modal-material-titulo");

const campoNome =
    document.querySelector("#material-nome");

const campoCategoria =
    document.querySelector("#material-categoria");

const campoUnidade =
    document.querySelector("#material-unidade");

const campoPreco =
    document.querySelector("#material-preco");

const botaoFecharModal =
    document.querySelector("#fechar-modal-material");

const botaoCancelarModal =
    document.querySelector("#cancelar-modal-material");


/* ========================================
   LOCAL STORAGE
======================================== */

function carregarMateriais() {

    try {

        const dadosSalvos =
            localStorage.getItem(
                CHAVE_MATERIAIS
            );


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
            "Erro ao carregar materiais:",
            erro
        );

        return [];
    }
}


function salvarMateriais() {

    try {

        localStorage.setItem(
            CHAVE_MATERIAIS,
            JSON.stringify(materiais)
        );

        return true;

    } catch (erro) {

        console.error(
            "Erro ao salvar materiais:",
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

    if (materiais.length === 0) {
        return 1;
    }


    const maiorId =
        materiais.reduce(
            (maior, material) => {

                const id =
                    Number(material.id);

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

function formatarMoeda(valor) {

    const numero =
        Number(valor);


    if (!Number.isFinite(numero)) {
        return "R$ 0,00";
    }


    return numero.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


/* ========================================
   RENDERIZAÇÃO
======================================== */

function renderizarMateriais() {

    if (!listaMateriais) {
        return;
    }


    const busca =
        normalizarTexto(
            campoBusca?.value
        );


    const categoriaSelecionada =
        filtroCategoria?.value || "todas";


    const resultados =
        materiais.filter(
            (material) => {

                const nome =
                    normalizarTexto(
                        material.nome
                    );


                const categoria =
                    String(
                        material.categoria ?? ""
                    );


                const correspondeBusca =
                    nome.includes(busca);


                const correspondeCategoria =
                    categoriaSelecionada === "todas" ||
                    categoria ===
                        categoriaSelecionada;


                return (
                    correspondeBusca &&
                    correspondeCategoria
                );
            }
        );


    listaMateriais.innerHTML = "";


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
            "Nenhum material encontrado.";

        celula.style.textAlign =
            "center";

        celula.style.padding =
            "32px";


        linha.appendChild(celula);

        listaMateriais.appendChild(
            linha
        );


    } else {

        /* ========================================
           LISTA DE MATERIAIS
        ======================================== */

        resultados.forEach(
            (material) => {

                const linha =
                    document.createElement("tr");


                /* ========================================
                   ID
                ======================================== */

                const celulaId =
                    document.createElement("td");

                celulaId.textContent =
                    `#${material.id}`;

                linha.appendChild(
                    celulaId
                );


                /* ========================================
                   NOME
                ======================================== */

                const celulaNome =
                    document.createElement("td");

                celulaNome.textContent =
                    material.nome || "—";

                linha.appendChild(
                    celulaNome
                );


                /* ========================================
                   CATEGORIA
                ======================================== */

                const celulaCategoria =
                    document.createElement("td");

                celulaCategoria.textContent =
                    material.categoria || "—";

                linha.appendChild(
                    celulaCategoria
                );


                /* ========================================
                   UNIDADE
                ======================================== */

                const celulaUnidade =
                    document.createElement("td");

                celulaUnidade.textContent =
                    material.unidade || "—";

                linha.appendChild(
                    celulaUnidade
                );


                /* ========================================
                   PREÇO
                ======================================== */

                const celulaPreco =
                    document.createElement("td");

                celulaPreco.textContent =
                    formatarMoeda(
                        material.preco
                    );

                linha.appendChild(
                    celulaPreco
                );


                /* ========================================
                   AÇÕES
                ======================================== */

                const celulaAcoes =
                    document.createElement("td");


                const botaoEditar =
                    document.createElement("a");

                botaoEditar.href = "#";
                botaoEditar.className =
                    "table-action";
                botaoEditar.dataset.id =
                    material.id;
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
                    material.id;
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


                listaMateriais.appendChild(
                    linha
                );
            }
        );
    }


    /* ========================================
       CONTADOR
    ======================================== */

    if (resultadoMateriais) {

        resultadoMateriais.textContent =
            `${resultados.length} ${
                resultados.length === 1
                    ? "material"
                    : "materiais"
            } encontrados`;
    }
}


/* ========================================
   ABRIR MODAL — NOVO
======================================== */

function abrirModalNovo() {

    materialEmEdicao = null;


    if (modalTitulo) {

        modalTitulo.textContent =
            "Novo material";
    }


    formulario?.reset();


    abrirModal();


    campoNome?.focus();
}


/* ========================================
   ABRIR MODAL — EDITAR
======================================== */

function abrirModalEdicao(id) {

    const material =
        materiais.find(
            (item) =>
                Number(item.id) ===
                Number(id)
        );


    if (!material) {
        return;
    }


    materialEmEdicao =
        Number(material.id);


    if (modalTitulo) {

        modalTitulo.textContent =
            "Editar material";
    }


    if (campoNome) {

        campoNome.value =
            material.nome || "";
    }


    if (campoCategoria) {

        campoCategoria.value =
            material.categoria || "";
    }


    if (campoUnidade) {

        campoUnidade.value =
            material.unidade || "";
    }


    if (campoPreco) {

        campoPreco.value =
            material.preco ?? "";
    }


    abrirModal();


    campoNome?.focus();
}


/* ========================================
   MODAL
======================================== */

function abrirModal() {

    if (!modalMaterial) {
        return;
    }


    modalMaterial.classList.add(
        "active"
    );


    modalMaterial.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );
}


function fecharModal() {

    if (!modalMaterial) {
        return;
    }


    modalMaterial.classList.remove(
        "active"
    );


    modalMaterial.setAttribute(
        "aria-hidden",
        "true"
    );


    const outroModalAberto =
        document.querySelector(
            ".modal-overlay.active"
        );


    if (!outroModalAberto) {

        document.body.classList.remove(
            "modal-open"
        );
    }


    materialEmEdicao = null;
}


/* ========================================
   EXCLUIR
======================================== */

function excluirMaterial(id) {

    const material =
        materiais.find(
            (item) =>
                Number(item.id) ===
                Number(id)
        );


    if (!material) {
        return;
    }


    const confirmar =
        confirm(
            `Deseja realmente excluir o material "${material.nome}"?`
        );


    if (!confirmar) {
        return;
    }


    materiais =
        materiais.filter(
            (item) =>
                Number(item.id) !==
                Number(id)
        );


    const salvo =
        salvarMateriais();


    if (!salvo) {
        return;
    }


    renderizarMateriais();
}


/* ========================================
   SALVAR MATERIAL
======================================== */

formulario?.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const nome =
            campoNome?.value.trim() || "";


        const categoria =
            campoCategoria?.value || "";


        const unidade =
            campoUnidade?.value || "";


        const preco =
            Number(
                campoPreco?.value
            );


        /* ========================================
           VALIDAÇÃO
        ======================================== */

        if (!nome) {

            campoNome?.focus();

            return;
        }


        if (!categoria) {

            campoCategoria?.focus();

            return;
        }


        if (!unidade) {

            campoUnidade?.focus();

            return;
        }


        if (
            !Number.isFinite(preco) ||
            preco < 0
        ) {

            campoPreco?.focus();

            return;
        }


        /* ========================================
           EDITAR MATERIAL
        ======================================== */

        if (materialEmEdicao !== null) {

            const indice =
                materiais.findIndex(
                    (item) =>
                        Number(item.id) ===
                        Number(materialEmEdicao)
                );


            if (indice === -1) {
                return;
            }


            materiais[indice] = {

                ...materiais[indice],

                nome,
                categoria,
                unidade,
                preco
            };


        /* ========================================
           NOVO MATERIAL
        ======================================== */

        } else {

            const novoId =
                obterProximoId();


            materiais.push({

                id: novoId,

                nome,
                categoria,
                unidade,
                preco
            });
        }


        /* ========================================
           FINALIZAÇÃO
        ======================================== */

        const salvo =
            salvarMateriais();


        if (!salvo) {
            return;
        }


        renderizarMateriais();

        fecharModal();
    }
);


/* ========================================
   AÇÕES DA TABELA
======================================== */

listaMateriais?.addEventListener(
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
            Number(
                botao.dataset.id
            );


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
                excluirMaterial(id);
                break;
        }
    }
);


/* ========================================
   NOVO MATERIAL
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
    fecharModal
);


botaoCancelarModal?.addEventListener(
    "click",
    fecharModal
);


/* ========================================
   FECHAR CLICANDO FORA
======================================== */

modalMaterial?.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            modalMaterial
        ) {

            fecharModal();
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
            modalMaterial?.classList.contains(
                "active"
            )
        ) {

            fecharModal();
        }
    }
);


/* ========================================
   BUSCA
======================================== */

campoBusca?.addEventListener(
    "input",
    renderizarMateriais
);


/* ========================================
   FILTRO
======================================== */

filtroCategoria?.addEventListener(
    "change",
    renderizarMateriais
);


/* ========================================
   INICIALIZAÇÃO
======================================== */

materiais =
    carregarMateriais();


if (!Array.isArray(materiais)) {
    materiais = [];
}


renderizarMateriais();