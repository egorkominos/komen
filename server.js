const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;
// Middleware для обработки POST-запросов
app.use(express.urlencoded({ extended: true }));
// Middleware для работы с сессиями
app.use(session({
    secret: 'secret-key', // Замените на секретный ключ
    resave: false,
    saveUninitialized: true,
}));
// Простейший "база данных" для хранения пользователей
const users = {};
// Главная страница
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Главная страница</title>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
            <style>
                body {
                    background-color: black;
                    color: white;
                    font-family: 'Roboto', sans-serif;
                    text-align: center;
                    padding: 50px;
                }
                a {
                    color: #00ffcc;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <h1>Добро пожаловать на главную страницу!</h1>
            ${req.session.username ? 
                `<p>Вы вошли как ${req.session.username}</p>
                <a href="/logout">Выйти</a>` : 
                `<a href="/register">Зарегистрироваться</a> | <a href="/login">Войти</a>`}
        </body>
        </html>
    `);
});
// Страница регистрации
app.get('/register', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Регистрация</title>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
            <style>
                body {
                    background-color: black;
                    color: white;
                    font-family: 'Roboto', sans-serif;
                    text-align: center;
                    padding: 50px;
                }
                input {
                    margin: 10px;
                    padding: 10px;
                    font-size: 16px;
                }
                button {
                    padding: 10px 20px;
                    font-size: 16px;
                    background-color: #00ffcc;
                    border: none;
                    color: black;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #009999;
                }
                a {
                    color: #00ffcc;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <h1>Регистрация</h1>
            <form action="/register" method="POST">
                <input type="text" name="username" placeholder="Имя пользователя" required>
                <input type="password" name="password" placeholder="Пароль" required>
                <button type="submit">Зарегистрироваться</button>
            </form>
            ${req.session.error ? `<p style="color: red;">${req.session.error}</p>` : ''}
        </body>
        </html>
    `);
});
// Обработка формы регистрации
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    // Проверка, существует ли уже пользователь
    if (users[username]) {
        req.session.error = 'Пользователь с таким именем уже существует';
        return res.redirect('/register');
    }
    // Сохранение нового пользователя
    users[username] = password;
    req.session.username = username; // Сохраняем имя пользователя в сессии
    req.session.error = null; // Сбрасываем ошибку
    res.redirect('/'); // Перенаправляем на главную страницу
});
// Страница входа
app.get('/login', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Вход</title>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
            <style>
                body {
                    background-color: black;
                    color: white;
                    font-family: 'Roboto', sans-serif;
                    text-align: center;
                    padding: 50px;
                }
                input {
                    margin: 10px;
                    padding: 10px;
                    font-size: 16px;
                }
                button {
                    padding: 10px 20px;
                    font-size: 16px;
                    background-color: #00ffcc;
                    border: none;
                    color: black;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #009999;
                }
                a {
                    color: #00ffcc;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <h1>Вход</h1>
            <form action="/login" method="POST">
                <input type="text" name="username" placeholder="Имя пользователя" required>
                <input type="password" name="password" placeholder="Пароль" required>
                <button type="submit">Войти</button>
            </form>
            ${req.session.loginError ? `<p style="color: red;">${req.session.loginError}</p>` : ''}
        </body>
        </html>
    `);
});
// Обработка формы входа
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Проверка, существует ли пользователь и совпадает ли пароль
    if (users[username] && users[username] === password) {
        req.session.username = username; // Сохраняем имя пользователя в сессии
        req.session.loginError = null; // Сбрасываем ошибку
        return res.redirect('/'); // Перенаправляем на главную страницу
    }
    req.session.loginError = 'Неверное имя пользователя или пароль';
    res.redirect('/login'); // Перенаправляем на страницу входа
});
// Обработка выхода
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/'); // Если ошибка, перенаправляем на главную
        }
        res.redirect('/'); // Перенаправляем на главную страницу
    });
});
// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
