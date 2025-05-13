// Работа с localStorage для сохранения пользователей и текущей сессии
function getUsers() { return JSON.parse(localStorage.getItem('users') || '{}'); }
function saveUsers(u) { localStorage.setItem('users', JSON.stringify(u)); }
function setCurrent(email) { localStorage.setItem('current', email); }
function getCurrent() { return localStorage.getItem('current'); }
function logout() { localStorage.removeItem('current'); }

// Регистрация
function register(name, email, pw) {
    const u = getUsers();
    if (u[email]) return false;
    u[email] = { name, password: pw, bookings: [] };
    saveUsers(u);
    setCurrent(email);
    return true;
}

// Вход
function login(email, pw) {
    const u = getUsers();
    if (u[email]?.password === pw) { setCurrent(email); return true; }
    return false;
}

// Экспорт (для модулей, либо подключить в глобал)
window.auth = { register, login, logout, getCurrent, getUsers, saveUsers };