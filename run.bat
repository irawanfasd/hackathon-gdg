@echo off
echo === From Poster to Portfolio ===
if not exist node_modules (
  echo Menginstall dependencies...
  call npm install
)
echo Menjalankan server development...
call npm run dev
pause
