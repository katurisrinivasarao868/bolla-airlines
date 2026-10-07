"use strict";

/* =========================================
   FLIGHT DATA
========================================= */

const flights = [
    {
        id: 1,
        airline: "bolla",
        icon: "✈️",
        from: "Delhi",
        to: "Mumbai",
        departure: "06:30",
        arrival: "08:45",
        duration: 135,
        price: 4299
    },
    {
        id: 2,
        airline: "shirtyy",
        icon: "🛫",
        from: "Delhi",
        to: "Mumbai",
        departure: "09:15",
        arrival: "11:35",
        duration: 140,
        price: 3899
    },
    {
        id: 3,
        airline: "kowshi",
        icon: "🛩️",
        from: "Delhi",
        to: "Mumbai",
        departure: "14:20",
        arrival: "16:30",
        duration: 130,
        price: 4599
    },
    {
        id: 4,
        airline: "bolla",
        icon: "✈️",
        from: "Delhi",
        to: "Bangalore",
        departure: "07:20",
        arrival: "10:05",
        duration: 165,
        price: 5299
    },
    {
        id: 5,
        airline: "mahi",
        icon: "🛫",
        from: "Mumbai",
        to: "Delhi",
        departure: "08:10",
        arrival: "10:20",
        duration: 130,
        price: 4099
    },
    {
        id: 6,
        airline: "shirtyy",
        icon: "🛩️",
        from: "Mumbai",
        to: "Bangalore",
        departure: "12:00",
        arrival: "13:40",
        duration: 100,
        price: 3499
    },
    {
        id: 7,
        airline: "kowshi",
        icon: "✈️",
        from: "Bangalore",
        to: "Delhi",
        departure: "15:30",
        arrival: "18:15",
        duration: 165,
        price: 4999
    },
    {
        id: 8,
        airline: "bolla",
        icon: "🛫",
        from: "Hyderabad",
        to: "Delhi",
        departure: "10:00",
        arrival: "12:20",
        duration: 140,
        price: 3799
    },
    {
        id: 9,
        airline: "mahendra",
        icon: "🛩️",
        from: "Hyderabad",
        to: "Mumbai",
        departure: "16:15",
        arrival: "17:55",
        duration: 100,
        price: 3299
    }
];


/* =========================================
   DOM ELEMENTS
========================================= */

const searchForm = document.getElementById("searchForm");
const fromInput = document.getElementById("from");
const toInput = document.getElementById("to");
const departureInput = document.getElementById("departure");
const returnInput = document.getElementById("returnDate");
const returnField = document.getElementById("returnField");
const passengersInput = document.getElementById("passengers");

const swapBtn = document.getElementById("swapBtn");
const flightList = document.getElementById("flightList");
const resultTitle = document.getElementById("resultTitle");
const sortFlights = document.getElementById("sortFlights");

const bookingModal = document.getElementById("bookingModal");
const bookingContent = document.getElementById("bookingContent");
const closeModal = document.getElementById("closeModal");
const bookingHistory = document.getElementById("bookingHistory");
const messageRegion = document.getElementById("appMessage");


/* =========================================
   APPLICATION STATE
========================================= */

let currentFlights = [];
let selectedFlight = null;
let selectedReturnFlight = null;
let bookingTrigger = null;


/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", init);


function init() {

    setMinimumDates();

    setupTripType();

    setupSearch();

    setupSwap();

    setupSorting();

    setupBookingEvents();

    setupModal();

    renderBookings();

}


/* =========================================
   DATE SETUP
========================================= */

function setMinimumDates() {

    const today = new Date();

    const dateString =
        formatDateInput(today);

    departureInput.min = dateString;

    returnInput.min = departureInput.value || dateString;

    departureInput.addEventListener("change", () => {
        returnInput.min = departureInput.value || dateString;

        if (returnInput.value && returnInput.value <= departureInput.value) {
            returnInput.value = "";
        }
    });

}


/* =========================================
   ONE WAY / ROUND TRIP
========================================= */

function setupTripType() {

    const tripRadios =
        document.querySelectorAll(
            'input[name="trip"]'
        );

    tripRadios.forEach(radio => {

        radio.addEventListener(
            "change",
            handleTripChange
        );

    });

}


function handleTripChange(event) {

    const isRoundTrip =
        event.target.value === "roundtrip";

    returnField.hidden = !isRoundTrip;

    returnInput.required = isRoundTrip;

    if (!isRoundTrip) {
        returnInput.value = "";
    }

}


/* =========================================
   SEARCH
========================================= */

function setupSearch() {

    searchForm.addEventListener(
        "submit",
        handleSearch
    );

}


function handleSearch(event) {

    event.preventDefault();


    const from =
        normalize(fromInput.value);

    const to =
        normalize(toInput.value);

    const departure =
        departureInput.value;
    const returnDate =
        returnInput.value;
    const isRoundTrip =
        document.querySelector('input[name="trip"]:checked').value === "roundtrip";


    if (!from || !to) {

        showMessage(
            "Please enter both departure and destination.",
            "error"
        );

        return;
    }


    if (from === to) {

        showMessage(
            "Departure and destination cannot be the same.",
            "error"
        );

        return;
    }


    if (!departure) {

        showMessage(
            "Please select a departure date.",
            "error"
        );

        return;
    }


    if (departure < formatDateInput(new Date())) {

        showMessage(
            "Please select a future date.",
            "error"
        );

        return;
    }


    if (isRoundTrip && (!returnDate || returnDate <= departure)) {

        showMessage(
            "Return date must be after the departure date.",
            "error"
        );

        return;
    }


    const results =
        flights.filter(flight =>
            normalize(flight.from) === from &&
            normalize(flight.to) === to &&
            (!isRoundTrip || flights.some(returnFlight =>
                normalize(returnFlight.from) === to &&
                normalize(returnFlight.to) === from
            ))
        );


    currentFlights = sortFlightsByPreference(results);


    displayFlights(
        currentFlights,
        from,
        to
    );


    document
        .getElementById("flights")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================================
   DISPLAY FLIGHTS
========================================= */

function displayFlights(
    results,
    from,
    to
) {

    flightList.innerHTML = "";


    resultTitle.textContent =
        `${capitalize(from)} → ${capitalize(to)}`;


    if (results.length === 0) {

        flightList.innerHTML = `
            <div class="empty-state">

                <div>🔍</div>

                <h3>No flights found</h3>

                <p>
                    Try another destination or date.
                </p>

            </div>
        `;

        return;
    }


    const fragment =
        document.createDocumentFragment();


    results.forEach(flight => {

        const wrapper =
            document.createElement("div");

        wrapper.innerHTML =
            createFlightCard(flight);

        fragment.appendChild(
            wrapper.firstElementChild
        );

    });


    flightList.appendChild(fragment);

}


/* =========================================
   FLIGHT CARD
========================================= */

function createFlightCard(flight) {

    return `
        <article class="flight-card">

            <div class="airline">

                <div class="airline-icon">
                    ${flight.icon}
                </div>

                <div>
                    <strong>
                        ${escapeHTML(flight.airline)}
                    </strong>

                    <small>
                        Economy
                    </small>
                </div>

            </div>


            <div class="flight-time">

                <strong>
                    ${flight.departure}
                </strong>

                <small>
                    ${escapeHTML(flight.from)}
                </small>

            </div>


            <div class="duration">

                ${formatDuration(flight.duration)}

                <br>

                <small>
                    Non-stop
                </small>

            </div>


            <div class="flight-time">

                <strong>
                    ${flight.arrival}
                </strong>

                <small>
                    ${escapeHTML(flight.to)}
                </small>

            </div>


            <div class="price">

                <strong>
                    ₹${formatPrice(flight.price)}
                </strong>

                <small>
                    per passenger
                </small>

                <button
                    type="button"
                    class="book-btn"
                    data-flight-id="${flight.id}"
                >
                    Book Now
                </button>

            </div>

        </article>
    `;
}


/* =========================================
   SWAP CITIES
========================================= */

function setupSwap() {

    swapBtn.addEventListener(
        "click",
        () => {

            const temp =
                fromInput.value;

            fromInput.value =
                toInput.value;

            toInput.value =
                temp;

        }
    );

}


/* =========================================
   SORTING
========================================= */

function setupSorting() {

    sortFlights.addEventListener(
        "change",
        () => {

            if (!currentFlights.length) {
                return;
            }


            currentFlights = sortFlightsByPreference(currentFlights);


            displayFlights(
                currentFlights,
                fromInput.value,
                toInput.value
            );

        }
    );

}


/* =========================================
   BOOKING CLICK
========================================= */

function setupBookingEvents() {

    flightList.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".book-btn"
                );


            if (!button) {
                return;
            }


            const flightId =
                Number(
                    button.dataset.flightId
                );


            const flight =
                flights.find(
                    item =>
                        item.id === flightId
                );


            if (!flight) {

                showMessage(
                    "Flight could not be found.",
                    "error"
                );

                return;
            }


            selectedFlight = flight;
            bookingTrigger = button;

            openBooking(flight);

        }
    );

}


/* =========================================
   OPEN BOOKING
========================================= */

function openBooking(flight) {

    const passengers =
        Number(
            passengersInput.value
        );


    const isRoundTrip =
        document.querySelector('input[name="trip"]:checked').value === "roundtrip";
    const returnFlights = isRoundTrip
        ? flights.filter(item =>
            normalize(item.from) === normalize(flight.to) &&
            normalize(item.to) === normalize(flight.from)
        )
        : [];

    if (isRoundTrip && !returnFlights.length) {
        showMessage("No return flights are available for this route.", "error");
        return;
    }

    selectedReturnFlight = returnFlights[0] || null;

    const total =
        (flight.price + (selectedReturnFlight?.price || 0)) * passengers;


    bookingContent.innerHTML = `

        <h2 id="bookingTitle">
            🎫 Book Your Flight
        </h2>

        <div class="booking-summary">

            <p>
                <strong>Airline:</strong>
                ${escapeHTML(flight.airline)}
            </p>

            <p>
                <strong>Route:</strong>
                ${escapeHTML(flight.from)}
                →
                ${escapeHTML(flight.to)}
            </p>

            <p>
                <strong>Outbound:</strong>
                ${flight.departure}
                -
                ${flight.arrival}
            </p>

            ${isRoundTrip ? `
                <p>
                    <strong>Return date:</strong>
                    ${escapeHTML(returnInput.value)}
                </p>
            ` : ""}

            <p>
                <strong>Passengers:</strong>
                ${passengers}
            </p>

            <p>
                <strong>Total:</strong>
                <span id="bookingTotal">₹${formatPrice(total)}</span>
            </p>

        </div>

        ${isRoundTrip ? `
            <label class="return-flight-field" for="returnFlight">
                Return flight
                <select id="returnFlight">
                    ${returnFlights.map(returnFlight => `
                        <option value="${returnFlight.id}">
                            ${escapeHTML(returnFlight.airline)} · ${returnFlight.departure} - ${returnFlight.arrival} · ₹${formatPrice(returnFlight.price)}
                        </option>
                    `).join("")}
                </select>
            </label>
        ` : ""}


        <form
            id="bookingForm"
            class="booking-form"
        >

            <label>
                Full Name

                <input
                    type="text"
                    id="passengerName"
                    placeholder="Enter your name"
                    maxlength="60"
                    required
                >
            </label>


            <label>
                Email

                <input
                    type="email"
                    id="passengerEmail"
                    placeholder="example@gmail.com"
                    required
                >
            </label>


            <label>
                Phone

                <input
                    type="tel"
                    id="passengerPhone"
                    placeholder="10 digit mobile number"
                    inputmode="numeric"
                    pattern="[0-9]{10}"
                    maxlength="10"
                    required
                >
            </label>


            <button
                type="submit"
                class="confirm-btn"
            >
                Confirm Booking
            </button>

        </form>
    `;


    bookingModal.classList.add("active");
    bookingModal.setAttribute("aria-hidden", "false");


    const bookingForm =
        document.getElementById(
            "bookingForm"
        );


    bookingForm.addEventListener(
        "submit",
        handleBooking
    );

    const returnFlightInput = document.getElementById("returnFlight");

    if (returnFlightInput) {
        returnFlightInput.addEventListener("change", () => {
            selectedReturnFlight = returnFlights.find(item =>
                item.id === Number(returnFlightInput.value)
            );

            const updatedTotal =
                (flight.price + (selectedReturnFlight?.price || 0)) * passengers;
            document.getElementById("bookingTotal").textContent =
                `₹${formatPrice(updatedTotal)}`;
        });
    }

    document.getElementById("passengerName").focus();

}


/* =========================================
   CONFIRM BOOKING
========================================= */

function handleBooking(event) {

    event.preventDefault();


    if (!selectedFlight) {
        return;
    }


    const name =
        document
            .getElementById("passengerName")
            .value
            .trim();


    const email =
        document
            .getElementById("passengerEmail")
            .value
            .trim();


    const phone =
        document
            .getElementById("passengerPhone")
            .value
            .trim();


    if (
        name.length < 2 ||
        !isValidEmail(email) ||
        !/^[0-9]{10}$/.test(phone)
    ) {

        showMessage(
            "Please enter valid passenger details.",
            "error"
        );

        return;
    }


    const passengers =
        Number(
            passengersInput.value
        );


    const isRoundTrip = Boolean(returnInput.value);

    if (isRoundTrip && !selectedReturnFlight) {
        showMessage("Please select a return flight.", "error");
        return;
    }

    const total =
        (selectedFlight.price + (selectedReturnFlight?.price || 0)) *
        passengers;


    const booking = {

        id: generateBookingId(),

        passengerName: name,

        email: email,

        phone: phone,

        airline:
            selectedFlight.airline,

        from:
            selectedFlight.from,

        to:
            selectedFlight.to,

        departure:
            selectedFlight.departure,

        arrival:
            selectedFlight.arrival,

        departureDate:
            departureInput.value,

        returnDate:
            isRoundTrip ? returnInput.value : "",

        returnAirline:
            selectedReturnFlight?.airline || "",

        returnDeparture:
            selectedReturnFlight?.departure || "",

        returnArrival:
            selectedReturnFlight?.arrival || "",

        passengers:

            passengers,

        total:

            total,

        bookingDate:
            new Date().toISOString()

    };


    if (!saveBooking(booking)) {
        return;
    }


    showBookingSuccess(booking);
    renderBookings();

}


/* =========================================
   BOOKING SUCCESS
========================================= */

function showBookingSuccess(booking) {

    bookingContent.innerHTML = `

        <div class="success">

            <div class="success-icon">
                🎉
            </div>

            <h2>
                Booking Confirmed!
            </h2>

            <p>
                Your flight has been booked successfully.
            </p>


            <div class="booking-summary">

                <p>
                    <strong>
                        Booking ID:
                    </strong>

                    ${booking.id}
                </p>

                <p>
                    <strong>
                        Passenger:
                    </strong>

                    ${escapeHTML(
                        booking.passengerName
                    )}
                </p>

                <p>
                    <strong>
                        Flight:
                    </strong>

                    ${escapeHTML(
                        booking.airline
                    )}
                </p>

                <p>
                    <strong>
                        Route:
                    </strong>

                    ${escapeHTML(
                        booking.from
                    )}
                    →
                    ${escapeHTML(
                        booking.to
                    )}
                </p>

                <p>
                    <strong>
                        Passengers:
                    </strong>

                    ${booking.passengers}
                </p>

                <p>
                    <strong>
                        Total:
                    </strong>

                    ₹${formatPrice(
                        booking.total
                    )}
                </p>

            </div>


            <p>
                Confirmation:
                <strong>
                    ${escapeHTML(
                        booking.email
                    )}
                </strong>
            </p>


            <br>


            <button
                type="button"
                class="confirm-btn"
                id="doneButton"
            >
                Done
            </button>

        </div>
    `;


    document
        .getElementById("doneButton")
        .addEventListener(
            "click",
            closeBooking
        );

}


/* =========================================
   LOCAL STORAGE
========================================= */

function saveBooking(booking) {

    try {
        const bookings = getBookings();
        bookings.push(booking);

        localStorage.setItem(
            "skybook_bookings",
            JSON.stringify(bookings)
        );

        return true;
    } catch (error) {
        showMessage(
            "Your booking could not be saved in this browser. Check browser storage settings and try again.",
            "error"
        );

        return false;
    }

}


function getBookings() {

    try {

        const storedBookings = localStorage.getItem("skybook_bookings");
        const bookings = storedBookings ? JSON.parse(storedBookings) : [];

        return Array.isArray(bookings) ? bookings : [];

    } catch (error) {

        showMessage(
            "Saved bookings could not be read from this browser.",
            "error"
        );

        return [];

    }

}


/* =========================================
   MODAL
========================================= */

function setupModal() {

    closeModal.addEventListener(
        "click",
        closeBooking
    );


    bookingModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                bookingModal
            ) {

                closeBooking();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                bookingModal.classList.contains(
                    "active"
                )
            ) {

                closeBooking();

            }

        }
    );

}


function closeBooking() {

    bookingModal.classList.remove(
        "active"
    );

    bookingModal.setAttribute("aria-hidden", "true");

    selectedFlight = null;
    selectedReturnFlight = null;

    if (bookingTrigger?.isConnected) {
        bookingTrigger.focus();
    }

    bookingTrigger = null;

}


/* =========================================
   VALIDATION
========================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================
   BOOKING ID
========================================= */

function generateBookingId() {

    const random =
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();


    return `SKY-${Date.now()
        .toString()
        .slice(-6)}-${random}`;

}


/* =========================================
   HELPERS
========================================= */

function normalize(value) {

    return value
        .trim()
        .toLowerCase();

}


function formatDateInput(date) {

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function capitalize(value) {

    if (!value) {
        return "";
    }


    return value.charAt(0).toUpperCase() +
        value.slice(1);

}


function formatDuration(minutes) {

    const hours =
        Math.floor(minutes / 60);

    const mins =
        minutes % 60;


    return `${hours}h ${mins}m`;

}


function formatPrice(price) {

    return Number(price)
        .toLocaleString("en-IN");

}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function renderBookings() {

    const bookings = getBookings()
        .filter(booking => booking && typeof booking === "object");

    if (!bookings.length) {
        bookingHistory.innerHTML = `
            <div class="empty-state">
                <div aria-hidden="true">&#9992;</div>
                <h3>No bookings yet</h3>
                <p>Confirmed bookings will appear here.</p>
            </div>
        `;

        return;
    }

    bookingHistory.innerHTML = bookings.slice().reverse().map(booking => {
        const travelDate = /^\d{4}-\d{2}-\d{2}$/.test(booking.departureDate || "")
            ? new Date(`${booking.departureDate}T00:00:00`).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
            })
            : "Date unavailable";
        const tripLabel = booking.returnDate
            ? `Return ${escapeHTML(booking.returnDate)}`
            : "One way";

        return `
            <article class="booking-row">
                <div class="booking-id">
                    <span>BOOKING</span>
                    <strong>${escapeHTML(booking.id || "ID unavailable")}</strong>
                </div>
                <div class="booking-route">
                    <strong>${escapeHTML(booking.from || "Unknown")} to ${escapeHTML(booking.to || "Unknown")}</strong>
                    <small>${travelDate} · ${Number(booking.passengers) || 1} passenger(s) · ${tripLabel}</small>
                </div>
                <div class="booking-amount">
                    <span>Total</span>
                    <strong>₹${formatPrice(Number(booking.total) || 0)}</strong>
                </div>
            </article>
        `;
    }).join("");

}


/* =========================================
   MESSAGE
========================================= */

function showMessage(
    message,
    type = "info"
) {

    messageRegion.textContent = message;
    messageRegion.className = `app-message ${type}`;
    messageRegion.hidden = false;

}


function sortFlightsByPreference(results) {

    const sorted = [...results];

    if (sortFlights.value === "duration") {
        return sorted.sort((a, b) => a.duration - b.duration);
    }

    return sorted.sort((a, b) => a.price - b.price);

}