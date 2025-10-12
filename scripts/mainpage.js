console.log("Скрипт подключен и работает! mainpage.js");

const firstHeader = document.getElementById("firstHeader");
let currentPage = 1;
let totalPages = 1;

document.addEventListener("DOMContentLoaded", () => {
  if(needAuthorization()) window.location.href = "login.html";
  firstHeader.innerText += ` ${localStorage.getItem("username") ?? ""}`;
  loadTransactions();
});

function exit(){
    if (confirm("Вы точно хотите выйти ?" )){
        localStorage.removeItem("accessToken");
        localStorage.removeItem("username");
        window.location.href = "login.html";
    }
}

async function loadTransactions(page = 1) {
  try {
    const data = await getTransactions(page); // вызываем API
    renderTransactions(data.items);
    renderPagination(data.currentPage, data.totalPages);
  } catch (err) {
    console.error(err);
    alert("Не удалось загрузить транзакции: " + err.message);
  }
}

function renderTransactions(transactions) {
  const tbody = document.querySelector("#transactionsTable tbody");
  tbody.innerHTML = "";

  if (!transactions || transactions.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = "Нет данных";
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  transactions.forEach(t => {
    const row = document.createElement("tr");

    const typeCell = document.createElement("td");
    typeCell.textContent = t.type === 1 ? "Доход" : "Расход";

    const categoryCell = document.createElement("td");
    categoryCell.textContent = t.categoryName;

    const dateCell = document.createElement("td");
    dateCell.textContent = new Date(t.createdAtUtc).toLocaleDateString("ru-RU");

    const amountCell = document.createElement("td");
    amountCell.textContent = t.amount.toFixed(2);

    const commentCell = document.createElement("td");
    commentCell.textContent = t.comment || "";

    row.append(typeCell, categoryCell, dateCell, amountCell, commentCell);
    tbody.appendChild(row);
  });
}

function renderPagination() {
  const pageInfo = document.getElementById("pageInfo");
  pageInfo.textContent = `Страница ${currentPage} из ${totalPages}`;

  document.getElementById("prevPage").disabled = currentPage <= 1;
  document.getElementById("nextPage").disabled = currentPage >= totalPages;
}

// обработчики кнопок
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    loadTransactions(currentPage - 1);
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  if (currentPage < totalPages) {
    loadTransactions(currentPage + 1);
  }
});

// запуск при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  loadTransactions(1);
});