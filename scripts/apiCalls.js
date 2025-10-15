console.log("Скрипт подключен и работает! apiCalls.js");

const baseUrl = "http://localhost:5041/api";
const token = localStorage.getItem("accessToken");

function needAuthorization() {
  const token = localStorage.getItem("accessToken");
  return !token;
}

async function login(username, password) {
  try {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Ошибка ${res.status}: ${errorText}`);
    }
    const token = await res.text();
    localStorage.setItem("accessToken", token);
    localStorage.setItem("username", username);
    window.location.href = "main.html";
  } catch (err) {
    console.error("Ошибка при логине:", err);
    throw err;
  }
}

async function register(username, password) {
  try {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      throw new Error("Ошибка регистрации: " + res.status);
    }

    alert("Регистрация прошла успешно. Теперь войдите.");
    showLoginBox();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//метод для транзакций
async function getTransactions(page = 1) {
  const res = await fetch(`${baseUrl}/transactions?page=${page}`, {
  headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ошибка ${res.status}: ${text}`);
  }
  return await res.json();
}
async function getTransactionsWithQuery(page = 1) {
  const query = getQueryString(page);
  const res = await fetch(`${baseUrl}/transactions/filtered?${query}`, {
  headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ошибка ${res.status}: ${text}`);
  }
  return await res.json();
}
//CreateTransaction
async function postTrans(){
if(!formIsValid()){
  alert("Форма не валидна");
  return;
}
const dto = buildTransDto();
const res = await fetch(`${baseUrl}/transactions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dto)
  });

  if (res.ok) {
    // res.ok === true если статус 200–299
    alert("Транзакция успешно добавлена!");
  } else {
    const text = await res.text();
    alert(`Ошибка ${res.status}: ${text}`);
  }
}
//delet transaction
async function deleteTransaction(id) {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${baseUrl}/transactions/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ошибка ${res.status}: ${text}`);
  }

  return true; // успех
}
async function getCategories(route = "") {
  const url = route === "by-user" ? `${baseUrl}/categories/by-user` : `${baseUrl}/categories`;
  const res = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ошибка ${res.status}: ${text}`);
  }

  return await res.json();
}
async function updateCategoryApi(dto) {
  const res = await fetch(`${baseUrl}/categories/${dto.id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dto)
  });
  if (!res.ok) throw new Error(await res.text());
}

async function deleteCategoryApi(id) {
  const res = await fetch(`${baseUrl}/categories/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(await res.text());
}
async function createCategoryApi(dto) {
  const res = await fetch(`${baseUrl}/categories`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dto)
  });
  if (!res.ok) throw new Error(await res.text());
}
async function deleteUser() {
  try {
    const res = await fetch(`${baseUrl}/auth/delete`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Ошибка ${res.status}: ${errorText}`);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    window.location.href = "index.html";
  } catch (err) {
    console.error("Ошибка при удалении профиля:", err);
    throw err;
  }
}
