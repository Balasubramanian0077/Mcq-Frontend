requireUser(); // block if not logged in

const msg = document.getElementById("msg");
const listEl = document.getElementById("questions");
const userInfo = document.getElementById("userInfo");
const submitBtn = document.getElementById("submitBtn");
const reloadBtn = document.getElementById("reloadBtn");
const logoutLink = document.getElementById("logoutLink");

const user = getUser(); // {id,name,email,...}
userInfo.textContent = "Logged in as: " + (user?.email || "");

let questions = []; // store fetched questions

function show(text, ok = true) {
  msg.style.display = "block";
  msg.className = "notice " + (ok ? "ok" : "bad");
  msg.textContent = text;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderQuestions() {
  if (!Array.isArray(questions) || questions.length === 0) {
    listEl.innerHTML = `<p class="small">No questions available.</p>`;
    return;
  }

  listEl.innerHTML = questions.map((q, idx) => {
    const name = `q_${q.id}`;

    // radio values must be A/B/C/D (your ResultService expects that)
    const options = [
      { code: "A", text: q.optionA },
      { code: "B", text: q.optionB },
      { code: "C", text: q.optionC },
      { code: "D", text: q.optionD },
    ];

    const optionsHtml = options.map(opt => `
      <label class="opt">
        <input type="radio" name="${escapeHtml(name)}" value="${opt.code}">
        <span><b>${opt.code}.</b> ${escapeHtml(opt.text)}</span>
      </label>
    `).join("");

    return `
      <div class="q">
        <h3 style="margin:0 0 8px;">${idx + 1}) ${escapeHtml(q.questionText)}</h3>
        <div class="opts">${optionsHtml}</div>
      </div>
    `;
  }).join("");
}

async function loadQuestions() {
  msg.style.display = "none";
  listEl.innerHTML = `<p class="small">Loading questions...</p>`;

  const data = await apiFetch("/user/userviewallquestion", { method: "GET" });

  if (!Array.isArray(data)) {
    show("Failed to load questions: " + data, false);
    listEl.innerHTML = "";
    return;
  }

  questions = data;
  renderQuestions();
  show("Loaded " + questions.length + " questions ✅", true);
}

function collectAnswers() {
  // For each question, find selected radio value (A/B/C/D)
  const answers = [];

  for (const q of questions) {
    const name = `q_${q.id}`;
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    const answer = selected ? selected.value : null;

    answers.push({
      questionId: q.id,
      answer: answer // null if not selected
    });
  }

  return answers;
}

submitBtn.addEventListener("click", async () => {
  if (!questions.length) {
    show("No questions to submit.", false);
    return;
  }

  const answers = collectAnswers();

  // Optional: require all answered
  const notAnswered = answers.filter(a => !a.answer).length;
  if (notAnswered > 0) {
    show("Please answer all questions. Remaining: " + notAnswered, false);
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  const email = user.email;
  const result = await apiFetch(`/result/submit/${encodeURIComponent(email)}`, {
    method: "POST",
    body: JSON.stringify(answers)
  });

  submitBtn.disabled = false;
  submitBtn.textContent = "Submit Quiz";

  // backend returns string like: "Score: 3/5 | Percentage: 60.00% | Status: PASS | Grade: C"
  if (typeof result === "string") {
    localStorage.setItem("lastResult", result); // store for result page
    window.location.href = "result.html";
  } else {
    show("Submit failed: " + JSON.stringify(result), false);
  }
});

reloadBtn.addEventListener("click", loadQuestions);

logoutLink.addEventListener("click", (e) => {
  e.preventDefault();
  logoutUser();
  window.location.href = "user-login.html";
});

// Auto load on page open
loadQuestions();
