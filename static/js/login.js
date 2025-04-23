window.onload = () => {
    const form = document.getElementById('login-form');


    form.addEventListener("submit", async function(event){
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const data = {"username": username, "password": password};
        const json = JSON.stringify(data)

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username, password
                })
            })
            const data = await response.json();
            if (!response.ok) {
                console.error("Error occurred. Please try again later.");
                return;
            }
            console.log("good");
            let expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days from now
            document.cookie = "username=" + encodeURIComponent(username) + "; expires=" + expirationDate.toUTCString() + "; path=/";
            window.location.href = "/";

        } catch (error) {
            console.error("Fetch error:", error);
        }
    });
};