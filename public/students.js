const tableBody = document.getElementById("studentsTableBody");
const tableMessage = document.getElementById("tableMessage");

async function loadStudents() {
  try {
    const response = await fetch("/students");
    const data = await response.json();

    if (!data.success) {
      tableMessage.textContent = "Could not load students.";
      tableMessage.className = "registration__message error";
      return;
    }

    const students = data.students;

    if (students.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6">No students found.</td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = "";

    students.forEach((student) => {
      const row = `
        <tr>
          <td>${student.id}</td>
          <td>${student.full_name}</td>
          <td>${student.student_number}</td>
          <td>${student.email}</td>
          <td>${student.phone_number}</td>
          <td>${student.residence_choice}</td>
        </tr>
      `;

      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error("Error loading students:", error);
    tableMessage.textContent = "Something went wrong while loading students.";
    tableMessage.className = "registration__message error";
  }
}

loadStudents();