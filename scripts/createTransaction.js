console.log("Скрипт подключен и работает! createTransaction.js");

document.addEventListener("DOMContentLoaded", async () => {
  if (needAuthorization()) window.location.href = "login.html";
  let catSelect = document.getElementById("categorySelect");
  categories = await getCategories();

    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      catSelect.appendChild(option);
    });
});

function buildTransDto() {
  const categoryId = getSelectedCategoryId();
  const amount = getAmount();
  const createdAt = getCreatedAt(); // обязательно объявляем
  const comment = getComment();

  return {
    categoryId: categoryId,
    amount: amount,
    createdAtUtc: createdAt ? new Date(createdAt).toISOString() : null,
    comment: comment,
    type: 0
  };
}

function backClicked(){
  window.location.href = "main.html";
}

function getSelectedCategoryId() {
  const select = document.getElementById("categorySelect");
  return parseInt(select.value);
}

// Получить сумму (decimal)
function getAmount() {
  const input = document.getElementById("amountInput");
  return parseFloat(input.value);
}

// Получить дату (или дату+время, если используешь datetime-local)
function getCreatedAt() {
  const input = document.querySelector("input[name='createdAt']") 
             || document.querySelector("input[type='date']");
  return input.value; // строка в формате YYYY-MM-DD или YYYY-MM-DDTHH:mm
}

// Получить комментарий
function getComment() {
  const textarea = document.getElementById("commentInput");
  return textarea.value.trim();
}

function formIsValid() {
  let isEnable = true;
  const amount = getAmount();
  const createdAt = getCreatedAt();

  if (isNaN(amount) || amount <= 0) isEnable = false;
  if (!createdAt) isEnable = false;

  return isEnable;
}
