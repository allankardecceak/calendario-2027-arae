# Calendário de Atividades 2027 — 7º CEU Duque de Caxias (ARAE)
> Documento técnico e arquitetural de referência para manutenção, evolução e suporte por desenvolvedores e modelos de Inteligência Artificial.

---

## 1. Visão Geral do Projeto

- **Organização:** 7º Conselho Espírita de Unificação — Duque de Caxias (ARAE - Área de Ações Estratégicas).
- **Repositório GitHub:** `allankardecceak/calendario-2027-arae`
- **Branch Principal:** `main`
- **Ambiente de Produção (Deploy):** Vercel integrado via GitHub (deploy contínuo a cada `push` na branch `main`).
- **URL Pública:** [https://calendario-2027-arae.vercel.app/](https://calendario-2027-arae.vercel.app/)
- **Painel Administrativo:** [https://calendario-2027-arae.vercel.app/admin.html](https://calendario-2027-arae.vercel.app/admin.html)

---

## 2. Arquitetura e Pilha Tecnológica (Stack)

O projeto é estritamente **Serverless / Jamstack estático**:
- **HTML5 semântico** e **Vanilla CSS** (sem dependências pesadas como Tailwind, Bootstrap ou React).
- **Vanilla JavaScript (ES6+)**:
  - Sem etapa de *build* (`npm`, `webpack` ou `vite` não são necessários).
  - Execução direta no navegador do cliente.
- **Persistência de Dados:** Arquivo central [events.json](file:///c:/Projetos/Calend%C3%A1rio%20ARAE/events.json) versionado diretamente no repositório.
- **Upload e Mídia:** Pasta `/imagens/` no repositório GitHub, servida via CDN Raw (`https://raw.githubusercontent.com/...`).
- **Integração de Backend:** Utiliza a API REST do GitHub (`https://api.github.com/repos/allankardecceak/calendario-2027-arae/contents/...`) para operações de CRUD e uploads diretamente do navegador via Personal Access Token (PAT).

---

## 3. Estrutura de Arquivos e Diretórios

```
calendario-2027-arae/
├── .gitignore          # Ignora arquivos sensíveis (Token.txt, logs, etc.)
├── Token.txt           # Armazenamento LOCAL do Personal Access Token do GitHub (NUNCA commitar)
├── README.md           # Resumo básico do repositório
├── PROJETO_GUIA_IA.md  # Este manual detalhado de instruções para IAs e desenvolvedores
├── events.json         # Base de dados JSON de todas as atividades de 2027
├── index.html          # Aplicação principal (Portal público do calendário e resumo de impressão)
├── admin.html          # Painel administrativo com autenticação PAT e CRUD de eventos
└── imagens/            # Pasta onde são salvos os banners e fotos dos eventos
```

---

## 4. Esquema de Dados (`events.json`)

O arquivo [events.json](file:///c:/Projetos/Calend%C3%A1rio%20ARAE/events.json) segue o seguinte formato padronizado:

```json
{
  "meta": {
    "titulo": "Calendário de Atividades 2027",
    "subtitulo": "7º Conselho Espírita de Unificação — Duque de Caxias",
    "area": "Área de Ações Estratégicas (ARAE)",
    "totalAtividades": 35,
    "ultimaAtualizacao": "2026-10-30"
  },
  "eventos": [
    {
      "id": "jan-01",
      "mes": 1,
      "nomeMes": "Janeiro",
      "data": "10 de Janeiro — Parte I",
      "tipo": "type-eleicao",
      "tipoLabel": "Reunião do Conselho",
      "titulo": "UNIFICAÇÃO — Reunião do Conselho",
      "descricao": "Reunião ordinária do 7º CEU para acompanhamento das atividades...",
      "competencia": "UNIFICAÇÃO / ADM",
      "diretrizes": "6 (Unificação) e 7 (Formação)",
      "imagem": "https://raw.githubusercontent.com/allankardecceak/calendario-2027-arae/main/imagens/img_1793382287688.jpg"
    }
  ]
}
```

### Tipos e Categorias (`tipo`):
- `type-eleicao`: Reuniões & Planejamento (Cor Verde Petróleo/Teal)
- `type-capacitacao`: Estudos, Capacitações & Seminários (Cor Azul Céu/Sky)
- `type-encontro`: Encontros Regionais & Temáticos (Cor Roxa/Purple)
- `type-confraternizacao`: Confraternizações (Cor Laranja/Orange)

---

## 5. Regras Críticas de Implementação e Gotchas (Atenção para IAs)

### A. Codificação UTF-8 e Base64 na API do GitHub
> [!IMPORTANT]
> A API do GitHub exige que o conteúdo de arquivos gravados (`PUT /contents/{path}`) seja enviado em **Base64**.  
> Em JavaScript de navegadores, as funções nativas `btoa()` e `atob()` operam estritamente sobre strings binárias de 1 byte (Latin-1). Usá-las diretamente corrompe caracteres acentuados (`ã`, `ç`, `í`, `—`, etc.), gerando *mojibake*.
>
> **Sempre utilize os métodos `TextDecoder` e `TextEncoder`:**
```javascript
function b64DecodeUtf8(str) {
    var binStr = atob(str.replace(/\s/g, ''));
    var bytes = new Uint8Array(binStr.length);
    for (var i = 0; i < binStr.length; i++) {
        bytes[i] = binStr.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
}

function b64EncodeUtf8(str) {
    var bytes = new TextEncoder().encode(str);
    var binStr = '';
    var len = bytes.length;
    for (var i = 0; i < len; i++) {
        binStr += String.fromCharCode(bytes[i]);
    }
    return btoa(binStr);
}
```

### B. Apresentação Visual e Layout ([index.html](file:///c:/Projetos/Calend%C3%A1rio%20ARAE/index.html))
1. **Estrutura da Página Principal:**
   - **Cabeçalho:** Título e identificação do 7º CEU / ARAE.
   - **Legenda de Categorias:** Identificação das 4 categorias por cores.
   - **Módulos Mensais:** Linhas agrupadas por mês (Janeiro a Dezembro) com grid de cards.
   - **Resumo Anual Condensado (Impressão / PDF):** Posicionado após Dezembro e antes do Resumo por Competência.
   - **Atividades por Área Responsável (Timeline):** Resumo agrupado por competência.
   - **Rodapé:** Identificação e link discreto `🔒 Área Administrativa` para `admin.html`.
   *(Nota: O bloco antigo de introdução e os "Princípios Orientadores" foram removidos a pedido do usuário).*

2. **Cards Fechados (Visão Geral):**
   - **NÃO** exibir campos de "Competência" nem "Diretrizes" nos cards da listagem geral (decisão deliberada para manter os cards limpos e objetivos).
   - Imagens no card usam `.card-image-wrap img` com `object-fit: contain; max-width: 100%; max-height: 100%;` e fundo neutro (`#f8fafc`). **Nunca use `object-fit: cover`** para evitar corte de textos e fotos de divulgação.

3. **Modal Expandido (Ao Clicar no Card):**
   - O modal possui altura máxima de `90vh`, cabeçalho fixo no topo e rolagem vertical suave no corpo (`.modal-body { overflow-y: auto; }`).
   - Ao abrir o modal, a rolagem deve ser resetada para o topo com `modalBody.scrollTop = 0`.
   - **Exibe todas as informações completas:** Imagem ampliada, Tipo, Título, Descrição, **Competência** e **Diretrizes FEB**.

### C. Seção de Resumo para Impressão e PDF
- Localizada em `#printSummarySection` (entre o mês de Dezembro e o resumo por competências).
- Estruturada em 2 colunas: Coluna 1 (Jan a Jun) e Coluna 2 (Jul a Dez).
- **Cores Específicas por Mês:** Cada título de mês no resumo utiliza o **mesmo gradiente de cor do cabeçalho do card do respectivo mês** (via `.summary-month-block[data-month="XX"] .summary-month-title`), e as datas herdam a cor primária do mês.
- **Sincronização Dinâmica:** O resumo é gerado e atualizado diretamente a partir de `events.json` dentro da função `loadEvents()` (junto com `renderCalendar()`). Qualquer edição, inclusão ou exclusão de eventos realizada no painel administrativo reflete imediatamente no resumo anual.
- Formato condensado: `Mês:` em destaque na cor do mês, seguido por linhas `Data — Título do Evento ⏰ Horário`.
- Botão interativo `🖨️ Imprimir / Salvar em PDF` aciona `window.printSummaryCalendar()`.
- A classe CSS `printing-summary` oculta temporariamente cabeçalho, legenda, cards grandes e rodapé no `@media print`, isolando apenas a folha de resumo com as cores do mês preservadas (`print-color-adjust: exact`).

### D. Segurança do Token
- O token de acesso pessoal do GitHub (PAT) é mantido em `localStorage.getItem('arae_tok')` no navegador do administrador.
- O arquivo local `Token.txt` está listado no `.gitignore`. **Nunca remova o `.gitignore` nem comite tokens no código-fonte.**

---

## 6. Fluxo de Publicação e Atualização

1. O administrador acessa `admin.html`, insere o token (ou usa o salvo no navegador).
2. Pode adicionar evento, editar existente ou anexar imagem.
3. Se anexar imagem:
   - A imagem é convertida em base64.
   - Enviada via API para `imagens/img_{timestamp}.{ext}`.
   - O link Raw do GitHub é inserido no campo `ev.imagem`.
4. Ao clicar em **"Publicar no GitHub"**:
   - `admin.html` faz um `PUT /contents/events.json` com o novo conteúdo serializado em UTF-8 Base64 e o SHA atualizado.
   - O commit é registrado na branch `main`.
   - A Vercel detecta o push e republica o site automaticamente em menos de 30 segundos.

---

## 7. Instruções para Manutenções Futuras

Caso o usuário solicite novas alterações:
1. Verifique sempre o estado do repositório remoto com `git fetch origin` e `git status` antes de editar.
2. Preserve a estrutura do `events.json` e garanta que todas as strings salvas permaneçam em UTF-8 limpo.
3. Não reinsira dependências externas ou bibliotecas desnecessárias; priorize a simplicidade e a performance da stack nativa atual.
4. Mantenha este documento atualizado sempre que novas seções estruturais ou regras de negócio forem introduzidas.
