# Renomeador de Arquivos em Lote

Aplicação web desenvolvida em HTML, CSS e JavaScript para renomear múltiplos arquivos de uma vez, diretamente no navegador, seguindo regras específicas de padronização exigidas por processos internos.

O projeto roda 100% no front-end e gera um arquivo ZIP com os arquivos renomeados.

---

## Demonstração

🔗 Demo online (GitHub Pages):  
<https://rory-mendez.github.io/renomeador-arquivos/>

---

## Como Usar

- Preencha ID Operadora e ID Site
- Selecione proprietários e tipo de imóvel
- Anexe os arquivos por item
- Clique em “Criar ZIP” para baixar

---

## Motivação

Este projeto surgiu da necessidade de automatizar a padronização de nomes de arquivos enviados por clientes, seguindo regras rígidas definidas pela empresa.

O processo manual era repetitivo, sujeito a erros e pouco escalável.  
A solução foi criar uma ferramenta simples, acessível via navegador, eliminando erros humanos e acelerando o fluxo de trabalho.

---

## Funcionalidades Atuais

- Renomeação automática de arquivos em lote
- Suporte às tabelas: PF Urbano, PF Rural, PJ Urbano, PJ Rural e PJ Condomínio
- Seleção do tipo de documento (**RG ou CNH**)
- Geração de arquivo **ZIP** para download
- Limpeza automática dos anexos após o download
- Botão manual para limpar anexos
- Interface com CSS atualizado e foco em usabilidade
- Execução 100% no navegador (sem backend)

---

## Evolução do Projeto

### v0.1 — Primeira versão funcional

- Primeira versão operacional do renomeador
- Ordem de renomeação incorreta
- Incluía área de candidato (regra antiga)
- Interface simples

### v1.0 — Correção da regra de negócio

- Correção da ordem correta de renomeação
- Remoção da área de candidato
- Suporte limitado a um proprietário

### v2.0 — Versão estável

- Interface redesenhada com CSS atualizado
- Suporte a dois proprietários
- Opção de escolha entre RG e CNH
- Limpeza automática e manual dos anexos
- Código mais organizado e melhor experiência de uso

### v2.1 — Adição da tabela de PF Rural

- Suporte para duas tabelas de renomeação (PF Urbano e PF Rural)

### v2.1.1 — Correções pontuais

- Correção de erro do item em HTML
- Campo de CND IBAMA aceita 2 proprietários

### v2.2 — Refatoração para facilitar expansão

- Refatoração motivada pela necessidade de escalar o número de tabelas
- A abordagem anterior geraria alta duplicação e dificuldade de manutenção
- As tabelas agora são geradas a partir de uma configuração central

---

### 3.0 — Tabelas completas + ícones (PWA / favicons)

- Suporte para as tabelas de renomeação restantes (PJ Urbano, PJ Rural e PF Condomínio)
- Adição de favicons e ícones (web/iOS)
- Crédito ao criador do ícone no footer

### Decisões técnicas

- O projeto foi desenvolvido 100% em front-end para permitir uso imediato, sem necessidade de backend ou infraestrutura adicional
- A estrutura inicial das tabelas foi refatorada (v2.2) para evitar duplicação de código e facilitar a manutenção
- As tabelas de renomeação passaram a ser geradas a partir de uma configuração central, permitindo adicionar novas tabelas com baixo impacto no código
- A geração do ZIP é feita no navegador para preservar a privacidade dos arquivos, que não são enviados a servidores externos
- A adição de ícones e manifest (v3.0) prepara o projeto para uso como PWA e melhora a experiência em dispositivos móveis

---

## Roadmap (Funcionalidades Futuras)

- Adicionar novas tabelas agora ficou mais rápido graças à refatoração v2.2
- Permitir personalização da regra de renomeação  
  (usuário escolhe ordem e formato do nome final)
- Converter imagens (`jpg`, `jpeg`, `png`) em PDFs individuais antes da geração do ZIP
- Avaliar migração parcial para backend no futuro

---

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- JSZip

---

## Observações

Este projeto foi desenvolvido como ferramenta real de uso interno e evoluiu conforme mudanças nas regras de negócio, servindo também como estudo prático de versionamento, organização de código e experiência do usuário.

## Screenshots

<p align="center">
  <img src="assets/screenshots/capa.png" alt="Capa do site" width="47%" style="vertical-align: top; margin-right: 12px;" />
  <img src="assets/screenshots/tabela.png" alt="Tabela de renomeação" width="45%" style="vertical-align: top;" />
</p>
