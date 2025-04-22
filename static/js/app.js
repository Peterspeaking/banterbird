const username = "admin";

function renderPost(post) {
  const template = document
    .getElementById("post-template")
    .content.cloneNode(true);
  template.querySelector(".username").innerText = post.username;
  template.querySelector(".message").innerText = post.message;
  document.getElementById("feed").appendChild(template);
}

async function submitPost() {
  const message = document.getElementById("postInput").value;
  console.log(message, username);
  try {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        message: message,
      }),
    });
  } catch (error) {
    console.error("Post failed 😭", error);
  }
}

window.onload = async () => {
  try {
    const response = await fetch("/api/posts");
    const posts = await response.json();
    posts.forEach((post) => {
      renderPost(post);
    });
  } catch (error) {
    console.error("FIXXX ITTTT", error);
  }
};
