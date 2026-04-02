const tableBody = document.getElementById("studentsTableBody");
const tableMessage = document.getElementById("tableMessage");
const logoutBtn = document.getElementById("logoutBtn");
const exportBtn = document.getElementById("exportBtn");
const studentNumberSearch = document.getElementById("studentNumberSearch");
const residenceFilter = document.getElementById("residenceFilter");

const totalStudents = document.getElementById("totalStudents");
const totalResidences = document.getElementById("totalResidences");
const latestStudent = document.getElementById("latestStudent");

// Modal elements
const editModal = document.getElementById("editModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const editStudentForm = document.getElementById("editStudentForm");
const editMessage = document.getElementById("editMessage");

const editStudentId = document.getElementById("editStudentId");
const editFullName = document.getElementById("editFullName");
const editStudentNumber = document.getElementById("editStudentNumber");
const editEmail = document.getElementById("editEmail");
const editPhoneNumber = document.getElementById("editPhoneNumber");
const editResidenceChoice = document.getElementById("editResidenceChoice");

let allStudents = [];

// Load all students
async function loadStudents() {
  try {
    const response = await fetch("/admin/students");
    const data = await response.json();

    if (!data.success) {
      tableMessage.textContent = data.message || "Could not load students.";
      tableMessage.className = "registration__message error";
      return;
    }

    allStudents = data.students;

    updateSummaryCards(allStudents);
    populateResidenceFilter(allStudents);
    applyFilters();
  } catch (error) {
    console.error("Error loading students:", error);
    tableMessage.textContent = "Something went wrong while loading students.";
    tableMessage.className = "registration__message error";
  }
}

// Summary cards
function updateSummaryCards(students) {
  totalStudents.textContent = students.length;

  const uniqueResidences = [...new Set(students.map(student => student.residence_choice))];
  totalResidences.textContent = uniqueResidences.length;

  if (students.length > 0) {
    latestStudent.textContent = students[0].full_name;
  } else {
    latestStudent.textContent = "None";
  }
}

// Residence filter with counts
function populateResidenceFilter(students) {
  const currentValue = residenceFilter.value;
  const residenceCounts = {};

  students.forEach((student) => {
    const residence = student.residence_choice;
    if (residenceCounts[residence]) {
      residenceCounts[residence]++;
    } else {
      residenceCounts[residence] = 1;
    }
  });

  residenceFilter.innerHTML = `<option value="">All Residences</option>`;

  Object.keys(residenceCounts).forEach((residence) => {
    const option = document.createElement("option");
    option.value = residence;
    option.textContent = `${residence} (${residenceCounts[residence]})`;
    residenceFilter.appendChild(option);
  });

  residenceFilter.value = currentValue;
}

// Render table
function renderStudents(students) {
  if (students.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7">No students found.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = "";

  students.forEach((student, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${student.full_name}</td>
        <td>${student.student_number}</td>
        <td>${student.email}</td>
        <td>${student.phone_number}</td>
        <td>${student.residence_choice}</td>
        <td class="actions-cell">
          <button class="button action-btn edit-btn" onclick="openEditModal(${student.id})">
            Edit
          </button>
          <button class="button action-btn delete-btn-custom" onclick="deleteStudent(${student.id})">
            Delete
          </button>
        </td>
      </tr>
    `;

    tableBody.innerHTML += row;
  });
}

// Search by student number + filter by residence
function applyFilters() {
  const studentNumberValue = studentNumberSearch.value.toLowerCase().trim();
  const residenceValue = residenceFilter.value;

  const filteredStudents = allStudents.filter((student) => {
    const matchesStudentNumber = student.student_number
      .toLowerCase()
      .includes(studentNumberValue);

    const matchesResidence =
      residenceValue === "" || student.residence_choice === residenceValue;

    return matchesStudentNumber && matchesResidence;
  });

  renderStudents(filteredStudents);
}

// Open edit modal
function openEditModal(id) {
  const student = allStudents.find((item) => item.id === id);

  if (!student) return;

  editStudentId.value = student.id;
  editFullName.value = student.full_name;
  editStudentNumber.value = student.student_number;
  editEmail.value = student.email;
  editPhoneNumber.value = student.phone_number;
  editResidenceChoice.value = student.residence_choice;

  editMessage.textContent = "";
  editMessage.className = "registration__message";

  editModal.classList.remove("hidden");
}

// Close modal
function closeEditModal() {
  editModal.classList.add("hidden");
}

// Update student
editStudentForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = editStudentId.value;

  const updatedStudent = {
    fullName: editFullName.value.trim(),
    studentNumber: editStudentNumber.value.trim(),
    email: editEmail.value.trim(),
    phoneNumber: editPhoneNumber.value.trim(),
    residenceChoice: editResidenceChoice.value
  };

  try {
    const response = await fetch(`/admin/students/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedStudent)
    });

    const data = await response.json();

    if (data.success) {
      editMessage.textContent = data.message;
      editMessage.className = "registration__message success";

      tableMessage.textContent = data.message;
      tableMessage.className = "registration__message success";

      await loadStudents();

      setTimeout(() => {
        closeEditModal();
      }, 800);
    } else {
      editMessage.textContent = data.message;
      editMessage.className = "registration__message error";
    }
  } catch (error) {
    console.error("Update error:", error);
    editMessage.textContent = "Something went wrong while updating.";
    editMessage.className = "registration__message error";
  }
});

// Delete student
async function deleteStudent(id) {
  const confirmed = confirm("Are you sure you want to delete this student?");
  if (!confirmed) return;

  try {
    const response = await fetch(`/admin/students/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (data.success) {
      tableMessage.textContent = data.message;
      tableMessage.className = "registration__message success";
      loadStudents();
    } else {
      tableMessage.textContent = data.message;
      tableMessage.className = "registration__message error";
    }
  } catch (error) {
    console.error("Delete error:", error);
    tableMessage.textContent = "Something went wrong while deleting.";
    tableMessage.className = "registration__message error";
  }
}

// Logout
logoutBtn.addEventListener("click", async function () {
  try {
    const response = await fetch("/admin/logout", {
      method: "POST"
    });

    const data = await response.json();

    if (data.success) {
      window.location.href = "/admin/login";
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
});

// Export CSV
exportBtn.addEventListener("click", function () {
  window.location.href = "/admin/export";
});

// Close modal button
closeModalBtn.addEventListener("click", closeEditModal);

// Close modal when clicking outside
editModal.addEventListener("click", function (e) {
  if (e.target === editModal) {
    closeEditModal();
  }
});

// Filters
studentNumberSearch.addEventListener("input", applyFilters);
residenceFilter.addEventListener("change", applyFilters);

// Start
loadStudents();