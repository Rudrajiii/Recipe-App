document.addEventListener("DOMContentLoaded", function () {
  var alerts = document.querySelectorAll(".alert");
  alerts.forEach(function (alert) {
    new bootstrap.Alert(alert);
  });
});

setTimeout(function () {
  document.querySelector(".alert-success").style.display = "none";
}, 3000);

function isPageReloaded() {
  const navigationEntries = window.performance.getEntriesByType('navigation');
  if (navigationEntries.length > 0) {
      const lastNavigation = navigationEntries[navigationEntries.length - 1];
      return lastNavigation.type === 'reload';
  }
  return false;
}
let count = 0;
if (isPageReloaded()) {
  console.log("Page has been reloaded");
  count++;
} else {
  console.log("Page has been loaded normally");
}
count > 0 ? document.querySelector(".alert-success").style.display = "none": null;

document.querySelector(".history").addEventListener("click",(event)=>{
  event.preventDefault();
});


