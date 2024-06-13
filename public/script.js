const passwordForm = document.getElementById("password-form");
const commentForm = document.getElementById("comment-form");
const commentsList = document.getElementById("comments-list");
const passwordInput = document.getElementById("password-input");
const errorMessage = document.getElementById("error-message");

passwordForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const password = passwordInput.value;

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      throw new Error("Incorrect password");
    }

    document.getElementById("password-section").style.display = "none";
    document.getElementById("podcast-section").style.display = "block";
    errorMessage.textContent = "";
    loadComments();
  } catch (error) {
    errorMessage.textContent = "Incorrect password. Please try again.";
  }
});

commentForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const comment = document.getElementById("comment").value;

  try {
    const response = await fetch("/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, comment }),
    });

    if (!response.ok) {
      throw new Error("Failed to post comment");
    }

    const commentElement = document.createElement("div");
    commentElement.innerHTML = `<strong>${name}</strong>: ${comment}`;
    commentsList.appendChild(commentElement);

    document.getElementById("comment-form").reset();
  } catch (error) {
    console.error("Error posting comment:", error);
    alert("Failed to post comment. Please try again later.");
  }
});

function loadComments() {
  fetch("/comments")
    .then((response) => response.json())
    .then((comments) => {
      commentsList.innerHTML = "";
      comments.forEach(({ name, comment }) => {
        const commentElement = document.createElement("div");
        commentElement.innerHTML = `<strong>${name}</strong>: ${comment}`;
        commentsList.appendChild(commentElement);
      });
    })
    .catch((error) => {
      console.error("Error loading comments:", error);
      alert("Failed to load comments. Please refresh the page.");
    });
}

// Load comments when the page loads
window.onload = loadComments;
