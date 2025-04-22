const form = document.getElementById("account-form")
console.log(form)
form.addEventListener("submit", async function(event) {
    event.preventDefault();  // Prevent form from reloading the page
    console.log("clicked");
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const errorMessage = document.getElementById("error-message");

    errorMessage.textContent = ""; // Clear previous error messages

    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match";
        return;
    }

    try {
        const response = await fetch("/api/register", {  // Changed from "/" to "/register"
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ username, password }),
        });
        console.log("sent");
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            switch (response.status) {
                case 400:
                    errorMessage.textContent = data.message || "Bad request — check your input.";
                    break;
                case 409:
                    errorMessage.textContent = data.message || "Username already exists.";
                    break;
                case 500:
                    errorMessage.textContent = "Server error — try again later.";
                    break;
                default:
                    errorMessage.textContent = data.message || "An unknown error occurred.";
                    break;
            }
            return;
        }

        // Redirect user after successful registration
        window.location.href = "/login";  // Redirect to login page
    } catch (error) {
        console.error("Fetch error:", error);
        errorMessage.textContent = "An error occurred. Please try again later.";
    }
});
