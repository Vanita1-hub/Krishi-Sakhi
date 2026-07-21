import './style.css'

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const WEATHER_API_URL = import.meta.env.VITE_WEATHER_API_URL || 'https://api.weatherapi.com/v1/history.json'

const sampleClaim = {
  farmerName: 'Rakesh Kumar',
  contact: '+91 98765 43210',
  cropType: 'Paddy',
  cropStage: 'Flowering stage',
  damageDate: '2026-07-15',
  damageType: 'flood',
  notes:
    'Continuous rain overflowed the canal and flooded the field for 2 days. Leaves turned yellow and lodging is visible in multiple patches.',
  manualLat: '26.8467',
  manualLon: '80.9462',
}

const sampleWeather = {
  source: 'Demo mode sample weather',
  locationName: 'Lucknow, India',
  date: '2026-07-15',
  condition: 'Moderate to heavy rain',
  precipitationMm: 68.4,
  tempMinC: 24.1,
  tempMaxC: 30.7,
  maxWindKph: 33.5,
  humidity: 89,
}

const state = {
  claim: {
    farmerName: '',
    contact: '',
    cropType: '',
    cropStage: '',
    damageDate: '',
    damageType: '',
    notes: '',
    manualLat: '',
    manualLon: '',
  },
  photos: [],
  weather: null,
  weatherError: '',
  weatherLoading: false,
  locationMessage: 'No location captured yet. Add photo evidence to capture GPS coordinates.',
  showReport: false,
  demoMode: false,
}

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="container">
    <header class="hero">
      <p class="eyebrow">Hackathon Prototype</p>
      <h1>Agri-Insurance Claim Proof App</h1>
      <p class="subtext">Help farmers compile evidence-rich claim reports for crop loss compensation requests.</p>
      <button id="demoModeBtn" class="ghost-btn" type="button">Load Demo Mode</button>
    </header>

    <section class="card">
      <h2>1) Claim Details</h2>
      <form id="claimForm" class="grid-form">
        <label>Farmer Name<input name="farmerName" required placeholder="e.g., Rakesh Kumar" /></label>
        <label>Contact<input name="contact" required placeholder="e.g., +91 98765 43210" /></label>
        <label>Crop Type<input name="cropType" required placeholder="e.g., Paddy" /></label>
        <label>Crop Stage<input name="cropStage" required placeholder="e.g., Flowering" /></label>
        <label>Damage Date<input name="damageDate" required type="date" /></label>
        <label>Damage Type
          <select name="damageType" required>
            <option value="">Select one</option>
            <option value="rain">Rain</option>
            <option value="flood">Flood</option>
            <option value="hail">Hail</option>
            <option value="pest">Pest</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label class="full-width">Damage Notes
          <textarea name="notes" rows="4" placeholder="Describe visible crop damage and impact..."></textarea>
        </label>
        <label>Fallback Latitude (optional)<input name="manualLat" type="number" step="0.000001" placeholder="26.8467" /></label>
        <label>Fallback Longitude (optional)<input name="manualLon" type="number" step="0.000001" placeholder="80.9462" /></label>
      </form>
    </section>

    <section class="card">
      <h2>2) Photo Evidence</h2>
      <p class="muted">Upload one or more crop damage photos. Timestamp is auto-added. GPS is captured (when permission is granted).</p>
      <div class="row-wrap">
        <input id="photoInput" type="file" accept="image/*" multiple />
        <button id="addEvidenceBtn" type="button">Add Evidence</button>
      </div>
      <p id="locationMessage" class="status-line"></p>
      <div id="photoList" class="photo-list"></div>
    </section>

    <section class="card">
      <h2>3) Weather Evidence</h2>
      <p class="muted">Fetch day-level historical weather proof for the selected date and location.</p>
      <div class="row-wrap">
        <button id="fetchWeatherBtn" type="button">Fetch Weather Evidence</button>
        <span id="weatherStatus" class="status-chip"></span>
      </div>
      <div id="weatherError" class="error-text"></div>
      <div id="weatherSummary" class="weather-summary"></div>
    </section>

    <section class="card">
      <h2>4) Claim Report</h2>
      <p class="muted">Generate a consolidated submission-style report for insurers.</p>
      <div class="row-wrap">
        <button id="generateReportBtn" type="button">Generate Report</button>
        <button id="downloadPdfBtn" type="button" class="secondary">Download PDF</button>
      </div>
      <div id="report" class="report"></div>
    </section>
  </main>
`

const claimForm = document.querySelector('#claimForm')
const photoInput = document.querySelector('#photoInput')
const addEvidenceBtn = document.querySelector('#addEvidenceBtn')
const locationMessageEl = document.querySelector('#locationMessage')
const photoListEl = document.querySelector('#photoList')
const fetchWeatherBtn = document.querySelector('#fetchWeatherBtn')
const weatherStatusEl = document.querySelector('#weatherStatus')
const weatherErrorEl = document.querySelector('#weatherError')
const weatherSummaryEl = document.querySelector('#weatherSummary')
const generateReportBtn = document.querySelector('#generateReportBtn')
const reportEl = document.querySelector('#report')
const downloadPdfBtn = document.querySelector('#downloadPdfBtn')
const demoModeBtn = document.querySelector('#demoModeBtn')

claimForm.addEventListener('input', (event) => {
  const target = event.target
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
    return
  }
  state.claim[target.name] = target.value
})

demoModeBtn.addEventListener('click', () => {
  state.demoMode = true
  state.claim = { ...sampleClaim }
  Object.entries(sampleClaim).forEach(([key, value]) => {
    const field = claimForm.elements.namedItem(key)
    if (field) {
      field.value = value
    }
  })

  const now = new Date()
  state.photos = [
    {
      id: crypto.randomUUID(),
      name: 'flooded-paddy-plot-1.svg',
      previewUrl: '/demo-crop-1.svg',
      uploadedAt: new Date(now.getTime() - 8 * 60 * 1000).toISOString(),
      location: { latitude: 26.8467, longitude: 80.9462 },
      note: 'Waterlogging visible in central field area.',
    },
    {
      id: crypto.randomUUID(),
      name: 'lodged-crop-zone-2.svg',
      previewUrl: '/demo-crop-2.svg',
      uploadedAt: new Date(now.getTime() - 4 * 60 * 1000).toISOString(),
      location: { latitude: 26.8471, longitude: 80.9465 },
      note: 'Stem lodging and patchwise yellowing visible.',
    },
  ]

  state.weather = { ...sampleWeather }
  state.weatherError = ''
  state.locationMessage = 'Demo mode loaded with sample geo-tagged evidence.'
  renderPhotos()
  renderWeather()
  renderReport()
})

addEvidenceBtn.addEventListener('click', async () => {
  const files = [...photoInput.files]
  if (!files.length) {
    state.locationMessage = 'Please choose at least one photo before adding evidence.'
    renderPhotos()
    return
  }

  addEvidenceBtn.disabled = true
  addEvidenceBtn.textContent = 'Adding...'

  const locationResult = await captureLocation()
  state.locationMessage = locationResult.message

  files.forEach((file) => {
    state.photos.push({
      id: crypto.randomUUID(),
      name: file.name,
      sizeKb: Math.max(1, Math.round(file.size / 1024)),
      previewUrl: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      location: locationResult.location,
    })
  })

  photoInput.value = ''
  addEvidenceBtn.disabled = false
  addEvidenceBtn.textContent = 'Add Evidence'
  renderPhotos()
})

fetchWeatherBtn.addEventListener('click', async () => {
  state.weatherLoading = true
  state.weatherError = ''
  renderWeather()

  const coords = getPreferredCoordinates()
  if (!state.claim.damageDate) {
    state.weatherLoading = false
    state.weatherError = 'Please select damage date before fetching weather evidence.'
    renderWeather()
    return
  }

  if (!coords) {
    state.weatherLoading = false
    state.weatherError = 'No coordinates available. Add photo evidence with location or provide fallback coordinates.'
    renderWeather()
    return
  }

  if (!WEATHER_API_KEY) {
    state.weatherLoading = false
    state.weatherError = 'Weather API key missing. Set VITE_WEATHER_API_KEY in .env file.'
    renderWeather()
    return
  }

  const query = new URLSearchParams({
    key: WEATHER_API_KEY,
    q: `${coords.latitude},${coords.longitude}`,
    dt: state.claim.damageDate,
  })

  try {
    const response = await fetch(`${WEATHER_API_URL}?${query.toString()}`)
    const payload = await response.json()

    if (!response.ok || !payload.forecast?.forecastday?.length) {
      throw new Error(payload?.error?.message || 'Weather data unavailable for selected date/location.')
    }

    const day = payload.forecast.forecastday[0].day
    state.weather = {
      source: 'WeatherAPI historical day summary',
      locationName: payload.location?.name
        ? `${payload.location.name}, ${payload.location.region || payload.location.country}`
        : `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`,
      date: state.claim.damageDate,
      condition: day.condition?.text || 'Not available',
      precipitationMm: day.totalprecip_mm,
      tempMinC: day.mintemp_c,
      tempMaxC: day.maxtemp_c,
      maxWindKph: day.maxwind_kph,
      humidity: day.avghumidity,
    }
    state.weatherError = ''
  } catch (error) {
    state.weatherError =
      `Unable to fetch weather evidence right now. ${error instanceof Error ? error.message : 'Please try again.'}`
    if (state.demoMode) {
      state.weather = { ...sampleWeather }
      state.weatherError += ' Showing demo weather sample for presentation continuity.'
    }
  } finally {
    state.weatherLoading = false
    renderWeather()
  }
})

generateReportBtn.addEventListener('click', () => {
  const requiredFields = ['farmerName', 'contact', 'cropType', 'cropStage', 'damageDate', 'damageType']
  const missing = requiredFields.filter((field) => !state.claim[field])

  if (missing.length) {
    state.showReport = false
    reportEl.innerHTML = `<p class="error-text">Please complete required claim details before generating report.</p>`
    return
  }

  state.showReport = true
  renderReport()
  reportEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
})

downloadPdfBtn.addEventListener('click', () => {
  if (!state.showReport) {
    reportEl.innerHTML = '<p class="error-text">Generate the report first, then use Download PDF.</p>'
    return
  }
  window.print()
})

function renderPhotos() {
  locationMessageEl.textContent = state.locationMessage

  if (!state.photos.length) {
    photoListEl.innerHTML = '<p class="muted">No photo evidence added yet.</p>'
    renderReport()
    return
  }

  photoListEl.innerHTML = state.photos
    .map((photo, index) => {
      const locationText = photo.location
        ? `${photo.location.latitude.toFixed(5)}, ${photo.location.longitude.toFixed(5)}`
        : 'Location unavailable'
      return `
      <article class="photo-card">
        <img src="${photo.previewUrl}" alt="Damage evidence ${index + 1}" />
        <div>
          <h4>${escapeHtml(photo.name)}</h4>
          <p><strong>Uploaded:</strong> ${new Date(photo.uploadedAt).toLocaleString()}</p>
          <p><strong>Coordinates:</strong> ${locationText}</p>
          ${photo.sizeKb ? `<p><strong>Size:</strong> ${photo.sizeKb} KB</p>` : ''}
          ${photo.note ? `<p><strong>Notes:</strong> ${escapeHtml(photo.note)}</p>` : ''}
        </div>
      </article>
    `
    })
    .join('')

  renderReport()
}

function renderWeather() {
  if (state.weatherLoading) {
    weatherStatusEl.textContent = 'Loading weather evidence...'
    weatherSummaryEl.innerHTML = ''
    weatherErrorEl.textContent = ''
    renderReport()
    return
  }

  weatherStatusEl.textContent = state.weather ? 'Weather evidence ready' : 'Not fetched yet'
  weatherErrorEl.textContent = state.weatherError

  if (!state.weather) {
    weatherSummaryEl.innerHTML = '<p class="muted">Fetch weather to strengthen the claim proof report.</p>'
    renderReport()
    return
  }

  weatherSummaryEl.innerHTML = `
    <div class="weather-grid">
      <p><strong>Source:</strong> ${escapeHtml(state.weather.source)}</p>
      <p><strong>Location:</strong> ${escapeHtml(state.weather.locationName)}</p>
      <p><strong>Date:</strong> ${escapeHtml(state.weather.date)}</p>
      <p><strong>Condition:</strong> ${escapeHtml(state.weather.condition)}</p>
      <p><strong>Precipitation:</strong> ${state.weather.precipitationMm} mm</p>
      <p><strong>Temperature:</strong> ${state.weather.tempMinC}°C to ${state.weather.tempMaxC}°C</p>
      <p><strong>Max wind:</strong> ${state.weather.maxWindKph} kph</p>
      <p><strong>Humidity:</strong> ${state.weather.humidity}%</p>
    </div>
  `
  renderReport()
}

function renderReport() {
  if (!state.showReport) {
    reportEl.innerHTML = '<p class="muted">Report preview appears here after clicking Generate Report.</p>'
    return
  }

  const locationProof = getPreferredCoordinates()
  reportEl.innerHTML = `
    <section class="report-sheet" id="reportSheet">
      <h3>Insurance Claim Evidence Report</h3>
      <p class="muted">Generated on ${new Date().toLocaleString()}</p>

      <h4>Claim Details</h4>
      <div class="report-grid">
        <p><strong>Farmer:</strong> ${escapeHtml(state.claim.farmerName)}</p>
        <p><strong>Contact:</strong> ${escapeHtml(state.claim.contact)}</p>
        <p><strong>Crop Type:</strong> ${escapeHtml(state.claim.cropType)}</p>
        <p><strong>Crop Stage:</strong> ${escapeHtml(state.claim.cropStage)}</p>
        <p><strong>Damage Date:</strong> ${escapeHtml(state.claim.damageDate)}</p>
        <p><strong>Damage Type:</strong> ${escapeHtml(state.claim.damageType)}</p>
      </div>
      <p><strong>Damage Notes:</strong> ${escapeHtml(state.claim.notes || 'Not provided')}</p>

      <h4>Photo & Location Evidence</h4>
      <p><strong>Total photos:</strong> ${state.photos.length}</p>
      <p><strong>Primary coordinates:</strong> ${locationProof ? `${locationProof.latitude.toFixed(5)}, ${locationProof.longitude.toFixed(5)}` : 'Unavailable'}</p>
      <ul>
        ${state.photos
          .map((photo) => `<li>${escapeHtml(photo.name)} • ${new Date(photo.uploadedAt).toLocaleString()} • ${photo.location ? `${photo.location.latitude.toFixed(5)}, ${photo.location.longitude.toFixed(5)}` : 'No coordinates'}</li>`)
          .join('') || '<li>No photo evidence uploaded.</li>'}
      </ul>

      <h4>Weather Evidence</h4>
      ${
        state.weather
          ? `<p><strong>${escapeHtml(state.weather.condition)}</strong> on ${escapeHtml(state.weather.date)} at ${escapeHtml(state.weather.locationName)}.</p>
             <p>Precipitation: ${state.weather.precipitationMm} mm • Temperature: ${state.weather.tempMinC}°C to ${state.weather.tempMaxC}°C • Wind: ${state.weather.maxWindKph} kph • Humidity: ${state.weather.humidity}%</p>
             <p class="muted">Source: ${escapeHtml(state.weather.source)}</p>`
          : `<p>${escapeHtml(state.weatherError || 'Weather evidence not available yet.')}</p>`
      }
    </section>
  `
}

async function captureLocation() {
  if (!navigator.geolocation) {
    return {
      location: null,
      message: 'Location unavailable: browser does not support geolocation. Evidence still saved with timestamp.',
    }
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          message: 'Location captured successfully and attached to uploaded evidence.',
        })
      },
      (error) => {
        const reason =
          error.code === 1
            ? 'permission denied'
            : error.code === 2
              ? 'position unavailable'
              : 'request timed out'

        resolve({
          location: null,
          message: `Location not captured (${reason}). Evidence still saved with timestamp.`,
        })
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 0 },
    )
  })
}

function getPreferredCoordinates() {
  const withLocation = [...state.photos].reverse().find((photo) => photo.location)
  if (withLocation) {
    return withLocation.location
  }

  if (state.claim.manualLat && state.claim.manualLon) {
    return {
      latitude: Number(state.claim.manualLat),
      longitude: Number(state.claim.manualLon),
    }
  }

  return null
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

renderPhotos()
renderWeather()
renderReport()
