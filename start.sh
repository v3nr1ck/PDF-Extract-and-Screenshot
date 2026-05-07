#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo ""
echo "  >>> 🐶 PDF Extract & Screenshot — Starting up!"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    if command -v python &> /dev/null; then
        PYTHON=python
    else
        echo "  ❌ Python not found! Install Python 3.10+ from https://www.python.org/downloads/"
        exit 1
    fi
else
    PYTHON=python3
fi

echo "  ✅ Python found: $($PYTHON --version)"

# Virtual env
if [ ! -d ".venv" ]; then
    echo "  📦 Creating virtual environment..."
    $PYTHON -m venv .venv
fi

echo "  📥 Installing dependencies (one-time)..."
source .venv/bin/activate
$PYTHON -m pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

echo "  ✅ All set! Launching app..."
echo ""
echo "  🌐 Open your browser to: http://127.0.0.1:8080"
echo "  Press Ctrl+C to stop the server."
echo ""

$PYTHON app.py
