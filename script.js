/* ===== تسجيل دخول المستخدم ===== */
function login() {
  const user = document.getElementById("username").value.trim();
  if (!user) { 
    alert("اكتب اسم المستخدم"); 
    return; 
  }
  localStorage.setItem("user", user);
  localStorage.setItem("points", 0);

  const referral = window.location.href + "?ref=" + encodeURIComponent(user);
  localStorage.setItem("referral", referral);

  window.location.href = "dashboard.html";
}

/* ===== تحميل لوحة المستخدم ===== */
function loadDashboard() {
  const user = localStorage.getItem("user");
  const points = localStorage.getItem("points");
  const referral = localStorage.getItem("referral");

  if (document.getElementById("user")) document.getElementById("user").innerText = user;
  if (document.getElementById("points")) document.getElementById("points").innerText = points;
  if (document.getElementById("referral")) document.getElementById("referral").innerText = referral;
}

/* ===== المهام ===== */
const tasks = [
  "https://bln.gg/B0T-QKA-MZD",
  "https://bln.gg/DNB-1HJ-EMT",
  "https://bln.gg/ANC-154-YBR"
];

function startTask(id) {
  localStorage.setItem("taskStarted", "yes");
  window.open(tasks[id], "_blank");
}

function verifyTask() {
  if (localStorage.getItem("taskStarted") !== "yes") { alert("❌ يجب تنفيذ المهمة أولًا"); return; }
  let points = parseInt(localStorage.getItem("points"));
  points += 10;
  localStorage.setItem("points", points);
  localStorage.removeItem("taskStarted");
  loadDashboard();
}

/* ===== السحب TRC20 ===== */
function withdrawTRC() {
  const address = document.getElementById("trcAddress").value;
  const amount = parseInt(document.getElementById("amount").value);
  const points = parseInt(localStorage.getItem("points"));

  if (!address || address.length < 10) {
    document.getElementById("msg").innerText = "❌ أدخل عنوان TRC20 صحيح";
    return;
  }
  if (amount > points) {
    document.getElementById("msg").innerText = "❌ لا تملك نقاط كافية";
    return;
  }
  if (amount < 50) {
    document.getElementById("msg").innerText = "❌ الحد الأدنى للسحب: 50 نقطة";
    return;
  }

  let requests = JSON.parse(localStorage.getItem("withdrawRequests") || "[]");
  requests.push({ address, amount, status: "pending" });
  localStorage.setItem("withdrawRequests", JSON.stringify(requests));

  document.getElementById("msg").innerText = "✅ تم تسجيل طلبك، سيتم تحويل النقاط بعد المراجعة";
}

/* ===== إدارة الطلبات (Admin) ===== */
function adminLoginPrompt() {
  const password = prompt("أدخل كلمة مرور الإدارة:");
  if (password !== "admin123") {
    alert("كلمة مرور خاطئة! سيتم إعادة التوجيه.");
    window.location.href = "index.html";
    return;
  }
  document.getElementById("adminContent").style.display = "block";
  loadRequests();
}

function loadRequests() {
  let requests = JSON.parse(localStorage.getItem("withdrawRequests") || "[]");
  const table = document.getElementById("requestsTable");
  table.innerHTML = "";

  requests.forEach((req, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${req.address}</td>
      <td>${req.amount}</td>
      <td>${req.status}</td>
      <td>
        <button onclick="approveRequest(${index})">✔️ تحويل</button>
        <button onclick="rejectRequest(${index})">❌ رفض</button>
      </td>
    `;
    table.appendChild(row);
  });
}

function approveRequest(index) {
  let requests = JSON.parse(localStorage.getItem("withdrawRequests") || "[]");
  requests[index].status = "تم التحويل";
  localStorage.setItem("withdrawRequests", JSON.stringify(requests));
  loadRequests();
}

function rejectRequest(index) {
  let requests = JSON.parse(localStorage.getItem("withdrawRequests") || "[]");
  requests[index].status = "مرفوض";
  localStorage.setItem("withdrawRequests", JSON.stringify(requests));
  loadRequests();
}

/* ===== تسجيل Service Worker لتفعيل PWA ===== */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
  .then(() => console.log("Service Worker Registered"))
  .catch(err => console.log("Service Worker registration failed: ", err));
}

/* ===== تحميل لوحة المستخدم عند بدء التشغيل ===== */
loadDashboard();