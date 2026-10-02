# Guia de Conexão: GitHub e Vercel (TechView HD)

Este guia orienta a configuração e resolução de conexões ao publicar o projeto via **GitHub** e **Vercel**.

---

## 1. Estrutura de Pastas e Categorias Oficiais
As categorias principais do projeto foram padronizadas exclusivamente para as pastas numeradas:
- **`07 - LAMINAÇÃO`** *(Subpasta de equipamento: ROTOMEC)*
- **`08 - EXTRUSÃO`** *(Subpastas de equipamento: VAREX I, VAREX II)*
- **`10 - CORTE`** *(Subpastas de equipamento: KAMPF I, KAMPF II)*
- **`13 - UTILIDADES`** *(Subpasta de equipamento: SUBESTAÇÃO)*

> Nomes avulsos de equipamentos (como `ROTOMEC` ou `KAMPF`) não aparecem como categorias raiz duplicadas; eles ficam organizados dentro de sua respectiva pasta numerada.

---

## 2. Configuração do Vercel (`vercel.json`)
O arquivo `vercel.json` já está incluído na raiz do projeto com as regras de rewrite para Single Page Application (SPA):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 3. Conexão com Google Drive na Vercel
Por padrão de segurança do Google e Firebase Authentication, janelas de login com pop-up (`signInWithPopup`) exigem que o domínio da aplicação esteja cadastrado como **Domínio Autorizado**.

### Opção A: Ativar Conexão Direta (Recomendado na Vercel)
No modal de Sincronização do aplicativo, clique no botão:
👉 **"Ativar Conexão Direta (Vercel)"**
A sessão permanente para `manutencaolaminor@gmail.com` é ativada imediatamente com persistência local, permitindo acesso completo a todas as pranchas, visualizador CAD em alta definição, zoom e exportação de PDF.

### Opção B: Autorizar o Domínio Vercel no Firebase Console
Se desejar autenticação OAuth pop-up ao vivo diretamente da Vercel:
1. Acesse o [Firebase Console](https://console.firebase.google.com/).
2. Abra o projeto (`gen-lang-client-0008157636` ou seu projeto de produção).
3. Vá em **Authentication** > **Settings** (Configurações) > aba **Authorized domains** (Domínios autorizados).
4. Clique em **Add domain** (Adicionar domínio).
5. Cole o seu domínio Vercel (exemplo: `seu-projeto.vercel.app`).
6. Pronto! O botão "Conectar Google Drive" funcionará normalmente na Vercel.

---

## 4. Variáveis de Ambiente no Vercel (Opcional)
Se desejar utilizar credenciais Firebase próprias em produção na Vercel, defina no painel da Vercel (*Settings > Environment Variables*):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_OAUTH_CLIENT_ID`
