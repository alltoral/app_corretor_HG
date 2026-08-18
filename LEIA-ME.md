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

## Instalar como app de verdade (não como atalho do navegador)

Corrigi um problema no `manifest.json`: ele ainda apontava para o nome de arquivo antigo (`catalogo-imoveis.html`), e como você renomeou pra `index.html`, o navegador não conseguia validar o app — por isso só oferecia "atalho", não "instalar app". Já corrigido. Também troquei o ícone usado em telas Android (maskable) por uma versão com mais margem, pra sua logo não ficar cortada quando o Android aplicar a máscara redonda/quadrada.

**Reenvie estes arquivos pro GitHub, todos juntos, na raiz do repositório:**
- `index.html`
- `manifest.json`
- `service-worker.js`
- pasta `icons/` inteira (agora com o arquivo novo `icon-512-maskable.png` incluso)

Depois de subir, espere a publicação (1-2 min) e faça este teste pra confirmar que ficou certo:

1. Abra o site publicado no Chrome (Android ou computador).
2. Aperte F12 (ou menu → Mais ferramentas → Ferramentas do desenvolvedor) → aba **Application** → **Manifest**.
3. Se aparecer o nome "HG Corretor de Imóveis", os ícones e nenhum erro em vermelho, está tudo certo — o Chrome vai te oferecer o botão **"Instalar app"** (não mais "Adicionar atalho").
4. No celular Android, o menu (⋮) do Chrome deve mostrar **"Instalar aplicativo"**. No iPhone, o Safari não tem esse botão automático — lá você usa Compartilhar → **"Adicionar à Tela de Início"**, e com os ajustes que já fiz (ícone e modo standalone) ele abre em tela cheia, sem a barra do navegador, como um app normal.

Se depois de reenviar ainda aparecer só "atalho", me manda o link do site publicado que eu confiro direto o que está faltando.

## Firebase já está ligado ✅

O app agora salva os imóveis no seu projeto Firebase (`app-corretor-hg`) usando o **Firestore**, com sincronização em tempo real: qualquer alteração feita no celular aparece automaticamente no computador (e vice-versa), sem precisar recarregar a página.

### Passo obrigatório: criar o banco e liberar o acesso

1. No [Firebase Console](https://console.firebase.google.com), abra o projeto `app-corretor-hg`.
2. No menu lateral, vá em **Firestore Database** → **Criar banco de dados** (se ainda não existir). Escolha uma região próxima (ex: `southamerica-east1`, São Paulo) e comece em **modo de produção**.
3. Vá na aba **Regras** e cole exatamente isto, substituindo o conteúdo:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. Clique em **Publicar**.

⚠️ Como você escolheu **acesso automático sem login**, essas regras deixam o banco aberto: qualquer pessoa que descobrir a URL do app instalado consegue ler e editar os imóveis. Está adequado pra um uso pessoal onde só você conhece o link — mas não é recomendado se em algum momento o link circular. Se quiser reforçar isso depois com uma senha simples de tela, é uma mudança pequena — é só pedir.

### Limite de tamanho por imóvel

Agora as fotos são enviadas para o **Firebase Storage** (não ficam mais dentro do Firestore), então você pode cadastrar até **20 fotos por imóvel**, em boa qualidade. Pra isso funcionar, falta liberar o Storage também:

1. No Firebase Console, vá em **Storage** → **Vamos começar** (se ainda não tiver criado) → escolha a mesma região do Firestore.
2. Vá na aba **Regras** e cole:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

3. Publique.

⚠️ Mesma observação de antes: como está sem login, essas regras deixam o Storage aberto — adequado pro uso pessoal combinado, mas não divulgue a URL do app publicamente.

### Sem internet

Mesmo com o Firestore, o app continua funcionando offline graças ao cache local do navegador — as alterações feitas sem internet são enviadas automaticamente assim que a conexão voltar.

## Sobre a busca por foto

A busca por foto (📷) compara a "impressão visual" da foto tirada com as fotos já cadastradas no seu catálogo — cor, luz e formato geral da imagem. Ela é útil para bater uma foto tirada na rua com um imóvel que você já cadastrou (ou o contrário), mas não é um reconhecimento inteligente de objetos — é uma comparação de semelhança visual simples. Funciona melhor quando as fotos são do mesmo ângulo/fachada.
