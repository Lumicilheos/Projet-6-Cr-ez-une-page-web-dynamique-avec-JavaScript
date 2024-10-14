let modal = null;

// OPEN MODAL

const openModal = function (event, targetModal = null) {
  event.preventDefault();
  const target = targetModal || document.querySelector(event.target.getAttribute("href"));
  target.style.display = null;
  modal = target;
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
};

const closeModal = function (event = null) {
  if (modal === null) return;

  if (event && typeof event.preventDefault === "function") {
    event.preventDefault();
  }

  modal.style.display = "none";
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);

  modal = null;
};

const stopPropagation = function (event) {
  event.stopPropagation();
};

//  SWITCH BACK / MODAL2

const switchModal2 = function (event) {
  event.preventDefault();
  closeModal(event);
  openModal(event, document.querySelector("#modal2"));
};

const switchBack = function (event) {
  event.preventDefault();
  closeModal(event);
  openModal(event, document.querySelector("#modal1"));
};

document.querySelector(".js-modal-switch").addEventListener("click", switchModal2);
document.querySelector(".js-modal-back").addEventListener("click", switchBack);

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

// DISPLAY WORK

function displayWorksModal(works) {
  const gallery = document.querySelector(".gallery-modal");

  gallery.innerHTML = "";

  works.forEach((work) => {
    const workContainer = document.createElement("div");
    const workImg = document.createElement("img");
    const iconDelete = document.createElement("i");

    workImg.src = work.imageUrl;
    iconDelete.classList.add("fa-solid", "fa-trash-can");

    iconDelete.addEventListener("click", async () => {
      await deleteWork(work.id);
    });

    workContainer.appendChild(workImg);
    workContainer.appendChild(iconDelete);
    gallery.appendChild(workContainer);
  });
}

// DELETE

async function deleteWork(workId) {
  const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    console.log(`Work with ID ${workId} deleted successfully`);

    const updatedWorks = await fetchWorks();
    displayWorksModal(updatedWorks);
    displayWorks(updatedWorks);
  } else {
    console.error("Failed to delete work:", response.statusText);
  }
}

const form = document.getElementById("newProject");

if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    postWork();
  });
}

// PREVIEW

const fileInput = document.getElementById("fileInput");
if (fileInput) {
  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const previewImage = document.getElementById("preview");
      const btnImage = document.querySelector(".btn-text");
      const assideText = document.querySelector(".assideText");
      const assideIcone = document.querySelector(".assideIcone");
      const buttonContainer = document.querySelector(".modalProject > button");

      btnImage.style.display = "none";
      buttonContainer.style.display = "none";
      assideText.style.display = "none";
      assideIcone.style.display = "none";

      previewImage.src = URL.createObjectURL(file);
      previewImage.style.display = "block";
    }
  });
} else {
  console.error("L'élément fileInput n'a pas été trouvé.");
}

// DYNAMICS CATEGORIES SELECTED

async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories"); // Fetch categories via API
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des catégories : " + response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
  }
}

async function afficherCategories() {
  try {
    const categoriesData = await fetchCategories();
    let selectElement = document.getElementById("categories");

    categoriesData.forEach(function (categorie) {
      let optionElement = document.createElement("option");
      optionElement.textContent = categorie.name;
      optionElement.value = categorie.id;
      selectElement.appendChild(optionElement);
    });
  } catch (error) {
    console.error("Erreur:", error);
  }
}

afficherCategories();

// POST PROJECT

async function postWork() {
  const imageFile = document.querySelector("#fileInput").files[0];
  const titleInput = document.querySelector("#titleInput");
  const categorySelect = document.querySelector("#categories");
  const formData = new FormData();

  formData.append("image", imageFile);
  formData.append("title", titleInput.value);
  formData.append("category", categorySelect.value);

  if (!imageFile || !titleInput || !categorySelect) {
    console.error("Tous les champs ne sont pas remplis.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      console.log("Projet posté avec succès !");

      // RESET
      const previewImage = document.getElementById("preview");
      previewImage.style.display = "none";
      previewImage.removeAttribute("src");

      const btnImage = document.querySelector(".btn-text");
      const assideText = document.querySelector(".assideText");
      const assideIcone = document.querySelector(".assideIcone");
      const btnText = document.querySelector(".modalProject > button");

      btnImage.style.display = "block";
      btnText.style.display = "flex";
      assideText.style.display = "block";
      assideIcone.style.display = "block";

      titleInput.value = "";
      categorySelect.selectedIndex = 0;

      const updatedWorks = await fetchWorks();
      displayWorksModal(updatedWorks);
      displayWorks(updatedWorks);
      modal.style.display = "none";
    } else {
      console.error("Erreur lors de l'envoi :", response.statusText);
    }
  } catch (error) {
    console.error("Erreur:", error);
  }
}
