(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={farmerName:`Rakesh Kumar`,contact:`+91 98765 43210`,cropType:`Paddy`,cropStage:`Flowering stage`,damageDate:`2026-07-15`,damageType:`flood`,notes:`Continuous rain overflowed the canal and flooded the field for 2 days. Leaves turned yellow and lodging is visible in multiple patches.`,manualLat:`26.8467`,manualLon:`80.9462`},t={source:`Demo mode sample weather`,locationName:`Lucknow, India`,date:`2026-07-15`,condition:`Moderate to heavy rain`,precipitationMm:68.4,tempMinC:24.1,tempMaxC:30.7,maxWindKph:33.5,humidity:89},n={claim:{farmerName:``,contact:``,cropType:``,cropStage:``,damageDate:``,damageType:``,notes:``,manualLat:``,manualLon:``},photos:[],weather:null,weatherError:``,weatherLoading:!1,locationMessage:`No location captured yet. Add photo evidence to capture GPS coordinates.`,showReport:!1,demoMode:!1},r=document.querySelector(`#app`);r.innerHTML=`
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
`;var i=document.querySelector(`#claimForm`),a=document.querySelector(`#photoInput`),o=document.querySelector(`#addEvidenceBtn`),s=document.querySelector(`#locationMessage`),c=document.querySelector(`#photoList`),l=document.querySelector(`#fetchWeatherBtn`),u=document.querySelector(`#weatherStatus`),d=document.querySelector(`#weatherError`),f=document.querySelector(`#weatherSummary`),p=document.querySelector(`#generateReportBtn`),m=document.querySelector(`#report`),h=document.querySelector(`#downloadPdfBtn`),g=document.querySelector(`#demoModeBtn`);i.addEventListener(`input`,e=>{let t=e.target;(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement)&&(n.claim[t.name]=t.value)}),g.addEventListener(`click`,()=>{n.demoMode=!0,n.claim={...e},Object.entries(e).forEach(([e,t])=>{let n=i.elements.namedItem(e);n&&(n.value=t)});let r=new Date;n.photos=[{id:crypto.randomUUID(),name:`flooded-paddy-plot-1.svg`,previewUrl:`/demo-crop-1.svg`,uploadedAt:new Date(r.getTime()-480*1e3).toISOString(),location:{latitude:26.8467,longitude:80.9462},note:`Waterlogging visible in central field area.`},{id:crypto.randomUUID(),name:`lodged-crop-zone-2.svg`,previewUrl:`/demo-crop-2.svg`,uploadedAt:new Date(r.getTime()-240*1e3).toISOString(),location:{latitude:26.8471,longitude:80.9465},note:`Stem lodging and patchwise yellowing visible.`}],n.weather={...t},n.weatherError=``,n.locationMessage=`Demo mode loaded with sample geo-tagged evidence.`,_(),v(),y()}),o.addEventListener(`click`,async()=>{let e=[...a.files];if(!e.length){n.locationMessage=`Please choose at least one photo before adding evidence.`,_();return}o.disabled=!0,o.textContent=`Adding...`;let t=await b();n.locationMessage=t.message,e.forEach(e=>{n.photos.push({id:crypto.randomUUID(),name:e.name,sizeKb:Math.max(1,Math.round(e.size/1024)),previewUrl:URL.createObjectURL(e),uploadedAt:new Date().toISOString(),location:t.location})}),a.value=``,o.disabled=!1,o.textContent=`Add Evidence`,_()}),l.addEventListener(`click`,async()=>{n.weatherLoading=!0,n.weatherError=``,v();let e=x();if(!n.claim.damageDate){n.weatherLoading=!1,n.weatherError=`Please select damage date before fetching weather evidence.`,v();return}if(!e){n.weatherLoading=!1,n.weatherError=`No coordinates available. Add photo evidence with location or provide fallback coordinates.`,v();return}n.weatherLoading=!1,n.weatherError=`Weather API key missing. Set VITE_WEATHER_API_KEY in .env file.`,v()}),p.addEventListener(`click`,()=>{if([`farmerName`,`contact`,`cropType`,`cropStage`,`damageDate`,`damageType`].filter(e=>!n.claim[e]).length){n.showReport=!1,m.innerHTML=`<p class="error-text">Please complete required claim details before generating report.</p>`;return}n.showReport=!0,y(),m.scrollIntoView({behavior:`smooth`,block:`start`})}),h.addEventListener(`click`,()=>{if(!n.showReport){m.innerHTML=`<p class="error-text">Generate the report first, then use Download PDF.</p>`;return}window.print()});function _(){if(s.textContent=n.locationMessage,!n.photos.length){c.innerHTML=`<p class="muted">No photo evidence added yet.</p>`,y();return}c.innerHTML=n.photos.map((e,t)=>{let n=e.location?`${e.location.latitude.toFixed(5)}, ${e.location.longitude.toFixed(5)}`:`Location unavailable`;return`
      <article class="photo-card">
        <img src="${e.previewUrl}" alt="Damage evidence ${t+1}" />
        <div>
          <h4>${S(e.name)}</h4>
          <p><strong>Uploaded:</strong> ${new Date(e.uploadedAt).toLocaleString()}</p>
          <p><strong>Coordinates:</strong> ${n}</p>
          ${e.sizeKb?`<p><strong>Size:</strong> ${e.sizeKb} KB</p>`:``}
          ${e.note?`<p><strong>Notes:</strong> ${S(e.note)}</p>`:``}
        </div>
      </article>
    `}).join(``),y()}function v(){if(n.weatherLoading){u.textContent=`Loading weather evidence...`,f.innerHTML=``,d.textContent=``,y();return}if(u.textContent=n.weather?`Weather evidence ready`:`Not fetched yet`,d.textContent=n.weatherError,!n.weather){f.innerHTML=`<p class="muted">Fetch weather to strengthen the claim proof report.</p>`,y();return}f.innerHTML=`
    <div class="weather-grid">
      <p><strong>Source:</strong> ${S(n.weather.source)}</p>
      <p><strong>Location:</strong> ${S(n.weather.locationName)}</p>
      <p><strong>Date:</strong> ${S(n.weather.date)}</p>
      <p><strong>Condition:</strong> ${S(n.weather.condition)}</p>
      <p><strong>Precipitation:</strong> ${n.weather.precipitationMm} mm</p>
      <p><strong>Temperature:</strong> ${n.weather.tempMinC}°C to ${n.weather.tempMaxC}°C</p>
      <p><strong>Max wind:</strong> ${n.weather.maxWindKph} kph</p>
      <p><strong>Humidity:</strong> ${n.weather.humidity}%</p>
    </div>
  `,y()}function y(){if(!n.showReport){m.innerHTML=`<p class="muted">Report preview appears here after clicking Generate Report.</p>`;return}let e=x();m.innerHTML=`
    <section class="report-sheet" id="reportSheet">
      <h3>Insurance Claim Evidence Report</h3>
      <p class="muted">Generated on ${new Date().toLocaleString()}</p>

      <h4>Claim Details</h4>
      <div class="report-grid">
        <p><strong>Farmer:</strong> ${S(n.claim.farmerName)}</p>
        <p><strong>Contact:</strong> ${S(n.claim.contact)}</p>
        <p><strong>Crop Type:</strong> ${S(n.claim.cropType)}</p>
        <p><strong>Crop Stage:</strong> ${S(n.claim.cropStage)}</p>
        <p><strong>Damage Date:</strong> ${S(n.claim.damageDate)}</p>
        <p><strong>Damage Type:</strong> ${S(n.claim.damageType)}</p>
      </div>
      <p><strong>Damage Notes:</strong> ${S(n.claim.notes||`Not provided`)}</p>

      <h4>Photo & Location Evidence</h4>
      <p><strong>Total photos:</strong> ${n.photos.length}</p>
      <p><strong>Primary coordinates:</strong> ${e?`${e.latitude.toFixed(5)}, ${e.longitude.toFixed(5)}`:`Unavailable`}</p>
      <ul>
        ${n.photos.map(e=>`<li>${S(e.name)} • ${new Date(e.uploadedAt).toLocaleString()} • ${e.location?`${e.location.latitude.toFixed(5)}, ${e.location.longitude.toFixed(5)}`:`No coordinates`}</li>`).join(``)||`<li>No photo evidence uploaded.</li>`}
      </ul>

      <h4>Weather Evidence</h4>
      ${n.weather?`<p><strong>${S(n.weather.condition)}</strong> on ${S(n.weather.date)} at ${S(n.weather.locationName)}.</p>
             <p>Precipitation: ${n.weather.precipitationMm} mm • Temperature: ${n.weather.tempMinC}°C to ${n.weather.tempMaxC}°C • Wind: ${n.weather.maxWindKph} kph • Humidity: ${n.weather.humidity}%</p>
             <p class="muted">Source: ${S(n.weather.source)}</p>`:`<p>${S(n.weatherError||`Weather evidence not available yet.`)}</p>`}
    </section>
  `}async function b(){return navigator.geolocation?new Promise(e=>{navigator.geolocation.getCurrentPosition(t=>{e({location:{latitude:t.coords.latitude,longitude:t.coords.longitude},message:`Location captured successfully and attached to uploaded evidence.`})},t=>{e({location:null,message:`Location not captured (${t.code===1?`permission denied`:t.code===2?`position unavailable`:`request timed out`}). Evidence still saved with timestamp.`})},{enableHighAccuracy:!0,timeout:9e3,maximumAge:0})}):{location:null,message:`Location unavailable: browser does not support geolocation. Evidence still saved with timestamp.`}}function x(){let e=[...n.photos].reverse().find(e=>e.location);return e?e.location:n.claim.manualLat&&n.claim.manualLon?{latitude:Number(n.claim.manualLat),longitude:Number(n.claim.manualLon)}:null}function S(e){return String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}_(),v(),y();