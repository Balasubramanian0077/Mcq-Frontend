const msg = document.getElementById("msg");
const loginBtn = document.getElementById("loginBtn");

function show(text, ok = true) {
  msg.style.display = "block";
  msg.className = "notice " + (ok ? "ok" : "bad");
  msg.textContent = text;
}

function getVal(id) {
  return document.getElementById(id).value.trim();
}

loginBtn.addEventListener("click", async () => {
  const email = getVal("email");
  const password = getVal("password");

  if (!email || !password) {
    show("Email and Password required!", false);
    return;
  }

  // Using apiFetch (it reads text/JSON)
  const result = await apiFetch("/user/userlogin", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

  // ✅ Success: backend returns User JSON object
  if (result && typeof result === "object" && result.email) {
    setUser(result); // store user session
    show("Login Success ✅ Redirecting...", true);
    window.location.href = "instructions.html";

    setTimeout(() => {
      window.location.href = "instructions.html";
    }, 800);

  } else {
    // ❌ Failure: backend returns string
    show(String(result || "Login failed"), false);
  }
});
