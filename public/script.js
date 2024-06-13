const correctPassword = "tobiiscool"; // Set your desired password here

function checkPassword() {
  const passwordInput = document.getElementById("password-input").value;
  const errorMessage = document.getElementById("error-message");

  if (passwordInput === correctPassword) {
    document.getElementById("password-section").style.display = "none";
    document.getElementById("podcast-section").style.display = "block";
    loadComments();
  } else {
    errorMessage.textContent = "Incorrect password. Please try again.";
  }
}

document
  .getElementById("comment-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const comment = document.getElementById("comment").value;

    if (name && comment) {
      const commentData = { name, comment };

      fetch("/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      })
        .then((response) => response.json())
        .then((comment) => {
          addCommentToList(comment);
          document.getElementById("comment-form").reset();
        })
        .catch((error) => console.error("Error:", error));
    }
  });

function loadComments() {
  fetch("/comments")
    .then((response) => response.json())
    .then((comments) => {
      comments.forEach(addCommentToList);
    })
    .catch((error) => console.error("Error:", error));
}

function addCommentToList({ name, comment }) {
  const commentElement = document.createElement("div");
  commentElement.innerHTML = `<strong>${name}</strong>: ${comment}`;
  document.getElementById("comments-list").appendChild(commentElement);
}

// Load comments when the page loads
window.onload = checkPassword;
