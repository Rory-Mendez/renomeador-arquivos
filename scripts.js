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
// Config (nomes fixos e itens com proprietário e preconfig de tabelas)
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

const TABELAS = {
    PF_Urbano: {
        key: "PF_Urbano",
        containerID: "documentosPfUrbano",
        tbodyID: "pfUrbanoTbody",
        labels: labelByIndexUrbano,
        // quais índices recebem sufixo _Proprietario quando tem 2
        indicesComProprietario: new Set(["2.1","2.5","2.6","2.7","2.8","2.9","2.10","2.11"]),
        // quais índices têm toggle (CNH/RG). Em PF é 2.1
        indicesComToggleDoc: new Set(["2.1"]),
    },
    PF_Rural: {
        key: "PF_Rural",
        containerID: "documentosPfRural",
        tbodyID: "pfRuralTbody",
        labels: labelByIndexRural,
        // quais índices recebem sufixo _Proprietario quando tem 2
        indicesComProprietario: new Set(["2.1","2.5","2.6","2.7","2.8","2.9","2.10","2.11", "2.12"]),
        // quais índices têm toggle (CNH/RG). Em PF é 2.1
        indicesComToggleDoc: new Set(["2.1"]),
    }
}

function getTabelaConfig() {
    const tipo = document.getElementById('tipoImovel')?.value ?? '';
    return TABELAS[tipo] ?? null;
}

function esconderTodasAsTabelas() {
    Object.values(TABELAS).forEach(cfg => {
        const el = document.getElementById(cfg.containerID);
        if (el) el.style.display = 'none';
    });
}

const TBODY_ORIGINAL = {};

function salvarTbodyOriginal(cfg) {
    const tbody = document.getElementById(cfg.tbodyID);
    if (tbody && !TBODY_ORIGINAL[cfg.key]) {
        TBODY_ORIGINAL[cfg.key] = tbody.innerHTML;
    }
}

function pegarTbodyOriginal(cfg) {
    return TBODY_ORIGINAL[cfg.key] ?? "";
}

// ==============================
// UI: mostra/esconde campos
// ==============================

function mostrarCamposEspecificos() {
    const tipoImovel = document.getElementById('tipoImovel')?.value ?? '';
    const geralDiv = document.getElementById('arquivoGeralDiv');
    const arquivoGeralInput = document.getElementById('arquivoInputGeral');
    const cfg = getTabelaConfig();

    // Zera tudo
    esconderTodasAsTabelas();
    geralDiv.style.display = 'none';
    arquivoGeralInput.removeAttribute('required');

    if (cfg) {
        const container = document.getElementById(cfg.containerID);
        if (container) container.style.display = 'block';
    }
    else if (tipoImovel) {
        geralDiv.style.display = 'block';
        arquivoGeralInput.setAttribute('required', 'required');
    }

    // Quando muda o tipo, a UI de proprietário pode precisar ser re-aplicada
    atualizarUIProprietario();
}

function atualizarUIProprietario() {
    const raw = document.getElementById('temProprietario')?.value;
    const temProprietario = raw && raw.trim() ? raw : '1';
    const cfg = getTabelaConfig();

    const fields = document.getElementById('proprietarioFields');
    const input1 = document.getElementById('proprietario1');
    const input2 = document.getElementById('proprietario2');

    if (!cfg) {
        fields.style.display = 'none'
        input1.removeAttribute('required');
        input2.removeAttribute('required');
        return;
    }

    const tbody = document.getElementById(cfg.tbodyID);
    if (!tbody) {
        fields.style.display = 'none'
        input1.removeAttribute('required');
        input2.removeAttribute('required');
        return;
    }

    const deveMostrarCampos = 
    (temProprietario === '2');

    // Campos de nome: obrigatórios quando 2 proprietários + PF_Urbano ou PF_Rural
    fields.style.display = deveMostrarCampos ? 'block' : 'none';
    if (deveMostrarCampos) {
        input1.setAttribute('required', 'required');
        input2.setAttribute('required', 'required');
    } else {
        input1.removeAttribute('required');
        input2.removeAttribute('required');
    }

    if (temProprietario === '2') {
        // Reconstruir o tbody duplicando os itens que têm proprietário
        const temp = document.createElement('tbody');

        temp.innerHTML = pegarTbodyOriginal(cfg);

        const novoTbody = document.createElement('tbody');

        novoTbody.id = cfg.tbodyID;
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
            if (!cfg.indicesComProprietario.has(index)) {
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
            if (cfg.indicesComToggleDoc.has(index)) {
                row1.dataset.docTipo = row.dataset.docTipo || "CNH";
                row2.dataset.docTipo = row.dataset.docTipo || "CNH";
            }

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
        original.id = cfg.tbodyID;

        original.innerHTML = pegarTbodyOriginal(cfg);

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
    const raw = document.getElementById('temProprietario')?.value;
    const temProprietario = raw && raw.trim() ? raw : '1';
    const cfg = getTabelaConfig();

    if (!cfg || temProprietario !== '2') return;

    const tbody = document.getElementById(cfg.tbodyID);
    if (!tbody) return;

    const input1 = document.getElementById('proprietario1')?.value?.trim() ?? '';
    const input2 = document.getElementById('proprietario2')?.value?.trim() ?? '';

    const label1 = input1 || "Proprietário 1";
    const label2 = input2 || "Proprietário 2";

    tbody.querySelectorAll('tr[data-proprietario-variant]').forEach((row) => {
        const variant = row.dataset.proprietarioVariant;
        if (variant !== "1" && variant !== "2") return;

        const descTd = row.querySelector('td:nth-child(2)');
        if (!descTd) return;

        // Se existir owner-label, atualiza só ele (preserva botões CNH/RG)
        const owner = descTd.querySelector('.owner-label');
        const label = variant === "1" ? label1 : label2;
        if (owner) {
            owner.textContent = `(${label})`;
            return;
        }

        // Caso normal (sem HTML extra), pode atualizar texto inteiro
        const textoAtual = row.dataset.baseDesc || descTd.textContent;
        const baseDesc = removerParentesesDoFinal(textoAtual);

        descTd.textContent = `${baseDesc} (${label})`;
    });
}

function configurarBotoesDocTipo() {
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-doc");
        if (!btn) return;

        const cfg = getTabelaConfig();
        if (!cfg) return; 

        const row = btn.closest("tr");
        if (!row) return;

        const indexRaw = row.querySelector("td")?.textContent?.trim() || "";

        if (!cfg.indicesComToggleDoc.has(indexRaw)) return;

        // Atualiza o tipo no dataset da linha
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
    const cfg = getTabelaConfig();
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

        const raw = document.getElementById('temProprietario')?.value;
        const temProprietario = raw && raw.trim() ? raw : '1';
        const proprietario1 = document.getElementById('proprietario1')?.value?.trim() ?? '';
        const proprietario2 = document.getElementById('proprietario2')?.value?.trim() ?? '';

        if (!idOperadora || !idSite || !tipoImovel) {
            alert('Por favor, preencha: ID Operadora, ID Site e Tipo de Imóvel.');
            return;
        }

        // Se marcar "Sim" em PF Urbano, os dois nomes são obrigatórios
        if (cfg && temProprietario === '2') {
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
        if (cfg) {
            // Fluxo: múltiplos arquivos via tabela
            const tbody = document.getElementById(cfg.tbodyID);
            if (!tbody) {
                alert('Erro interno: tabela de documentos não encontrada.');
                return;
            }
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

                let label = cfg.labels[indexRaw] ?? sanitizeTitle(base);

                if (cfg.indicesComToggleDoc.has(indexRaw)) {
                    label = row.dataset.docTipo || label;
                }

                const variant = row.dataset.proprietarioVariant || ""; // "1" | "2" | ""

                let sufixoProprietario = "";
                if (temProprietario === '2' && cfg.indicesComProprietario.has(indexRaw) && variant) {
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

            const nomeZip = `${cfg.key}_${operadoraFmt}_${siteFmt}_Documentos.zip`;
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
    Object.values(TABELAS).forEach(cfg => salvarTbodyOriginal(cfg));

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
