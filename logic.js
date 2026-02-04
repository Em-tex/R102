// --- KONFIGURASJON & DATA ---
const STORAGE_KEY = 'r102_autosave_v2';
const GEBYR_FORSKRIFT = "Forskrift av 28. januar 2026 nr. 125 om gebyr til Luftfartstilsynet mv.";
const GEBYR_SATS_NY = "3180";
const GEBYR_SATS_FORLENGELSE = "1610";

// Global state for lister
let drones = [];
let pilots = [];

document.addEventListener('DOMContentLoaded', () => {
    // Sjekk at tekster.js er lastet
    if (typeof teksterData === 'undefined') {
        alert("Feil: tekster.js er ikke lastet.");
        return;
    }

    setStandardDates();
    loadState(); // Laster lagret data
    
    if (pilots.length === 0) addPilot();
    if (drones.length === 0) addDrone();

    oppdaterGebyr(); 
    attachAutosave();
});

// --- LISTE-LOGIKK (Samme som før) ---
function addPilot(navn = '', tlf = '', epost = '') {
    const id = Date.now(); 
    pilots.push({ id, navn, tlf, epost });
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
            <div class="icon-input" style="flex: 2;"><i class="fa-solid fa-user"></i><input type="text" placeholder="Navn" value="${p.navn}" oninput="updatePilot(${p.id}, 'navn', this.value)"></div>
            <div class="icon-input" style="flex: 1;"><i class="fa-solid fa-phone"></i><input type="text" placeholder="Tlf" value="${p.tlf}" oninput="updatePilot(${p.id}, 'tlf', this.value)"></div>
            <div class="icon-input" style="flex: 2;"><i class="fa-solid fa-envelope"></i><input type="text" placeholder="Epost" value="${p.epost}" oninput="updatePilot(${p.id}, 'epost', this.value)"></div>
            ${index > 0 ? `<button class="btn-remove" onclick="removePilot(${p.id})" title="Fjern"><i class="fa-solid fa-times"></i></button>` : ''}
        `;
        container.appendChild(div);
    });
}
function updatePilot(id, field, value) {
    const p = pilots.find(x => x.id === id);
    if (p) { p[field] = value; saveState(); }
}
function addDrone(modell = '', vekt = '', sn = '') {
    const id = Date.now() + Math.random(); 
    drones.push({ id, modell, vekt, sn });
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
            <div class="icon-input" style="flex: 1;"><i class="fa-solid fa-weight-hanging"></i><input type="text" placeholder="Vekt" value="${d.vekt}" oninput="updateDrone(${d.id}, 'vekt', this.value)"></div>
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

// --- GEBYR & SPRÅK ---
function oppdaterGebyr() {
    const isExtension = document.getElementById('type_forlengelse').checked;
    const gebyrInput = document.getElementById('in_gebyr_sats');
    if (isExtension) {
        gebyrInput.value = GEBYR_SATS_FORLENGELSE;
    } else {
        gebyrInput.value = GEBYR_SATS_NY;
    }
    byttSpraak(false); 
    saveState();
}

function byttSpraak(resetTexts = true) {
    const lang = document.getElementById('in_spraak').value;
    const t = teksterData[lang];
    const isExtension = document.getElementById('type_forlengelse').checked;
    
    // Sett riktig ordlyd for type (dispensasjon/forlengelse)
    let typeTxt = "";
    if (lang === 'no') typeTxt = isExtension ? "forlengelse" : "dispensasjon";
    else typeTxt = isExtension ? "extension" : "permission"; // PDF bruker "permission" og "extension of permission"

    const gebyrSats = document.getElementById('in_gebyr_sats').value;

    if (resetTexts) {
        document.getElementById('txt_edit_bakgrunn').value = t.bakgrunn.replace('{TYPE}', typeTxt);
        document.getElementById('txt_edit_vurdering').value = t.vurdering;
        document.getElementById('txt_edit_vedtak').value = t.vedtak;
        document.getElementById('txt_edit_gebyr').value = t.gebyr.replace('{BELOP}', gebyrSats).replace('{FORSKRIFT}', GEBYR_FORSKRIFT).replace('{TYPE}', typeTxt);
    } else {
        document.getElementById('txt_edit_bakgrunn').value = t.bakgrunn.replace('{TYPE}', typeTxt);
        document.getElementById('txt_edit_gebyr').value = t.gebyr.replace('{BELOP}', gebyrSats).replace('{FORSKRIFT}', GEBYR_FORSKRIFT).replace('{TYPE}', typeTxt);
    }
    saveState();
}

// --- LAGRING ---
function setStandardDates() {
    const today = new Date();
    const dEl = document.getElementById('in_dato');
    const fEl = document.getElementById('in_fra');
    if (dEl && !dEl.value) dEl.valueAsDate = today;
    if (fEl && !fEl.value) fEl.valueAsDate = today;
}

function saveState() {
    const inputs = document.querySelectorAll('input, select, textarea');
    const data = { fields: {}, drones: drones, pilots: pilots };
    inputs.forEach(el => {
        if (el.id && !el.id.startsWith('search')) { 
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
}

function resetForm() {
    if (confirm("Er du sikker på at du vil tømme hele skjemaet?")) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload(); 
    }
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
        gebyr: document.getElementById('in_gebyr_sats').value
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
            if (key === 'stilling') { document.getElementById('lbl_stilling').innerText = label; }
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

    // Fyll output
    const map = {
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
        'out_sjef_tittel': m.sjefTittel
    };
    for (const [id, val] of Object.entries(map)) {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    }

    let pilotText = pilots.map(p => `${p.navn} (tlf: ${p.tlf})`).join("\n");
    document.getElementById('out_kontakt').innerText = pilotText; 
    document.getElementById('out_piloter_liste').innerText = "Se kontaktinformasjon"; 

    // Fyll inn redigerbare tekster
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

    // Vilkår
    const ul = document.getElementById('list_vilkar');
    ul.innerHTML = "";
    t.vilkar.forEach(punkt => {
        let tekst = punkt
            .replace('{FRA}', m.fra)
            .replace('{TIL}', m.til)
            .replace('{REGELSETT}', regelsettStr);
        let li = document.createElement('li');
        li.innerText = tekst;
        ul.appendChild(li);
    });

    // Tabell
    const tbody = document.getElementById('tbody_droner');
    tbody.innerHTML = "";
    drones.forEach(d => {
        let tr = document.createElement('tr');
        tr.innerHTML = `<td>${d.modell}</td><td>${d.vekt}</td><td>${d.sn}</td>`;
        tbody.appendChild(tr);
    });

    window.print();
}

document.getElementById('reg_spesifikk').addEventListener('change', function() {
    document.getElementById('in_spesifikk_ref').style.display = this.checked ? 'block' : 'none';
});