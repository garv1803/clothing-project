document.getElementById("register-form").addEventListener("submit", function(e) {
    e.preventDefault();

    // Get user data
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    // Validation check
    if (username && email.includes("@") && phone.length === 10 && password) {
        // Store user data in localStorage
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("phone", phone);
        localStorage.setItem("password", password);

        // Show success message
        alert("Successfully Registered!");

        // Redirect to the login page after 2 seconds
        setTimeout(function() {
            window.location.href = "login.html";
        }, 2000);
    } else {
        alert("Please fill in all fields correctly.");
    }
});
