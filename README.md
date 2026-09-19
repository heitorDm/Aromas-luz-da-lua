# Luz da Lua Aromas — V6 WhatsApp

## Fluxo
Cliente escolhe produto -> carrinho -> checkout -> escolhe forma de pagamento -> pedido é salvo com ID -> WhatsApp da loja abre com a mensagem pronta.

WhatsApp da loja: (27) 99951-2072
Link: https://wa.me/5527999512072

## Incluído
- catálogo;
- aromas;
- página de produto;
- carrinho salvo por conta/visitante;
- criar conta, entrar e sair;
- histórico de pedidos;
- checkout sem gateway;
- envio dos detalhes pelo WhatsApp;
- página de confirmação;
- painel `admin.html` com pedidos, status e métricas de WhatsApp;
- botão de WhatsApp rastreado;
- visualizador 3D preparado.

## Métricas
Sem backend, as métricas ficam somente no navegador atual. O painel pode mostrar cliques no WhatsApp, pedidos enviados, pedidos de hoje, valor total dos pedidos locais e visitantes identificados no navegador.

No backend Python, esses dados deverão ser salvos em banco para serem globais e acessíveis pela dona de qualquer dispositivo.

## Contas
A autenticação atual é apenas um protótipo local. Senhas não devem permanecer no navegador em produção. Ao conectar o Python, usar hash de senha e sessão no servidor.
