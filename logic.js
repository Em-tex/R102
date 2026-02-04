// --- KONFIGURASJON & DATA ---
const STORAGE_KEY = 'r102_autosave_v2';
const GEBYR_FORSKRIFT = "Forskrift av 28. januar 2026 nr. 125 om gebyr til Luftfartstilsynet mv.";
const GEBYR_SATS_NY = "3180";
const GEBYR_SATS_FORLENGELSE = "1610";

// Standardtekster (Norsk og Engelsk)
const texts = {
    no: {
        bakgrunn: "Vi viser til søknad om {TYPE} av tillatelse til flyging med drone i EN R102 – {MOTTAKER}, operatørnummer: {OPNR}",
        regelverk: "Forskrift av 16. oktober 2007 nr. 1152 om opprettelse av et permanent restriksjonsområde over sentrum av Oslo (EN R102 Oslo).",
        vurdering: "Restriksjonsområde EN R102 Oslo er etablert for å redusere risikoen for luftfartshendelser med de potensielle konsekvenser slike kan ha med tanke på sentrale statsfunksjoner, og allmenn sikkerhet.\n\nFlygninger med samfunnsnyttig formål kan innvilges dispensasjon fra flyforbudet på vilkår satt av Luftfartstilsynet. Det er Luftfartstilsynets vurdering at <strong>{FORMAL}</strong> kan defineres som et samfunnsnyttig formål.\n\nLuftfartstilsynet informerer Oslo Politidistrikt ved Fellesoperativ seksjon, plan og beredskap om dispensasjonen til flyging i R102. Luftfartstilsynet gjør oppmerksom på at politiet kan nedlegge flyforbud på kort varsel, og denne dispensasjonen gir ikke unntak fra pålegg om flyforbud fra politiet.",
        vedtak: "Med hjemmel i forskrift av 16. oktober 2007 nr. 1152 om opprettelse av et permanent restriksjonsområde over sentrum av Oslo § 3 tredje ledd, dispensasjon fra flyforbudet i restriksjonsområde EN R102 Oslo, innvilges {MOTTAKER} tillatelse til å operere luftfartøy uten fører om bord i tråd med OM med vedlegg, og vilkårene gitt nedenfor.",
        gebyr: "For behandling av søknad om dispensasjon for flyging i restriksjonsområde faktureres gebyr på kr. {BELOP}, jf. {FORSKRIFT} § 31. Faktura vil bli ettersendt.\n\nI forbindelse med fremtidig korrespondanse ber vi om at det benyttes referanse til saksnummer som angitt øverst til høyre på dette dokumentet.",
        klage: "Dere kan klage på dette vedtaket til Samferdselsdepartementet. En klage må sendes til Luftfartstilsynet innen 3 uker fra dere mottok vedtaket.",
        kopi: "Oslo Politidistrikt (oslo.arrangement@politiet.no), Avinor (osopsup@avinor.no), Forsvaret (fft.vs.ops@mil.no), NSM (luft@nsm.no), Gebyr (gebyr@caa.no).",
        labels: {
            saksbehandler: "Saksbehandler:", tlf: "Telefon direkte:", dato: "Vår dato:", 
            ref: "Vår referanse:", deres_dato: "Deres dato:", fra: "Fra", til: "Til",
            hilsen: "Med vennlig hilsen", avdeling: "ubemannet luftfart", stilling: "flyoperativ inspektør",
            elektronisk: "Dokumentet er elektronisk godkjent og krever ikke signatur",
            dok_tittel: "Dispensasjon",
            tabell: { regelsett: "Regelsett", kontakt: "Kontaktinfo", oppdrag: "Oppdragsgiver", art: "Oppdragets art", tid: "Tidsrom", sted: "Område", piloter: "Piloter" },
            header: { bakgrunn: "Bakgrunn", regelverk: "Regelverk", vurdering: "Vurdering", vedtak: "Vedtak", vilkar: "Vilkår", droner: "Droner", info: "Til informasjon", klage: "Klageadgang" }
        },
        vilkar: [
            "Flygning er kun tillatt i tidsrommet {FRA} – {TIL}, unntatt 17. mai og 31.12 - 01.01.",
            "Flyging skal skje i henhold til reglene i {REGELSETT}, jf. forskrift om luftfart med ubemannede luftfartøyer.",
            "Flyging er kun tillatt med dronene det er søkt om å bruke (se tabell).",
            "Flyging i forbudsområder for bruk av luftbårne sensorer krever egen tillatelse fra Nasjonal Sikkerhetsmyndighet (NSM).",
            "Supervisor Norway ACC Oslo skal, før flyging, varsles på epost til osopsup@avinor.no.",
            "Et eventuelt pålegg fra Politiet om å stanse flygning skal etterkommes så snart som operasjonelt mulig.",
            "Flyging innenfor restriksjonsområdet skal begrenses i så stor grad som mulig.",
            "Egnet nødlandingsplass skal til enhver tid være tilgjengelig i tilfelle motorbortfall.",
            "Dette dokumentet skal medbringes under aktuell flygning."
        ]
    },
    en: {
        bakgrunn: "Reference is made to the application for {TYPE} of permission to fly with drones in EN R102 – {MOTTAKER}, operator number: {OPNR}",
        regelverk: "Regulation of October 16, 2007, No. 1152 concerning the establishment of a permanent restricted area over the center of Oslo (EN R102 Oslo).",
        vurdering: "The restricted area EN R102 Oslo is established to reduce the risk of aviation incidents and the potential consequences such incidents may have regarding central government functions and general public safety.\n\nFlights with a socially beneficial purpose may be granted an exemption from the flight ban based on conditions set by the Civil Aviation Authority (CAA) of Norway. It is the CAA's assessment that <strong>{FORMAL}</strong> can be defined as a socially beneficial purpose.\n\nThe CAA informs Oslo Police District about the permission to fly in R102. Please be advised that the police may issue flight bans on short notice in R102, and this permission does not grant an exemption from such bans.",
        vedtak: "Pursuant to the regulation of October 16, 2007, No. 1152 establishing a permanent restricted area over the center of Oslo § 3 third paragraph, exemption from the flight ban in the restricted area EN R102 Oslo, {MOTTAKER} is hereby granted permission to operate unmanned aircraft in accordance with OM including attachments, and the conditions given below.",
        gebyr: "A fee of NOK {BELOP} is invoiced for applications for permission to fly in a restricted area, cf. {FORSKRIFT} § 31. The invoice will be sent separately.\n\nFor future correspondence, please reference the case number found at the top right of this document.",
        klage: "This decision may be appealed to the Ministry of Transport. In such case, an appeal must be sent to the Civil Aviation Authority within 3 weeks from receipt of the decision.",
        kopi: "Oslo Police District, Avinor, Norwegian Armed Forces, NSM, CAA Fees.",
        labels: {
            saksbehandler: "Executive Officer:", tlf: "Direct line:", dato: "Date:", 
            ref: "Our ref:", deres_dato: "Your date:", fra: "From", til: "To",
            hilsen: "Yours sincerely", avdeling: "Unmanned Aviation", stilling: "Flight Operations Inspector",
            elektronisk: "This document has been electronically approved",
            dok_tittel: "Dispensation",
            tabell: { regelsett: "Regulations", kontakt: "Contact info", oppdrag: "Client", art: "Operation type", tid: "Timeframe", sted: "Area", piloter: "Pilots" },
            header: { bakgrunn: "Background", regelverk: "Regulations", vurdering: "Assessment", vedtak: "Decision", vilkar: "Conditions", droner: "Drones", info: "Information", klage: "Right of Appeal" }
        },
        vilkar: [
            "Flight may only be carried out between {FRA} and {TIL}, except May 17th and Dec 31st - Jan 1st.",
            "Flights must be carried out according to {REGELSETT}.",
            "Operations are only permitted using the drones specified in the table below.",
            "Flights within areas where the use of airborne sensors is prohibited require a separate permission from the NSM.",
            "Supervisor Norway ACC, Oslo, must be notified via email to osopsup@avinor.no prior to flight.",
            "Any order from the Police to cease flight operations shall be complied with as soon as operationally possible.",
            "Flights within the restricted area should be limited as much as possible.",
            "A suitable emergency landing site must always be available at all times in the event of engine failure.",
            "This document must be carried during the flight operation."
        ]
    }
};

// Global state for lister
let drones = [];
let pilots = [];

document.addEventListener('DOMContentLoaded', () => {
    setStandardDates();
    loadState(); // Laster lagret data
    
    // Hvis ingen piloter/droner lastet, legg til en tom rad
    if (pilots.length === 0) addPilot();
    if (drones.length === 0) addDrone();

    oppdaterGebyr(); // Sett riktig startgebyr
    attachAutosave();
});

// --- LISTE-LOGIKK ---

function addPilot(navn = '', tlf = '', epost = '') {
    const id = Date.now(); // Unik ID
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


// --- GEBYR & SPRÅK LOGIKK ---

function oppdaterGebyr() {
    const isExtension = document.getElementById('type_forlengelse').checked;
    const gebyrInput = document.getElementById('in_gebyr_sats');
    
    // Oppdater kun hvis brukeren ikke har skrevet noe manuelt custom (valgfritt, her overskriver vi for sikkerhets skyld ved bytte)
    if (isExtension) {
        gebyrInput.value = GEBYR_SATS_FORLENGELSE;
    } else {
        gebyrInput.value = GEBYR_SATS_NY;
    }
    
    byttSpraak(false); // Oppdater tekster uten å reset
    saveState();
}

function byttSpraak(resetTexts = true) {
    const lang = document.getElementById('in_spraak').value;
    const t = texts[lang];
    const isExtension = document.getElementById('type_forlengelse').checked;
    const typeTxt = lang === 'no' ? (isExtension ? "forlengelse" : "dispensasjon") : (isExtension ? "extension" : "dispensation");
    const gebyrSats = document.getElementById('in_gebyr_sats').value;

    // Fyll inn redigerbare felt med standardtekst
    if (resetTexts) {
        document.getElementById('txt_edit_bakgrunn').value = t.bakgrunn.replace('{TYPE}', typeTxt);
        document.getElementById('txt_edit_vurdering').value = t.vurdering;
        document.getElementById('txt_edit_vedtak').value = t.vedtak;
        document.getElementById('txt_edit_gebyr').value = t.gebyr.replace('{BELOP}', gebyrSats).replace('{FORSKRIFT}', GEBYR_FORSKRIFT);
    } else {
        // Hvis vi bare bytter type (ny/forlengelse), oppdater kun gebyr og bakgrunn dynamisk hvis de ikke er endret? 
        // For enkelhets skyld resetter vi tekstene i editoren når man bytter språk/type for å sikre at variablene er med.
        document.getElementById('txt_edit_bakgrunn').value = t.bakgrunn.replace('{TYPE}', typeTxt);
        document.getElementById('txt_edit_gebyr').value = t.gebyr.replace('{BELOP}', gebyrSats).replace('{FORSKRIFT}', GEBYR_FORSKRIFT);
    }

    saveState();
}


// --- LAGRING OG HJELPEFUNKSJONER ---

function setStandardDates() {
    const today = new Date();
    const dEl = document.getElementById('in_dato');
    const fEl = document.getElementById('in_fra');
    if (dEl && !dEl.value) dEl.valueAsDate = today;
    if (fEl && !fEl.value) fEl.valueAsDate = today;
}

function saveState() {
    const inputs = document.querySelectorAll('input, select, textarea');
    const data = {
        fields: {},
        drones: drones,
        pilots: pilots
    };

    inputs.forEach(el => {
        if (el.id && !el.id.startsWith('search')) { // Ignorer dynamiske felt inni listene
            if (el.type === 'checkbox' || el.type === 'radio') {
                if (el.checked) data.fields[el.id] = el.value; // For radio, lagre kun den valgte
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
    
    // Gjenopprett felt
    if (data.fields) {
        for (const [id, value] of Object.entries(data.fields)) {
            const el = document.getElementById(id);
            if (el) {
                if (el.type === 'checkbox') el.checked = true;
                else if (el.type === 'radio') {
                    if (el.value === value) el.checked = true;
                } else el.value = value;
            }
        }
    }

    // Gjenopprett lister
    if (data.drones) {
        drones = data.drones;
        renderDrones();
    }
    if (data.pilots) {
        pilots = data.pilots;
        renderPilots();
    }
}

function resetForm() {
    if (confirm("Er du sikker på at du vil tømme hele skjemaet?")) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload(); 
    }
}

// --- UTSKRIFTSGENERERING ---

function formatDate(dateStr) {
    if (!dateStr) return "DD.MM.YYYY";
    const d = new Date(dateStr);
    return d.toLocaleDateString('no-NO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function printDoc() {
    saveState(); // Lagre før print

    const lang = document.getElementById('in_spraak').value;
    const t = texts[lang];
    
    // 1. Hent data
    const m = {
        mottaker: document.getElementById('in_mottaker').value || "[MOTTAKER]",
        adresse: document.getElementById('in_adresse').value,
        poststed: document.getElementById('in_poststed').value,
        saksbehandler: document.getElementById('in_saksbehandler').value,
        ref: document.getElementById('in_ref').value,
        opNr: document.getElementById('in_opNr').value || "[OPNR]",
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

    // 2. Regelsett (samle checkboxer)
    let regelsettArr = [];
    if (document.getElementById('reg_a1').checked) regelsettArr.push(document.getElementById('reg_a1').value);
    if (document.getElementById('reg_a2').checked) regelsettArr.push(document.getElementById('reg_a2').value);
    if (document.getElementById('reg_spesifikk').checked) {
        let ref = document.getElementById('in_spesifikk_ref').value;
        regelsettArr.push(`Spesifikk kategori (${ref})`);
    }
    const regelsettStr = regelsettArr.join(", ");

    // 3. Fyll ut faste labels fra språkfil
    for (const [key, label] of Object.entries(t.labels)) {
        if (typeof label === 'string') {
            const el = document.getElementById('lbl_' + key); // Eks: lbl_saksbehandler
            if (el) el.innerText = label;
            
            // For output fields som saksbehandler signatur tittel
            if (key === 'stilling') { document.getElementById('lbl_stilling').innerText = label; }
        } else if (typeof label === 'object') {
            // Tabell headers
            if (key === 'tabell') {
                for (const [k, v] of Object.entries(label)) {
                    const th = document.getElementById('th_' + k);
                    if (th) th.innerText = v;
                }
            }
            // Seksjon headers
            if (key === 'header') {
                for (const [k, v] of Object.entries(label)) {
                    const h = document.getElementById('h_' + k);
                    if (h) h.innerText = v;
                }
            }
        }
    }

    // 4. Fyll ut output felter
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

    // 5. Piloter liste til tekst
    let pilotText = pilots.map(p => `${p.navn} (tlf: ${p.tlf})`).join("\n");
    document.getElementById('out_kontakt').innerText = pilotText; // Vises i tabelltoppen
    document.getElementById('out_piloter_liste').innerText = "Se kontaktinformasjon"; 

    // 6. Tekster fra tekstfeltene (som kan være redigert)
    // Erstatt plassholdere i de redigerte tekstene
    let bakgrunn = document.getElementById('txt_edit_bakgrunn').value
        .replace('{MOTTAKER}', m.mottaker).replace('{OPNR}', m.opNr);
    
    let vurdering = document.getElementById('txt_edit_vurdering').value
        .replace('{FORMAL}', m.art);

    let vedtak = document.getElementById('txt_edit_vedtak').value
        .replace('{MOTTAKER}', m.mottaker);

    let gebyrTxt = document.getElementById('txt_edit_gebyr').value; // Allerede ferdig formatert i byttSpraak

    document.getElementById('out_txt_bakgrunn').innerHTML = bakgrunn;
    document.getElementById('out_txt_regelverk').innerText = t.regelverk; // Denne endres sjelden, hentes fra const
    document.getElementById('out_txt_vurdering').innerHTML = vurdering.replace(/\n/g, "<br>");
    document.getElementById('out_txt_vedtak').innerText = vedtak;
    document.getElementById('out_txt_gebyr').innerHTML = gebyrTxt.replace(/\n/g, "<br>");
    document.getElementById('out_txt_klage').innerText = t.klage;
    document.getElementById('out_txt_kopi').innerText = t.kopi;

    // 7. Bygg vilkårsliste
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

    // 8. Bygg dronetabell
    const tbody = document.getElementById('tbody_droner');
    tbody.innerHTML = "";
    drones.forEach(d => {
        let tr = document.createElement('tr');
        tr.innerHTML = `<td>${d.modell}</td><td>${d.vekt}</td><td>${d.sn}</td>`;
        tbody.appendChild(tr);
    });

    // 9. Print
    window.print();
}

// Lytt til endring på spesifikk kategori for å vise input felt
document.getElementById('reg_spesifikk').addEventListener('change', function() {
    document.getElementById('in_spesifikk_ref').style.display = this.checked ? 'block' : 'none';
});