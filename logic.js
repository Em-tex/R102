// Navnet på lagringsnøkkelen i nettleseren
const STORAGE_KEY = 'r102_autosave_v1';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sett standard datoer først (i tilfelle det er første gang)
    setStandardDates();

    // 2. Prøv å laste lagret data (overskriver standard hvis funnet)
    loadState();

    // 3. Start overvåking av alle felt for autolagring
    attachAutosave();
});

function setStandardDates() {
    const today = new Date();
    // Vår dato = i dag
    const datoEl = document.getElementById('in_dato');
    if (datoEl && !datoEl.value) datoEl.valueAsDate = today;
    
    // Fra dato = i dag (som utgangspunkt)
    const fraEl = document.getElementById('in_fra');
    if (fraEl && !fraEl.value) fraEl.valueAsDate = today;
}

// Funksjon som lagrer ALT i skjemaet
function saveState() {
    const inputs = document.querySelectorAll('input, select, textarea');
    const data = {};

    inputs.forEach(el => {
        if (el.id) { // Lagrer kun elementer som har en ID
            if (el.type === 'checkbox') {
                data[el.id] = el.checked;
            } else {
                data[el.id] = el.value;
            }
        }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Funksjon som henter data tilbake
function loadState() {
    const savedJson = localStorage.getItem(STORAGE_KEY);
    if (!savedJson) return; // Ingen data lagret

    const data = JSON.parse(savedJson);

    for (const [id, value] of Object.entries(data)) {
        const el = document.getElementById(id);
        if (el) {
            if (el.type === 'checkbox') {
                el.checked = value;
            } else {
                el.value = value;
            }
        }
    }
}

// Kobler lagringsfunksjonen til alle felt
function attachAutosave() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(el => {
        el.addEventListener('input', saveState);
        el.addEventListener('change', saveState);
    });
}

// Funksjon for TØM SKJEMA-knappen
function resetForm() {
    if (confirm("Er du sikker på at du vil tømme hele skjemaet? Dette kan ikke angres.")) {
        // 1. Slett fra minnet
        localStorage.removeItem(STORAGE_KEY);
        
        // 2. Nullstill alle felt visuelt
        document.querySelectorAll('input, select, textarea').forEach(el => {
            if (el.type === 'checkbox') el.checked = false;
            else el.value = '';
        });

        // 3. Sett inn dagens dato igjen
        setStandardDates();
        
        // 4. Scroll til toppen
        window.scrollTo(0, 0);
    }
}

// --- GENERERINGS-FUNKSJONER (Samme som før) ---

function formatDate(dateStr) {
    if (!dateStr) return "DD.MM.YYYY";
    const d = new Date(dateStr);
    return d.toLocaleDateString('no-NO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function printDoc() {
    // Sikre at siste endring er lagret før print
    saveState(); 

    // 1. Hent verdier fra input
    const data = {
        mottaker: document.getElementById('in_mottaker').value || "[MOTTAKER]",
        adresse: document.getElementById('in_adresse').value,
        poststed: document.getElementById('in_poststed').value,
        saksbehandler: document.getElementById('in_saksbehandler').value,
        ref: document.getElementById('in_ref').value,
        opNr: document.getElementById('in_opNr').value,
        regelsett: document.getElementById('in_regelsett').value,
        oppdrag: document.getElementById('in_oppdrag').value,
        art: document.getElementById('in_art').value || "[FORMÅL]",
        omrade: document.getElementById('in_omrade').value,
        kontakt: document.getElementById('in_kontakt').value,
        modell: document.getElementById('in_modell').value,
        vekt: document.getElementById('in_vekt').value,
        sn: document.getElementById('in_sn').value,
        dato: formatDate(document.getElementById('in_dato').value),
        deresDato: formatDate(document.getElementById('in_deresDato').value),
        fra: formatDate(document.getElementById('in_fra').value),
        til: formatDate(document.getElementById('in_til').value)
    };

    // 2. Fyll ut enkle felt direkte
    const textFields = [
        ['out_mottaker', data.mottaker],
        ['out_tittelMottaker', data.mottaker],
        ['out_adresse', data.adresse],
        ['out_poststed', data.poststed],
        ['out_saksbehandler', data.saksbehandler],
        ['out_saksbehandler_sign', data.saksbehandler],
        ['out_dato', data.dato],
        ['out_ref', data.ref],
        ['out_deresDato', data.deresDato],
        ['out_regelsett', data.regelsett],
        ['out_oppdrag', data.oppdrag],
        ['out_art', data.art],
        ['out_omrade', data.omrade],
        ['out_kontakt', data.kontakt],
        ['out_fra', data.fra],
        ['out_til', data.til],
        ['out_modell', data.modell],
        ['out_vekt', data.vekt],
        ['out_sn', data.sn]
    ];

    textFields.forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    });

    // 3. Fyll ut tekster fra tekster.js
    if (typeof tekster !== 'undefined') {
        document.getElementById('txt_bakgrunn').innerHTML = tekster.bakgrunn
            .replace('{MOTTAKER}', data.mottaker)
            .replace('{OPNR}', data.opNr);
        
        document.getElementById('txt_regelverk').innerHTML = tekster.regelverk;
        document.getElementById('txt_vurdering_part1').innerHTML = tekster.vurdering1;
        
        document.getElementById('txt_vurdering_part2').innerHTML = tekster.vurdering2
            .replace('{FORMAL}', data.art);
            
        document.getElementById('txt_vurdering_part3').innerHTML = tekster.vurdering3;
        
        document.getElementById('txt_vedtak').innerHTML = tekster.vedtak
            .replace('{MOTTAKER}', data.mottaker);

        document.getElementById('txt_gebyr').innerHTML = tekster.gebyr;
        document.getElementById('txt_klage').innerHTML = tekster.klage;
        document.getElementById('txt_kopi').innerText = tekster.kopiMottakere;

        // 4. Bygg vilkårslisten
        const ul = document.getElementById('list_vilkar');
        if (ul && typeof vilkarListe !== 'undefined') {
            ul.innerHTML = ""; 
            vilkarListe.forEach(punkt => {
                let tekst = punkt
                    .replace('{FRA}', data.fra)
                    .replace('{TIL}', data.til)
                    .replace('{REGELSETT}', data.regelsett);
                
                let li = document.createElement('li');
                li.innerText = tekst;
                ul.appendChild(li);
            });
        }
    }

    // 5. Kjør print
    window.print();
}