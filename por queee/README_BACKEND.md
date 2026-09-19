
# Arquitetura

```text
navegador
   ↓
frontend HTML/CSS/JS
   ↓ fetch /api/...
Flask (backend/app.py)
   ↓
SQLite (backend/luz_da_lua.db)
```

Para o WhatsApp:

```text
checkout
   ↓
POST /api/orders
   ↓
backend cria pedido + grava banco
   ↓
backend gera URL wa.me
   ↓
navegador abre WhatsApp da Luz da Lua
```

Número configurado:
(27) 99951-2072

Importante:
- pagamento real não está integrado;
- o pagamento é escolhido no checkout e enviado como informação no WhatsApp;
- as métricas deixam de ser apenas locais quando o frontend passar a enviar eventos ao backend.
