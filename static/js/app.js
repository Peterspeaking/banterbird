const username = "admin";

async function fetchPosts() {
    const res = await fetch("/api/posts");
    const posts = await res.json();
    const feed = document.getElementById("feed");
    feed.innerHTML = '';
    posts.forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.innerHTML = `<p><strong>${post.username}</strong>: ${post.message}</p><small>${post.timestamp}</small><hr>`;
        feed.appendChild(postDiv);
    });
}

function submitPost() {
    const message = document.getElementById("postInput").value;
    console.log("Would post:", message);
    alert("Tweet submitted (not really yet)");
}

window.onload = fetchPosts;