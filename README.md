# Portfólio — Fernando Prestes Godinho / PG SYSTEMS

Site estático, sem build e sem dependências. Abrir o `index.html` já funciona.

```
index.html          página inteira
css/style.css       tokens, layout e componentes
js/app.js           terminal do hero, filtros, visores de tela, lightbox
assets/shots/       prints dos sistemas (WebP, ~3 MB no total)
assets/img/         logos dos produtos
```

## Ver localmente

Basta abrir o `index.html` no navegador. Se preferir servir:

```bash
python -m http.server 8000
```

## Antes de publicar — o que falta preencher

No fim do `index.html`, na seção `#contato`, três links estão com marcador:

| Link | O que trocar |
|---|---|
| `mailto:SEU-EMAIL@exemplo.com` | o e-mail que você quer divulgar |
| `https://wa.me/55SEUNUMERO` | DDD + número, sem espaços (ex.: `5511999998888`) |
| `https://www.linkedin.com/in/SEU-PERFIL` | o seu perfil, ou apague a linha |

O GitHub já aponta para `github.com/feernandopg`.

## Publicar

É estático — sobe em qualquer lugar. Na Netlify, o mesmo caminho do site da PG:

1. Crie um repositório com esta pasta.
2. Netlify → *Add new site* → *Import an existing project*.
3. Build command: **vazio**. Publish directory: **`.`** (a raiz).

## Sobre os prints

Todos os prints saíram dos sistemas reais, rodando localmente. Antes de cada
captura os bancos foram trocados por bancos de demonstração com dados
fictícios — nenhum cliente, aluno, veículo, endereço ou conta real aparece no
site. Duas escolhas conscientes:

- **Central de monitoramento**: as telas vêm das páginas de *preview* do próprio
  projeto (mesma UI, dados de exemplo), e não da instalação em produção.
- **MyIp**: sem print. A tela mostra a rede real da máquina onde ele roda.

## Trocar ou acrescentar prints

1. Coloque o `.webp` em `assets/shots/`.
2. Em `js/app.js`, adicione a linha na galeria do projeto, em `GALERIAS`:

```js
['nome-do-arquivo', 'Rótulo da aba', 'Legenda que aparece embaixo', 1]
```

O quarto item é opcional: use `1` quando a imagem for uma página inteira (muito
alta) — ela ganha limite de altura em vez de largura.
