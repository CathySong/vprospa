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

const calendarEl = document.querySelector("#appointment-calendar");

function formatDateInput(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function buildBookingEvents() {
  const events = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const serviceFocus = {
    1: "Haircut & styling focus",
    3: "HydraFacial focus",
    4: "Head spa focus",
    5: "Hair color & styling focus",
    6: "Head spa requests"
  };

  for (let index = 0; index < 35; index += 1) {
    const day = new Date(today);
    day.setDate(today.getDate() + index);
    const dayOfWeek = day.getDay();
    const date = formatDateInput(day);

    if (dayOfWeek === 2) {
      events.push({
        title: "Closed",
        start: date,
        allDay: true,
        extendedProps: { status: "closed" }
      });
      continue;
    }

    const isShortDay = dayOfWeek === 0 || dayOfWeek === 1;
    const startTime = isShortDay ? "10:00:00" : "09:30:00";
    const endTime = isShortDay ? "17:00:00" : "19:30:00";

    events.push({
      title: isShortDay ? "Open requests 10-5" : "Open requests 9:30-7:30",
      start: `${date}T${startTime}`,
      end: `${date}T${endTime}`,
      extendedProps: { status: "open" }
    });

    if (serviceFocus[dayOfWeek]) {
      events.push({
        title: serviceFocus[dayOfWeek],
        start: `${date}T12:00:00`,
        end: `${date}T13:00:00`,
        extendedProps: { status: "focus" }
      });
    }
  }

  return events;
}

function syncBookingDate(date) {
  const dateInput = document.querySelector('#booking-form input[name="date"]');
  if (dateInput) {
    dateInput.value = formatDateInput(date);
    dateInput.focus();
  }
}

if (calendarEl && window.FullCalendar) {
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: window.matchMedia("(max-width: 680px)").matches ? "listWeek" : "timeGridWeek",
    height: "auto",
    fixedWeekCount: false,
    nowIndicator: true,
    selectable: true,
    firstDay: 0,
    allDaySlot: true,
    slotMinTime: "09:00:00",
    slotMaxTime: "20:00:00",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,listWeek"
    },
    events: buildBookingEvents(),
    businessHours: [
      { daysOfWeek: [0, 1], startTime: "10:00", endTime: "17:00" },
      { daysOfWeek: [3, 4, 5, 6], startTime: "09:30", endTime: "19:30" }
    ],
    dateClick(info) {
      syncBookingDate(info.date);
    },
    eventClick(info) {
      if (info.event.extendedProps.status !== "closed") {
        syncBookingDate(info.event.start);
      }
    },
    eventDidMount(info) {
      info.el.dataset.bookingEvent = info.event.extendedProps.status || "open";
    }
  });

  calendar.render();
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
