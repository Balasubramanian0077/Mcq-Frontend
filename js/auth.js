// USER
function setUser(user) { localStorage.setItem("user", JSON.stringify(user)); }
function getUser() { return JSON.parse(localStorage.getItem("user") || "null"); }
function logoutUser() { localStorage.removeItem("user"); }

// ADMIN
function setAdmin(flag) { localStorage.setItem("admin", flag ? "1" : "0"); }
function isAdmin() { return localStorage.getItem("admin") === "1"; }
function logoutAdmin() { localStorage.removeItem("admin"); }

// Guards
function requireUser() { if (!getUser()) window.location.href = "user-login.html"; }
function requireAdmin() { if (!isAdmin()) window.location.href = "admin-login.html"; }
