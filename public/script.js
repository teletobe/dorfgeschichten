const correctPassword = "tobiiscool"; // Set your desired password here

const episodeFiles = {
  1: "podcast1.m4a",
  2: "podcast2.m4a",
};

let currentEpisode = 1; // Default to episode 1

function checkPassword() {
  const passwordInput = document.getElementById("password-input").value;
  const errorMessage = document.getElementById("error-message");

  if (passwordInput === correctPassword) {
    document.getElementById("password-section").style.display = "none";
    document.getElementById("podcast-section").style.display = "block";
    loadComments(currentEpisode); // Load comments for the default episode
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
    const episode = currentEpisode; // Use the current episode value

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
      commentsList.innerHTML = ""; // Clear existing comments
      comments.forEach(addCommentToList);
    })
    .catch((error) => console.error("Error:", error));
}

function addCommentToList({ name, comment }) {
  const commentElement = document.createElement("div");
  commentElement.innerHTML = `<strong>${name}</strong>: ${comment}`;
  document.getElementById("comments-list").appendChild(commentElement);
}

// Handle episode selection
document
  .getElementById("episode-selector")
  .addEventListener("change", function () {
    currentEpisode = parseInt(this.value, 10);
    const audioSource = document.getElementById("audio-source");
    const podcastAudio = document.getElementById("podcast-audio");

    audioSource.src = episodeFiles[currentEpisode];
    podcastAudio.load();
    loadComments(currentEpisode);
  });

// Load comments when the page loads (ensure password check first)
window.onload = function () {
  const passwordSection = document.getElementById("password-section");
  const podcastSection = document.getElementById("podcast-section");
  if (podcastSection.style.display === "block") {
    loadComments(currentEpisode);
  }
};
