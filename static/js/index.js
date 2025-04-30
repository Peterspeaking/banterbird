let username = "";
// Checks login Status
let logged_in = confirm_login();
console.log(logged_in);
if (logged_in) {
    console.log("Logged in: true");
} else {
    console.log("Logged in: false");
    window.location.href = "/login";
}



function sleep(s) {
    let ms = s*1000;
    return new Promise(resolve => setTimeout(resolve, ms));
}



function renderPost(post) {
    const template = document.getElementById("post-template").content.cloneNode(true);

    template.querySelector(".username").innerText = post.username;
    template.querySelector(".message").innerText = post.message;

    if (post.timestamp) {
        const timestamp = new Date(post.timestamp);
        template.querySelector(".timestamp").innerText = getRelativeTime(timestamp);
    } else {
        template.querySelector(".timestamp").innerText = "";
    }

    document.getElementById("feed").appendChild(template);
}


function getRelativeTime(time) {
    const now = new Date();
    const diff = Math.floor((now - time) / 1000); // difference in seconds

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    return time.toLocaleDateString();
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
    document.getElementById("postInput").value = "";
    try {
        await show_posts()
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


async function show_posts() {
    document.getElementById("username").innerHTML = username;
    console.log(username);
    try {
        const response = await fetch("/api/posts");
        const posts = await response.json();
        const feed = document.getElementById("feed");
        feed.innerHTML = "";
        console.log("rendering posts");
        console.log(posts);
        posts.forEach(post => renderPost(post));
    } catch (error) {
        console.error("An error occurred", error);
    }
}





window.onload = async function() {
    await show_posts();
    while (true) {
        await sleep(60);
        await show_posts();
    }
};