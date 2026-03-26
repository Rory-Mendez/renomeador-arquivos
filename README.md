# Renomeador de Arquivos em Lote

Ferramenta web desenvolvida para **automatizar a padronização e organização de documentos operacionais**, reduzindo trabalho manual, erros humanos e tempo gasto em fluxos internos de uma empresa de telecomunicações.

A aplicação permite renomear múltiplos arquivos diretamente no navegador, seguindo regras específicas de nomenclatura exigidas por cada cliente do setor.

O projeto roda **100% no front-end**, gera um arquivo ZIP com os arquivos renomeados e **nunca envia dados para servidores** — preservando total privacidade dos documentos.

---

## Demonstração

🔗 Demo online (GitHub Pages):
<https://rory-mendez.github.io/renomeador-arquivos/>

---

## Contexto e Motivação

No fluxo de aquisição e licenciamento de infraestrutura de telecomunicações, documentos enviados por proprietários de terrenos precisam seguir **padrões rígidos de nomenclatura**, que variam conforme o cliente contratante e o tipo de processo.

O processo manual era:

- Repetitivo e sujeito a erros
- Pouco escalável com o crescimento da carteira de clientes
- Consumia tempo operacional relevante da equipe

Este projeto surgiu da necessidade real de **otimizar esse fluxo**, e passou a ser utilizado por colaboradores do departamento no dia a dia.

---

## Impacto Operacional

- Redução significativa do tempo gasto na organização de arquivos antes do protocolo
- Padronização consistente dos documentos por cliente
- Menor risco de erros operacionais
- Estrutura preparada para escalar com novos clientes sem reescrever o sistema

---

## Como Usar

1. Selecione o **Cliente** (CAW, TBSA, IHS, GLOBAL, CENTENNIAL e HIGHLINE)
2. Selecione o **Tipo de Imóvel** — as opções aparecem automaticamente conforme o cliente
3. Preencha **ID Operadora** e **ID Site**
4. Informe a quantidade de proprietários/sócios
5. Anexe os arquivos em cada item da tabela
6. Clique em **"Criar ZIP"** para baixar os arquivos renomeados

---

## Funcionalidades Atuai

- Suporte a múltiplos clientes com conjuntos de tabelas independentes
- Tabelas de documentos geradas dinamicamente por cliente
- Suporte às tabelas: PF Urbano, PF Rural, PJ Urbano, PJ Rural e PJ Condomínio (cliente CAW)
- Seleção do tipo de documento (RG ou CNH)
- Suporte a 1 ou 2 proprietários com nomenclatura individualizada
- Geração de arquivo ZIP para download
- Limpeza automática e manual dos anexos
- Execução 100% no navegador, sem backend

---

## Decisões Técnicas

- **100% front-end** — sem necessidade de servidor, instalação ou infraestrutura adicional
- **Estrutura orientada a configuração** — adicionar um novo cliente ou tabela exige apenas declarar um objeto de configuração, sem alterar a lógica principal
- **Geração de ZIP no navegador** via JSZip — os arquivos nunca saem do computador do usuário
- **Separação de responsabilidades** — funções pequenas e focadas facilitam manutenção e testes manuais

---

## Evolução do Projeto

### v4.0 — Suporte a múltiplos clientes

- Arquitetura refatorada para suportar múltiplos clientes (CAW, TBSA, IHS, GLOBAL, CENTENNIAL e HIGHLINE)
- Tipos de Imóvel gerados dinamicamente conforme o cliente selecionado
- Todas as tabelas agora iniciam ocultas corretamente
- Troca de cliente reseta e oculta tabelas automaticamente
- Código preparado para receber novos conjuntos de tabelas sem impacto na lógica existente

### v3.0 — Tabelas completas + ícones (PWA / favicons)

- Suporte para as tabelas restantes (PJ Urbano, PJ Rural e PJ Condomínio)
- Adição de favicons e ícones
- Preparação para uso como PWA

### v2.2 — Refatoração para facilitar expansão

- Redução de duplicação de código
- Facilidade de manutenção e expansão

### v2.1.1 — Correções pontuais

- Correção de erro do item em HTML
- Campo de CND IBAMA aceita 2 proprietários

### v2.1 — Adição da tabela de PF Rural

- Suporte para duas tabelas de renomeação (PF Urbano e PF Rural)

### v2.0 — Versão estável

- Interface redesenhada com CSS atualizado
- Suporte a dois proprietários com opção RG ou CNH
- Limpeza automática e manual dos anexos

### v1.0 — Correção da regra de negócio

- Correção da ordem correta de renomeação
- Remoção da área de candidato

### v0.1 — Primeira versão funcional

- Primeira versão operacional do renomeador

---

## Roadmap

- [ ] Suporte a sócios múltiplos em PJ (de 1 até 10)
- [ ] Nomenclatura personalizada pelo usuário
- [ ] Conversão de imagens (jpg, png) em PDF antes do ZIP
- [ ] Preenchimento das tabelas para TBSA, IHS e GLOBAL

---

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- JSZip

---

## Observações

Projeto desenvolvido como **ferramenta real de uso interno**, evoluindo conforme mudanças nas regras de negócio e servindo como estudo prático de versionamento, organização de código e melhoria contínua de processos operacionais.

---

## Screenshots

<p align="center">
  <img src="assets/screenshots/capa.png" alt="Capa do site" width="47%" />
  <img src="assets/screenshots/tabela.png" alt="Tabela de renomeação" width="45%" />
</p>