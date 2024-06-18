const correctPassword = "tobiiscool"; // Set your desired password here

const episodeFiles = {
  1: "podcast1.m4a",
  2: "podcast2.m4a",
};

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
    const episode = document.getElementById("episode-selector").value;

    if (name && comment) {
      const commentData = { episode, name, comment };

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

function loadComments(episode) {
  fetch(`/comments?episode=${episode}`)
    .then((response) => response.json())
    .then((comments) => {
      const commentsList = document.getElementById("comments-list");
      commentsList.innerHTML = "";
      comments.forEach(addCommentToList);
    })
    .catch((error) => console.error("Error:", error));
}

function addCommentToList({ name, comment }) {
  const commentElement = document.createElement("div");
  commentElement.innerHTML = `<strong>${name}</strong>: ${comment}`;
  document.getElementById("comments-list").appendChild(commentElement);
}

document
  .getElementById("episode-selector")
  .addEventListener("change", function () {
    const selectedEpisode = this.value;
    const audioSource = document.getElementById("audio-source");
    const podcastAudio = document.getElementById("podcast-audio");

    audioSource.src = episodeFiles[selectedEpisode];
    podcastAudio.load();
    loadComments(selectedEpisode);
  });

// Load comments when the page loads
window.onload = checkPassword;
