requireAdmin(); // only admin can open

const msg = document.getElementById("msg");
const body = document.getElementById("rBody");

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

function formatPercent(v) {
  if (v === null || v === undefined) return "";
  const n = Number(v);
  if (Number.isNaN(n)) return escapeHtml(v);
  return n.toFixed(2);
}

function formatDate(val) {
  if (!val) return "";
  // LocalDateTime comes like "2026-02-18T10:15:30.123"
  return escapeHtml(String(val).replace("T", " "));
}

function statusBadge(status) {
  const s = String(status || "").toUpperCase();
  const ok = s === "PASS";
  return `<span style="
      padding:4px 8px;
      border-radius:999px;
      border:1px solid ${ok ? "#84d19a" : "#ff9b9b"};
      background:${ok ? "#e7f8ed" : "#ffe9e9"};
      color:${ok ? "#0b5a24" : "#7a0c0c"};
      font-weight:700;
      font-size:12px;
    ">${escapeHtml(s)}</span>`;
}

function row(r) {
  return `
    <tr>
      <td style="padding:10px; border-bottom:1px solid #e6eaf2;">${escapeHtml(r.id)}</td>
      <td style="padding:10px; border-bottom:1px solid #e6eaf2;">${escapeHtml(r.userEmail)}</td>
      <td style="padding:10px; border-bottom:1px solid #e6eaf2;">${escapeHtml(r.score)}</td>
      <td style="padding:10px; border-bottom:1px solid #e6eaf2;">${escapeHtml(r.totalQuestions)}</td>
      <td style="padding:10px; border-bottom:1px solid #e6eaf2;">${formatPercent(r.percentage)}%</td>
      <td style="padding:10px; border-bottom:1px solid #e6eaf2;">${statusBadge(r.status)}</td>
      <td style="padding:10px; border-bottom:1px solid #e6eaf2;"><b>${escapeHtml(r.grade)}</b></td>
      <td style="padding:10px; border-bottom:1px solid #e6eaf2;">${formatDate(r.submittedAt)}</td>
    </tr>
  `;
}

async function loadResults() {
  msg.style.display = "none";
  clearTable();

  const data = await apiFetch("/admin/results/all", { method: "GET" });

  if (!Array.isArray(data)) {
    show("Error: " + data, false);
    return;
  }

  if (data.length === 0) {
    show("No results found.", true);
    return;
  }

  // Optional: show latest first by submittedAt if available
  data.sort((a, b) => String(b.submittedAt || "").localeCompare(String(a.submittedAt || "")));

  body.innerHTML = data.map(row).join("");
  show("Loaded " + data.length + " results ✅", true);
}

document.getElementById("refreshBtn").addEventListener("click", loadResults);
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "admin-dashboard.html";
});

loadResults();
