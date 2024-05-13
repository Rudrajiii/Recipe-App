// Initialize Bootstrap alerts
document.addEventListener("DOMContentLoaded", function () {
  var alerts = document.querySelectorAll(".alert");
  alerts.forEach(function (alert) {
    new bootstrap.Alert(alert);
  });
});
