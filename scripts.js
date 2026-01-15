// ==============================
// Utilitários de texto / nomes
// ==============================

// Para IDs (operadora/site): mantém só letras/números e troca espaços por underline (IDs normalmente não têm espaço)
function normalizeId(text) {
    const normalized = (text ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalized.replace(/[^a-zA-Z0-9]+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

// Para títulos/descrições de arquivo: mantém ESPAÇOS e remove caracteres problemáticos do Windows
function sanitizeTitle(text) {
    const normalized = (text ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // Remove caracteres inválidos em nomes de arquivo no Windows: <>:"/\|?* e também controles
    return normalized
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// Separa nome e extensão (pega a última ocorrência de ".")
function splitNameAndExt(filename) {
    const name = filename ?? '';
    const lastDot = name.lastIndexOf('.');
    if (lastDot <= 0) return { base: name, ext: '' }; // sem extensão ou arquivo tipo ".env"
    return { base: name.slice(0, lastDot), ext: name.slice(lastDot) };
}

// ==============================
// UI: mostra/esconde campos
// ==============================
function mostrarCamposEspecificos() {
    const tipoImovel = document.getElementById('tipoImovel').value;
    const docDiv = document.getElementById('documentosPfUrbano');
    const geralDiv = document.getElementById('arquivoGeralDiv');
    const arquivoGeralInput = document.getElementById('arquivoInputGeral');

    if (tipoImovel === 'PF_Urbano') {
        docDiv.style.display = 'block';
        geralDiv.style.display = 'none';
        arquivoGeralInput.removeAttribute('required');
    } else if (tipoImovel) {
        docDiv.style.display = 'none';
        geralDiv.style.display = 'block';
        arquivoGeralInput.setAttribute('required', 'required');
    } else {
        docDiv.style.display = 'none';
        geralDiv.style.display = 'none';
    }
}

// ==============================
// Fluxo principal (ZIP)
// ==============================
async function iniciarRenomeacao() {
    const loading = document.getElementById('loading');
    const downloadButton = document.getElementById('downloadButton');

    downloadButton.disabled = true;
    loading.style.display = 'block';

    const idOperadora = document.getElementById('idOperadora').value.trim();
    const idSite = document.getElementById('idSite').value.trim();
    const tipoImovel = document.getElementById('tipoImovel').value.trim();

    // Campo "conjuge" (mantido no HTML), mas NÃO é mais obrigatório pro nome.
    const conjuge = document.getElementById('conjuge')?.value?.trim() ?? '';

    if (!idOperadora || !idSite || !tipoImovel) {
        alert('Por favor, preencha: ID Operadora, ID Site e Tipo de Imóvel.');
        downloadButton.disabled = false;
        loading.style.display = 'none';
        return;
    }

    const operadoraFmt = normalizeId(idOperadora);
    const siteFmt = normalizeId(idSite);
    const conjugeFmt = sanitizeTitle(conjuge); // mantém espaços, remove caracteres ruins

    const zip = new JSZip();

    // Mapa: índice -> rótulo fixo do documento
const labelByIndex = {
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

// Índices que aceitam (e devem usar) _Cônjuge quando preenchido
const indicesComConjuge = new Set([
    "2.1","2.5","2.6","2.7","2.8","2.9","2.10","2.11"
]);


    if (tipoImovel === 'PF_Urbano') {
        // Fluxo: múltiplos arquivos na tabela
        const prefixCells = document.querySelectorAll('#documentosPfUrbano .doc-table td[data-prefix]');

        const arquivosParaRenomear = [];

        prefixCells.forEach(cell => {
            const fileInput = cell.nextElementSibling?.querySelector('input[type="file"]');
            if (!fileInput || fileInput.files.length === 0) return;

            const arquivo = fileInput.files[0];
            const { base, ext } = splitNameAndExt(arquivo.name);

            // ✅ índice vem da 1ª coluna (td anterior)
            const indexRaw = (cell.previousElementSibling?.textContent ?? '').trim();

            // ✅ label vem do mapa; se não existir, cai no texto da célula (descrição) ou no nome do arquivo
            const label = labelByIndex[indexRaw] ?? sanitizeTitle((cell.textContent ?? '').trim() || base);

            // ✅ cônjuge opcional por índice
            const sufixoConjuge =
                (indicesComConjuge.has(indexRaw) && conjugeFmt) ? `_${conjugeFmt}` : "";

            // ✅ padrão final
            const novoNome = `${indexRaw} ${operadoraFmt}_${siteFmt}_${label}${sufixoConjuge}${ext}`;

            arquivosParaRenomear.push({ novoNome, arquivo });
        });


        if (arquivosParaRenomear.length === 0) {
            alert('Nenhum arquivo foi selecionado. Anexe pelo menos um documento para gerar o ZIP.');
            downloadButton.disabled = false;
            loading.style.display = 'none';
            return;
        }

        arquivosParaRenomear.forEach(item => zip.file(item.novoNome, item.arquivo));

        // ZIP sem candidato (mas o campo continua no HTML)
        const nomeZip = `${tipoImovel}_${operadoraFmt}_${siteFmt}_Documentos.zip`;
        const content = await zip.generateAsync({ type: 'blob' });
        dispararDownload(content, nomeZip);

    } else {
        // Fluxo: arquivo único
        const arquivoInput = document.getElementById('arquivoInputGeral');
        if (arquivoInput.files.length === 0) {
            alert('Por favor, selecione um arquivo no campo de Arquivo Geral.');
            downloadButton.disabled = false;
            loading.style.display = 'none';
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
    }

    downloadButton.disabled = false;
    loading.style.display = 'none';
}

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

document.addEventListener('DOMContentLoaded', () => {
    mostrarCamposEspecificos();
});
