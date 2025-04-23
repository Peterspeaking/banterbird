let username = "admin";

function renderPost(post) {
    const template = document.getElementById("post-template").content.cloneNode(true);
    template.querySelector(".username").innerText = post.username;
    template.querySelector(".message").innerText = post.message;
    document.getElementById("feed").appendChild(template);
}

async function submitPost() {
    const message = document.getElementById("postInput").value;
    try{
        const response =  await fetch("/api/add_post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username, message
            })
        })
    } catch (error) {
        console.error("Post failed:", error);
    }
    try {
        document.getElementById("feed").innerHTML = "";
        document.getElementById("postInput").value = "";
        const response = await fetch("/api/posts");
        const posts = await response.json();
        posts.forEach(post => renderPost(post));
    } catch (error) {
        console.error("An error occurred", error);
    }
}

window.onload = async() => {
    let username = "";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookies = decodedCookie.split(';');
    for(let i = 0; i <cookies.length; i++) {
        let current_cookie = cookies[i].trim();
        if (current_cookie.startsWith("username=")) {
            username = current_cookie.substring("username=".length);
            break;
        }
    }
    if (username) {
        document.getElementById("username").innerHTML = username;
        console.log(username);
        try {
            const response = await fetch("/api/posts");
            const posts = await response.json();
            posts.forEach(post => renderPost(post));
        } catch (error) {
            console.error("An error occurred", error);
        }
    } else {
        window.location.href = "/login";
    }
};

