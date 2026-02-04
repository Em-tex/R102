// --- KONFIGURASJON & DATA ---
const STORAGE_KEY = 'r102_autosave_v6';
const GEBYR_FORSKRIFT = "Forskrift av 28. januar 2026 nr. 125 om gebyr til Luftfartstilsynet mv.";
const GEBYR_SATS_NY = "3180";
const GEBYR_SATS_FORLENGELSE = "1610";

const STANDARD_NOFLY = [
    { date: "05-17", label: "17.05 (nasjonaldagen)" },
    { date: "12-31", label: "31.12-01.01 (nyttårsaften og første nyttårsdag)" }, 
    { date: "12-10", label: "10.12 (utdeling av Nobels fredspris)" }
];

let drones = [];
let pilots = [];
let activeNoFlyDates = [];
let mapImageBase64 = null;

document.addEventListener('DOMContentLoaded', () => {
    if (typeof teksterData === 'undefined') { alert("Feil: tekster.js mangler."); return; }

    setStandardDates();
    setStortingetDate();    // Beregner åpningsdato
    loadState();            // Laster data (overskriver datoer hvis de var lagret manuelt)
    
    if(!document.getElementById('in_gebyr_sats').value) {
        oppdaterGebyr();
    }

    if (pilots.length === 0) addPilot();
    if (drones.length === 0) addDrone();

    togglePrivat(false); 
    byttSpraak(false);
    
    if (mapImageBase64) {
        document.getElementById('img_preview').src = mapImageBase64;
        document.getElementById('image_preview_container').style.display = 'block';
    }
    
    checkDates(); 
    attachAutosave();
});

// --- DATO-LOGIKK FOR STORTINGET ---
function setStortingetDate() {
    const fraInput = document.getElementById('in_fra');
    // Bruk årstall fra "Fra dato" hvis valgt, ellers inneværende år
    const year = fraInput.value ? new Date(fraInput.value).getFullYear() : new Date().getFullYear();
    
    // 1. oktober
    let d = new Date(year, 9, 1); 
    const dayOfWeek = d.getDay(); // 0=Søn, 6=Lør

    // Stortinget trer sammen første hverdag i oktober.
    if (dayOfWeek === 6) {
        d.setDate(3); // Lørdag -> Mandag (pluss 2 dager)
    } else if (dayOfWeek === 0) {
        d.setDate(2); // Søndag -> Mandag (pluss 1 dag)
    }

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const field = document.getElementById('in_stortinget_dato');
    // Sett kun hvis feltet er tomt (ikke overskriv hvis brukeren har endret det manuelt før reload)
    if (!field.value) {
        field.value = dateStr;
    }
}

// --- SJEKK DATOER MOT PERIODE ---
function checkDates() {
    const fra = document.getElementById('in_fra').valueAsDate;
    const til = document.getElementById('in_til').valueAsDate;
    
    if (!fra || !til) return;

    // 1. Sjekk faste datoer (17. mai etc)
    STANDARD_NOFLY.forEach(std => {
        let hit = false;
        let startYear = fra.getFullYear();
        let endYear = til.getFullYear();

        for (let y = startYear; y <= endYear; y++) {
            if (std.date === "12-31") { 
                 let d1 = new Date(y, 11, 31);
                 let d2 = new Date(y+1, 0, 1);
                 if ((d1 >= fra && d1 <= til) || (d2 >= fra && d2 <= til)) hit = true;
            } else {
                let [m, d] = std.date.split('-');
                let testDate = new Date(y, parseInt(m)-1, parseInt(d));
                if (testDate >= fra && testDate <= til) hit = true;
            }
        }

        if (hit && !activeNoFlyDates.some(x => x.label === std.label)) {
            activeNoFlyDates.push({ label: std.label, auto: true });
        }
    });

    // 2. Sjekk Stortingets åpning (fra konfigurasjonsfeltet)
    const stortingInput = document.getElementById('in_stortinget_dato');
    if (stortingInput.value) {
        const stortingDate = new Date(stortingInput.value);
        if (stortingDate >= fra && stortingDate <= til) {
            const day = String(stortingDate.getDate()).padStart(2, '0');
            const month = String(stortingDate.getMonth() + 1).padStart(2, '0');
            const label = `${day}.${month} (Stortingets åpning)`;

            if (!activeNoFlyDates.some(x => x.label === label)) {
                activeNoFlyDates.push({ label: label, auto: true });
            }
        }
    }

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

// --- PRIVATPERSON ---
function togglePrivat(save = true) {
    const isPrivat = document.getElementById('check_privat').checked;
    const orgDiv = document.getElementById('div_orgNr');
    
    if (isPrivat) {
        orgDiv.style.display = 'none';
    } else {
        orgDiv.style.display = 'block';
    }
    
    byttSpraak(false);
    if(save) saveState();
}

// --- VALIDERING ---
function validateForm() {
    let isValid = true;
    const requiredInputs = document.querySelectorAll('.required');
    
    requiredInputs.forEach(el => {
        // Validerer kun synlige felt (ignorerer skjult orgnr)
        if (el.offsetParent !== null) { 
            if (!el.value.trim()) {
                el.classList.add('input-error');
                isValid = false;
            } else {
                el.classList.remove('input-error');
            }
        }
    });

    requiredInputs.forEach(el => {
        el.addEventListener('input', function() {
            if(this.value.trim()) this.classList.remove('input-error');
        });
    });

    return isValid;
}

// --- GENERELT ---
function oppdaterGebyr() {
    const isExtension = document.getElementById('type_forlengelse').checked;
    document.getElementById('in_gebyr_sats').value = isExtension ? GEBYR_SATS_FORLENGELSE : GEBYR_SATS_NY;
    byttSpraak(false); 
    saveState();
}

function byttSpraak(resetTexts = true) {
    const lang = document.getElementById('in_spraak').value;
    const t = teksterData[lang];
    const isExtension = document.getElementById('type_forlengelse').checked;
    const isPrivat = document.getElementById('check_privat').checked;
    
    let typeTxt = lang === 'no' ? (isExtension ? "forlengelse" : "dispensasjon") : (isExtension ? "extension" : "permission");
    const gebyrSats = document.getElementById('in_gebyr_sats').value;

    let rawBakgrunn = t.bakgrunn;
    if (isPrivat) {
        rawBakgrunn = rawBakgrunn.replace(", organisasjonsnummer: {ORGNR}", "").replace(", trade register No: {ORGNR}", "");
    }

    const fillTexts = () => {
        document.getElementById('txt_edit_bakgrunn').value = rawBakgrunn.replace('{TYPE}', typeTxt);
        document.getElementById('txt_edit_vurdering').value = t.vurdering;
        document.getElementById('txt_edit_vedtak').value = t.vedtak;
        document.getElementById('txt_edit_gebyr').value = t.gebyr.replace('{BELOP}', gebyrSats).replace('{FORSKRIFT}', GEBYR_FORSKRIFT).replace('{TYPE}', typeTxt);
    };

    if (resetTexts) {
        fillTexts();
    } else {
        if (!document.getElementById('txt_edit_bakgrunn').value) fillTexts();
        else {
            document.getElementById('txt_edit_bakgrunn').value = rawBakgrunn.replace('{TYPE}', typeTxt);
            document.getElementById('txt_edit_gebyr').value = t.gebyr.replace('{BELOP}', gebyrSats).replace('{FORSKRIFT}', GEBYR_FORSKRIFT).replace('{TYPE}', typeTxt);
        }
    }
    saveState();
}

function addPilot(navn = '') {
    const id = Date.now(); pilots.push({ id, navn }); renderPilots(); saveState();
}
function removePilot(id) {
    pilots = pilots.filter(p => p.id !== id); renderPilots(); saveState();
}
function renderPilots() {
    const container = document.getElementById('pilot_container'); container.innerHTML = '';
    pilots.forEach((p, index) => {
        const div = document.createElement('div'); div.className = 'dynamic-row';
        div.innerHTML = `<div class="icon-input" style="flex: 1;"><i class="fa-solid fa-user-pilot"></i><input type="text" placeholder="Navn på pilot" value="${p.navn}" oninput="updatePilot(${p.id}, 'navn', this.value)"></div>${index > 0 ? `<button class="btn-remove" onclick="removePilot(${p.id})"><i class="fa-solid fa-times"></i></button>` : ''}`;
        container.appendChild(div);
    });
}
function updatePilot(id, field, value) { const p = pilots.find(x => x.id === id); if (p) { p[field] = value; saveState(); } }

function addDrone(modell = '', vekt = '', unit = 'kg', sn = '') {
    const id = Date.now() + Math.random(); drones.push({ id, modell, vekt, unit, sn }); renderDrones(); saveState();
}
function removeDrone(id) { drones = drones.filter(d => d.id !== id); renderDrones(); saveState(); }
function renderDrones() {
    const container = document.getElementById('drone_container'); container.innerHTML = '';
    drones.forEach((d, index) => {
        const div = document.createElement('div'); div.className = 'dynamic-row';
        div.innerHTML = `<div class="icon-input" style="flex: 2;"><i class="fa-solid fa-plane"></i><input type="text" placeholder="Modell" value="${d.modell}" oninput="updateDrone(${d.id}, 'modell', this.value)"></div><div style="flex: 1; display:flex;"><input type="text" placeholder="Vekt" value="${d.vekt}" oninput="updateDrone(${d.id}, 'vekt', this.value)" style="width: 60%;"><select onchange="updateDrone(${d.id}, 'unit', this.value)" style="width: 40%;"><option value="kg" ${d.unit === 'kg' ? 'selected' : ''}>kg</option><option value="g" ${d.unit === 'g' ? 'selected' : ''}>g</option></select></div><div class="icon-input" style="flex: 2;"><i class="fa-solid fa-barcode"></i><input type="text" placeholder="Serienummer" value="${d.sn}" oninput="updateDrone(${d.id}, 'sn', this.value)"></div>${index > 0 ? `<button class="btn-remove" onclick="removeDrone(${d.id})"><i class="fa-solid fa-times"></i></button>` : ''}`;
        container.appendChild(div);
    });
}
function updateDrone(id, field, value) { const d = drones.find(x => x.id === id); if (d) { d[field] = value; saveState(); } }

function previewImage() {
    const file = document.getElementById('in_kart_bilde').files[0];
    if (file) { const reader = new FileReader(); reader.onloadend = function() { mapImageBase64 = reader.result; document.getElementById('img_preview').src = mapImageBase64; document.getElementById('image_preview_container').style.display = 'block'; saveState(); }; reader.readAsDataURL(file); }
}
function removeImage() { mapImageBase64 = null; document.getElementById('in_kart_bilde').value = ""; document.getElementById('image_preview_container').style.display = 'none'; saveState(); }

function setStandardDates() {
    const today = new Date(); const dEl = document.getElementById('in_dato');
    if (dEl && !dEl.value) dEl.valueAsDate = today;
}
function saveState() {
    const inputs = document.querySelectorAll('input, select, textarea');
    const data = { fields: {}, drones: drones, pilots: pilots, nofly: activeNoFlyDates, map: mapImageBase64, isPrivat: document.getElementById('check_privat').checked };
    inputs.forEach(el => {
        if (el.id && !el.id.startsWith('search') && el.type !== 'file') { 
            if (el.type === 'checkbox' || el.type === 'radio') { if (el.checked) data.fields[el.id] = el.value; } 
            else { data.fields[el.id] = el.value; }
        }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function loadState() {
    const savedJson = localStorage.getItem(STORAGE_KEY); if (!savedJson) return;
    const data = JSON.parse(savedJson);
    if (data.isPrivat) document.getElementById('check_privat').checked = true;
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
    if (data.nofly) { activeNoFlyDates = data.nofly; }
    if (data.map) { mapImageBase64 = data.map; }
}
function resetForm() { if (confirm("Er du sikker på at du vil tømme hele skjemaet?")) { localStorage.removeItem(STORAGE_KEY); location.reload(); } }
function attachAutosave() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(el => { if (el.type !== 'file') { el.addEventListener('input', saveState); el.addEventListener('change', saveState); } });
}

// --- UTSKRIFT ---
function getFormData() {
    return {
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
}
function formatDate(dateStr) { if (!dateStr) return "DD.MM.YYYY"; const d = new Date(dateStr); return d.toLocaleDateString('no-NO', { day: '2-digit', month: '2-digit', year: 'numeric' }); }

function printDoc() {
    if (!validateForm()) {
        alert("Advarsel: Noen obligatoriske felt er ikke fylt ut (markert med rødt). PDF genereres likevel.");
    }
    saveState(); 

    const lang = document.getElementById('in_spraak').value;
    const t = teksterData[lang];
    const isPrivat = document.getElementById('check_privat').checked;
    const m = getFormData();

    let regelsettArr = [];
    if (document.getElementById('reg_a1').checked) regelsettArr.push(document.getElementById('reg_a1').value);
    if (document.getElementById('reg_a2').checked) regelsettArr.push(document.getElementById('reg_a2').value);
    if (document.getElementById('reg_spesifikk').checked) {
        let ref = document.getElementById('in_spesifikk_ref').value;
        regelsettArr.push(`Spesifikk kategori (${ref})`);
    }
    const regelsettStr = regelsettArr.join(", ");

    for (const [key, label] of Object.entries(t.labels)) {
        if (typeof label === 'string') {
            const el = document.getElementById('lbl_' + key);
            if (el) el.innerText = label;
            if (key === 'stilling') document.getElementById('lbl_stilling').innerText = label;
        } else if (typeof label === 'object') {
            if (key === 'tabell') { for (const [k, v] of Object.entries(label)) { const th = document.getElementById('th_' + k); if (th) th.innerText = v; } }
            if (key === 'header') { for (const [k, v] of Object.entries(label)) { const h = document.getElementById('h_' + k); if (h) h.innerText = v; } }
        }
    }
    
    const mapFields = {
        'out_saksbehandler': m.saksbehandler, 'out_saksbehandler_sign': m.saksbehandler,
        'out_dato': m.dato, 'out_ref': m.ref, 'out_deresDato': m.deresDato,
        'out_mottaker': m.mottaker, 'out_tittelMottaker': m.mottaker,
        'out_adresse': m.adresse, 'out_poststed': m.poststed,
        'out_regelsett': regelsettStr, 'out_oppdrag': m.oppdrag, 'out_art': m.art,
        'out_fra': m.fra, 'out_til': m.til, 'out_omrade': m.omrade,
        'out_sjef_navn': m.sjefNavn, 'out_sjef_tittel': m.sjefTittel,
        'out_kontakt_navn': m.kontaktNavn, 'out_kontakt_tlf': m.kontaktTlf, 'out_kontakt_epost': m.kontaktEpost
    };
    for (const [id, val] of Object.entries(mapFields)) { const el = document.getElementById(id); if (el) el.innerText = val; }

    let pilotText = pilots.map(p => p.navn).join(", ");
    document.getElementById('out_piloter_liste').innerText = pilotText || "-";

    const imgOut = document.getElementById('out_kart_bilde');
    if (mapImageBase64) { imgOut.src = mapImageBase64; imgOut.style.display = 'block'; } else { imgOut.style.display = 'none'; }

    let bakgrunn = document.getElementById('txt_edit_bakgrunn').value;
    if (isPrivat) bakgrunn = bakgrunn.replace("{MOTTAKER}", m.mottaker).replace("{OPNR}", m.opNr);
    else bakgrunn = bakgrunn.replace("{MOTTAKER}", m.mottaker).replace("{OPNR}", m.opNr).replace("{ORGNR}", m.orgNr);

    let vurdering = document.getElementById('txt_edit_vurdering').value.replace('{FORMAL}', m.art);
    let vedtak = document.getElementById('txt_edit_vedtak').value.replace('{MOTTAKER}', m.mottaker);
    let gebyrTxt = document.getElementById('txt_edit_gebyr').value;

    document.getElementById('out_txt_bakgrunn').innerHTML = bakgrunn;
    document.getElementById('out_txt_regelverk').innerText = t.regelverk;
    document.getElementById('out_txt_vurdering').innerHTML = vurdering.replace(/\n/g, "<br>");
    document.getElementById('out_txt_vedtak').innerText = vedtak;
    document.getElementById('out_txt_gebyr').innerHTML = gebyrTxt.replace(/\n/g, "<br>");
    document.getElementById('out_txt_klage').innerText = t.klage;
    document.getElementById('out_txt_kopi').innerText = t.kopi;

    const ul = document.getElementById('list_vilkar'); ul.innerHTML = "";
    let noFlyStr = activeNoFlyDates.length > 0 ? activeNoFlyDates.map(d => " - " + d.label).join("\n") : " (Ingen spesielle datoer registrert)";
    t.vilkar.forEach(punkt => {
        let tekst = punkt.replace('{FRA}', m.fra).replace('{TIL}', m.til).replace('{REGELSETT}', regelsettStr).replace('{FORBUDSDAGER}', noFlyStr);
        let li = document.createElement('li'); li.innerText = tekst; li.style.whiteSpace = "pre-line"; ul.appendChild(li);
    });

    const tbody = document.getElementById('tbody_droner'); tbody.innerHTML = "";
    drones.forEach(d => {
        let tr = document.createElement('tr'); tr.innerHTML = `<td>${d.modell}</td><td>${d.vekt} ${d.unit}</td><td>${d.sn}</td>`;
        tbody.appendChild(tr);
    });

    window.print();
}

document.getElementById('reg_spesifikk').addEventListener('change', function() {
    document.getElementById('in_spesifikk_ref').style.display = this.checked ? 'block' : 'none';
});