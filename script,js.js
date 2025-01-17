document.addEventListener("DOMContentLoaded", () => {
    // Registration
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const phone = document.getElementById("phone").value;
            const password = document.getElementById("password").value;

            // Save user to localStorage
            const users = JSON.parse(localStorage.getItem("users") || "[]");
            users.push({ name, email, phone, password });
            localStorage.setItem("users", JSON.stringify(users));

            alert("Registration successful!");
            window.location.href = "login.html";
        });
    }

    // Login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // Validate user
            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const user = users.find((user) => user.email === email && user.password === password);

            if (user) {
                alert(`Welcome, ${user.name}!`);
                window.location.href = "shop.html";
            } else {
                alert("Invalid email or password!");
            }
        });
    }
});
