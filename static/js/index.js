let username = "";


function renderPost(post) {
    const template = document.getElementById("post-template").content.cloneNode(true);
    template.querySelector(".username").innerText = post.username;
    template.querySelector(".message").innerText = post.message;
    document.getElementById("feed").appendChild(template);
}

async function submitPost() {
    const message = document.getElementById("postInput").value;
    // Get the current time
    const now = new Date();

    // Get the local time zone offset (in minutes)
    const localOffset = now.getTimezoneOffset(); // Minutes behind UTC


    try{
        const response_a =  await fetch("/api/add_post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username, message, offset: localOffset, timestamp: now

            })
        })
        console.log("sent");
    } catch (error) {
        console.error("Post failed:", error);
    }
    try {
        const response_b = await fetch("/api/posts");
        console.log(response_b);
        const posts_b = await response_b.json();
        posts_b.forEach(post => renderPost(post));
    } catch (error) {
        console.error("An error occurred", error);
    }
}

function confirm_login()  {
    username = "";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookies = decodedCookie.split(';');
    for(let i = 0; i <cookies.length; i++) {
        let current_cookie = cookies[i].trim();
        if (current_cookie.startsWith("username=")) {
            username = current_cookie.substring("username=".length);
            return true;
        }
    }
    return false;
}


let logged_in = confirm_login();
console.log(logged_in);
if (logged_in) {
    console.log("Logged in: true");
} else {
    console.log("Logged in: false");
    window.location.href = "/login";
}



window.onload = async function() {
    document.getElementById("username").innerHTML = username;
    console.log(username);
    try {
        const response = await fetch("/api/posts");
        const posts = await response.json();
        posts.forEach(post => renderPost(post));
    } catch (error) {
        console.error("An error occurred", error);
    }
};