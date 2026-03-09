const clockData = [
    { id: 'vn', code: 'VN', name: 'Hanoi, Vietnam', timezone: 'Asia/Ho_Chi_Minh' },
    { id: 'mm', code: 'MM', name: 'Yangon, Myanmar', timezone: 'Asia/Yangon' },
    { id: 'kr', code: 'KR', name: 'Seoul, Korea', timezone: 'Asia/Seoul' },
    { id: 'jp', code: 'JP', name: 'Tokyo, Japan', timezone: 'Asia/Tokyo' },
    { id: 'sg', code: 'SG', name: 'Singapore', timezone: 'Asia/Singapore' },
    { id: 'my', code: 'MY', name: 'Kuala Lumpur, Malaysia', timezone: 'Asia/Kuala_Lumpur' }
];

const container = document.getElementById('clock-container');
const template = document.getElementById('clock-card-template');
const displayMode = document.getElementById('display-mode');

// Store references to elements to update them efficiently
const clockElements = [];

function init() {
    // Generate clock cards
    clockData.forEach((data, index) => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.clock-card');

        card.querySelector('.country-code').textContent = data.code;
        card.querySelector('.city-name').textContent = data.name;

        // Setup clock numbers
        const numbersContainer = card.querySelector('.numbers-container');
        const radius = 55; // Distance from center
        for (let i = 1; i <= 12; i++) {
            const num = document.createElement('div');
            num.className = 'clock-number';
            num.textContent = i;

            // Calculate position
            const angle = i * 30 * (Math.PI / 180); // 30 degrees per hour
            const x = Math.sin(angle) * radius;
            const y = -Math.cos(angle) * radius;

            num.style.transform = `translate(${x}px, ${y}px)`;
            numbersContainer.appendChild(num);
        }

        container.appendChild(clone);

        // Add elements to array to update them later
        const appendedCard = container.children[index];
        clockElements.push({
            card: appendedCard,
            digitalTime: appendedCard.querySelector('.digital-time'),
            dateDisplay: appendedCard.querySelector('.date'),
            hourHand: appendedCard.querySelector('.hour-hand'),
            minHand: appendedCard.querySelector('.min-hand'),
            secHand: appendedCard.querySelector('.sec-hand'),
            timezone: data.timezone
        });
    });

    // Handle display mode change
    displayMode.addEventListener('change', (e) => {
        const mode = e.target.value;
        clockElements.forEach(el => {
            el.card.classList.remove('hide-digital', 'hide-analog');
            if (mode === 'digital') {
                el.card.classList.add('hide-analog');
            } else if (mode === 'analog') {
                el.card.classList.add('hide-digital');
            }
        });
    });

    // Start clock loop
    updateClocks();
    setInterval(updateClocks, 1000);
}

function updateClocks() {
    const now = new Date();

    // Formatting options for digital
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };

    clockElements.forEach(el => {
        try {
            // Get local time string for the timezone and parse it
            // We use en-US to ensure a standard parseable format: MM/DD/YYYY, hh:mm:ss AM/PM
            const tzDateString = now.toLocaleString("en-US", { timeZone: el.timezone });
            const tzDate = new Date(tzDateString);

            // Format digital time
            const timeFormatter = new Intl.DateTimeFormat('en-US', { ...timeOptions, timeZone: el.timezone });
            el.digitalTime.textContent = timeFormatter.format(now);

            // Format date
            const dateFormatter = new Intl.DateTimeFormat('en-US', { ...dateOptions, timeZone: el.timezone });
            el.dateDisplay.textContent = dateFormatter.format(now);

            // Update analog clock hands
            const h = tzDate.getHours();
            const m = tzDate.getMinutes();
            const s = tzDate.getSeconds();

            const hoursDegree = (h % 12) * 30 + m * 0.5;
            const minsDegree = m * 6 + s * 0.1;
            const secsDegree = s * 6;

            el.hourHand.style.transform = `rotate(${hoursDegree}deg)`;
            el.minHand.style.transform = `rotate(${minsDegree}deg)`;
            el.secHand.style.transform = `rotate(${secsDegree}deg)`;
        } catch (e) {
            console.error(`Error updating clock for ${el.timezone}:`, e);
        }
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
