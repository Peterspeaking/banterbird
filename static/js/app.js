let username = localStorage.getItem("username");
if (!username) {
  window.location.href = "/login";
}

function renderPost(post, isNew = false) {
  const template = document
    .getElementById("post-template")
    .content.cloneNode(true);
  template.querySelector(".username").innerText = post.username;
  template.querySelector(".message").innerText = post.message;

  if (isNew) {
    document.getElementById("feed").prepend(template);
  } else {
    document.getElementById("feed").appendChild(template);
  }
}

async function submitPost() {
  const message = document.getElementById("postInput").value;
  try {
    const response = await fetch("/api/add_post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, message }),
    });
    if (response.ok) {
      renderPost({ username, message }, true); // Pass `isNew = true`
      document.getElementById("postInput").value = ""; // Clear the input box
    }
  } catch (error) {
    console.error("Error submitting post:", error);
  }
}

window.onload = async () => {
  try {
    const response = await fetch("/api/posts");
    const posts = await response.json();
    posts.forEach((post) => renderPost(post));
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

setInterval(async () => {
  try {
    const response = await fetch("/api/posts");
    const posts = await response.json();
    document.getElementById("feed").innerHTML = ""; // Clear the feed before rendering new posts
    posts.forEach((post) => renderPost(post));
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}, 5000); // 5 seconds
