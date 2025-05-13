window.addEventListener('DOMContentLoaded', () => {
  const { getCurrent, getUsers, saveUsers } = window.auth;
  const datesForm  = document.getElementById('dates-form');
  const payForm    = document.getElementById('payment-form');
  const roomSelect = document.getElementById('room-type');
  const totalInput = document.getElementById('total-price');
  const backBtn    = document.getElementById('back-btn');

  // Цены по типам
  const prices = { Garden:100, Ocean:200, Duplex:150 };

  // Заполняем селект
  Object.keys(prices).forEach(type => {
    const opt = document.createElement('option');
    opt.value = type;
    opt.textContent = `${type} (${prices[type]} BYN)`;
    roomSelect.append(opt);
  });

  // Если тип пришёл из query 
  const params = new URLSearchParams(location.search);
  if (params.has('type')) {
    roomSelect.value = params.get('type');
  }

  let bookingData = {};

  // Шаг 1: выбор дат
  datesForm.addEventListener('submit', e => {
    e.preventDefault();
    const arrive = document.getElementById('arrive-date').value;
    const leave  = document.getElementById('leave-date').value;

    // Валидация дат
    if (!arrive || !leave) {
      alert('Заполните обе даты.');
      return;
    }
    const dArr = new Date(arrive);
    const dLev = new Date(leave);
    if (dLev <= dArr) {
      alert('Дата выезда должна быть позже даты заезда.');
      return;
    }

    const nights = Math.round((dLev - dArr) / (1000*60*60*24));
    const type   = roomSelect.value;
    const price  = prices[type];
    const total  = nights * price;

    bookingData = { arrive, leave, type, nights, total };

    // Показываем сумму и переходим
    totalInput.value = `${total} BYN (${nights} ночи × ${price} BYN)`;
    datesForm.classList.add('hidden');
    payForm.classList.remove('hidden');
  });

  // Кнопка «Назад»
  backBtn.addEventListener('click', () => {
    payForm.classList.add('hidden');
    datesForm.classList.remove('hidden');
  });

  // Шаг 2: оплата и сохранение
  payForm.addEventListener('submit', e => {
    e.preventDefault();
    bookingData.card = document.getElementById('card-number').value.trim();
    bookingData.cvv  = document.getElementById('card-cvv').value.trim();
    bookingData.exp  = document.getElementById('card-expiry').value;

    if (!bookingData.card || !bookingData.cvv || !bookingData.exp) {
      alert('Заполните все поля оплаты.');
      return;
    }

    const email = getCurrent();
    if (!email) {
      alert('Войдите в аккаунт');
      return location.href = 'profile.html';
    }

    const users = getUsers();
    users[email].bookings.push(bookingData);
    saveUsers(users);

    alert('Бронь создана!');
    location.href = 'profile.html';
  });
});
