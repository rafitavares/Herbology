# Herbário · Soul Youniversity

App estático (HTML/CSS/JS puro) para consultar a farmácia de chás de casa: ervas por objetivo, potência, preparo e avisos, em **português, alemão e inglês**. Sem servidor, sem build, sem chave de API.

## Arquivos

| Arquivo | Papel |
|---|---|
| `index.html` | Estrutura da página |
| `styles.css` | Estilo (paleta de boticário, barras graduadas) |
| `app.js` | Lógica, idiomas, categorias e blends |
| `ervas.json` | **O banco de dados.** É só isto que você edita para crescer o herbário |

## Publicar no GitHub Pages (grátis)

1. Crie um repositório no GitHub (pode ser privado) e envie estes quatro arquivos para a raiz.
2. No repositório: **Settings → Pages**.
3. Em *Build and deployment*, **Source: Deploy from a branch**; **Branch: `main`** e pasta **`/root`**. Salve.
4. Aguarde ~1 min. O link aparece no topo dessa mesma página (algo como `https://SEU-USUARIO.github.io/NOME-DO-REPO/`).
5. Quem tiver o link, abre. Se o repositório for privado, o site do Pages ainda fica público — se quiser restringir de verdade o acesso, use um repositório com Pages privado (recurso de planos pagos) ou rode local (abaixo).

## Rodar local (teste antes de publicar)

O app carrega `ervas.json` por HTTP, então **não** funciona abrindo o `index.html` direto (o navegador bloqueia). Rode um servidor simples na pasta:

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000
```

## Adicionar uma erva nova

1. Peça o perfil ao Claude no chat (ele devolve o bloco JSON pronto, nos três idiomas).
2. Cole o bloco dentro da lista `"ervas"` no `ervas.json` (separe do anterior com vírgula).
3. Commit. No próximo carregamento a erva aparece — nas fichas, na busca e em toda categoria que você listar em `categorias`.

Formato de cada erva:

```json
{
  "id": "gengibre",
  "nome": "Gengibre",
  "nome_de": "Ingwer",
  "nome_en": "Ginger",
  "nome_cientifico": "Zingiber officinale",
  "categorias": ["digestao", "imunidade", "dores"],
  "funcoes": [
    { "pt": "Digestão", "de": "Verdauung", "en": "Digestion", "nota": 9 },
    { "pt": "Náusea",   "de": "Übelkeit",  "en": "Nausea",    "nota": 9 }
  ],
  "descricao": { "pt": "…", "de": "…", "en": "…" },
  "preparo":   { "pt": "…", "de": "…", "en": "…" },
  "avisos":    { "pt": "…", "de": "…", "en": "…" },
  "confianca": "alta"
}
```

Regras: `nota` de 0 a 10; `confianca` é `"alta"`, `"media"` ou `"baixa"`.

## Categorias

As categorias existentes (chaves usadas no campo `categorias`):

`digestao`, `limpeza`, `menstruacao`, `enxaqueca`, `imunidade`, `dores`, `sono`, `nervoso`, `respiratorio`, `cardiovascular`, `terceiro_olho`.

Uma erva pode estar em várias. Se você usar uma chave nova (ex.: `"pele"`), ela aparece sozinha na aba **Categorias** — só sem blend recomendado até você definir um. Para nomear a categoria nos três idiomas, adicionar ícone ou um blend, edite o objeto `CAT` no topo do `app.js`.

## Nota sobre as pontuações

As barras 0–10 são **avaliação comparativa qualitativa** (uso tradicional + evidência disponível), não medida clínica. O campo `confianca` sinaliza quão sólida é cada avaliação. É informação de fitoterapia tradicional, **não prescrição médica** — sem vesícula ou em uso de medicação contínua, confirme interações antes de blends regulares.
