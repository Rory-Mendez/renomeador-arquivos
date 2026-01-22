// ==============================
// Utilitários de texto / nomes
// ==============================

// Para IDs (operadora/site): mantém só letras/números e troca espaços por underline
function normalizeId(text) {
    const normalized = (text ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalized.replace(/[^a-zA-Z0-9]+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

// Para títulos/descrições de arquivo: mantém ESPAÇOS e remove caracteres problemáticos do Windows
function sanitizeTitle(text) {
    const normalized = (text ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalized
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// Separa nome e extensão
function splitNameAndExt(filename) {
    const name = filename ?? '';
    const lastDot = name.lastIndexOf('.');
    if (lastDot <= 0) return { base: name, ext: '' };
    return { base: name.slice(0, lastDot), ext: name.slice(lastDot) };
}

// ==============================
// Config (nomes fixos e itens com proprietário)
// ==============================

const labelByIndexUrbano = {
    "1.1": "Matrícula",
    "1.2.1": "Compra e Venda",
    "1.2.2": "Historico IPTU",
    "1.2.3": "Contas Consumo",
    "1.2.4": "Declaração Vizinhos",
    "1.2.5": "Outros Documentos",
    "1.3": "Certidão Inexistência Matrícula",
    "1.4": "Comprovante IPTU",
    "1.5": "CND IPTU",
    "2.1": "CNH",
    "2.2": "Comprovante Residência",
    "2.3": "Comprovante Bancário",
    "2.4": "Certidão Casamento",
    "2.5": "CND Tributos Municipal",
    "2.6": "CND Tributos Estadual",
    "2.7": "CND Tributos Federal",
    "2.8": "Certidão Crim Estadual",
    "2.9": "Certidão Civel Estadual",
    "2.10": "Certidão Civel Federal",
    "2.11": "Certidão Crim Federal"
};

const labelByIndexRural = {
    "1.1": "Matrícula",
    "1.2.1": "Compra e Venda",
    "1.2.2": "Historico ITR",
    "1.2.3": "Contas Consumo",
    "1.2.4": "Declaração Vizinhos",
    "1.2.5": "Outros Documentos",
    "1.3": "Certidão Inexistência Matrícula",
    "1.4": "Comprovante ITR",
    "1.5": "CND ITR",
    "1.6": "CAR",
    "1.7": "CCIR",
    "2.1": "CNH",
    "2.2": "Comprovante Residência",
    "2.3": "Comprovante Bancário",
    "2.4": "Certidão Casamento",
    "2.5": "CND Tributos Municipal",
    "2.6": "CND Tributos Estadual",
    "2.7": "CND Tributos Federal",
    "2.8": "Certidão Crim Estadual",
    "2.9": "Certidão Civel Estadual",
    "2.10": "Certidão Crim Federal",
    "2.11": "Certidão Civel Federal",
    "2.12": "CND IBAMA"
};
// Itens que (quando "Proprietário? = Sim") serão duplicados em 1 e 2
const indicesComProprietario = new Set([
    "2.1","2.5","2.6","2.7","2.8","2.9","2.10","2.11", "2.12"
]);

// ==============================
// UI: mostra/esconde campos
// ==============================

let pfUrbanoTbodyOriginalHTML = "";
let pfRuralTbodyOriginalHTML = "";

function mostrarCamposEspecificos() {
    const tipoImovel = document.getElementById('tipoImovel').value;
    const docDivUrbano = document.getElementById('documentosPfUrbano');
    const docDivRural = document.getElementById('documentosPfRural');
    const geralDiv = document.getElementById('arquivoGeralDiv');
    const arquivoGeralInput = document.getElementById('arquivoInputGeral');

    docDivUrbano.style.display = 'none';
    docDivRural.style.display = 'none';
    geralDiv.style.display = 'none';

    if (tipoImovel === 'PF_Urbano') {
        docDivUrbano.style.display = 'block';
        arquivoGeralInput.removeAttribute('required');
    } else if (tipoImovel === 'PF_Rural') {
        docDivRural.style.display = 'block';
        arquivoGeralInput.removeAttribute('required'); 
    } else if (tipoImovel) {
        geralDiv.style.display = 'block';
        arquivoGeralInput.setAttribute('required', 'required');
    }

    // Quando muda o tipo, a UI de proprietário pode precisar ser re-aplicada
    atualizarUIProprietario();
}

function atualizarUIProprietario() {
    const tipoImovel = document.getElementById('tipoImovel')?.value ?? '';
    const raw = document.getElementById('temProprietario')?.value;
    const temProprietario = raw && raw.trim() ? raw : '1';

    const fields = document.getElementById('proprietarioFields');
    const input1 = document.getElementById('proprietario1');
    const input2 = document.getElementById('proprietario2');

    const whichTable = (tipoImovel === 'PF_Urbano' || tipoImovel === 'PF_Rural');

        if (!whichTable) {
        fields.style.display = 'none'
        input1.removeAttribute('required');
        input2.removeAttribute('required');
        return;
    }

    const tbodyId = 
        (tipoImovel === 'PF_Urbano') ? 'pfUrbanoTbody' :
        (tipoImovel === 'PF_Rural') ? 'pfRuralTbody' :
        null;
    
    const tbody = tbodyId ? document.getElementById(tbodyId) : null;

    const deveMostrarCampos = 
    (temProprietario === '2' && whichTable);

    // Campos de nome: obrigatórios quando Sim + PF_Urbano ou PF_Rural
    fields.style.display = deveMostrarCampos ? 'block' : 'none';
    if (deveMostrarCampos) {
        input1.setAttribute('required', 'required');
        input2.setAttribute('required', 'required');
    } else {
        input1.removeAttribute('required');
        input2.removeAttribute('required');
    }

    // Duplicar / restaurar linhas só quando PF Urbano
    if (tipoImovel !== 'PF_Urbano' && tipoImovel !== 'PF_Rural') return;

    if (temProprietario === '2') {
        // Reconstruir o tbody duplicando os itens que têm proprietário
        const temp = document.createElement('tbody');

        if (tipoImovel === 'PF_Urbano') {
            temp.innerHTML = pfUrbanoTbodyOriginalHTML;
        } else if (tipoImovel === 'PF_Rural') {
            temp.innerHTML = pfRuralTbodyOriginalHTML;
        }

        const novoTbody = document.createElement('tbody');

        novoTbody.id = tbodyId;

        const nomeProp1 = input1.value.trim();
        const nomeProp2 = input2.value.trim();

        const label1 = nomeProp1 || "Proprietário 1";
        const label2 = nomeProp2 || "Proprietário 2";

        Array.from(temp.querySelectorAll('tr')).forEach((row) => {
            const tds = row.querySelectorAll('td');
            if (tds.length < 3) return;

            const index = (tds[0].textContent ?? '').trim();
            const descTd = tds[1];
            const fileTd = tds[2];
            const input = fileTd.querySelector('input[type="file"]');

            // Se não tiver input de arquivo, só copia
            if (!input) {
                novoTbody.appendChild(row);
                return;
            }

            // Se esse índice não é “2 proprietários”, mantém a linha normal
            if (!indicesComProprietario.has(index)) {
                novoTbody.appendChild(row);
                return;
            }

            // Se é “com 2 proprietários”, cria duas linhas: 1 e 2
            const row1 = row.cloneNode(true);
            const row2 = row.cloneNode(true);

            // marca as variantes (isso é o que faz o querySelector do atualizarNomes funcionar)
            row1.dataset.proprietarioVariant = "1";
            row2.dataset.proprietarioVariant = "2";

            // docTipo (para o item 2.1): começa com CNH
            row1.dataset.docTipo = row.dataset.docTipo || "CNH";
            row2.dataset.docTipo = row.dataset.docTipo || "CNH";

            // pega o TD da descrição (2ª coluna) em cada clone
            const desc1 = row1.querySelector("td:nth-child(2)");
            const desc2 = row2.querySelector("td:nth-child(2)");

            // pega os inputs de arquivo dentro de cada linha clonada e dá IDs únicos
            const file1 = row1.querySelector('input[type="file"]');
            const file2 = row2.querySelector('input[type="file"]');

            if (file1) file1.id = `${input.id}_1`;
            if (file2) file2.id = `${input.id}_2`;

            // baseDesc seguro:
            // - se existir .base-desc (só no 2.1), usa ele
            // - se não existir, usa o texto do TD mesmo
            const base =
                descTd.querySelector(".base-desc")?.textContent?.trim()
                ?? descTd.textContent.trim();

            // salva a baseDesc no dataset das linhas clonadas (pra não “acumular parênteses” depois)
            row1.dataset.baseDesc = base;
            row2.dataset.baseDesc = base;

            // Atualiza só o owner-label se ele existir (preserva botões CNH/RG do 2.1)
            const owner1 = desc1?.querySelector(".owner-label");
            const owner2 = desc2?.querySelector(".owner-label");

            if (owner1) owner1.textContent = `(${label1})`;
            if (owner2) owner2.textContent = `(${label2})`;

            novoTbody.appendChild(row1);
            novoTbody.appendChild(row2);
        });

        tbody.replaceWith(novoTbody);
        aplicarListenersInputsArquivo();
        atualizarNomesProprietarios();
    } else {
        // Restaurar tbody original (sem duplicação)
        const original = document.createElement("tbody");
        original.id = tbodyId;

        original.innerHTML = 
        (tipoImovel === 'PF_Urbano') ? pfUrbanoTbodyOriginalHTML :
        (tipoImovel === 'PF_Rural') ? pfRuralTbodyOriginalHTML :
        '';

        tbody.replaceWith(original);
        aplicarListenersInputsArquivo();
    }
}

function removerParentesesDoFinal(text) {
    const idx = text.lastIndexOf(" (");
    if (idx === -1) return text;
    return text.slice(0, idx);
}

function atualizarNomesProprietarios() {
    const tipoImovel = document.getElementById('tipoImovel')?.value ?? '';
    const raw = document.getElementById('temProprietario')?.value;
    const temProprietario = raw && raw.trim() ? raw : '1';

    if ((tipoImovel === 'PF_Urbano' || tipoImovel === 'PF_Rural') && temProprietario === '2') {
        const input1 = document.getElementById('proprietario1').value.trim();
        const input2 = document.getElementById('proprietario2').value.trim();

        const tbodyId = 
            (tipoImovel === 'PF_Urbano') ? 'pfUrbanoTbody' :
            (tipoImovel === 'PF_Rural') ? 'pfRuralTbody' :
            null;

            if (!tbodyId) return;

        const label1 = input1 || "Proprietário 1";
        const label2 = input2 || "Proprietário 2";

        document.querySelectorAll(`#${tbodyId} tr[data-proprietario-variant]`).forEach((row) => {
            const variant = row.dataset.proprietarioVariant;

            const descTd = row.querySelector('td:nth-child(2)');
            if (!descTd) return;

            // Se existir owner-label, atualiza só ele (preserva botões CNH/RG)
            const owner = descTd.querySelector('.owner-label');
            if (owner) {
                owner.textContent = variant === "1" ? `(${label1})` : `(${label2})`;
                return;
            }

            // Caso normal (sem HTML extra), pode atualizar texto inteiro
            const textoAtual = row.dataset.baseDesc || descTd.textContent;
            const baseDesc = removerParentesesDoFinal(textoAtual);

            descTd.textContent = `${baseDesc} (${variant === "1" ? label1 : label2})`;
        });

    }
}

function configurarBotoesDocTipo() {
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-doc");
        if (!btn) return;

        const row = btn.closest("tr");
        if (!row) return;

        const tipo = btn.dataset.tipo; // "CNH" ou "RG"
        row.dataset.docTipo = tipo;

    // opcional: deixar visual qual está ativo
        row.querySelectorAll(".btn-doc").forEach(b => b.classList.toggle("active", b === btn));
    });
}


// ==============================
// Fluxo principal (ZIP)
// ==============================

async function iniciarRenomeacao() {
    const loading = document.getElementById('loading');
    const downloadButton = document.getElementById('downloadButton');
    const form = document.getElementById("renomearForm");
    if (form && !form.checkValidity()) {
        if (typeof form.reportValidity === 'function') form.reportValidity();
        return;
    }   

    downloadButton.disabled = true;
    loading.style.display = 'block';

    try {
        const idOperadora = document.getElementById('idOperadora').value.trim();
        const idSite = document.getElementById('idSite').value.trim();
        const tipoImovel = document.getElementById('tipoImovel').value.trim();

        const temProprietario = document.getElementById('temProprietario')?.value ?? '';
        const proprietario1 = document.getElementById('proprietario1')?.value?.trim() ?? '';
        const proprietario2 = document.getElementById('proprietario2')?.value?.trim() ?? '';

        if (!idOperadora || !idSite || !tipoImovel) {
            alert('Por favor, preencha: ID Operadora, ID Site e Tipo de Imóvel.');
            return;
        }

        // Se marcar "Sim" em PF Urbano, os dois nomes são obrigatórios
        if ((tipoImovel === 'PF_Urbano' || tipoImovel === 'PF_Rural') && temProprietario === '2') {
            if (!proprietario1 || !proprietario2) {
                alert('Você marcou "Proprietário? = Sim". Preencha obrigatoriamente Proprietário 1 e Proprietário 2.');
                return;
            }
        }

        const operadoraFmt = normalizeId(idOperadora);
        const siteFmt = normalizeId(idSite);

        const proprietario1Fmt = sanitizeTitle(proprietario1);
        const proprietario2Fmt = sanitizeTitle(proprietario2);

        const zip = new JSZip();

        const tbodyId = 
            (tipoImovel === 'PF_Urbano') ? 'pfUrbanoTbody' :
            (tipoImovel === 'PF_Rural') ? 'pfRuralTbody' :
            null;

        if (tipoImovel === 'PF_Urbano' || tipoImovel === 'PF_Rural') {
            if (!tbodyId) {
                alert('Erro interno: tbodyId inválido para o tipo de imóvel selecionado.');
                return;
            }
            // Fluxo: múltiplos arquivos via tabela
            const tbody = document.getElementById(tbodyId);
            const rows = Array.from(tbody.querySelectorAll('tr'));

            // Agora gerar arquivos (0/1/2 por índice dependendo do que foi anexado)
            const arquivosParaRenomear = [];

            rows.forEach((row) => {
                const tds = row.querySelectorAll('td');
                if (tds.length < 3) return;

                const indexRaw = (tds[0].textContent ?? '').trim();
                const input = row.querySelector('input[type="file"]');
                if (!input || !input.files || input.files.length === 0) return;

                const arquivo = input.files[0];
                const { base, ext } = splitNameAndExt(arquivo.name);

                const labelByIndex =
                    (tipoImovel === 'PF_Urbano') ? labelByIndexUrbano :
                    (tipoImovel === 'PF_Rural') ? labelByIndexRural :
                    {};

                let label = labelByIndex[indexRaw] ?? sanitizeTitle(base);

                if (indexRaw === "2.1") {
                    label = row.dataset.docTipo || "CNH";
                }

                const variant = row.dataset.proprietarioVariant || ""; // "1" | "2" | ""

                let sufixoProprietario = "";
                if ((tipoImovel === 'PF_Urbano' || tipoImovel === 'PF_Rural') && temProprietario === '2' && indicesComProprietario.has(indexRaw) && variant) {
                    const nomeProprietario = (variant === "1") ? proprietario1Fmt : proprietario2Fmt;
                    sufixoProprietario = nomeProprietario ? `_${nomeProprietario}` : "";
                }

                const novoNome = `${indexRaw} ${operadoraFmt}_${siteFmt}_${label}${sufixoProprietario}${ext}`;
                arquivosParaRenomear.push({ novoNome, arquivo });
            });

            if (arquivosParaRenomear.length === 0) {
                alert('Nenhum arquivo foi selecionado. Anexe pelo menos um documento para gerar o ZIP.');
                return;
            }

            arquivosParaRenomear.forEach(item => zip.file(item.novoNome, item.arquivo));

            const nomeZip = `${tipoImovel}_${operadoraFmt}_${siteFmt}_Documentos.zip`;
            const content = await zip.generateAsync({ type: 'blob' });
            dispararDownload(content, nomeZip);
            limparFormulario();

        } else {
            // Fluxo: arquivo único (sem proprietário por enquanto)
            const arquivoInput = document.getElementById('arquivoInputGeral');
            if (!arquivoInput.files || arquivoInput.files.length === 0) {
                alert('Por favor, selecione um arquivo no campo de Arquivo Geral.');
                return;
            }

            const arquivo = arquivoInput.files[0];
            const { base, ext } = splitNameAndExt(arquivo.name);

            const tipoFmt = sanitizeTitle(tipoImovel);
            const baseFmt = sanitizeTitle(base);

            const novoNomeCompleto = `${tipoFmt}_${operadoraFmt}_${siteFmt}_${baseFmt}${ext}`;

            zip.file(novoNomeCompleto, arquivo);

            const nomeZip = `${tipoImovel}_${operadoraFmt}_${siteFmt}.zip`;
            const content = await zip.generateAsync({ type: 'blob' });
            dispararDownload(content, nomeZip);
            limparFormulario();
        }

    } finally {
        downloadButton.disabled = false;
        loading.style.display = 'none';
    }
}

// Função que limpa os anexos do input de arquivo
function limparFormulario() {
    console.log("cliquei em limparFormulario");
    const files = document.querySelectorAll('#renomearForm input[type="file"]');
    console.log("ACHOU FILE INPUTS:", files.length);

    files.forEach((i, idx) => {
        console.log(idx, i.id, i.files?.length);
        i.value = "";
        console.log("depois:", i.files?.length);
    });
}

function aplicarListenersInputsArquivo() {
    document.querySelectorAll('input[type="file"]').forEach(inp => {
        inp.addEventListener('change', () => {
            if (inp.files && inp.files[0]) {
                inp.title = inp.files[0].name;
            }
        });
    });
}

// Função que dispara o download do Blob com o nome especificado

function dispararDownload(blob, filename) {
    const urlObjeto = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlObjeto;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(urlObjeto);
}

// ==============================
// Inicialização da página
// ==============================

document.addEventListener('DOMContentLoaded', () => {
    // Salva os tbodys “originais” (sem duplicação) para restaurar quando temProprietario = 1
    const tbodyUrbano = document.getElementById('pfUrbanoTbody');
    if (tbodyUrbano) pfUrbanoTbodyOriginalHTML = tbodyUrbano.innerHTML;
    const tbodyRural = document.getElementById('pfRuralTbody');
    if (tbodyRural) pfRuralTbodyOriginalHTML = tbodyRural.innerHTML;

    mostrarCamposEspecificos();
    atualizarUIProprietario();
    configurarBotoesDocTipo();
    limparFormulario();


    const btnLimpar = document.getElementById("limparFormulario");
    if (btnLimpar) btnLimpar.addEventListener("click", limparFormulario);

    // Eventos para mostrar/esconder campos ao mudar seletores
    aplicarListenersInputsArquivo();

    // Eventos para atualizar nomes dos proprietários ao digitar

    const input1 = document.getElementById('proprietario1');
    const input2 = document.getElementById('proprietario2');

    if (input1) input1.addEventListener('input', atualizarNomesProprietarios);
    if (input2) input2.addEventListener('input', atualizarNomesProprietarios);

});
