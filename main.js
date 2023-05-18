//Объявление переменных - Строковых констант
const STATUS_IN_LIMIT = 'все хорошо';
const STATUS_OUT_OF_LIMIT = 'все плохо';
const CHANGE_LIMIT_TEXT = 'Новый лимит';

// Объявление переменных - ссылок на html элементы
const inputNode = document.getElementById('expenseInput');
const categorySelectNode = document.getElementById('categorySelect');
const addButtonNode = document.getElementById('addButton');
const clearButtonNode = document.getElementById('clearButton');
const totalValueNode = document.getElementById('totalValue');
const statusNode = document.getElementById('statusText');
const historyList = document.getElementById('historyList');
const changeLimitBtn = document.getElementById('changeLimitBtn');

// Получает лимит из элемента html с id LimitValue
const limitNode = document.getElementById('limitValue');
let limit = parseInt(limitNode.innerText);

function initLimit() {
  const limitFromStorage = parseInt(localStorage.getItem('limit'));
  if (!limitFromStorage) {
    return;
  }
  limitNode.innerText = limitFromStorage;
}

initLimit();

//Объявление нашей основной переменной
//При запуске она содержит в себе пустой массив
let expenses = [];

//---Функции------------------------------------------

// подсчитывает и возвращает сумму всех трат
function getTotal() {
  let sum = 0;
  expenses.forEach(function (expense) {
    //пробегает по массиву объектов expense, берет из каждого поле amount
    // и прибавляет к переменной sum
    sum += expense.amount;
  });

  return sum;
}
//Мы содали переменную getTotal, которая по сути функция. функцию выше через function уже не пишут (там несколько другое, почитать контекст в js)

// Отрисовывает/обновляет блок с "Всего", "Лимит", "Статус"
function renderStatus() {
  //Создаем переменную total (всего) и записывыаем в нее результат выполнения getTotal
  const total = getTotal(expenses);
  totalValueNode.innerHTML = total;

  // условие сравнения - что больше - "всего" или "лимит"
  if (total <= limit) {
    //всего меньше чем лимит = все хорошо
    statusNode.innerText = STATUS_IN_LIMIT;
    statusNode.className = 'stats__statusText_positive';
  } else {
    //всего больше чем лимит - все плохо

    //шаблонная строка - строка в которую можно вставить переменные
    //тут вставлена переменная STATUS_OUT_OF_LIMIT
    //и будет вставлено значение разницы между лимитом и общей суммой расходов
    statusNode.innerText = `${STATUS_OUT_OF_LIMIT} (${limit - total} руб)`;
    statusNode.className = 'stats__statusText_negative';
  }
}

//Отрисовывает/обновляет блок
function renderHistory() {
  historyList.innerHTML = '';
  //cокращенная запись
  //expenses.forEach((expense) => {

  //цикл по массиву expenses, где каждый элемент - запись о расходе (сумма и категория)
  expenses.forEach(function (expense) {
    //создание элемента li(он пока создан только в памяти)
    const historyItem = document.createElement('li');

    //через свойство className также можно прописывать классы
    historyItem.className = 'rub';

    //снова создаем шаблонную строку
    //формата "категория" - "сумма" (а не наоборот, чтобы не усложнять html)
    historyItem.innerText = `${expense.category} - ${expense.amount}`;

    //берем наш li из памяти и вставляем в документ, в конец historyList
    historyList.appendChild(historyItem);
  });
}

//Отрисовывает/обновляет весь интерфейс (в нашем случае - историю, всего, статус)
function render() {
  //вызываем функцию обновления статуса и "всего"
  renderStatus();

  // вызываем функцию обновления истории
  renderHistory();
}

//Возвращает введенную пользователем сумму, превращает ее в число
function getExpenseFromUser() {
  return parseInt(inputNode.value);
}

//Возвращает выбранную пользователем категорию
function getSelectedCategory() {
  return categorySelectNode.value;
}

//функция очистки поля ввода суммы
//на вход получает переменную input , в которой мы ожидаем html элемент input

//альтернативы
/*function clearInput(input) {
  input.value = "";
}*/

const clearInput = function (input) {
  inputNode.value = '';
};

/*
const clearInput = (input) => {
  input.value = "";
}
*/

//функция-обработчик, которая будет вызвана при нажатии на кнопку Добавить
function addButtonHandler() {
  //cохраняем в переменную curretnAmount (текущаяСумма) введенную сумму
  const currentAmount = getExpenseFromUser();
  if (!currentAmount) {
    return;
  }

  // сохраняем в переменную currettCategoty (текущаяКатегория) выбранную категорию
  const currentCategory = getSelectedCategory();
  //если текущая категория равна значению Категория
  if (currentCategory === 'Категория') {
    //тогда выйди из функции, тк это значение говорит нам о том
    //что пользователь не выбрал категорию
    alert('Не задана категория');
    return;
  }

  //из полученных переменных собираем объект newExpense (новыйРасход)
  //который состоит из двух полей - amount, в которое записано значение currentAmount
  //и category, в которое записано значение currentCategory
  const newExpense = { amount: currentAmount, category: currentCategory };
  console.log(newExpense);

  //добавляем наш новыйРасход в массив расходов
  expenses.push(newExpense);

  //  console.log(expenses);

  //перерисовываем интерфейс
  render();

  //сбрасываем введенную сумму
  clearInput(inputNode);
}

//функция-обработчик кнопки Сбросить расходы
function clearButtonHandler() {
  expenses = [];
  render();
}

//фунукция-обработчик (хендлер) кнопки изменения лимита
function changelimitHandler() {
  // в переменную newLimit мы записываем результат выполения функции prompt
  //в которой передаем параметр "Новый лимит"
  //prompt вызывает встроенную в браузер модалку с инпутом
  //а возвращает то что ввел в инпут пользователь
  const newLimit = prompt(CHANGE_LIMIT_TEXT);

  //потому что там может быть строка
  const newLimitValue = parseInt(newLimit);

  if (!newLimitValue) {
    return;
  }

  //прописываем в html новое значение лимита
  limitNode.innerText = newLimitValue;
  // а также прописываем это значение в нашу переменную с лимитом
  limit = newLimitValue;
  localStorage.setItem('limit', newLimitValue);

  //обновляем интерфейс
  render();
}

//Привязка функций-обработчиков к кнопкам
addButtonNode.addEventListener('click', addButtonHandler);
clearButtonNode.addEventListener('click', clearButtonHandler);
changeLimitBtn.addEventListener('click', changelimitHandler);
