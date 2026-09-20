const form = document.getElementById("attendanceForm");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");

// Paste your deployed Google Web App URL here
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyO-EZnQINhsA5LQscne5WlLQt20y4Q_Pz9U99Be_KzRQGnGSIep3SN31PVmVb1tvbq/exec";

// Pre-fill inputs if previously saved locally
window.addEventListener("DOMContentLoaded", () => {
    const savedName = localStorage.getItem("att_name");
    const savedRole = localStorage.getItem("att_role");
    const savedPhone = localStorage.getItem("att_phone");
    const savedEmail = localStorage.getItem("att_email");

    if (savedName) document.getElementById("name").value = savedName;
    if (savedRole) document.getElementById("jobRole").value = savedRole;
    if (savedPhone) document.getElementById("phone").value = savedPhone;
    if (savedEmail) document.getElementById("email").value = savedEmail;
});

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const jobRole = document.getElementById("jobRole").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();

    // Cache user info locally for fast future check-outs
    localStorage.setItem("att_name", name);
    localStorage.setItem("att_role", jobRole);
    localStorage.setItem("att_phone", phone);
    localStorage.setItem("att_email", email);

    message.textContent = "Processing status...";
    message.style.color = "orange";
    submitBtn.disabled = true;

    try {
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ name, jobRole, phone, email })
        });

        const result = await response.json();

        if (result.status === "CHECK_IN") {
            message.textContent = `Check-In Successful ✓ (${result.time})`;
            message.style.color = "green";
        } else if (result.status === "CHECK_OUT") {
            message.textContent = `Check-Out Successful ✓ (${result.time})`;
            message.style.color = "#0056b3";
        } else {
            message.textContent = result.message || "An error occurred.";
            message.style.color = "red";
        }
    } catch (error) {
        console.error("Error!", error);
        message.textContent = "Network error. Try again.";
        message.style.color = "red";
    } finally {
        submitBtn.disabled = false;
    }
});