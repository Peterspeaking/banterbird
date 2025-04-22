const username = "admin";

function renderPost(post) {
    const template = document.getElementById("post-template").content.cloneNode(true);
    template.querySelector(".username").innerText = post.username;
    template.querySelector(".message").innerText = post.message;
    document.getElementById("feed").appendChild(template);
}

async function submitPost() {
    const message = document.getElementById("postInput").value;
    try{
        const response = await fetch("/api/add_post", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                username,
                message,
            }),
        })
    } catch(error){
        console.log("😔 FAILED", error)
    }
}

window.onload = () => {
    const hardcodedPost = {
        username: "admin",
        message: "Welcome to Banterbird! This post is hardcoded.",
    };
    renderPost(hardcodedPost);
};
