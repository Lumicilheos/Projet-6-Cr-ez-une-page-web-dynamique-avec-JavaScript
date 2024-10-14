// URL de l'API
const apiCategoriesUrl = "http://localhost:5678/api/categories";
const apiWorksUrl = "http://localhost:5678/api/works";
const apiworkpost = "http://localhost:5678/api/users/login";

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

// REDIRECTION

document.getElementById("loginButton").addEventListener("click", function () {
  window.location.href = "login.html";
});

// BTN ADMIN

if (token) {
  let adminLog = document.getElementsByClassName("js-modal");
  for (let i = 0; i < adminLog.length; i++) {
    if (adminLog[i]) {
      adminLog[i].style.display = "block";
    }
  }
}

// RECUPERATION

//catégories
async function fetchCategories() {
  try {
    const response = await fetch(apiCategoriesUrl); // Appel API pour les categorties
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des catégories : " + response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// projets
async function fetchWorks() {
  try {
    const response = await fetch(apiWorksUrl); // Appel api projet
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des projets : " + response.statusText);
    }
    return await response.json(); // convertit en json
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// FILTRED

function createFilterButtons(categories) {
  const filterContainer = document.getElementById("category-filters"); // Sélectionne les filtre
  filterContainer.innerHTML = "";

  // BTN ALL
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";

  allButton.classList.add("btn-style");
  allButton.addEventListener("click", async () => {
    const allWorks = await fetchWorks(); // Récupère tous les projets
    displayWorks(allWorks); // Affiche tous les projets
  });
  filterContainer.appendChild(allButton);

  // BTN CATEGORIES
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("btn-style");
    button.addEventListener("click", async () => {
      const allWorks = await fetchWorks();
      const filteredWorks = allWorks.filter((work) => work.categoryId === category.id);
      displayWorks(filteredWorks);
    });
    filterContainer.appendChild(button);
  });
}

// FETCH

// CATEGORIES
async function getCategories() {
  return await fetchCategories(); // Appelle la fonction fetchCategories et retourne les catégories
}

// PROJECT
async function getWorks() {
  return await fetchWorks(); // Appelle la fonction fetchWorks et retourne les projets
}

// INITIALIZE USER / BTN
function initializeUI(categories, works) {
  createFilterButtons(categories);
  displayWorks(works);
  displayWorksModal(works);
}

//INITIALIZE
async function initialize() {
  const categories = await getCategories();
  const works = await getWorks();
  initializeUI(categories, works);
}

// SHOW PROJECT

async function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  const projects = await fetchWorks();

  works.forEach((project) => {
    const workItem = document.createElement("div");
    workItem.classList.add("gallery-item");

    workItem.innerHTML = `
    <figure>
      <img src="${project.imageUrl}" alt="${project.title}">
      <figcaption>${project.title}</figcaption>
    </figure>
  `;

    gallery.appendChild(workItem);
  });
}

// CHEK LOGIN

function checkLoginStatus() {
  const loginButton = document.querySelector("#loginButton");
  const token = localStorage.getItem("token");
  if (token) {
    loginButton.textContent = "Logout";
    loginButton.addEventListener("click", function () {
      localStorage.removeItem("token");
    });
  } else {
    loginButton.textContent = "Login";
  }
}

checkLoginStatus();

document.addEventListener("DOMContentLoaded", initialize);
