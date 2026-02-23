const msg = document.getElementById("msg");
const btn = document.getElementById("btn");

function show(text, ok=true){
  msg.style.display = "block";
  msg.className = "notice " + (ok ? "ok" : "bad");
  msg.textContent = text;
}

btn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if(!email || !password){
    show("Enter email and password", false);
    return;
  }

  const result = await apiFetch("/admin/adminlogin", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

  // backend returns "Admin Login success" (string)
  if (typeof result === "string" && result.toLowerCase().includes("success")) {
    setAdmin(true);
    show("Login Success ✅ Redirecting...");
    setTimeout(() => window.location.href = "admin-dashboard.html", 800);
  } else {
    setAdmin(false);
    show(result, false);
  }
});
