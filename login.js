document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();

    // Get input values
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Retrieve stored user data
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    // Check if email and password match the stored data
    if (email === storedEmail && password === storedPassword) {
        alert("Login Successful!");
        window.location.href = "shop.html"; // Redirect to the shop page
    } else {
        document.getElementById("error-message").textContent = "Invalid email or password. Please register first.";
    }
});
