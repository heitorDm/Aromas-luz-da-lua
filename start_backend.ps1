
$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\backend"

if (!(Test-Path ".venv")) {
  python -m venv .venv
}

& ".\.venv\Scripts\python.exe" -m pip install -r requirements.txt

if (!$env:SECRET_KEY) { $env:SECRET_KEY = "troque-esta-chave" }
if (!$env:ADMIN_NAME) { $env:ADMIN_NAME = "Responsavel Luz da Lua" }
if (!$env:ADMIN_EMAIL) { $env:ADMIN_EMAIL = "admin@exemplo.com" }
if (!$env:ADMIN_PASSWORD) { $env:ADMIN_PASSWORD = "troque-esta-senha" }

& ".\.venv\Scripts\python.exe" app.py
