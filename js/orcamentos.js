/* ========================================
   ORÇAMENTOS — MÓDULO
======================================== */

const CHAVE_STORAGE = "orcamentos";
const CHAVE_MATERIAIS = "materiais";

let orcamentos = [];
let orcamentoEmEdicao = null;


/* ========================================
   ELEMENTOS
======================================== */

const listaOrcamentos =
    document.querySelector("#orcamentos-lista");

const resultadoOrcamentos =
    document.querySelector("#resultado-orcamentos");

const campoBusca =
    document.querySelector("#buscar-orcamento");

const filtroStatus =
    document.querySelector("#filtro-status");

const botaoNovo =
    document.querySelector("#novo-orcamento");

const modalOrcamento =
    document.querySelector("#modal-orcamento");

const modalVisualizar =
    document.querySelector("#modal-visualizar");

const formulario =
    document.querySelector("#form-orcamento");

const modalTitulo =
    document.querySelector("#modal-titulo");

const campoCliente =
    document.querySelector("#cliente");

const campoData =
    document.querySelector("#data");

const campoStatus =
    document.querySelector("#status");

const itensOrcamento =
    document.querySelector("#itens-orcamento");

const totalOrcamento =
    document.querySelector("#total-orcamento");

const botaoAdicionarItem =
    document.querySelector("#adicionar-item");

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

const visualizarItens =
    document.querySelector("#visualizar-itens");

const visualizarTotal =
    document.querySelector("#visualizar-total");

const botaoGerarPDF =
    document.querySelector("#gerar-pdf");


/* ========================================
   LOCAL STORAGE
======================================== */

function carregarDados(chave) {

    try {

        const dadosSalvos =
            localStorage.getItem(chave);

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
            `Erro ao carregar "${chave}":`,
            erro
        );

        return [];
    }
}


function carregarOrcamentos() {

    return carregarDados(CHAVE_STORAGE);

}


function salvarOrcamentos() {

    try {

        localStorage.setItem(
            CHAVE_STORAGE,
            JSON.stringify(orcamentos)
        );

    } catch (erro) {

        console.error(
            "Erro ao salvar orçamentos:",
            erro
        );

    }
}


function carregarMateriais() {

    return carregarDados(CHAVE_MATERIAIS);

}


/* ========================================
   FORMATAÇÃO
======================================== */

function formatarMoeda(valor) {

    const numero =
        Number(valor) || 0;

    return numero.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


function formatarData(data) {

    if (!data) {
        return "—";
    }

    const partes =
        String(data).split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


/* ========================================
   STATUS
======================================== */

function obterClasseStatus(status) {

    if (status === "Aprovado") {
        return "status-approved";
    }

    return "status-open";

}


/* ========================================
   CALCULAR TOTAL
======================================== */

function calcularTotalItens() {

    if (!itensOrcamento) {
        return 0;
    }

    const itens =
        itensOrcamento.querySelectorAll(
            ".quote-item"
        );

    let total = 0;

    itens.forEach((item) => {

        const campoQuantidade =
            item.querySelector(
                ".item-quantidade"
            );

        const campoValor =
            item.querySelector(
                ".item-valor"
            );

        const campoSubtotal =
            item.querySelector(
                ".item-subtotal"
            );

        const quantidade =
            Number(
                campoQuantidade?.value
            ) || 0;

        const valorUnitario =
            Number(
                campoValor?.value
            ) || 0;

        const subtotal =
            quantidade * valorUnitario;

        if (campoSubtotal) {

            campoSubtotal.textContent =
                formatarMoeda(subtotal);

        }

        total += subtotal;

    });


    if (totalOrcamento) {

        totalOrcamento.textContent =
            formatarMoeda(total);

    }


    return total;

}


/* ========================================
   CRIAR ITEM
======================================== */

function adicionarItem(item = {}) {

    if (!itensOrcamento) {
        return;
    }

    const linha =
        document.createElement("div");

    linha.className =
        "quote-item";


    linha.innerHTML = `

        <div class="quote-item-field">

            <label>
                Produto / serviço
            </label>

            <select
                class="item-produto"
                required
            >

                <option value="">
                    Selecione um material
                </option>

            </select>

        </div>


        <div class="quote-item-field">

            <label>
                Quantidade
            </label>

            <input
                type="number"
                class="item-quantidade"
                min="1"
                step="1"
                value="${item.quantidade || 1}"
                required
            >

        </div>


        <div class="quote-item-field">

            <label>
                Valor unitário
            </label>

            <input
                type="number"
                class="item-valor"
                min="0"
                step="0.01"
                placeholder="0,00"
                value="${
                    item.valorUnitario !== undefined
                        ? item.valorUnitario
                        : ""
                }"
                required
            >

        </div>


        <div class="quote-item-subtotal">

            <span>
                Subtotal
            </span>

            <strong class="item-subtotal">
                R$ 0,00
            </strong>

        </div>


        <button
            type="button"
            class="remove-item"
            title="Remover item"
            aria-label="Remover item"
        >
            ×
        </button>

    `;


    itensOrcamento.appendChild(linha);


    /* ========================================
       MATERIAL
    ======================================== */

    const selectProduto =
        linha.querySelector(
            ".item-produto"
        );

    const materiais =
        carregarMateriais();


    materiais.forEach((material) => {

        const option =
            document.createElement("option");

        option.value =
            material.id;

        option.textContent =
            `${material.nome} — ${formatarMoeda(
                material.preco
            )} / ${material.unidade}`;

        option.dataset.preco =
            material.preco;

        option.dataset.unidade =
            material.unidade;

        selectProduto.appendChild(option);

    });


    /* ========================================
       RESTAURAR ITEM EXISTENTE
    ======================================== */

    if (item.materialId !== undefined) {

        const materialExiste =
            materiais.some(
                (material) =>
                    String(material.id) ===
                    String(item.materialId)
            );

        if (materialExiste) {

            selectProduto.value =
                item.materialId;

        }

    } else if (item.produto) {

        const materialEncontrado =
            materiais.find(
                (material) =>
                    material.nome ===
                    item.produto
            );

        if (materialEncontrado) {

            selectProduto.value =
                materialEncontrado.id;

        }

    }


    /* ========================================
       SELEÇÃO DO MATERIAL
    ======================================== */

    selectProduto.addEventListener(
        "change",
        () => {

            const opcaoSelecionada =
                selectProduto.options[
                    selectProduto.selectedIndex
                ];

            if (!opcaoSelecionada) {
                return;
            }

            const preco =
                Number(
                    opcaoSelecionada.dataset.preco
                ) || 0;

            const campoValor =
                linha.querySelector(
                    ".item-valor"
                );

            if (campoValor) {

                campoValor.value =
                    preco;

            }

            calcularTotalItens();

        }
    );


    /* ========================================
       ALTERAÇÃO DE QUANTIDADE / VALOR
    ======================================== */

    const campos =
        linha.querySelectorAll(
            ".item-quantidade, .item-valor"
        );


    campos.forEach((campo) => {

        campo.addEventListener(
            "input",
            calcularTotalItens
        );

    });


    /* ========================================
       REMOVER ITEM
    ======================================== */

    const botaoRemover =
        linha.querySelector(
            ".remove-item"
        );


    botaoRemover?.addEventListener(
        "click",
        () => {

            linha.remove();

            calcularTotalItens();

        }
    );


    calcularTotalItens();

}


/* ========================================
   COLETAR ITENS
======================================== */

function obterItensFormulario() {

    if (!itensOrcamento) {
        return [];
    }

    const itens =
        itensOrcamento.querySelectorAll(
            ".quote-item"
        );


    return Array.from(itens).map((item) => {

        const selectProduto =
            item.querySelector(
                ".item-produto"
            );

        const opcaoSelecionada =
            selectProduto?.options[
                selectProduto.selectedIndex
            ];


        const materialId =
            selectProduto?.value
                ? Number(selectProduto.value)
                : null;


        const produto =
            opcaoSelecionada &&
            opcaoSelecionada.value
                ? opcaoSelecionada.textContent
                    .split(" — ")[0]
                : "";


        const quantidade =
            Number(
                item.querySelector(
                    ".item-quantidade"
                )?.value
            ) || 0;


        const valorUnitario =
            Number(
                item.querySelector(
                    ".item-valor"
                )?.value
            ) || 0;


        return {

            materialId,

            produto,

            quantidade,

            valorUnitario,

            subtotal:
                quantidade * valorUnitario

        };

    });

}


/* ========================================
   RENDERIZAR ORÇAMENTOS
======================================== */

function renderizarOrcamentos() {

    if (!listaOrcamentos) {
        return;
    }


    const busca =
        campoBusca?.value
            .trim()
            .toLowerCase() || "";


    const statusSelecionado =
        filtroStatus?.value ||
        "todos";


    const resultados =
        orcamentos.filter(
            (orcamento) => {

                const id =
                    String(
                        orcamento.id ?? ""
                    );

                const cliente =
                    String(
                        orcamento.cliente ?? ""
                    );


                const correspondeBusca =
                    id.includes(busca) ||
                    cliente
                        .toLowerCase()
                        .includes(busca);


                const correspondeStatus =
                    statusSelecionado ===
                        "todos" ||
                    orcamento.status ===
                        statusSelecionado;


                return (
                    correspondeBusca &&
                    correspondeStatus
                );

            }
        );


    listaOrcamentos.innerHTML = "";


    if (resultados.length === 0) {

        listaOrcamentos.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="
                        text-align: center;
                        padding: 32px;
                    "
                >
                    Nenhum orçamento encontrado.
                </td>

            </tr>

        `;

    } else {

        resultados.forEach(
            (orcamento) => {

                const linha =
                    document.createElement("tr");


                linha.innerHTML = `

                    <td>
                        #${orcamento.id}
                    </td>

                    <td>
                        ${orcamento.cliente || "—"}
                    </td>

                    <td>
                        ${formatarData(
                            orcamento.data
                        )}
                    </td>

                    <td>
                        ${formatarMoeda(
                            orcamento.valor
                        )}
                    </td>

                    <td>

                        <span
                            class="status ${obterClasseStatus(
                                orcamento.status
                            )}"
                        >
                            ${orcamento.status || "Em aberto"}
                        </span>

                    </td>

                    <td>

                        <a
                            href="#"
                            class="table-action"
                            data-id="${orcamento.id}"
                            data-action="visualizar"
                        >
                            Visualizar
                        </a>

                        <a
                            href="#"
                            class="table-action"
                            data-id="${orcamento.id}"
                            data-action="editar"
                        >
                            Editar
                        </a>

                        <a
                            href="#"
                            class="table-action"
                            data-id="${orcamento.id}"
                            data-action="excluir"
                        >
                            Excluir
                        </a>

                    </td>

                `;


                listaOrcamentos.appendChild(
                    linha
                );

            }
        );

    }


    if (resultadoOrcamentos) {

        resultadoOrcamentos.textContent =
            `${resultados.length} ${
                resultados.length === 1
                    ? "orçamento"
                    : "orçamentos"
            } encontrados`;

    }

}


/* ========================================
   NOVO ORÇAMENTO
======================================== */

function abrirModalNovo() {

    orcamentoEmEdicao = null;


    if (modalTitulo) {

        modalTitulo.textContent =
            "Novo orçamento";

    }


    formulario?.reset();


    if (campoStatus) {

        campoStatus.value =
            "Em aberto";

    }


    if (itensOrcamento) {

        itensOrcamento.innerHTML = "";

    }


    adicionarItem();


    abrirModal(modalOrcamento);

}


/* ========================================
   EDITAR ORÇAMENTO
======================================== */

function abrirModalEdicao(id) {

    const orcamento =
        orcamentos.find(
            (item) =>
                Number(item.id) ===
                Number(id)
        );


    if (!orcamento) {
        return;
    }


    orcamentoEmEdicao =
        orcamento.id;


    if (modalTitulo) {

        modalTitulo.textContent =
            "Editar orçamento";

    }


    if (campoCliente) {

        campoCliente.value =
            orcamento.cliente || "";

    }


    if (campoData) {

        campoData.value =
            orcamento.data || "";

    }


    if (campoStatus) {

        campoStatus.value =
            orcamento.status ||
            "Em aberto";

    }


    if (itensOrcamento) {

        itensOrcamento.innerHTML = "";

    }


    if (
        Array.isArray(orcamento.itens) &&
        orcamento.itens.length > 0
    ) {

        orcamento.itens.forEach(
            (item) => {

                adicionarItem(item);

            }
        );

    } else {

        adicionarItem();

    }


    calcularTotalItens();


    abrirModal(modalOrcamento);

}


/* ========================================
   VISUALIZAR ORÇAMENTO
======================================== */

function abrirVisualizacao(id) {

    const orcamento =
        orcamentos.find(
            (item) =>
                Number(item.id) ===
                Number(id)
        );


    if (!orcamento) {
        return;
    }


    /* ========================================
       DADOS PRINCIPAIS
    ======================================== */

    if (visualizarId) {

        visualizarId.textContent =
            `#${orcamento.id}`;

    }


    if (visualizarCliente) {

        visualizarCliente.textContent =
            orcamento.cliente || "—";

    }


    if (visualizarData) {

        visualizarData.textContent =
            formatarData(
                orcamento.data
            );

    }


    if (visualizarValor) {

        visualizarValor.textContent =
            formatarMoeda(
                orcamento.valor
            );

    }


    if (visualizarStatus) {

        visualizarStatus.textContent =
            orcamento.status ||
            "Em aberto";

        visualizarStatus.className =
            `status ${obterClasseStatus(
                orcamento.status
            )}`;

    }


    /* ========================================
       ITENS
    ======================================== */

    if (!visualizarItens) {

        abrirModal(modalVisualizar);

        return;

    }


    visualizarItens.innerHTML = "";


    const itens =
        Array.isArray(orcamento.itens)
            ? orcamento.itens
            : [];


    if (itens.length > 0) {

        itens.forEach(
            (item) => {

                const linha =
                    document.createElement("tr");


                const produto =
                    document.createElement("td");

                produto.textContent =
                    item.produto || "—";


                const quantidade =
                    document.createElement("td");

                quantidade.textContent =
                    item.quantidade ?? 0;


                const valorUnitario =
                    document.createElement("td");

                valorUnitario.textContent =
                    formatarMoeda(
                        item.valorUnitario
                    );


                const subtotal =
                    document.createElement("td");

                subtotal.textContent =
                    formatarMoeda(
                        item.subtotal
                    );


                linha.appendChild(produto);

                linha.appendChild(quantidade);

                linha.appendChild(valorUnitario);

                linha.appendChild(subtotal);


                visualizarItens.appendChild(
                    linha
                );

            }
        );

    } else {

        visualizarItens.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="
                        text-align: center;
                        padding: 20px;
                    "
                >
                    Este orçamento não possui
                    itens cadastrados.
                </td>

            </tr>

        `;

    }


    /* ========================================
       TOTAL
    ======================================== */

    if (visualizarTotal) {

        visualizarTotal.textContent =
            formatarMoeda(
                orcamento.valor
            );

    }


    /* ========================================
       GUARDA ID PARA PDF
    ======================================== */

    if (modalVisualizar) {

        modalVisualizar.dataset.orcamentoId =
            String(orcamento.id);

    }


    /* ========================================
       ABRIR MODAL
    ======================================== */

    abrirModal(
        modalVisualizar
    );

}


/* ========================================
   GERAR PDF
======================================== */

function gerarPDFOrcamento(id) {

    const orcamento =
        orcamentos.find(
            (item) =>
                Number(item.id) ===
                Number(id)
        );


    if (!orcamento) {

        alert(
            "Não foi possível encontrar este orçamento."
        );

        return;

    }


    /* ========================================
       VERIFICAR BIBLIOTECA
    ======================================== */

    if (
        !window.jspdf ||
        typeof window.jspdf.jsPDF !== "function"
    ) {

        alert(
            "A biblioteca de geração de PDF não foi carregada. Verifique o HTML."
        );

        return;

    }


    const { jsPDF } =
        window.jspdf;


    const doc =
        new jsPDF();


    /* ========================================
       CONFIGURAÇÕES
    ======================================== */

    const margem =
        18;

    const larguraPagina =
        doc.internal.pageSize.getWidth();

    const alturaPagina =
        doc.internal.pageSize.getHeight();


    const total =
        Number(orcamento.valor) || 0;


    const itens =
        Array.isArray(orcamento.itens)
            ? orcamento.itens
            : [];


    /* ========================================
       CABEÇALHO
    ======================================== */

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(22);

    doc.text(
        "OrçaPro",
        margem,
        22
    );


    doc.setFontSize(10);

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.text(
        "Sistema de Gestão de Orçamentos",
        margem,
        29
    );


    /* ========================================
       NÚMERO DO ORÇAMENTO
    ======================================== */

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(13);

    doc.text(
        `ORÇAMENTO #${orcamento.id}`,
        larguraPagina - margem,
        22,
        {
            align: "right"
        }
    );


    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(10);

    doc.text(
        `Data: ${formatarData(orcamento.data)}`,
        larguraPagina - margem,
        29,
        {
            align: "right"
        }
    );


    /* ========================================
       LINHA
    ======================================== */

    doc.setLineWidth(0.5);

    doc.line(
        margem,
        36,
        larguraPagina - margem,
        36
    );


    /* ========================================
       DADOS DO CLIENTE
    ======================================== */

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(11);

    doc.text(
        "DADOS DO CLIENTE",
        margem,
        48
    );


    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(10);

    doc.text(
        `Cliente: ${orcamento.cliente || "Não informado"}`,
        margem,
        56
    );


    doc.text(
        `Status: ${orcamento.status || "Em aberto"}`,
        margem,
        63
    );


    /* ========================================
       TABELA DE ITENS
    ======================================== */

    const linhasTabela =
        itens.map(
            (item) => [

                item.produto || "—",

                String(
                    item.quantidade ?? 0
                ),

                formatarMoeda(
                    item.valorUnitario
                ),

                formatarMoeda(
                    item.subtotal
                )

            ]
        );


    if (
        typeof doc.autoTable === "function"
    ) {

        doc.autoTable({

            startY: 72,

            head: [
                [
                    "Produto / Serviço",
                    "Qtd.",
                    "Valor Unit.",
                    "Subtotal"
                ]
            ],

            body:
                linhasTabela.length > 0
                    ? linhasTabela
                    : [
                        [
                            "Nenhum item cadastrado",
                            "",
                            "",
                            ""
                        ]
                    ],

            margin: {
                left: margem,
                right: margem
            },

            styles: {
                font: "helvetica",
                fontSize: 9,
                cellPadding: 5
            },

            headStyles: {
                fontStyle: "bold"
            },

            columnStyles: {

                0: {
                    cellWidth: "auto"
                },

                1: {
                    halign: "center",
                    cellWidth: 18
                },

                2: {
                    halign: "right",
                    cellWidth: 35
                },

                3: {
                    halign: "right",
                    cellWidth: 35
                }

            }

        });

    } else {

        /* ========================================
           FALLBACK
        ======================================== */

        let y =
            78;

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Produto / Serviço",
            margem,
            y
        );

        doc.text(
            "Qtd.",
            115,
            y
        );

        doc.text(
            "Valor",
            140,
            y
        );

        doc.text(
            "Subtotal",
            175,
            y
        );

        y += 8;

        doc.setFont(
            "helvetica",
            "normal"
        );

        itens.forEach(
            (item) => {

                doc.text(
                    String(
                        item.produto || "—"
                    ).substring(0, 38),
                    margem,
                    y
                );

                doc.text(
                    String(
                        item.quantidade ?? 0
                    ),
                    115,
                    y
                );

                doc.text(
                    formatarMoeda(
                        item.valorUnitario
                    ),
                    140,
                    y
                );

                doc.text(
                    formatarMoeda(
                        item.subtotal
                    ),
                    175,
                    y
                );

                y += 7;

            }
        );

    }


    /* ========================================
       POSIÇÃO DO TOTAL
    ======================================== */

    let posicaoTotal;

    if (
        typeof doc.autoTable === "function" &&
        doc.lastAutoTable
    ) {

        posicaoTotal =
            doc.lastAutoTable.finalY + 14;

    } else {

        posicaoTotal =
            100 + (itens.length * 7);

    }


    /* ========================================
       TOTAL FINAL
    ======================================== */

    if (
        posicaoTotal >
        alturaPagina - 45
    ) {

        doc.addPage();

        posicaoTotal =
            25;

    }


    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(12);

    doc.text(
        "TOTAL DO ORÇAMENTO",
        larguraPagina - margem,
        posicaoTotal,
        {
            align: "right"
        }
    );


    doc.setFontSize(17);

    doc.text(
        formatarMoeda(total),
        larguraPagina - margem,
        posicaoTotal + 9,
        {
            align: "right"
        }
    );


    /* ========================================
       RODAPÉ
    ======================================== */

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(8);

    doc.text(
        "Documento gerado pelo OrçaPro.",
        margem,
        alturaPagina - 15
    );


    doc.text(
        `Orçamento #${orcamento.id}`,
        larguraPagina - margem,
        alturaPagina - 15,
        {
            align: "right"
        }
    );


    /* ========================================
       SALVAR
    ======================================== */

    const clienteArquivo =
        String(
            orcamento.cliente ||
            "cliente"
        )
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .replace(
                /[^a-zA-Z0-9]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                ""
            )
            .toLowerCase();


    const nomeArquivo =
        `orcamento-${orcamento.id}-${clienteArquivo || "cliente"}.pdf`;


    doc.save(
        nomeArquivo
    );

}


/* ========================================
   MODAIS
======================================== */

function abrirModal(modal) {

    if (!modal) {
        return;
    }


    modal.classList.add("active");


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

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


    const algumModalAberto =
        document.querySelector(
            ".modal-overlay.active"
        );


    if (!algumModalAberto) {

        document.body.style.overflow =
            "";

    }

}


function fecharTodosModais() {

    fecharModal(
        modalOrcamento
    );


    fecharModal(
        modalVisualizar
    );

}


/* ========================================
   EXCLUIR
======================================== */

function excluirOrcamento(id) {

    const orcamento =
        orcamentos.find(
            (item) =>
                Number(item.id) ===
                Number(id)
        );


    if (!orcamento) {
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
                Number(item.id) !==
                Number(id)
        );


    salvarOrcamentos();


    renderizarOrcamentos();

}


/* ========================================
   SALVAR FORMULÁRIO
======================================== */

formulario?.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const cliente =
            campoCliente?.value
                .trim() || "";


        const data =
            campoData?.value || "";


        const status =
            campoStatus?.value || "";


        const itens =
            obterItensFormulario();


        /* ========================================
           VALIDAÇÃO
        ======================================== */

        if (
            !cliente ||
            !data ||
            !status ||
            itens.length === 0
        ) {

            return;

        }


        const itensValidos =
            itens.filter(
                (item) =>
                    item.produto &&
                    item.quantidade > 0 &&
                    item.valorUnitario >= 0
            );


        if (itensValidos.length === 0) {
            return;
        }


        const total =
            itensValidos.reduce(
                (
                    acumulador,
                    item
                ) =>
                    acumulador +
                    item.subtotal,
                0
            );


        /* ========================================
           EDITAR
        ======================================== */

        if (
            orcamentoEmEdicao !== null
        ) {

            const indice =
                orcamentos.findIndex(
                    (item) =>
                        Number(item.id) ===
                        Number(orcamentoEmEdicao)
                );


            if (indice !== -1) {

                orcamentos[indice] = {

                    ...orcamentos[indice],

                    cliente,

                    data,

                    status,

                    itens: itensValidos,

                    valor: total

                };

            }


        } else {

            /* ========================================
               NOVO
            ======================================== */

            const maiorId =
                orcamentos.reduce(
                    (
                        maior,
                        item
                    ) =>
                        Math.max(
                            maior,
                            Number(item.id) || 0
                        ),
                    0
                );


            const novoId =
                maiorId + 1;


            orcamentos.push({

                id: novoId,

                cliente,

                data,

                status,

                itens: itensValidos,

                valor: total

            });

        }


        salvarOrcamentos();


        renderizarOrcamentos();


        fecharModal(
            modalOrcamento
        );

    }
);


/* ========================================
   AÇÕES DA TABELA
======================================== */

listaOrcamentos?.addEventListener(
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


        const acao =
            botao.dataset.action;


        if (
            acao === "visualizar"
        ) {

            abrirVisualizacao(id);

        }


        if (
            acao === "editar"
        ) {

            abrirModalEdicao(id);

        }


        if (
            acao === "excluir"
        ) {

            excluirOrcamento(id);

        }

    }
);


/* ========================================
   ADICIONAR ITEM
======================================== */

botaoAdicionarItem?.addEventListener(
    "click",
    () => {

        adicionarItem();

    }
);


/* ========================================
   NOVO ORÇAMENTO
======================================== */

botaoNovo?.addEventListener(
    "click",
    abrirModalNovo
);


/* ========================================
   GERAR PDF
======================================== */

botaoGerarPDF?.addEventListener(
    "click",
    () => {

        const id =
            modalVisualizar?.dataset
                .orcamentoId;


        if (!id) {

            alert(
                "Nenhum orçamento selecionado."
            );

            return;

        }


        gerarPDFOrcamento(
            Number(id)
        );

    }
);


/* ========================================
   FECHAR MODAL — ORÇAMENTO
======================================== */

document
    .querySelector("#fechar-modal")
    ?.addEventListener(
        "click",
        () =>
            fecharModal(
                modalOrcamento
            )
    );


document
    .querySelector("#cancelar-modal")
    ?.addEventListener(
        "click",
        () =>
            fecharModal(
                modalOrcamento
            )
    );


/* ========================================
   FECHAR MODAL — VISUALIZAÇÃO
======================================== */

document
    .querySelector("#fechar-visualizacao")
    ?.addEventListener(
        "click",
        () =>
            fecharModal(
                modalVisualizar
            )
    );


document
    .querySelector("#cancelar-visualizacao")
    ?.addEventListener(
        "click",
        () =>
            fecharModal(
                modalVisualizar
            )
    );


/* ========================================
   FECHAR CLICANDO FORA
======================================== */

document.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            modalOrcamento
        ) {

            fecharModal(
                modalOrcamento
            );

        }


        if (
            event.target ===
            modalVisualizar
        ) {

            fecharModal(
                modalVisualizar
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
            event.key === "Escape"
        ) {

            fecharTodosModais();

        }

    }
);


/* ========================================
   BUSCA
======================================== */

campoBusca?.addEventListener(
    "input",
    renderizarOrcamentos
);


/* ========================================
   FILTRO
======================================== */

filtroStatus?.addEventListener(
    "change",
    renderizarOrcamentos
);


/* ========================================
   INICIALIZAÇÃO
======================================== */

orcamentos =
    carregarOrcamentos();


renderizarOrcamentos();