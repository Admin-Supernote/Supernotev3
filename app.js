// Simulated database
let users = [
  { username: 'ALESSANDROC', password: 'Temp1234', role: 'technician', firstLogin: true }
];
let classes = [];
let grades = [];

// Roles available
const roles = {
  student: "👦 Student",
  parent: "👨 Parent",
  teacher: "🧑‍🏫 Teacher",
  principal: "👩‍💼 Principal",
  surveillant: "👨‍💼 Surveillant",
  technician: "👨🏻‍💻 Technician",
};

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginSection = document.getElementById("loginSection");
  const dashboard = document.getElementById("dashboard");
  const dashboardContent = document.getElementById("dashboardContent");
  const logoutBtn = document.getElementById("logoutBtn");

  // Check if user is already logged in
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (storedUser) {
    loadDashboard(storedUser);
  }

  // Role selection
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

  // Load dashboard
  function loadDashboard(user) {
    loginSection.style.display = "none";
    dashboard.style.display = "block";
    dashboardContent.innerHTML = generateDashboardContent(user);
  }

  // Generate dashboard content based on role
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

  // Technician Dashboard
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

  // Create User Form
  window.showCreateUserForm = function () {
    document.getElementById("technicianContent").innerHTML = `
      <h4>Create New User</h4>
      <form id="createUserForm">
        <label>Username:</label><input type="text" id="newUsername" required>
        <label>Password:</label><input type="password" id="newPassword" required>
        <label>Role:</label>
        <select id="newRole">
          ${Object.keys(roles).map((key) => `<option value="${key}">${roles[key]}</option>`).join("")}
        </select>
        <button type="submit">Create User</button>
      </form>
    `;

    document.getElementById("createUserForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const username = document.getElementById("newUsername").value;
      const password = document.getElementById("newPassword").value;
      const role = document.getElementById("newRole").value;

      users.push({ username, password, role, firstLogin: true });
      alert(`User ${username} created successfully!`);
      document.getElementById("technicianContent").innerHTML = "";
    });
  };

  // Create Class Form
  window.showCreateClassForm = function () {
    document.getElementById("technicianContent").innerHTML = `
      <h4>Create New Class</h4>
      <form id="createClassForm">
        <label>Class Name:</label><input type="text" id="className" required>
        <button type="submit">Create Class</button>
      </form>
    `;

    document.getElementById("createClassForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const className = document.getElementById("className").value;
      classes.push({ name: className, students: [], subjects: [] });
      alert(`Class ${className} created successfully!`);
      document.getElementById("technicianContent").innerHTML = "";
    });
  };

  // View Classes
  window.viewClasses = function () {
    let content = `<h4>Class List</h4>`;
    if (classes.length === 0) {
      content += `<p>No classes created yet.</p>`;
    } else {
      classes.forEach((c, index) => {
        content += `
          <div>
            <h5>${c.name}</h5>
            <button onclick="manageClass(${index})">Manage</button>
          </div>
        `;
      });
    }
    document.getElementById("technicianContent").innerHTML = content;
  };

  // Manage Classes
  window.manageClass = function (index) {
    const classData = classes[index];
    document.getElementById("technicianContent").innerHTML = `
      <h4>Manage Class: ${classData.name}</h4>
      <button onclick="addStudent(${index})">Add Student</button>
      <button onclick="addSubject(${index})">Add Subject</button>
      <div id="classContent"></div>
    `;
  };

  // Add Students
  window.addStudent = function (index) {
    document.getElementById("classContent").innerHTML = `
      <h5>Add Student</h5>
      <form id="addStudentForm">
        <label>Student Name:</label><input type="text" id="studentName" required>
        <button type="submit">Add</button>
      </form>
    `;

    document.getElementById("addStudentForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const studentName = document.getElementById("studentName").value;
      classes[index].students.push(studentName);
      alert(`Student ${studentName} added successfully!`);
      document.getElementById("classContent").innerHTML = "";
    });
  };

  // Add Subjects
  window.addSubject = function (index) {
    document.getElementById("classContent").innerHTML = `
      <h5>Add Subject</h5>
      <form id="addSubjectForm">
        <label>Subject Name:</label><input type="text" id="subjectName" required>
        <button type="submit">Add</button>
      </form>
    `;

    document.getElementById("addSubjectForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const subjectName = document.getElementById("subjectName").value;
      classes[index].subjects.push(subjectName);
      alert(`Subject ${subjectName} added successfully!`);
      document.getElementById("classContent").innerHTML = "";
    });
  };
});
// Add Grades
window.addGrade = function () {
  document.getElementById("teacherContent").innerHTML = `
    <h5>Add Grade</h5>
    <form id="addGradeForm">
      <label>Class:</label>
      <select id="selectClass">
        ${classes.map((c, index) => `<option value="${index}">${c.name}</option>`).join("")}
      </select>
      <label>Student:</label>
      <select id="selectStudent"></select>
      <label>Subject:</label>
      <select id="selectSubject"></select>
      <label>Grade:</label><input type="number" id="gradeValue" required>
      <label>Max Grade:</label><input type="number" id="maxGradeValue" required>
      <label>Coefficient:</label><input type="number" id="coefficientValue" required>
      <button type="submit">Add</button>
    </form>
  `;

  // Populate Students and Subjects based on class selection
  const classSelect = document.getElementById("selectClass");
  classSelect.addEventListener("change", () => {
    const selectedClass = classes[classSelect.value];
    document.getElementById("selectStudent").innerHTML = selectedClass.students
      .map((student) => `<option value="${student}">${student}</option>`)
      .join("");
    document.getElementById("selectSubject").innerHTML = selectedClass.subjects
      .map((subject) => `<option value="${subject}">${subject}</option>`)
      .join("");
  });

  classSelect.dispatchEvent(new Event("change"));

  // Handle grade submission
  document.getElementById("addGradeForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const classIndex = classSelect.value;
    const student = document.getElementById("selectStudent").value;
    const subject = document.getElementById("selectSubject").value;
    const gradeValue = parseFloat(document.getElementById("gradeValue").value);
    const maxGradeValue = parseFloat(document.getElementById("maxGradeValue").value);
    const coefficient = parseFloat(document.getElementById("coefficientValue").value);

    grades.push({
      class: classes[classIndex].name,
      student,
      subject,
      score: gradeValue,
      maxScore: maxGradeValue,
      coefficient,
    });

    alert(`Grade added for ${student} in ${subject}.`);
    document.getElementById("teacherContent").innerHTML = "";
  });
};

// View Class Performance
window.viewClassPerformance = function () {
  document.getElementById("teacherContent").innerHTML = `
    <h5>Class Performance</h5>
    <label>Select Class:</label>
    <select id="selectClassPerformance">
      ${classes.map((c, index) => `<option value="${index}">${c.name}</option>`).join("")}
    </select>
    <div id="performanceContent"></div>
  `;

  const classSelect = document.getElementById("selectClassPerformance");
  classSelect.addEventListener("change", () => {
    const selectedClass = classes[classSelect.value];
    const classGrades = grades.filter((g) => g.class === selectedClass.name);

    if (classGrades.length === 0) {
      document.getElementById("performanceContent").innerHTML = `<p>No grades available for this class.</p>`;
      return;
    }

    // Calculate average per subject
    const subjects = [...new Set(classGrades.map((g) => g.subject))];
    let performanceTable = `<table>
      <tr>
        <th>Subject</th>
        <th>Class Average</th>
        <th>Highest Grade</th>
        <th>Lowest Grade</th>
      </tr>`;

    subjects.forEach((subject) => {
      const subjectGrades = classGrades.filter((g) => g.subject === subject);
      const totalWeighted = subjectGrades.reduce(
        (acc, g) => acc + ((g.score / g.maxScore) * 20) * g.coefficient,
        0
      );
      const totalCoefficients = subjectGrades.reduce((acc, g) => acc + g.coefficient, 0);
      const average = (totalWeighted / totalCoefficients).toFixed(2);
      const highest = Math.max(...subjectGrades.map((g) => (g.score / g.maxScore) * 20)).toFixed(2);
      const lowest = Math.min(...subjectGrades.map((g) => (g.score / g.maxScore) * 20)).toFixed(2);

      performanceTable += `
        <tr>
          <td>${subject}</td>
          <td>${average}</td>
          <td>${highest}</td>
          <td>${lowest}</td>
        </tr>`;
    });

    performanceTable += `</table>`;
    document.getElementById("performanceContent").innerHTML = performanceTable;
  });

  classSelect.dispatchEvent(new Event("change"));
};

// Display Student Performance
window.displayStudentPerformance = function (student) {
  const studentGrades = grades.filter((g) => g.student === student);
  if (studentGrades.length === 0) {
    return `<p>No grades available for ${student}.</p>`;
  }

  const subjects = [...new Set(studentGrades.map((g) => g.subject))];
  let performanceTable = `<table>
    <tr>
      <th>Subject</th>
      <th>Average</th>
    </tr>`;

  subjects.forEach((subject) => {
    const subjectGrades = studentGrades.filter((g) => g.subject === subject);
    const totalWeighted = subjectGrades.reduce(
      (acc, g) => acc + ((g.score / g.maxScore) * 20) * g.coefficient,
      0
    );
    const totalCoefficients = subjectGrades.reduce((acc, g) => acc + g.coefficient, 0);
    const average = (totalWeighted / totalCoefficients).toFixed(2);

    performanceTable += `
      <tr>
        <td>${subject}</td>
        <td>${average}</td>
      </tr>`;
  });

  performanceTable += `</table>`;
  return performanceTable;
};

// Dashboard for Students
window.generateStudentDashboard = function (user) {
  const studentGrades = grades.filter((g) => g.student === user.username);
  const performanceTable = window.displayStudentPerformance(user.username);

  return `
    <h3>Welcome, ${user.username}</h3>
    <p>Your Grades:</p>
    ${performanceTable}
  `;
};
