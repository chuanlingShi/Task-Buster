$(document).ready(function () {
  // Listen for the click event on the "Add" button
  $("#add-note-btn").click(function () {
    // Retrieve the value of the input field
    var note = $("#inputField").val();

    // Create a new card element with the retrieved value
    var newCard = $("<div>")
      .addClass("col-sm-4 mb-2")
      .html(
        '<div class="card position-relative">' +
          '<div class="card-body">' +
          '<button class="btn btn-outline-danger position-absolute top-0 end-0 delete-card-btn d-none rounded-circle"><i class="fas fa-trash"></i></button>' +
          '<p class="card-text">' +
          note +
          "</p>" +
          "</div>" +
          "</div>"
      );

    // Append the new card element to the card container
    $(".card-container").append(newCard);

    // Clear the input field
    $("#inputField").val("");

    // Set up hover event listener for the new card
    newCard.hover(
      function () {
        $(this).find(".delete-card-btn").removeClass("d-none");
      },
      function () {
        $(this).find(".delete-card-btn").addClass("d-none");
      }
    );
  });

  // Set up hover event listener for existing cards
  $(".card").hover(
    function () {
      $(this).find(".delete-card-btn").removeClass("d-none");
    },
    function () {
      $(this).find(".delete-card-btn").addClass("d-none");
    }
  );

  // Listen for the click event on the delete button
  $(".card-container").on("click", ".delete-card-btn", function () {
    // Get the card element that contains the delete button
    var card = $(this).closest(".card");

    // Get the index of the card element
    var index = card.index();

    // Remove the card element from the card container
    card.remove();
  });
});
