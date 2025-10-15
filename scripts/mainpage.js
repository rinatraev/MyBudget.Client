console.log("Скрипт подключен и работает! mainpage.js");
//collections, variables, links and flags
let currentPage = 1;
let totalPages = 1;

const firstHeader = document.getElementById("firstHeader");
const paginationControlBox = document.getElementById("paginationControls");
//filter controls
const dateToInput = document.getElementById("dateTo");
const dateFromInput = document.getElementById("dateFrom");
const type = document.getElementById("typeSelect");
const dateFrom = document.getElementById("dateFrom");
const dateTo = document.getElementById("dateTo");

document.addEventListener("DOMContentLoaded", () => {
  if (needAuthorization()) window.location.href = "login.html";
  firstHeader.innerText += ` ${localStorage.getItem("username") ?? ""}`;
  loadAndSetUsersCategories();
});

document.querySelector("#transactionsTable").addEventListener("contextmenu", async (e) => {
  e.preventDefault();
  
  const row = e.target.closest("tr");
  if (!row) return;

  const id = row.dataset.id; 
  if (confirm("Удалить транзакцию?")) {
    try {
      await deleteTransaction(id);
      row.remove(); // убираем строку из таблицы
      alert("Транзакция удалена");
    } catch (err) {
      alert(err.message);
    }
  }
});

function getQueryString(page) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("type", getType());

  const from = getDateFromInUnix();
  const to = getDateToInUnix();
  const cats = getArrayChoosenCategories();

  if (from !== null) params.append("dateFrom", from);
  if (to !== null) params.append("dateTo", to);
  if (cats.length > 0) {
    cats.forEach(c => params.append("choosenCategories", c));
  }

  return params.toString();
}

async function loadTransactions(page = 1) {
  try {
    let data;
    if(isDefaultValuesChanged()){
      data = await getTransactionsWithQuery(page)
    } else data = await getTransactions(page);
    currentPage = data.currentPage;
    totalPages = data.totalPages;

    renderTransactions(data.items);
    renderPagination(currentPage, totalPages);

    if (data.earliestDateUtc) {
      const minDate = new Date(data.earliestDateUtc).toISOString().split("T")[0];
      dateToInput.min = minDate;
      dateFromInput.min = minDate;
    }
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
    row.dataset.id = tr.id;
    cell.colSpan = 5;
    cell.textContent = "Нет данных";
    cell.classList.add("center");
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  const formatter = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: true});

  transactions.forEach(t => {
    const row = document.createElement("tr");
    row.dataset.id = t.id;
    const typeCell = document.createElement("td");
    typeCell.textContent = t.type === 1 ? "Доход" : "Расход";
    typeCell.classList.add("center");

    const categoryCell = document.createElement("td");
    categoryCell.textContent = t.categoryName;
    categoryCell.classList.add("center");

    const dateCell = document.createElement("td");
    dateCell.textContent = new Date(t.createdAtUtc).toLocaleDateString("ru-RU");
    dateCell.classList.add("right"); 

    const amountCell = document.createElement("td");
    amountCell.textContent = formatter.format(t.amount);
    amountCell.classList.add("right"); 

    const commentCell = document.createElement("td");
    commentCell.textContent = t.comment || "";
    commentCell.classList.add("center");

    row.append(typeCell, categoryCell, dateCell, amountCell, commentCell);
    tbody.appendChild(row);
  });
}

function renderPagination(currentPage, totalPages) {
  const pageInfo = document.getElementById("pageInfo");
  pageInfo.textContent = `Страница ${currentPage} из ${totalPages}`;
  document.getElementById("prevPage").disabled = currentPage <= 1;
  document.getElementById("nextPage").disabled = currentPage >= totalPages;
}

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) loadTransactions(currentPage - 1);
});

document.getElementById("nextPage").addEventListener("click", () => {
  if (currentPage < totalPages) loadTransactions(currentPage + 1);
});

async function loadAndSetUsersCategories(type = 0) {
  try {
    const categories = await getCategories("by-user");
    const fieldset = document.getElementById("categoriesFieldset");
    fieldset.querySelectorAll("label").forEach(el => el.remove());
    categories.forEach(cat => {
      if(cat.type == type.value){
        const label = document.createElement("label");
      const checkbox = document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.name = "categories";
      checkbox.value = cat.id;

      label.appendChild(checkbox);
      label.append(" " + cat.name);

      fieldset.appendChild(label);
      }
      const label = document.createElement("label");
      const checkbox = document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.name = "categories";
      checkbox.value = cat.id;

      label.appendChild(checkbox);
      label.append(" " + cat.name);

      fieldset.appendChild(label);
    });
  } catch (err) {
    console.error(err);
    alert("Не удалось загрузить категории: " + err.message);
  }
}

function exit() {
  if (confirm("Вы точно хотите выйти ?")) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    window.location.href = "index.html";
  }
}
function deleteProfile() {
  if (confirm("Вы точно хотите удалить свой аккаунт ?"))
    deleteUser();
}

function isDefaultValuesChanged(){
  let value = false;
  let checks = 0;
  if (getArrayChoosenCategories().length > 0)
  value = true;
  if (getDateFromInUnix() != null)
  value = true;
  if (getDateToInUnix() != null)
  value = true;
  if (getType() != 0)
  value = true;

  return value;
}
function navigateToCategoryList(){
  window.location.href = "categoryList.html";
}
function resetFilters() {
  dateFrom.value = "";
  dateFrom.value = "";

  document.getElementById("typeSelect").value = "0";

  document.querySelectorAll("#categoriesFieldset input[name='categories']")
    .forEach(cb => cb.checked = false);

  currentPage = 1;

  loadTransactions(1);
}
function getArrayChoosenCategories()
{
  // array[int]
  let choosenCategories = Array.from( document.querySelectorAll("#categoriesFieldset input[name='categories']:checked") )
  .map(cb => cb.value);
  return choosenCategories;
}
function getDateFromInUnix(){
  // long, null-if string empty "" 
  return value = dateFrom.value ? Math.floor(new Date(dateFrom.value).getTime() / 1000) : null;
}
function getDateToInUnix(){
   // long, null-if string empty "" 
  return value = dateTo.value ? Math.floor(new Date(dateTo.value).getTime() / 1000) : null;
}
function getType(){
  //int
  return type.value;
}
document.getElementById("buttonAddTransaction").addEventListener("click", ()=>
{
  window.location.href = "createTransaction.html";
})
