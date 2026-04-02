const form = document.getElementById("studentForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const studentNumber = document.getElementById("studentNumber").value.trim();
  const email = document.getElementById("email").value.trim();
  const phoneNumber = document.getElementById("phoneNumber").value.trim();
  const residenceChoice = document.getElementById("residenceChoice").value;

  if (!fullName || !studentNumber || !email || !phoneNumber || !residenceChoice) {
    message.textContent = "Please fill in all fields.";
    message.className = "registration__message error";
    return;
  }

  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName,
        studentNumber,
        email,
        phoneNumber,
        residenceChoice
      })
    });

    const data = await response.json();

    if (data.success) {
      message.textContent = data.message;
      message.className = "registration__message success";
      form.reset();
    } else {
      message.textContent = data.message;
      message.className = "registration__message error";
    }
  } catch (error) {
    console.error("Error:", error);
    message.textContent = "Something went wrong. Please try again.";
    message.className = "registration__message error";
  }
});