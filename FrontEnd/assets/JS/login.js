const apiLoginUrl = "http://localhost:5678/api/users/login";

document.getElementById("projet").addEventListener("click", function () {
  window.location.href = "index.html";
});

// SUBMIT LOGIN

document.querySelector("#formLogin").addEventListener("submit", function (event) {
  event.preventDefault();

  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;
  let errorMessage = document.querySelector("#errorMessage");

  if (email === "" || password === "") {
    errorMessage.textContent = "Erreur dans l’identifiant ou le mot de passe";
    errorMessage.style.display = "block";
  } else {
    fetch(apiLoginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then(async function (response) {
        if (response.ok) {
          let responseUser = await response.json();

          localStorage.setItem("token", responseUser.token);
          localStorage.setItem("userId", responseUser.userId);
          checkLoginStatus();

          document.querySelector("#formLogin").innerHTML = "";

          window.location.href = "index.html";
        } else {
          errorMessage.textContent = "Erreur dans l’identifiant ou le mot de passe";
          errorMessage.style.display = "block";
        }
      })
      .catch(function (error) {
        console.error("Erreur:", error);
      });
  }
});

// Login/logout

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
