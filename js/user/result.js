requireUser();

const user = getUser();
document.getElementById("userInfo").textContent =
  "Logged in as: " + user.email;

const result = localStorage.getItem("lastResult") || "No result found.";
document.getElementById("resultBox").textContent = result;

// ✅ SAFE CHECK
const homeBtn = document.getElementById("homeBtn");
if (homeBtn) {
  homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

const logoutLink = document.getElementById("logoutLink");
if (logoutLink) {
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    logoutUser();
    window.location.href = "user-login.html";
  });
}
