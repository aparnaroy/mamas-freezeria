// Modal functionality for "How to Play"
document.addEventListener("DOMContentLoaded", function () {
    var modal = document.getElementById("howToModal");
    var howToButton = document.getElementById("howToButton");
    var span = document.getElementsByClassName("close")[0];
  
    // Open the modal when "How To Play" is clicked
    howToButton.onclick = function() {
      modal.style.display = "block";
    }
  
    // Close the modal when the user clicks the "x" button
    span.onclick = function() {
      modal.style.display = "none";
    }
  
    // Close the modal when the user clicks anywhere outside of the modal content
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  });
  