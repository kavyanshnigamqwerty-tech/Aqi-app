const API_KEY = 'c4dfc8fd7d0b4a1499fd9b95c892cf9a'; // Paste your key here

function getLocation() {
    const display = document.getElementById('aqi-display');
    display.innerHTML = "<p>Locating...</p>";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchAQIData, (error) => {
            display.innerHTML = "<p>Error: Please enable location.</p>";
        });
    } else {
        display.innerHTML = "<p>Geolocation not supported.</p>";
    }
}

async function fetchAQIData(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const aqi = data.list[0].main.aqi; // Returns 1 to 5
        updateDisplay(aqi);
    } catch (err) {
        document.getElementById('aqi-display').innerHTML = "<p>Connection Failed.</p>";
    }
}

function updateDisplay(aqi) {
    const display = document.getElementById('aqi-display');
    let info = { label: "", color: "", advice: "" };

    switch(aqi) {
        case 1: info = { label: "Good", color: "#00ff88", advice: "Air is fresh! Ideal for outdoor exercise." }; break;
        case 2: info = { label: "Fair", color: "#ffee00", advice: "Acceptable. Long-term: Minor risk to sensitive groups." }; break;
        case 3: info = { label: "Moderate", color: "#ff9900", advice: "High risk for asthma patients. Avoid long stays outdoors." }; break;
        case 4: info = { label: "Poor", color: "#ff4444", advice: "Heavy pollution. Long-term: Can lead to heart & lung disease." }; break;
        case 5: info = { label: "Hazardous", color: "#cc00ff", advice: "Emergency! Long-term: Risk of stroke and respiratory cancer." }; break;
    }

    display.innerHTML = `
        <div class="aqi-val" style="color: ${info.color}">${aqi}</div>
        <div class="category-label" style="color: ${info.color}">${info.label}</div>
        <p class="advice-text">${info.advice}</p>
    `;
}
