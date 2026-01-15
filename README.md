# Renomeador de Arquivos em Lote

Aplicação web desenvolvida em HTML, CSS e JavaScript para renomear múltiplos arquivos de uma vez, diretamente no navegador, seguindo regras específicas de padronização exigidas por processos internos.

O projeto roda 100% no front-end e gera um arquivo ZIP com os arquivos renomeados.

---

## Demonstração

🔗 Demo online (GitHub Pages):  
(link será adicionado)

---

## Motivação

Este projeto surgiu da necessidade de automatizar a padronização de nomes de arquivos enviados por clientes, seguindo regras rígidas definidas pela empresa.

O processo manual era repetitivo, sujeito a erros e pouco escalável.  
A solução foi criar uma ferramenta simples, acessível via navegador, eliminando erros humanos e acelerando o fluxo de trabalho.

---

## Funcionalidades Atuais

- Renomeação automática de arquivos em lote
- Suporte a **até dois proprietários**
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

### v2.0 — Versão estável atual

- Interface redesenhada com CSS atualizado
- Suporte a dois proprietários
- Opção de escolha entre RG e CNH
- Limpeza automática e manual dos anexos
- Código mais organizado e melhor experiência de uso

---

## Roadmap (Funcionalidades Futuras)

- Implementar as demais tabelas de renomeação  
  (atualmente apenas uma tabela está funcional)
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
