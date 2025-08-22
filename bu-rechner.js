// bu-rechner.js

const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: block;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            background-color: #ffffff;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            max-width: 600px;
            margin: 2rem auto;
            border: 1px solid #e9ecef;
        }

        .rechner-container {
            display: flex;
            flex-direction: column;
            gap: 1.8rem;
        }

        h2 {
            margin: 0 0 1rem 0;
            color: #1a1a1a;
            font-size: 1.75rem;
            text-align: center;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        label {
            font-weight: 600;
            color: #495057;
        }

        .slider-container {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        input[type="range"] {
            flex-grow: 1;
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 8px;
            background: #dee2e6;
            border-radius: 5px;
            outline: none;
            opacity: 0.9;
            transition: opacity .2s;
        }

        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #007bff;
            cursor: pointer;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 5px rgba(0,0,0,0.2);
        }

        input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #007bff;
            cursor: pointer;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 5px rgba(0,0,0,0.2);
        }
        
        .slider-value {
            font-weight: 600;
            color: #007bff;
            background-color: #e7f3ff;
            padding: 0.25rem 0.75rem;
            border-radius: 6px;
            min-width: 70px;
            text-align: center;
        }

        input[type="number"], select {
            padding: 0.75rem;
            border: 1px solid #ced4da;
            border-radius: 8px;
            font-size: 1rem;
            width: 100%;
            box-sizing: border-box;
        }
        
        .results-container {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e9ecef;
        }

        .chart-container {
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
            height: 250px;
            border-bottom: 2px solid #adb5bd;
            padding-bottom: 1rem;
            gap: 2rem;
        }

        .bar-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-basis: 100px;
            text-align: center;
        }

        .bar {
            width: 100%;
            display: flex;
            flex-direction: column-reverse;
            transition: height 0.5s ease-out;
        }

        .bar-segment {
            width: 100%;
            transition: height 0.5s ease-out;
            position: relative;
        }
        
        .bar-segment::after {
            content: attr(data-label) " " attr(data-value);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-weight: bold;
            font-size: 0.8rem;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }

        .bar:hover .bar-segment::after {
            opacity: 1;
        }

        .bar-label {
            margin-top: 0.5rem;
            font-weight: 600;
            color: #343a40;
            font-size: 0.9rem;
        }

        .netto { background-color: #28a745; }
        .gesetzlich { background-color: #6c757d; }
        .privat { background-color: #007bff; }
        .luecke { 
            background: repeating-linear-gradient(
                45deg,
                #dc3545,
                #dc3545 10px,
                #c82333 10px,
                #c82333 20px
            );
        }

        .summary {
            text-align: center;
            margin-top: 2rem;
            padding: 1.5rem;
            background-color: #f8f9fa;
            border-radius: 8px;
        }

        .summary-item {
            margin-bottom: 1rem;
        }

        .summary-item:last-child {
            margin-bottom: 0;
        }
        
        .summary-label {
            font-size: 1rem;
            color: #495057;
        }

        .summary-value {
            font-size: 1.5rem;
            font-weight: bold;
        }

        .luecke-value { color: #dc3545; }
        .beitrag-value { color: #28a745; }

        .cta-button {
            display: block;
            width: 100%;
            padding: 1rem;
            margin-top: 2rem;
            font-size: 1.1rem;
            font-weight: bold;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
            transition: background-color 0.3s ease;
        }

        .cta-button:hover {
            background-color: #0056b3;
        }

        .disclaimer {
            font-size: 0.8rem;
            color: #6c757d;
            text-align: center;
            margin-top: 1rem;
        }
    </style>
    <div class="rechner-container">
        <h2>BU-Versorgungslücke berechnen</h2>
        
        <div class="input-group">
            <label for="netto-einkommen">Ihr monatliches Nettoeinkommen</label>
            <div class="slider-container">
                <input type="range" id="netto-einkommen" min="1000" max="8000" step="100" value="2500">
                <span id="netto-einkommen-wert" class="slider-value">2.500 €</span>
            </div>
        </div>

        <div class="input-group">
            <label for="alter">Ihr Alter</label>
            <input type="number" id="alter" min="18" max="60" value="30">
        </div>

        <div class="input-group">
            <label for="berufsgruppe">Ihre Berufsgruppe</label>
            <select id="berufsgruppe">
                <option value="1.0">Akademiker / Bürotätigkeit (>90% sitzend)</option>
                <option value="1.5">Kaufmännische Tätigkeit (hoher Büroanteil)</option>
                <option value="2.2">Handwerkliche / Soziale Tätigkeit (überwiegend körperlich)</option>
                <option value="3.0">Schwere körperliche / handwerkliche Tätigkeit</option>
            </select>
        </div>

        <div class="input-group">
            <label for="bu-rente">Gewünschte monatliche BU-Rente</label>
             <div class="slider-container">
                <input type="range" id="bu-rente" min="500" max="6000" step="50" value="1500">
                <span id="bu-rente-wert" class="slider-value">1.500 €</span>
            </div>
        </div>

        <div class="results-container">
            <div class="chart-container">
                <div class="bar-wrapper">
                    <div id="bar-aktuell" class="bar" style="height: 100%;">
                        <div class="bar-segment netto" style="height: 100%;" data-label="Netto" data-value=""></div>
                    </div>
                    <div class="bar-label">Ihr Einkommen heute</div>
                </div>
                <div class="bar-wrapper">
                    <div id="bar-bu" class="bar" style="height: 0%;">
                        <div id="segment-luecke" class="bar-segment luecke" style="height: 0%;" data-label="Lücke" data-value=""></div>
                        <div id="segment-privat" class="bar-segment privat" style="height: 0%;" data-label="Privat" data-value=""></div>
                        <div id="segment-gesetzlich" class="bar-segment gesetzlich" style="height: 0%;" data-label="Staatlich" data-value=""></div>
                    </div>
                    <div class="bar-label">Versorgung bei BU</div>
                </div>
            </div>
            <div class="summary">
                <div class="summary-item">
                    <div class="summary-label">Ihre monatliche Versorgungslücke</div>
                    <div id="luecke-wert" class="summary-value luecke-value">- €</div>
                </div>
                 <div class="summary-item">
                    <div class="summary-label">Geschätzter monatlicher Beitrag für Ihre Absicherung</div>
                    <div id="beitrag-wert" class="summary-value beitrag-value">ab -- €</div>
                </div>
            </div>
        </div>
        
        <button class="cta-button">Jetzt kostenloses Angebot anfordern</button>
        <p class="disclaimer">Dies ist eine beispielhafte Schätzung und stellt kein verbindliches Angebot dar. Der exakte Beitrag hängt von Ihrem Gesundheitszustand und weiteren Faktoren ab.</p>

    </div>
`;

class BuRechner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Elemente im Shadow DOM referenzieren
        this.nettoEinkommenInput = this.shadowRoot.querySelector('#netto-einkommen');
        this.nettoEinkommenWert = this.shadowRoot.querySelector('#netto-einkommen-wert');
        this.alterInput = this.shadowRoot.querySelector('#alter');
        this.berufsgruppeInput = this.shadowRoot.querySelector('#berufsgruppe');
        this.buRenteInput = this.shadowRoot.querySelector('#bu-rente');
        this.buRenteWert = this.shadowRoot.querySelector('#bu-rente-wert');
        
        // Ergebnis-Elemente
        this.barAktuell = this.shadowRoot.querySelector('#bar-aktuell .netto');
        this.barBu = this.shadowRoot.querySelector('#bar-bu');
        this.segmentGesetzlich = this.shadowRoot.querySelector('#segment-gesetzlich');
        this.segmentPrivat = this.shadowRoot.querySelector('#segment-privat');
        this.segmentLuecke = this.shadowRoot.querySelector('#segment-luecke');
        this.lueckeWert = this.shadowRoot.querySelector('#luecke-wert');
        this.beitragWert = this.shadowRoot.querySelector('#beitrag-wert');
    }

    connectedCallback() {
        // Event Listeners hinzufügen
        this.nettoEinkommenInput.addEventListener('input', this.updateValues.bind(this));
        this.alterInput.addEventListener('input', this.updateValues.bind(this));
        this.berufsgruppeInput.addEventListener('change', this.updateValues.bind(this));
        this.buRenteInput.addEventListener('input', this.updateValues.bind(this));

        // Initialberechnung
        this.updateValues();
    }

    updateValues() {
        const nettoEinkommen = parseInt(this.nettoEinkommenInput.value);
        const buRente = parseInt(this.buRenteInput.value);
        
        // Slider-Werte aktualisieren
        this.nettoEinkommenWert.textContent = `${nettoEinkommen.toLocaleString('de-DE')} €`;
        this.buRenteWert.textContent = `${buRente.toLocaleString('de-DE')} €`;

        // BU-Renten-Slider an Nettoeinkommen anpassen (max 80%)
        const maxBuRente = Math.round((nettoEinkommen * 0.8) / 50) * 50;
        this.buRenteInput.max = maxBuRente;
        if (buRente > maxBuRente) {
            this.buRenteInput.value = maxBuRente;
            this.buRenteWert.textContent = `${maxBuRente.toLocaleString('de-DE')} €`;
        }
        
        this.calculate();
    }

    calculate() {
        const nettoEinkommen = parseInt(this.nettoEinkommenInput.value);
        const alter = parseInt(this.alterInput.value);
        const berufsgruppeFaktor = parseFloat(this.berufsgruppeInput.value);
        const gewuenschteBuRente = parseInt(this.buRenteInput.value);

        // 1. Versorgungslücke berechnen
        // Vereinfachte Annahme: Staatliche Erwerbsminderungsrente ca. 30% des letzten Bruttos.
        // Wir schätzen das Brutto vom Netto hoch (sehr vereinfacht!).
        const geschaetztesBrutto = nettoEinkommen / 0.65;
        const gesetzlicheRente = Math.min(Math.round(geschaetztesBrutto * 0.3), 850); // Deckelung für Realismus

        const gesamtversorgungBu = gesetzlicheRente + gewuenschteBuRente;
        const luecke = nettoEinkommen - gesamtversorgungBu;

        this.lueckeWert.textContent = `${luecke.toLocaleString('de-DE')} €`;

        // 2. Beitrag schätzen (vereinfachte Formel)
        const grundbeitragPro1000Rente = 25;
        const altersFaktor = (alter - 18) * 0.05 + 1; // Älter = teurer
        
        const geschaetzterBeitrag = (gewuenschteBuRente / 1000) * grundbeitragPro1000Rente * altersFaktor * berufsgruppeFaktor;
        this.beitragWert.textContent = `ab ${Math.round(geschaetzterBeitrag).toLocaleString('de-DE')} €`;

        // 3. Diagramm aktualisieren
        this.updateChart(nettoEinkommen, gesetzlicheRente, gewuenschteBuRente, luecke);
    }

    updateChart(netto, gesetzlich, privat, luecke) {
        const totalBuVersorgung = gesetzlich + privat + Math.max(0, luecke);
        const maxHoehe = Math.max(netto, totalBuVersorgung);
        
        if (maxHoehe === 0) return;

        const gesetzlichProzent = (gesetzlich / maxHoehe) * 100;
        const privatProzent = (privat / maxHoehe) * 100;
        const lueckeProzent = (Math.max(0, luecke) / maxHoehe) * 100;

        const barBuGesamtProzent = ( (gesetzlich + privat) / maxHoehe ) * 100;

        this.barAktuell.setAttribute('data-value', `${netto.toLocaleString('de-DE')} €`);
        
        this.barBu.style.height = `${barBuGesamtProzent}%`;
        
        this.segmentGesetzlich.style.height = `${gesetzlichProzent}%`;
        this.segmentGesetzlich.setAttribute('data-value', `${gesetzlich.toLocaleString('de-DE')} €`);

        this.segmentPrivat.style.height = `${privatProzent}%`;
        this.segmentPrivat.setAttribute('data-value', `${privat.toLocaleString('de-DE')} €`);
        
        // Lücke nur im Diagramm anzeigen, wenn sie positiv ist.
        if (luecke > 0) {
            const barBuMitLueckeProzent = ( (gesetzlich + privat + luecke) / maxHoehe ) * 100;
            this.barBu.style.height = `${barBuMitLueckeProzent}%`;
            this.segmentLuecke.style.height = `${lueckeProzent}%`;
            this.segmentLuecke.setAttribute('data-value', `${luecke.toLocaleString('de-DE')} €`);
        } else {
            this.segmentLuecke.style.height = '0%';
        }
    }
}

// Das Custom Element definieren, damit es im Browser verwendet werden kann
window.customElements.define('bu-rechner', BuRechner);
