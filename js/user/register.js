const msg = document.getElementById("msg");
const regBtn = document.getElementById("regBtn");

function show(text, ok = true) {
  msg.style.display = "block";
  msg.className = "notice " + (ok ? "ok" : "bad");
  msg.textContent = text;
}

function getVal(id) {
  return document.getElementById(id).value.trim();
}

regBtn.addEventListener("click", async () => {
  const name = getVal("name");
  const email = getVal("email");
  const password = getVal("password");

  // basic validation
  if (!name || !email || !password) {
    show("All fields are required!", false);
    return;
  }

  const payload = { name, email, password };

  const result = await apiFetch("/user/userregister", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  // success: backend returns saved user object
  if (result && typeof result === "object" && result.email) {
    show("Registered successfully ✅ Redirecting to Login...", true);

    // redirect to login after 1 sec
    setTimeout(() => {
      window.location.href = "user-login.html";
    }, 900);

  } else {
    // if backend returns error string
    show("Register failed: " + result, false);
  }
});
