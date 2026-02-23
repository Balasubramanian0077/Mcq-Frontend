requireUser(); // user must be logged in

const user = getUser();
document.getElementById("userInfo").textContent =
  "Logged in as: " + user.email;

document.getElementById("startBtn").addEventListener("click", () => {
  window.location.href = "quiz.html"; // ✅ redirect to quiz
});

document.getElementById("logoutLink").addEventListener("click", (e) => {
  e.preventDefault();
  logoutUser();
  window.location.href = "user-login.html";
});
