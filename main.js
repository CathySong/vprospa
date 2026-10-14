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

const calEmbed = document.querySelector("#cal-booking");

if (calEmbed) {
  const calLink = (calEmbed.dataset.calLink || "").trim();

  if (!calLink) {
    calEmbed.dataset.calStatus = "pending";
  } else {
    calEmbed.dataset.calStatus = "active";

    (function initCalEmbed(windowRef, scriptSrc, initName) {
      const documentRef = windowRef.document;
      windowRef.Cal = windowRef.Cal || function Cal() {
        const cal = windowRef.Cal;
        const args = arguments;
        const push = function push(queue, queueArgs) {
          queue.q.push(queueArgs);
        };

        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          const script = documentRef.createElement("script");
          script.src = scriptSrc;
          script.async = true;
          documentRef.head.appendChild(script);
          cal.loaded = true;
        }

        if (args[0] === initName) {
          const namespace = args[1];
          const api = function api() {
            push(api, arguments);
          };
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            push(cal.ns[namespace], args);
            push(cal, ["initNamespace", namespace]);
          } else {
            push(cal, args);
          }
          return;
        }

        push(cal, args);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    Cal("init", "vprospa", { origin: "https://cal.com" });
    Cal.ns.vprospa("inline", {
      elementOrSelector: "#cal-booking",
      calLink,
      config: {
        layout: "month_view",
        theme: "light"
      }
    });
    Cal.ns.vprospa("ui", {
      theme: "light",
      hideEventTypeDetails: false,
      layout: "month_view",
      cssVarsPerTheme: {
        light: {
          "cal-brand": "#24a99b",
          "cal-brand-emphasis": "#1f6f67",
          "cal-border-emphasis": "#dce9e7"
        }
      }
    });
  }
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
