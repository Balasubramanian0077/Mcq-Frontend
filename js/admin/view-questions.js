requireAdmin(); // only admin can open

const msg = document.getElementById("msg");
const body = document.getElementById("qBody");

function show(text, ok = true) {
  msg.style.display = "block";
  msg.className = "notice " + (ok ? "ok" : "bad");
  msg.textContent = text;
}

function clearTable() {
  body.innerHTML = "";
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function row(q) {
  return `
    <tr>
      <td style="padding:10px; border-bottom:1px solid #e6eaf2;">${escapeHtml(q.id)}</td>
      <td style="padding:10px; border-bottom:1px solid #e6eaf2;">${escapeHtml(q.questionText)}</td>
      <td style="padding:10px; border-bottom:1px solid #e6eaf2;">${escapeHtml(q.optionA)}</td>
      <td style="padding:10px; border-bottom:1px solid #e6eaf2;">${escapeHtml(q.optionB)}</td>
      <td style="padding:10px; border-bottom:1px solid #e6eaf2;">${escapeHtml(q.optionC)}</td>
      <td style="padding:10px; border-bottom:1px solid #e6eaf2;">${escapeHtml(q.optionD)}</td>
      <td style="padding:10px; border-bottom:1px solid #e6eaf2;"><b>${escapeHtml(q.correctAnswer)}</b></td>
    </tr>
  `;
}

async function loadQuestions() {
  msg.style.display = "none";
  clearTable();

  const data = await apiFetch("/admin/questions/all", { method: "GET" });

  // If error string comes
  if (!Array.isArray(data)) {
    show("Error: " + data, false);
    return;
  }

  if (data.length === 0) {
    show("No questions found.", true);
    return;
  }

  body.innerHTML = data.map(row).join("");
  show("Loaded " + data.length + " questions ✅", true);
}

document.getElementById("refreshBtn").addEventListener("click", loadQuestions);
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "admin-dashboard.html";
});

// Auto load on page open
loadQuestions();
