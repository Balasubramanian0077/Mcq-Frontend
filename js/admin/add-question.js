requireAdmin(); // protect page (only admin can open)

const msg = document.getElementById("msg");

function show(text, ok = true) {
  msg.style.display = "block";
  msg.className = "notice " + (ok ? "ok" : "bad");
  msg.textContent = text;
}

function getValue(id) {
  return document.getElementById(id).value.trim();
}

function clearForm() {
  document.getElementById("questionText").value = "";
  document.getElementById("optionA").value = "";
  document.getElementById("optionB").value = "";
  document.getElementById("optionC").value = "";
  document.getElementById("optionD").value = "";
  document.getElementById("correctAnswer").value = "";
}

document.getElementById("clearBtn").addEventListener("click", () => {
  clearForm();
  msg.style.display = "none";
});

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "admin-dashboard.html";
});

document.getElementById("addBtn").addEventListener("click", async () => {
  const questionText = getValue("questionText");
  const optionA = getValue("optionA");
  const optionB = getValue("optionB");
  const optionC = getValue("optionC");
  const optionD = getValue("optionD");
  const correctAnswer = document.getElementById("correctAnswer").value;

  // Basic validation
  if (!questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
    show("All fields are required!", false);
    return;
  }

  const payload = {
    questionText,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer
  };

  const result = await apiFetch("/admin/add/questions", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  // On success backend returns the saved Question JSON (with id)
  if (result && typeof result === "object" && result.id) {
    show("Question added successfully ✅ (ID: " + result.id + ")", true);
    clearForm();
  } else {
    // if backend returns error string
    show("Failed to add question: " + result, false);
  }
});
