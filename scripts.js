// Funcao para normalizar strings (troca espacos por underscores e remove caracteres especiais)
function normalizeText(text) {
    const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalized.replace(/[^a-zA-Z0-9]+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

// Mostra ou esconde campos dependendo da selecao
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

// Fluxo principal de renomeacao e compactacao
async function iniciarRenomeacao() {
    const loading = document.getElementById('loading');
    const downloadButton = document.getElementById('downloadButton');

    downloadButton.disabled = true;
    loading.style.display = 'block';
    
    const idOperadora = document.getElementById('idOperadora').value.trim();
    const idSite = document.getElementById('idSite').value.trim();
    const tipoImovel = document.getElementById('tipoImovel').value.trim();
    const candidato = document.getElementById('candidato').value.trim();
    
    if (!idOperadora || !idSite || !tipoImovel || !candidato) {
        alert('Por favor, preencha os campos de identificacao (ID Operadora, Site, Tipo e Candidato).');
        downloadButton.disabled = false;
        loading.style.display = 'none';
        return;
    }

    const formatadoOperadora = normalizeText(idOperadora);
    const formatadoSite = normalizeText(idSite);
    const formatadoCandidato = normalizeText(candidato);
    
    const zip = new JSZip(); 
    let arquivosParaRenomear = [];

    if (tipoImovel === 'PF_Urbano') {
        // Fluxo com multiplos arquivos
        const prefixCells = document.querySelectorAll('#documentosPfUrbano .doc-table td[data-prefix]');

        prefixCells.forEach(cell => {
            const prefix = cell.getAttribute('data-prefix');
            const fileInput = cell.nextElementSibling.querySelector('input[type=\"file\"]');
            
            // Apenas processa se tiver arquivo.
            if (fileInput.files.length > 0) {
                const arquivo = fileInput.files[0];
                const nomeOriginal = arquivo.name;
                const partesNome = nomeOriginal.split('.');
                let extensao = '';
                let nomeBase = nomeOriginal;
                if (partesNome.length > 1) {
                    extensao = '.' + partesNome.pop();
                    nomeBase = partesNome.join('.');
                }
                const nomeBaseNormalizado = normalizeText(nomeBase);
                
                // Novo padrao: prefixo_IDOperadora_IDSite_nomeOriginal
                const novoNome = `${prefix}_${formatadoOperadora}_${formatadoSite}_${nomeBaseNormalizado}${extensao}`;
                
                arquivosParaRenomear.push({
                    arquivo: arquivo,
                    novoNome: novoNome
                });
            }
        });

        if (arquivosParaRenomear.length === 0) {
            alert('Nenhum arquivo foi selecionado. Por favor, anexe pelo menos um documento para gerar o ZIP.');
            downloadButton.disabled = false;
            loading.style.display = 'none';
            return;
        }
        
        arquivosParaRenomear.forEach(item => {
            zip.file(item.novoNome, item.arquivo); 
        });

        const nomeZip = `${tipoImovel}_${formatadoOperadora}_${formatadoSite}_${formatadoCandidato}_Documentos.zip`;
        const content = await zip.generateAsync({ type: 'blob' });
        dispararDownload(content, nomeZip);

    } else {
        // Fluxo de arquivo unico
        const arquivoInput = document.getElementById('arquivoInputGeral');
        if (arquivoInput.files.length === 0) {
            alert('Por favor, selecione um arquivo no campo de Arquivo Geral.');
            downloadButton.disabled = false;
            loading.style.display = 'none';
            return;
        }
        
        const arquivo = arquivoInput.files[0];
        const nomeOriginal = arquivo.name;
        const partesNome = nomeOriginal.split('.');
        let extensao = '';
        let nomeBase = nomeOriginal;
        if (partesNome.length > 1) {
            extensao = '.' + partesNome.pop();
            nomeBase = partesNome.join('.');
        }
        const nomeBaseNormalizado = normalizeText(nomeBase);

        // Mesmo padrao para o fluxo unico
        const novoNomeCompleto = `${formatadoOperadora}_${formatadoSite}_${tipoImovel}_${nomeBaseNormalizado}${extensao}`;
        
        zip.file(novoNomeCompleto, arquivo);

        const nomeZip = `${tipoImovel}_${formatadoOperadora}_${formatadoSite}_${formatadoCandidato}.zip`;
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
