const bookingButtons = document.querySelectorAll("[data-booking]");

for (const button of bookingButtons) {
  button.addEventListener("click", () => {
    sessionStorage.setItem("vproPreferredService", button.dataset.booking);
  });
}

const serviceSelect = document.querySelector("#service");
const preferredService = sessionStorage.getItem("vproPreferredService");

if (serviceSelect && preferredService) {
  serviceSelect.value = preferredService;
}

const bookingForm = document.querySelector("#booking-form");

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const notice = document.querySelector("#booking-notice");
    notice.textContent = "Request saved for the self-hosted booking system handoff. Production API endpoint goes here.";
    notice.hidden = false;
    bookingForm.reset();
  });
}
