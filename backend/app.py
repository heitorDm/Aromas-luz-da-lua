
import os
import sqlite3
from datetime import datetime
from functools import wraps
from urllib.parse import quote

from flask import Flask, jsonify, request, session, send_from_directory, g
from werkzeug.security import generate_password_hash, check_password_hash

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "luz_da_lua.db")
FRONTEND_DIR = BASE_DIR

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-change-this")

WHATSAPP_NUMBER = "5527999512072"

PRODUCTS = [
    {"id":"vela-80","name":"Vela Clássica 80 g","category":"velas","label":"VELA AROMÁTICA","price":30.0,"image":"assets/vela-80g.png","aroma":"Lavanda"},
    {"id":"vela-140","name":"Vela Clássica 140 g","category":"velas","label":"VELA AROMÁTICA","price":50.0,"image":"assets/vela-140g.png","aroma":"Florença"},
    {"id":"decor-180","name":"Vela Decor 180 g","category":"velas","label":"VELA AROMÁTICA","price":55.0,"image":"assets/vela-decor.png","aroma":"Macadâmia"},
    {"id":"home-250","name":"Home Spray 250 ml","category":"aromatizadores","label":"AROMATIZADOR","price":50.0,"image":"assets/home-spray.png","aroma":"Lavanda"},
    {"id":"gold-difusor","name":"Difusor 250 ml","category":"gold","label":"LINHA GOLD","price":65.0,"image":"assets/gold-difusor.png","aroma":"Equilíbrio"},
    {"id":"gold-spray","name":"Home Spray 250 ml","category":"gold","label":"LINHA GOLD","price":60.0,"image":"assets/gold-spray.png","aroma":"Conecta"},
    {"id":"gold-sabonete","name":"Sabonete Líquido Perolizado 250 ml","category":"gold","label":"LINHA GOLD","price":55.0,"image":"assets/gold-sabonete.png","aroma":"Equilíbrio"},
    {"id":"gold-kit","name":"Kit Linha Gold","category":"gold","label":"KIT","price":120.0,"image":"assets/gold-kit.png","aroma":"Equilíbrio"},
    {"id":"refil-250","name":"Refil de Difusor 250 ml","category":"refis","label":"REFIL","price":50.0,"image":"assets/refil-250.png","aroma":"Equilíbrio"},
    {"id":"refil-500","name":"Refil 500 ml para Difusor","category":"refis","label":"REFIL","price":90.0,"image":"assets/refil-500.png","aroma":"Equilíbrio"},
]

AROMAS = [
    {"name":"Florença","type":"Aroma","description":"Cítrico floral."},
    {"name":"Lavanda","type":"Aroma","description":"Aroma listado no catálogo."},
    {"name":"Flor de Cerejeira","type":"Aroma","description":"Aroma listado no catálogo."},
    {"name":"Vanilla","type":"Aroma","description":"Aroma listado no catálogo."},
    {"name":"Alecrim","type":"Aroma","description":"Aroma listado no catálogo."},
    {"name":"Macadâmia","type":"Aroma","description":"Aroma listado no catálogo."},
    {"name":"Equilíbrio","type":"Criação Luz da Lua","description":"Lavanda + Bamboo."},
    {"name":"Conecta","type":"Criação Luz da Lua","description":"Lavanda + Mirraj."},
    {"name":"Harmonia","type":"Criação Luz da Lua","description":"Vanilla + Limão."},
]


def db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(exception=None):
    conn = g.pop("db", None)
    if conn is not None:
        conn.close()


def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.executescript("""
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'customer',
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS carts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id TEXT NOT NULL,
        aroma TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE(user_id, product_id, aroma),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        public_id TEXT NOT NULL UNIQUE,
        user_id INTEGER,
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        cep TEXT NOT NULL,
        city TEXT NOT NULL,
        address TEXT NOT NULL,
        payment TEXT NOT NULL,
        total REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'Enviado ao WhatsApp',
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        aroma TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        event_type TEXT NOT NULL,
        page TEXT,
        context TEXT,
        payload TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
    );
    """)
    conn.commit()
    conn.close()


def current_user():
    user_id = session.get("user_id")
    if not user_id:
        return None
    row = db().execute(
        "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
        (user_id,)
    ).fetchone()
    return dict(row) if row else None


def login_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not current_user():
            return jsonify({"error":"authentication_required"}), 401
        return fn(*args, **kwargs)
    return wrapper


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user = current_user()
        if not user:
            return jsonify({"error":"authentication_required"}), 401
        if user["role"] != "admin":
            return jsonify({"error":"admin_required"}), 403
        return fn(*args, **kwargs)
    return wrapper


def now():
    return datetime.utcnow().isoformat(timespec="seconds") + "Z"


def money(v):
    return round(float(v), 2)


def get_product(product_id):
    return next((p for p in PRODUCTS if p["id"] == product_id), None)


def order_whatsapp_message(order, items):
    lines = []
    for item in items:
        subtotal = money(item["quantity"] * item["unit_price"])
        lines.append(
            f"• {item['product_name']}\n"
            f"  Aroma: {item['aroma']}\n"
            f"  Qtd: {item['quantity']}\n"
            f"  R$ {subtotal:.2f}".replace(".", ",")
        )
    payment_names = {
        "pix":"Pix",
        "card":"Cartão de crédito",
        "cash":"Dinheiro"
    }
    payment = payment_names.get(order["payment"], order["payment"])
    total = f"R$ {order['total']:.2f}".replace(".", ",")

    return (
        "Olá! Quero fazer um pedido na Luz da Lua Aromas 🌙\n\n"
        "🛍️ PRODUTOS\n" + "\n\n".join(lines) + "\n\n"
        "────────────────\n"
        f"💰 TOTAL: {total}\n\n"
        "📍 ENTREGA\n"
        f"Nome: {order['customer_name']}\n"
        f"Telefone: {order['phone']}\n"
        f"E-mail: {order['email']}\n"
        f"Cidade: {order['city']}\n"
        f"CEP: {order['cep']}\n"
        f"Endereço: {order['address']}\n\n"
        "💳 PAGAMENTO\n"
        f"{payment}\n\n"
        f"Pedido: {order['public_id']}"
    )


@app.get("/")
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.get("/api/health")
def health():
    return jsonify({"ok":True,"service":"Luz da Lua API"})


@app.get("/api/products")
def api_products():
    category = request.args.get("category")
    products = PRODUCTS if not category or category == "todos" else [
        p for p in PRODUCTS if p["category"] == category
    ]
    return jsonify(products)


@app.get("/api/aromas")
def api_aromas():
    return jsonify(AROMAS)


@app.post("/api/auth/register")
def register():
    data = request.get_json(force=True)
    name = str(data.get("name","")).strip()
    email = str(data.get("email","")).strip().lower()
    password = str(data.get("password",""))

    if not name or not email or len(password) < 6:
        return jsonify({"error":"Dados inválidos. Senha mínima de 6 caracteres."}), 400

    try:
        cur = db().execute(
            "INSERT INTO users(name,email,password_hash,role,created_at) VALUES(?,?,?,?,?)",
            (name,email,generate_password_hash(password),"customer",now())
        )
        db().commit()
        session["user_id"] = cur.lastrowid
        return jsonify({"user":current_user()}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error":"E-mail já cadastrado."}), 409


@app.post("/api/auth/login")
def login():
    data = request.get_json(force=True)
    email = str(data.get("email","")).strip().lower()
    password = str(data.get("password",""))
    row = db().execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()

    if not row or not check_password_hash(row["password_hash"], password):
        return jsonify({"error":"E-mail ou senha inválidos."}), 401

    session["user_id"] = row["id"]
    return jsonify({"user":current_user()})


@app.post("/api/auth/logout")
def logout():
    session.clear()
    return jsonify({"ok":True})


@app.get("/api/auth/me")
def me():
    user = current_user()
    return jsonify({"user":user})


@app.get("/api/cart")
@login_required
def get_cart_api():
    user = current_user()
    rows = db().execute(
        "SELECT product_id, aroma, quantity FROM carts WHERE user_id = ? ORDER BY id",
        (user["id"],)
    ).fetchall()
    result = []
    for row in rows:
        p = get_product(row["product_id"])
        if p:
            item = dict(p)
            item["quantity"] = row["quantity"]
            item["aroma"] = row["aroma"]
            result.append(item)
    return jsonify(result)


@app.put("/api/cart")
@login_required
def replace_cart():
    user = current_user()
    items = request.get_json(force=True)
    if not isinstance(items, list):
        return jsonify({"error":"cart_must_be_list"}), 400

    conn = db()
    conn.execute("DELETE FROM carts WHERE user_id = ?", (user["id"],))
    for item in items:
        product_id = item.get("id")
        product = get_product(product_id)
        if not product:
            continue
        qty = max(1, int(item.get("quantity", 1)))
        aroma = str(item.get("aroma") or product.get("aroma") or "Florença")
        conn.execute(
            "INSERT INTO carts(user_id,product_id,aroma,quantity,updated_at) VALUES(?,?,?,?,?)",
            (user["id"], product_id, aroma, qty, now())
        )
    conn.commit()
    return get_cart_api()


@app.post("/api/events")
def event():
    data = request.get_json(force=True)
    typ = str(data.get("type","")).strip()
    if not typ:
        return jsonify({"error":"event_type_required"}), 400

    user = current_user()
    db().execute(
        "INSERT INTO events(user_id,event_type,page,context,payload,created_at) VALUES(?,?,?,?,?,?)",
        (
            user["id"] if user else None,
            typ,
            data.get("page"),
            data.get("context"),
            str(data.get("payload"))[:2000],
            now(),
        )
    )
    db().commit()
    return jsonify({"ok":True}), 201


@app.post("/api/orders")
def create_order():
    data = request.get_json(force=True)
    items = data.get("items") or []
    customer = data.get("customer") or {}
    address = data.get("address") or {}
    payment = str(data.get("payment","")).strip()

    if not items:
        return jsonify({"error":"cart_empty"}), 400

    normalized = []
    total = 0.0
    for raw in items:
        p = get_product(raw.get("id"))
        if not p:
            continue
        qty = max(1, int(raw.get("quantity",1)))
        aroma = str(raw.get("aroma") or p.get("aroma") or "Florença")
        subtotal = money(p["price"] * qty)
        total += subtotal
        normalized.append({
            "product_id":p["id"],
            "product_name":p["name"],
            "aroma":aroma,
            "quantity":qty,
            "unit_price":p["price"]
        })

    if not normalized:
        return jsonify({"error":"no_valid_items"}), 400

    public_id = "LL-" + datetime.utcnow().strftime("%Y%m%d%H%M%S")
    user = current_user()

    conn = db()
    cur = conn.execute(
        """INSERT INTO orders(
            public_id,user_id,customer_name,phone,email,cep,city,address,payment,total,status,created_at
        ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)""",
        (
            public_id,
            user["id"] if user else None,
            str(customer.get("name","")).strip(),
            str(customer.get("phone","")).strip(),
            str(customer.get("email","")).strip(),
            str(address.get("cep","")).strip(),
            str(address.get("city","")).strip(),
            str(address.get("address","")).strip(),
            payment,
            money(total),
            "Enviado ao WhatsApp",
            now(),
        )
    )
    order_db_id = cur.lastrowid

    for item in normalized:
        conn.execute(
            """INSERT INTO order_items(
                order_id,product_id,product_name,aroma,quantity,unit_price
            ) VALUES(?,?,?,?,?,?)""",
            (
                order_db_id,item["product_id"],item["product_name"],
                item["aroma"],item["quantity"],item["unit_price"]
            )
        )

    if user:
        conn.execute("DELETE FROM carts WHERE user_id = ?", (user["id"],))

    conn.execute(
        "INSERT INTO events(user_id,event_type,context,payload,created_at) VALUES(?,?,?,?,?)",
        (user["id"] if user else None,"whatsapp_order_created","checkout",public_id,now())
    )
    conn.commit()

    order = {
        "public_id":public_id,
        "customer_name":customer.get("name",""),
        "phone":customer.get("phone",""),
        "email":customer.get("email",""),
        "cep":address.get("cep",""),
        "city":address.get("city",""),
        "address":address.get("address",""),
        "payment":payment,
        "total":money(total),
        "status":"Enviado ao WhatsApp",
    }

    message = order_whatsapp_message(order, normalized)
    url = f"https://wa.me/{WHATSAPP_NUMBER}?text={quote(message)}"

    return jsonify({
        "order":order,
        "items":normalized,
        "whatsapp_url":url
    }), 201


@app.get("/api/orders")
@login_required
def orders():
    user = current_user()
    rows = db().execute(
        "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC",
        (user["id"],)
    ).fetchall()
    return jsonify([dict(r) for r in rows])


@app.get("/api/orders/<public_id>")
def order_detail(public_id):
    row = db().execute("SELECT * FROM orders WHERE public_id = ?", (public_id,)).fetchone()
    if not row:
        return jsonify({"error":"not_found"}), 404
    order = dict(row)
    items = db().execute(
        "SELECT product_id,product_name,aroma,quantity,unit_price FROM order_items WHERE order_id=?",
        (row["id"],)
    ).fetchall()
    order["items"] = [dict(r) for r in items]
    return jsonify(order)


@app.get("/api/admin/metrics")
@admin_required
def admin_metrics():
    conn = db()
    wa_clicks = conn.execute(
        "SELECT COUNT(*) FROM events WHERE event_type='whatsapp_click'"
    ).fetchone()[0]
    wa_orders = conn.execute(
        "SELECT COUNT(*) FROM events WHERE event_type='whatsapp_order_created'"
    ).fetchone()[0]
    total_orders = conn.execute("SELECT COUNT(*) FROM orders").fetchone()[0]
    revenue = conn.execute("SELECT COALESCE(SUM(total),0) FROM orders").fetchone()[0]
    today = datetime.utcnow().date().isoformat()
    today_orders = conn.execute(
        "SELECT COUNT(*) FROM orders WHERE substr(created_at,1,10)=?",
        (today,)
    ).fetchone()[0]
    return jsonify({
        "whatsapp_clicks":wa_clicks,
        "whatsapp_orders":wa_orders,
        "total_orders":total_orders,
        "today_orders":today_orders,
        "revenue":money(revenue),
    })


@app.get("/api/admin/orders")
@admin_required
def admin_orders():
    rows = db().execute(
        """SELECT o.*, u.name AS account_name
           FROM orders o LEFT JOIN users u ON u.id=o.user_id
           ORDER BY o.id DESC"""
    ).fetchall()

    result = []
    for r in rows:
        item = dict(r)
        item["items"] = [dict(x) for x in db().execute(
            "SELECT product_name, aroma, quantity, unit_price FROM order_items WHERE order_id=?",
            (r["id"],)
        ).fetchall()]
        result.append(item)
    return jsonify(result)


@app.patch("/api/admin/orders/<public_id>")
@admin_required
def admin_order_status(public_id):
    data = request.get_json(force=True)
    status = str(data.get("status","")).strip()
    allowed = {"Enviado ao WhatsApp","Confirmado","Em preparo","Concluído","Cancelado"}
    if status not in allowed:
        return jsonify({"error":"invalid_status"}), 400
    cur = db().execute(
        "UPDATE orders SET status=? WHERE public_id=?",
        (status,public_id)
    )
    db().commit()
    if cur.rowcount == 0:
        return jsonify({"error":"not_found"}), 404
    return jsonify({"ok":True})


def ensure_admin_from_env():
    email = os.environ.get("velasluzdalua@outlook.com")
    password = os.environ.get("heitor04")
    name = os.environ.get("LuanaDalcamini", "Luz da Lua Admin")
    if not email or not password:
        return

    conn = sqlite3.connect(DB_PATH)
    existing = conn.execute("SELECT id FROM users WHERE email=?", (email.lower(),)).fetchone()
    if existing:
        conn.close()
        return
    conn.execute(
        "INSERT INTO users(name,email,password_hash,role,created_at) VALUES(?,?,?,?,?)",
        (name,email.lower(),generate_password_hash(password),"admin",now())
    )
    conn.commit()
    conn.close()


init_db()
ensure_admin_from_env()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT","5000")), debug=True)
