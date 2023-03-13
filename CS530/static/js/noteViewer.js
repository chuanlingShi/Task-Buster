$(document).ready(function () {
  // Set up hover event listener for existing cards
  $(".card").hover(
    function () {
      $(this).find(".delete-card-btn").removeClass("d-none");
    },
    function () {
      $(this).find(".delete-card-btn").addClass("d-none");
    }
  );
});
