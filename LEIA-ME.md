# HG Corretor de Imóveis — guia rápido

## Arquivos deste pacote
- `catalogo-imoveis.html` → o aplicativo (renomeie para `index.html` quando subir pro GitHub)
- `manifest.json` → configuração do PWA (nome, ícone, cor do app instalado)
- `service-worker.js` → permite o app funcionar offline e ser "instalado"
- `icons/` → ícone estilo Apple em vários tamanhos, gerado a partir da sua logo

## Como colocar no GitHub e instalar no celular/computador

1. Crie um repositório no GitHub (ex: `hg-imoveis`).
2. Suba estes arquivos, renomeando `catalogo-imoveis.html` para `index.html` (fica na raiz do repositório, junto com `manifest.json`, `service-worker.js` e a pasta `icons/`).
3. Ative o **GitHub Pages** (Settings → Pages → Branch: main → pasta raiz).
4. Depois de publicar, o GitHub te dá um link (ex: `https://seunome.github.io/hg-imoveis/`).
5. Abra esse link no celular (Chrome/Safari) → menu → **"Adicionar à tela inicial"** / **"Instalar app"**. O ícone HG que criei vai aparecer certinho, do mesmo jeito que um app normal. No computador, o Chrome mostra um ícone de instalação na barra de endereço.

Hoje o app já funciona sozinho (sem precisar de internet depois de instalado), guardando os dados no próprio celular/computador (`localStorage`). A limitação: os dados ficam só naquele aparelho — não sincronizam entre o seu celular e o computador, por exemplo.

## Próximo passo: sincronizar entre aparelhos (Firebase)

Pra ter um banco de dados de verdade, que atualiza em todos os aparelhos ao mesmo tempo, o caminho mais simples é o **Firebase Firestore** (Google, tem plano gratuito que cobre bem o uso de um corretor autônomo). Resumo dos passos, pra quando você quiser avançar:

1. Criar um projeto em https://console.firebase.google.com
2. Ativar o **Firestore Database** (modo produção)
3. Copiar as credenciais do projeto (`apiKey`, `projectId`, etc.)
4. No código, troque o objeto `DB` (no início do `<script>`) para salvar/ler do Firestore em vez de `localStorage`. A estrutura de dados (um documento por imóvel, com os mesmos campos: código, tipo, título, endereço, bairro, valor, fotos, etc.) já está pronta pra isso — é só trocar a "gaveta" onde ela é guardada.

Quando você tiver o projeto criado no Firebase, me manda as credenciais (ou me chama de novo) que eu faço essa troca no código pra você.

## Sobre a busca por foto

A busca por foto (📷) compara a "impressão visual" da foto tirada com as fotos já cadastradas no seu catálogo — cor, luz e formato geral da imagem. Ela é útil para bater uma foto tirada na rua com um imóvel que você já cadastrou (ou o contrário), mas não é um reconhecimento inteligente de objetos — é uma comparação de semelhança visual simples. Funciona melhor quando as fotos são do mesmo ângulo/fachada.
