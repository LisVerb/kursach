window.addEventListener('DOMContentLoaded', () => {
  // Единожды забираем методы auth
  const { login, register, logout, getCurrent, getUsers, saveUsers } = window.auth;

  // Элементы DOM
  const loginForm    = document.getElementById('login-form');
  const regForm      = document.getElementById('register-form');
  const authForms    = document.getElementById('auth-forms');
  const profileView  = document.getElementById('profile-view');
  const switchToReg  = document.getElementById('switch-to-register');
  const switchToLog  = document.getElementById('switch-to-login');
  const logoutBtn    = document.getElementById('logout-btn');
  const userNameEl   = document.getElementById('user-name');
  const bookingsList = document.getElementById('bookings-list');

  // Проверка наличия нужных элементов
  if (!switchToReg || !switchToLog) {
    console.error('Не найдены элементы переключения форм. Проверьте ID в HTML.');
    return;
  }

  // Переключение формы входа → регистрация
  switchToReg.addEventListener('click', e => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    regForm.classList.remove('hidden');
  });

  // Переключение регистрация → вход
  switchToLog.addEventListener('click', e => {
    e.preventDefault();
    regForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  });

  // Вход
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pw    = document.getElementById('login-password').value;
    if (login(email, pw)) renderProfile();
    else alert('Неверные данные');
  });

  // Регистрация
  regForm.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pw    = document.getElementById('reg-password').value;
    if (register(name, email, pw)) renderProfile();
    else alert('Пользователь уже существует');
  });

  // Выход
  logoutBtn.addEventListener('click', () => {
    logout();
    location.reload();
  });

function renderProfile() {
  const email = getCurrent();
  const user  = getUsers()[email];

  authForms.classList.add('hidden');
  profileView.classList.remove('hidden');
  userNameEl.textContent = user.name;

  const container = document.getElementById('bookings-table');
  if (!user.bookings.length) {
    container.innerHTML = '<p>У вас нет броней</p>';
    return;
  }

  let html = `
    <table>
      <thead>
        <tr>
          <th>№</th>
          <th>Тип номера</th>
          <th>Кол-во ночей</th>
          <th>Заезд</th>
          <th>Выезд</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
  `;

  user.bookings.forEach((b, i) => {
    html += `
      <tr>
        <td>${i + 1}</td>
        <td>${b.type}</td>
        <td>${b.nights}</td>
        <td>${b.arrive}</td>
        <td>${b.leave}</td>
        <td>
          <button class="cancel-btn" data-index="${i}">Отменить</button>
        </td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  container.innerHTML = html;
  container.querySelectorAll('button.cancel-btn').forEach(btn => {
    btn.addEventListener('click', () => cancel(+btn.dataset.index));
  });
}



  // Отмена брони
  window.cancel = i => {
    const email = getCurrent();
    const users = getUsers();
    users[email].bookings.splice(i, 1);
    saveUsers(users);
    renderProfile();
  };

  // При загрузке: если уже залогинен — сразу показываем профиль
  if (getCurrent()) {
    renderProfile();
  }
});