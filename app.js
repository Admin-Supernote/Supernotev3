// Database simulato
let users = [
  { username: 'ALESSANDROC', password: 'Temp1234', role: 'technician', firstLogin: true }
];
let classes = [];
let grades = [];

// Ruoli disponibili
const roles = {
  student: "👦 Student",
  parent: "👨 Parent",
  teacher: "🧑‍🏫 Teacher",
  principal: "👩‍💼 Principal",
  surveillant: "👨‍💼 Surveillant",
  technician: "👨🏻‍💻 Technician",
};

// Caricamento iniziale
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginSection = document.getElementById("loginSection");
  const dashboard = document.getElementById("dashboard");
  const dashboardContent = document.getElementById("dashboardContent");
  const logoutBtn = document.getElementById("logoutBtn");

  // Verifica se un utente è già loggato
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (storedUser) {
    loadDashboard(storedUser);
  }

  // Selezione ruolo
  document.querySelectorAll(".roleBtn").forEach((button) => {
    button.addEventListener("click", () => {
      loginForm.style.display = "block";
      loginForm.dataset.role = button.dataset.role;
    });
  });

  // Login
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = loginForm.dataset.role;

    const user = users.find(
      (u) => u.username === username && u.password === password && u.role === role
    );

    if (user) {
      if (user.firstLogin) {
        alert("Please change your password at first login.");
        user.firstLogin = false; // Reset flag
      }
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      loadDashboard(user);
    } else {
      alert("Invalid credentials.");
    }
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    loginSection.style.display = "block";
    dashboard.style.display = "none";
  });

  // Caricamento dashboard
  function loadDashboard(user) {
    loginSection.style.display = "none";
    dashboard.style.display = "block";
    dashboardContent.innerHTML = generateDashboardContent(user);
  }

  // Generazione dashboard per ruolo
  function generateDashboardContent(user) {
    switch (user.role) {
      case "technician":
        return technicianDashboard();
      case "teacher":
        return teacherDashboard();
      case "student":
        return studentDashboard(user);
      default:
        return `<p>Role not recognized.</p>`;
    }
  }

  // --- DASHBOARD PER OGNI RUOLO ---
  function technicianDashboard() {
    return `
      <h3>Technician Panel</h3>
      <button onclick="showCreateUserForm()">Create User</button>
      <button onclick="showCreateClassForm()">Create Class</button>
      <button onclick="viewClasses()">View Classes</button>
      <div id="technicianContent"></div>
    `;
  }

  function teacherDashboard() {
    return `
      <h3>Teacher Panel</h3>
      <button onclick="addGrade()">Add Grade</button>
      <button onclick="viewClassPerformance()">View Class Performance</button>
      <div id="teacherContent"></div>
    `;
  }

  function studentDashboard(user) {
    return `
      <h3>Welcome, ${user.username}</h3>
      <p>Your Grades:</p>
      <div id="grades"></div>
      <div id="studentPerformance"></div>
    `;
  }

  // --- CALCOLO MEDIE CON COEFFICIENTE ---
  function calculateAveragesWithCoefficients(grades) {
    const subjects = [...new Set(grades.map((g) => g.subject))];
    const averages = subjects.map((subject) => {
      const subjectGrades = grades.filter((g) => g.subject === subject);
      const weightedTotal = subjectGrades.reduce(
        (acc, g) => acc + ((g.score / g.maxScore) * 20) * g.coefficient,
        0
      );
      const totalCoefficients = subjectGrades.reduce((acc, g) => acc + g.coefficient, 0);
      const average = (weightedTotal / totalCoefficients).toFixed(2);
      return { subject, average };
    });

    const overallTotal = averages.reduce((acc, avg) => acc + parseFloat(avg.average), 0);
    const overallAverage = (overallTotal / averages.length).toFixed(2);

    return { averages, overallAverage };
  }

  // Visualizzazione performance
  function displayPerformance(userGrades) {
    const { averages, overallAverage } = calculateAveragesWithCoefficients(userGrades);

    let content = `<h4>Performance Summary</h4>`;
    content += `<p>Overall Average: ${overallAverage}/20</p>`;
    content += `<table>
      <tr><th>Subject</th><th>Average</th></tr>`;
    averages.forEach((avg) => {
      content += `<tr><td>${avg.subject}</td><td>${avg.average}/20</td></tr>`;
    });
    content += `</table>`;
    document.getElementById("studentPerformance").innerHTML = content;
  }
});
