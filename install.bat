@echo off
echo Installing Backend Dependencies...
cd backend
python -m pip install -r requirements.txt
cd ..

echo.
echo Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

echo.
echo Installation Complete!
echo.
echo To start the application:
echo 1. Backend: cd backend && python app.py
echo 2. Frontend: cd frontend && npm start
echo.
pause
