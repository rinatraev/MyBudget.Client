console.log("Скрипт подключен и работает! apiCalls.js");

const baseUrl = "http://localhost:5041/api";

function needAuthorization(){
  const token = localStorage.getItem("accessToken");
  if(token == null) return true;
}

async function login(username, password) {
  try {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      // Здесь обрабатываются все статусы, кроме 200–299
      const errorText = await res.text();
      throw new Error(`Ошибка ${res.status}: ${errorText}`);
    }
    const token = await res.text();
    localStorage.setItem("accessToken", token);
    localStorage.setItem("username", username);
    window.location.href="main.html"
  } catch (err) {
    console.error("Ошибка при логине:", err);
    throw err;
  }
}

async function register(username, password) {
  try {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      throw new Error("Ошибка входа: " + res.status);
    }

    alert("Регистрация прошла успешно. Токен сохранен.");
    showLoginBox();
    return;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//Без параметров
async function getTransactions(page = 1) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${baseUrl}/transactions?page=${page}&pageSize=15`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ошибка ${res.status}: ${text}`);
  }

  return await res.json(); // возвращаем "обёртку" с items, totalPages и т.д.
}
//С параметр(ами)ом
async function getTransactions(page = 1) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${baseUrl}/transactions?page=${page}&`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ошибка ${res.status}: ${text}`);
  }

  return await res.json(); // возвращаем "обёртку" с items, totalPages и т.д.
}

async function getCategories(route) {
  const token = localStorage.getItem("accessToken");
  if(route !== "by-user"){
    route = "";
  }
  const res = await fetch(`${baseUrl}/categories/${route}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ошибка ${res.status}: ${text}`);
  }

  return await res.json(); // возвращаем "обёртку" категории
}

async function deleteUser(){
  const token = localStorage.getItem("accessToken");
   try {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "Delete",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    });

    if (!res.ok) {
      // Здесь обрабатываются все статусы, кроме 200–299
      const errorText = await res.text();
      throw new Error(`Ошибка ${res.status}: ${errorText}`);
    }
    localStorage.removeItemItem("accessToken", token);
    localStorage.removeItem("username", username);
    window.location.href="index.html"
  } catch (err) {
    console.error("Ошибка при логине:", err);
    throw err;
  }
}