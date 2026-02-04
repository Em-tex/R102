const teksterData = {
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