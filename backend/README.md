
# Backend Luz da Lua Aromas

Backend Flask + SQLite para a versão de vendas pelo WhatsApp.

## O que ele faz

- cadastro e login real no servidor;
- senhas com hash;
- sessão do usuário;
- carrinho salvo no banco;
- criação de pedidos;
- histórico de pedidos;
- status dos pedidos;
- geração da URL do WhatsApp;
- registro de eventos;
- métricas de cliques no WhatsApp e pedidos;
- painel administrativo protegido por login de admin.

## Instalação

No Windows PowerShell:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Configure as variáveis do `.env.example` no ambiente.

Depois:

```powershell
python app.py
```

Abra:

http://127.0.0.1:5000/

## Criar o admin

Defina:

```text
ADMIN_NAME=Responsavel Luz da Lua
ADMIN_EMAIL=seu-email
ADMIN_PASSWORD=sua-senha
```

na sessão/ambiente antes de iniciar o Flask. O usuário admin é criado automaticamente na primeira execução.

## Banco

O arquivo:

```text
backend/luz_da_lua.db
```

é criado automaticamente.

## Próxima etapa

O frontend desta pasta ainda contém a camada local do protótipo. A próxima ligação é trocar os dados de localStorage pelos endpoints `/api/...` deste backend.

Isso pode ser feito sem alterar o desenho das páginas.
