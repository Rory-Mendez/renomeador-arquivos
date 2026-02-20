# Renomeador de Arquivos em Lote

Ferramenta web desenvolvida para **automatizar a padronização e organização de documentos operacionais**, reduzindo trabalho manual, erros humanos e tempo gasto em fluxos internos.

A aplicação permite renomear múltiplos arquivos diretamente no navegador, seguindo regras específicas de padronização exigidas por processos internos do setor de telecomunicações.

O projeto roda **100% no front-end** e gera um arquivo ZIP com os arquivos renomeados, preservando a privacidade dos dados.

---

## Demonstração

🔗 Demo online (GitHub Pages):  
<https://rory-mendez.github.io/renomeador-arquivos/>

---

## Contexto e Motivação

No fluxo de aquisição e licenciamento de infraestrutura, os documentos enviados por proprietários precisam seguir **padrões rígidos de nomenclatura**, que variam conforme cliente e tipo de processo.

O processo manual de renomeação era:

- Repetitivo
- Sujeito a erros
- Pouco escalável
- Consumia tempo operacional relevante

Este projeto surgiu da necessidade real de **otimizar esse fluxo**, garantindo padronização, redução de erros e maior eficiência operacional, sem depender de backend ou infraestrutura adicional.

A ferramenta passou a ser utilizada por **mais de um colaborador do departamento**, integrando-se ao fluxo de trabalho diário.

---

## Impacto Operacional

- Redução significativa do tempo manual gasto na organização de arquivos
- Padronização consistente dos documentos antes do protocolo
- Menor risco de erros operacionais
- Maior eficiência no preparo da documentação para envio a clientes e órgãos públicos

---

## Como Usar

- Preencha ID Operadora e ID Site
- Selecione proprietários e tipo de imóvel
- Anexe os arquivos por item
- Clique em “Criar ZIP” para baixar

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
- Redução de duplicação de código
- Facilidade de manutenção e expansão

### v3.0 — Tabelas completas + ícones (PWA / favicons)

- Suporte para as tabelas restantes (PJ Urbano, PJ Rural e PF Condomínio)
- Adição de favicons e ícones
- Preparação para uso como PWA

---

## Decisões Técnicas

- Aplicação 100% front-end para uso imediato, sem necessidade de backend
- Refatoração estrutural para permitir crescimento do projeto com baixo impacto
- Geração de ZIP no navegador para garantir privacidade dos arquivos
- Estrutura orientada a configuração para facilitar manutenção e evolução

---

## Roadmap (Funcionalidades Futuras)

- Adição de novas tabelas de renomeação
- Personalização da regra de nomenclatura
- Conversão de imagens (`jpg`, `jpeg`, `png`) em PDFs antes da geração do ZIP
- Avaliação de migração parcial para backend

---

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- JSZip

---

## Observações

Projeto desenvolvido como **ferramenta real de uso interno**, evoluindo conforme mudanças nas regras de negócio e servindo como estudo prático de versionamento, organização de código e melhoria contínua de fluxos operacionais.

---

## Screenshots

<p align="center">
  <img src="assets/screenshots/capa.png" alt="Capa do site" width="47%" />
  <img src="assets/screenshots/tabela.png" alt="Tabela de renomeação" width="45%" />
</p>
