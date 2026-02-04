// --- KONFIGURASJON & DATA ---
const STORAGE_KEY = 'r102_autosave_v3';
const GEBYR_FORSKRIFT = "Forskrift av 28. januar 2026 nr. 125 om gebyr til Luftfartstilsynet mv.";
const GEBYR_SATS_NY = "3180";
const GEBYR_SATS_FORLENGELSE = "1610";

// Standard forbudsdager (MM-DD)
const STANDARD_NOFLY = [
    { date: "05-17", label: "17.05 (nasjonaldagen)" },
    { date: "12-31", label: "31.12-01.01 (nyttårsaften og første nyttårsdag)" }, // Spesiell håndtering
    { date: "12-10", label: "10.12 (utdeling av Nobels fredspris)" }
];

// Global state
let drones = [];
let pilots = [];
let activeNoFlyDates = [];
let mapImageBase64 = null; // Lagrer kartbildet

document.addEventListener('DOMContentLoaded', () => {
    if (typeof teksterData === 'undefined') { alert("Feil: tekster.js mangler."); return; }

    setStandardDates();
    loadState(); // Laster data (inkludert bilder og lister)
    
    if (pilots.length === 0) addPilot();
    if (drones.length === 0) addDrone();

    // VIKTIG: Initialiser tekstfelter slik at de ikke er tomme
    byttSpraak(false); 
    
    // Gjenopprett kartbilde visuelt
    if (mapImageBase64) {
        document.getElementById('img_preview').src = mapImageBase64;
        document.getElementById('image_preview_container').style.display = 'block';
    }
    
    renderNoFlyList();
    attachAutosave();
});

// --- PILOTER (Kun navn) ---
function addPilot(navn = '') {
    const id = Date.now(); 
    pilots.push({ id, navn });
    renderPilots();
    saveState();
}
function removePilot(id) {
    pilots = pilots.filter(p => p.id !== id);
    renderPilots();
    saveState();
}
function renderPilots() {
    const container = document.getElementById('pilot_container');
    container.innerHTML = '';
    pilots.forEach((p, index) => {
        const div = document.createElement('div');
        div.className = 'dynamic-row';
        div.innerHTML = `
            <div class="icon-input" style="flex: 1;"><i class="fa-solid fa-user-pilot"></i><input type="text" placeholder="Navn på pilot" value="${p.navn}" oninput="updatePilot(${p.id}, 'navn', this.value)"></div>
            ${index > 0 ? `<button class="btn-remove" onclick="removePilot(${p.id})" title="Fjern"><i class="fa-solid fa-times"></i></button>` : ''}
        `;
        container.appendChild(div);
    });
}
function updatePilot(id, field, value) {
    const p = pilots.find(x => x.id === id);
    if (p) { p[field] = value; saveState(); }
}

// --- DRONER (Med vekt-enhet) ---
function addDrone(modell = '', vekt = '', unit = 'kg', sn = '') {
    const id = Date.now() + Math.random(); 
    drones.push({ id, modell, vekt, unit, sn });
    renderDrones();
    saveState();
}
function removeDrone(id) {
    drones = drones.filter(d => d.id !== id);
    renderDrones();
    saveState();
}
function renderDrones() {
    const container = document.getElementById('drone_container');
    container.innerHTML = '';
    drones.forEach((d, index) => {
        const div = document.createElement('div');
        div.className = 'dynamic-row';
        div.innerHTML = `
            <div class="icon-input" style="flex: 2;"><i class="fa-solid fa-plane"></i><input type="text" placeholder="Modell" value="${d.modell}" oninput="updateDrone(${d.id}, 'modell', this.value)"></div>
            <div style="flex: 1; display:flex;">
                <input type="text" placeholder="Vekt" value="${d.vekt}" oninput="updateDrone(${d.id}, 'vekt', this.value)" style="border-radius: 6px 0 0 6px; width: 60%;">
                <select onchange="updateDrone(${d.id}, 'unit', this.value)" style="border-radius: 0 6px 6px 0; width: 40%; border-left: 0;">
                    <option value="kg" ${d.unit === 'kg' ? 'selected' : ''}>kg</option>
                    <option value="g" ${d.unit === 'g' ? 'selected' : ''}>g</option>
                </select>
            </div>
            <div class="icon-input" style="flex: 2;"><i class="fa-solid fa-barcode"></i><input type="text" placeholder="Serienummer" value="${d.sn}" oninput="updateDrone(${d.id}, 'sn', this.value)"></div>
            ${index > 0 ? `<button class="btn-remove" onclick="removeDrone(${d.id})" title="Fjern"><i class="fa-solid fa-times"></i></button>` : ''}
        `;
        container.appendChild(div);
    });
}
function updateDrone(id, field, value) {
    const d = drones.find(x => x.id === id);
    if (d) { d[field] = value; saveState(); }
}

// --- KART / BILDE ---
function previewImage() {
    const file = document.getElementById('in_kart_bilde').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = function() {
            mapImageBase64 = reader.result;
            document.getElementById('img_preview').src = mapImageBase64;
            document.getElementById('image_preview_container').style.display = 'block';
            saveState();
        }
        reader.readAsDataURL(file);
    }
}
function removeImage() {
    mapImageBase64 = null;
    document.getElementById('in_kart_bilde').value = "";
    document.getElementById('image_preview_container').style.display = 'none';
    saveState();
}

// --- DATO SJEKK (Flyforbud) ---
function checkDates() {
    const fra = document.getElementById('in_fra').valueAsDate;
    const til = document.getElementById('in_til').valueAsDate;
    
    if (!fra || !til) return;

    // Rens listen for autogenererte, behold egendefinerte (her forenkler vi og regenererer standard)
    // Beholder "custom" dager som brukeren har lagt til manuelt?
    // Enklest: Vi sjekker standarddatoer og legger til hvis de mangler.
    
    const currentList = activeNoFlyDates.map(d => d.label);

    STANDARD_NOFLY.forEach(std => {
        // Enkel sjekk: Sjekk om datoen finnes i årene mellom fra og til
        let hit = false;
        let startYear = fra.getFullYear();
        let endYear = til.getFullYear();

        for (let y = startYear; y <= endYear; y++) {
            // Konstruer datoobjekt for sjekk
            let checkStr = "";
            if (std.date === "12-31") { // Nyttår håndtering
                 // Sjekk om 31.12.Y eller 01.01.Y+1 er i intervallet
                 let d1 = new Date(y, 11, 31);
                 let d2 = new Date(y+1, 0, 1);
                 if ((d1 >= fra && d1 <= til) || (d2 >= fra && d2 <= til)) hit = true;
            } else {
                let [m, d] = std.date.split('-');
                let dateObj = new Date(y, parseInt(m)-1, parseInt(d));
                if (dateObj >= fra && dateObj <= til) hit = true;
            }
        }

        if (hit) {
            if (!activeNoFlyDates.some(x => x.label === std.label)) {
                activeNoFlyDates.push({ label: std.label, auto: true });
            }
        }
    });

    renderNoFlyList();
    saveState();
}

function addCustomNoFly() {
    const txt = document.getElementById('new_nofly_text').value;
    if (txt) {
        activeNoFlyDates.push({ label: txt, auto: false });
        document.getElementById('new_nofly_text').value = '';
        renderNoFlyList();
        saveState();
    }
}

function removeNoFly(index) {
    activeNoFlyDates.splice(index, 1);
    renderNoFlyList();
    saveState();
}

function renderNoFlyList() {
    const ul = document.getElementById('no_fly_list');
    ul.innerHTML = '';
    activeNoFlyDates.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.label} <span class="tag-remove" onclick="removeNoFly(${index})">&times;</span>`;
        ul.appendChild(li);
    });
}

// --- STANDARD LOGIKK ---
function oppdaterGebyr() {
    const isExtension = document.getElementById('type_forlengelse').checked;
    document.getElementById('in_gebyr_sats').value = isExtension ? GEBYR_SATS_FORLENGELSE : GEBYR_SATS_NY;
    byttSpraak(false); // Oppdater tekster, men behold evt manuelle redigeringer hvis mulig (her resetter vi for sikkerhet)
    saveState();
}

function byttSpraak(resetTexts = true) {
    const lang = document.getElementById('in_spraak').value;
    const t = teksterData[lang];
    const isExtension = document.getElementById('type_forlengelse').checked;
    
    let typeTxt = lang === 'no' ? (isExtension ? "forlengelse" : "dispensasjon") : (isExtension ? "extension" : "permission");
    const gebyrSats = document.getElementById('in_gebyr_sats').value;

    const fillTexts = () => {
        document.getElementById('txt_edit_bakgrunn').value = t.bakgrunn.replace('{TYPE}', typeTxt);
        document.getElementById('txt_edit_vurdering').value = t.vurdering;
        document.getElementById('txt_edit_vedtak').value = t.vedtak;
        document.getElementById('txt_edit_gebyr').value = t.gebyr.replace('{BELOP}', gebyrSats).replace('{FORSKRIFT}', GEBYR_FORSKRIFT).replace('{TYPE}', typeTxt);
    };

    if (resetTexts) {
        fillTexts();
    } else {
        // Hvis feltene er tomme (f.eks. ved første last), fyll dem uansett
        if (!document.getElementById('txt_edit_bakgrunn').value) fillTexts();
        else {
            // Bare oppdater variablene i teksten, behold resten? Litt risikabelt.
            // Vi kjører full oppdatering på bakgrunn/gebyr for å sikre rett data.
            document.getElementById('txt_edit_bakgrunn').value = t.bakgrunn.replace('{TYPE}', typeTxt);
            document.getElementById('txt_edit_gebyr').value = t.gebyr.replace('{BELOP}', gebyrSats).replace('{FORSKRIFT}', GEBYR_FORSKRIFT).replace('{TYPE}', typeTxt);
        }
    }
    saveState();
}

function setStandardDates() {
    const today = new Date();
    const dEl = document.getElementById('in_dato');
    if (dEl && !dEl.value) dEl.valueAsDate = today;
}

function saveState() {
    const inputs = document.querySelectorAll('input, select, textarea');
    const data = { fields: {}, drones: drones, pilots: pilots, nofly: activeNoFlyDates, map: mapImageBase64 };
    
    inputs.forEach(el => {
        if (el.id && !el.id.startsWith('search') && el.type !== 'file') { 
            if (el.type === 'checkbox' || el.type === 'radio') {
                if (el.checked) data.fields[el.id] = el.value; 
            } else {
                data.fields[el.id] = el.value;
            }
        }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadState() {
    const savedJson = localStorage.getItem(STORAGE_KEY);
    if (!savedJson) return;
    const data = JSON.parse(savedJson);
    
    if (data.fields) {
        for (const [id, value] of Object.entries(data.fields)) {
            const el = document.getElementById(id);
            if (el) {
                if (el.type === 'checkbox') el.checked = true;
                else if (el.type === 'radio') { if (el.value === value) el.checked = true; } 
                else el.value = value;
            }
        }
    }
    if (data.drones) { drones = data.drones; renderDrones(); }
    if (data.pilots) { pilots = data.pilots; renderPilots(); }
    if (data.nofly) { activeNoFlyDates = data.nofly; renderNoFlyList(); }
    if (data.map) { mapImageBase64 = data.map; }
}

function resetForm() {
    if (confirm("Er du sikker på at du vil tømme hele skjemaet?")) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload(); 
    }
}

function attachAutosave() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(el => {
        if (el.type !== 'file') {
            el.addEventListener('input', saveState);
            el.addEventListener('change', saveState);
        }
    });
}

// --- UTSKRIFT ---
function formatDate(dateStr) {
    if (!dateStr) return "DD.MM.YYYY";
    const d = new Date(dateStr);
    return d.toLocaleDateString('no-NO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function printDoc() {
    saveState(); 

    const lang = document.getElementById('in_spraak').value;
    const t = teksterData[lang];
    
    const m = {
        mottaker: document.getElementById('in_mottaker').value || "[MOTTAKER]",
        adresse: document.getElementById('in_adresse').value,
        poststed: document.getElementById('in_poststed').value,
        saksbehandler: document.getElementById('in_saksbehandler').value,
        ref: document.getElementById('in_ref').value,
        opNr: document.getElementById('in_opNr').value || "[OPNR]",
        orgNr: document.getElementById('in_orgNr').value || "[ORGNR]",
        oppdrag: document.getElementById('in_oppdrag').value,
        art: document.getElementById('in_art').value || "[FORMÅL]",
        omrade: document.getElementById('in_omrade').value,
        fra: formatDate(document.getElementById('in_fra').value),
        til: formatDate(document.getElementById('in_til').value),
        dato: formatDate(document.getElementById('in_dato').value),
        deresDato: formatDate(document.getElementById('in_deresDato').value),
        sjefNavn: document.getElementById('in_sjef_navn').value,
        sjefTittel: document.getElementById('in_sjef_tittel').value,
        kontaktNavn: document.getElementById('in_kontakt_navn').value,
        kontaktTlf: document.getElementById('in_kontakt_tlf').value,
        kontaktEpost: document.getElementById('in_kontakt_epost').value
    };

    let regelsettArr = [];
    if (document.getElementById('reg_a1').checked) regelsettArr.push(document.getElementById('reg_a1').value);
    if (document.getElementById('reg_a2').checked) regelsettArr.push(document.getElementById('reg_a2').value);
    if (document.getElementById('reg_spesifikk').checked) {
        let ref = document.getElementById('in_spesifikk_ref').value;
        regelsettArr.push(`Spesifikk kategori (${ref})`);
    }
    const regelsettStr = regelsettArr.join(", ");

    // Fyll labels
    for (const [key, label] of Object.entries(t.labels)) {
        if (typeof label === 'string') {
            const el = document.getElementById('lbl_' + key);
            if (el) el.innerText = label;
            if (key === 'stilling') document.getElementById('lbl_stilling').innerText = label;
        } else if (typeof label === 'object') {
            if (key === 'tabell') {
                for (const [k, v] of Object.entries(label)) {
                    const th = document.getElementById('th_' + k);
                    if (th) th.innerText = v;
                }
            }
            if (key === 'header') {
                for (const [k, v] of Object.entries(label)) {
                    const h = document.getElementById('h_' + k);
                    if (h) h.innerText = v;
                }
            }
        }
    }

    // Fyll ut faste felter
    const mapFields = {
        'out_saksbehandler': m.saksbehandler,
        'out_saksbehandler_sign': m.saksbehandler,
        'out_dato': m.dato,
        'out_ref': m.ref,
        'out_deresDato': m.deresDato,
        'out_mottaker': m.mottaker,
        'out_tittelMottaker': m.mottaker,
        'out_adresse': m.adresse,
        'out_poststed': m.poststed,
        'out_regelsett': regelsettStr,
        'out_oppdrag': m.oppdrag,
        'out_art': m.art,
        'out_fra': m.fra,
        'out_til': m.til,
        'out_omrade': m.omrade,
        'out_sjef_navn': m.sjefNavn,
        'out_sjef_tittel': m.sjefTittel,
        'out_kontakt_navn': m.kontaktNavn,
        'out_kontakt_tlf': m.kontaktTlf,
        'out_kontakt_epost': m.kontaktEpost
    };

    for (const [id, val] of Object.entries(mapFields)) {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    }

    // Piloter i PDF (Kun navn)
    let pilotText = pilots.map(p => p.navn).join(", ");
    document.getElementById('out_piloter_liste').innerText = pilotText || "-";

    // Kartbilde
    const imgOut = document.getElementById('out_kart_bilde');
    if (mapImageBase64) {
        imgOut.src = mapImageBase64;
        imgOut.style.display = 'block';
    } else {
        imgOut.style.display = 'none';
    }

    // Tekster
    let bakgrunn = document.getElementById('txt_edit_bakgrunn').value
        .replace('{MOTTAKER}', m.mottaker).replace('{OPNR}', m.opNr).replace('{ORGNR}', m.orgNr);
    let vurdering = document.getElementById('txt_edit_vurdering').value
        .replace('{FORMAL}', m.art);
    let vedtak = document.getElementById('txt_edit_vedtak').value
        .replace('{MOTTAKER}', m.mottaker);
    let gebyrTxt = document.getElementById('txt_edit_gebyr').value;

    document.getElementById('out_txt_bakgrunn').innerHTML = bakgrunn;
    document.getElementById('out_txt_regelverk').innerText = t.regelverk;
    document.getElementById('out_txt_vurdering').innerHTML = vurdering.replace(/\n/g, "<br>");
    document.getElementById('out_txt_vedtak').innerText = vedtak;
    document.getElementById('out_txt_gebyr').innerHTML = gebyrTxt.replace(/\n/g, "<br>");
    document.getElementById('out_txt_klage').innerText = t.klage;
    document.getElementById('out_txt_kopi').innerText = t.kopi;

    // Vilkår (med forbudsdager)
    const ul = document.getElementById('list_vilkar');
    ul.innerHTML = "";
    
    // Formater listen over forbudsdager til tekst
    let noFlyStr = "";
    if (activeNoFlyDates.length > 0) {
        noFlyStr = activeNoFlyDates.map(d => " - " + d.label).join("\n");
    } else {
        noFlyStr = " (Ingen spesielle datoer registrert)";
    }

    t.vilkar.forEach(punkt => {
        let tekst = punkt
            .replace('{FRA}', m.fra)
            .replace('{TIL}', m.til)
            .replace('{REGELSETT}', regelsettStr)
            .replace('{FORBUDSDAGER}', noFlyStr);
        
        let li = document.createElement('li');
        li.innerText = tekst; // Bevarer linjeskift i tekst
        li.style.whiteSpace = "pre-line"; // Viktig for listen
        ul.appendChild(li);
    });

    // Dronetabell
    const tbody = document.getElementById('tbody_droner');
    tbody.innerHTML = "";
    drones.forEach(d => {
        let tr = document.createElement('tr');
        tr.innerHTML = `<td>${d.modell}</td><td>${d.vekt} ${d.unit}</td><td>${d.sn}</td>`;
        tbody.appendChild(tr);
    });

    window.print();
}

document.getElementById('reg_spesifikk').addEventListener('change', function() {
    document.getElementById('in_spesifikk_ref').style.display = this.checked ? 'block' : 'none';
});