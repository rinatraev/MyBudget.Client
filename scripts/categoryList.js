console.log("Скрипт подключен и работает! categoryList.js");

document.addEventListener("DOMContentLoaded", () => {
  if (needAuthorization()) window.location.href = "login.html";
  loadCategories();
});

document.getElementById("backButton").addEventListener("click", ()=>{window.location.href = "main.html"});

async function loadCategories(){
    try{
        const categories = await getCategories();

        renderCategories(categories);
    }catch(err){
        alert(err);
    }
}

document.getElementById("addCategoryButton").addEventListener("click", async () => {
  const name = document.getElementById("newCategoryName").value.trim();
  const type = parseInt(document.getElementById("newCategoryType").value);

  if (!name) {
    alert("Введите название категории");
    return;
  }

  try {
    await createCategoryApi({ name, type });
    alert("Категория добавлена");
    loadCategories(); // обновляем таблицу
    document.getElementById("newCategoryName").value = "";
    document.getElementById("newCategoryType").value = "1";
  } catch (err) {
    alert(err.message);
  }
});


function renderCategories(categories) {
  const tbody = document.querySelector("#categoriesTable tbody");
  tbody.innerHTML = "";

  categories.forEach(c => {
    const row = document.createElement("tr");
    row.dataset.id = c.id;

    // ID
    const idCell = document.createElement("td");
    idCell.textContent = c.id;

    // Наименование
    const nameCell = document.createElement("td");
    const nameInput = document.createElement("textarea");
    nameInput.value = c.name;
    nameInput.disabled = true;
    nameCell.appendChild(nameInput);

    // Тип
    const typeCell = document.createElement("td");
    const typeSelect = document.createElement("select");
    ["Доход", "Расход"].forEach((label, idx) => {
      const opt = document.createElement("option");
      opt.value = idx + 1; // 1=Доход, 2=Расход
      opt.textContent = label;
      if (c.type === idx + 1) opt.selected = true;
      typeSelect.appendChild(opt);
    });
    typeSelect.disabled = true;
    typeCell.appendChild(typeSelect);

    // Операции
    const opsCell = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.textContent = "Редактировать";
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Сохранить";
    saveBtn.disabled = true;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить";

    opsCell.append(editBtn, saveBtn, deleteBtn);

    // Вставляем в строку
    row.append(idCell, nameCell, typeCell, opsCell);
    tbody.appendChild(row);

    // Логика кнопок
    editBtn.addEventListener("click", () => {
      nameInput.disabled = false;
      typeSelect.disabled = false;
      saveBtn.disabled = false;
      editBtn.disabled = true;
    });

    saveBtn.addEventListener("click", async () => {
      const dto = {
        id: c.id,
        name: nameInput.value,
        type: parseInt(typeSelect.value)
      };
      try {
        await updateCategoryApi(dto);
        alert("Категория обновлена");
        nameInput.disabled = true;
        typeSelect.disabled = true;
        saveBtn.disabled = true;
        editBtn.disabled = false;
      } catch (err) {
        alert(err.message);
      }
    });

    deleteBtn.addEventListener("click", async () => {
      if (!confirm("Удалить категорию?")) return;
      try {
        await deleteCategoryApi(c.id);
        row.remove();
      } catch (err) {
        alert(err.message);
      }
    });
  });
}
