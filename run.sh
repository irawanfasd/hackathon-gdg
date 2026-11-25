#!/usr/bin/env bash
set -e
echo "=== From Poster to Portfolio ==="
if [ ! -d "node_modules" ]; then
  echo "Menginstall dependencies..."
  npm install
fi
echo "Menjalankan server development..."
npm run dev
