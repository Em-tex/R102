const teksterData = {
    no: {
        bakgrunn: "Vi viser til søknad om {TYPE} av tillatelse til flyging med drone i EN R102 – {MOTTAKER}, organisasjonsnummer: {ORGNR}, operatørnummer: {OPNR}",
        
        regelverk: "Forskrift av 16. oktober 2007 nr. 1152 om opprettelse av et permanent restriksjonsområde over sentrum av Oslo (EN R102 Oslo).",
        
        vurdering: "Restriksjonsområde EN R102 Oslo er etablert for å redusere risikoen for luftfartshendelser med de potensielle konsekvenser slike kan ha med tanke på sentrale statsfunksjoner, og allmenn sikkerhet.\n\nFlygninger med samfunnsnyttig formål kan innvilges dispensasjon fra flyforbudet på vilkår satt av Luftfartstilsynet. Det er Luftfartstilsynets vurdering at <strong>{FORMAL}</strong> kan defineres som et samfunnsnyttig formål.\n\nLuftfartstilsynet informerer Oslo Politidistrikt ved Fellesoperativ seksjon, plan og beredskap om dispensasjonen til flyging i R102. Luftfartstilsynet gjør oppmerksom på at politiet kan nedlegge flyforbud på kort varsel, og denne dispensasjonen gir ikke unntak fra pålegg om flyforbud fra politiet.",
        
        vedtak: "Med hjemmel i forskrift av 16. oktober 2007 nr. 1152 om opprettelse av et permanent restriksjonsområde over sentrum av Oslo § 3 tredje ledd, dispensasjon fra flyforbudet i restriksjonsområde EN R102 Oslo, innvilges {MOTTAKER} tillatelse til å operere luftfartøy uten fører om bord i tråd med OM med vedlegg, og vilkårene gitt nedenfor.",
        
        gebyr: "Gebyr på kr. {BELOP} faktureres for søknad om {TYPE} av tillatelse til flyging i restriksjonsområde. Jamfør {FORSKRIFT} § 31.\nFaktura vil bli ettersendt.\n\nI forbindelse med fremtidig korrespondanse ber vi om at det benyttes referanse til saksnummer som angitt øverst til høyre på dette dokumentet.",
        
        klage: "Dere kan klage på dette vedtaket til Samferdselsdepartementet. En klage må sendes til Luftfartstilsynet innen 3 uker fra dere mottok vedtaket. Dere kan lese mer om klageadgangen her: https://luftfartstilsynet.no/om-oss/saksbehandling/. Dere kan også ta kontakt med Luftfartstilsynet for å få mer informasjon om klageadgangen.",
        
        kopi: "Fellesoperativ seksjon - Plan og beredskap (oslo.arrangement@politiet.no), Avinor Flysikring AS Supervisor Sektorgruppe Øst (osopsup@avinor.no), Forsvarets Fellestjenester (fft.vs.ops@mil.no), Hans Majestets Kongens Garde (haren.hmkg.ops@mil.no), Departementenes sikkerhets- og serviceorganisasjon (vaktsentralen@dss.dep.no), Nasjonal Sikkerhetsmyndighet (luft@nsm.no), Gebyr (gebyr@caa.no).",
        
        labels: {
            saksbehandler: "Saksbehandler:", tlf: "Telefon direkte:", dato: "Vår dato:", 
            ref: "Vår referanse:", deres_dato: "Deres dato:", fra: "Fra", til: "Til",
            hilsen: "Med vennlig hilsen", avdeling: "ubemannet luftfart", stilling: "flyoperativ inspektør",
            elektronisk: "Dokumentet er elektronisk godkjent og krever ikke signatur",
            dok_tittel: "Dispensasjon",
            tabell: { regelsett: "Regelsett", kontakt: "Kontaktinformasjon", oppdrag: "Oppdragsgiver", art: "Oppdragets art", tid: "Tidsrom", sted: "Operasjonsområde", piloter: "Piloter" },
            header: { bakgrunn: "Bakgrunn", regelverk: "Regelverk", vurdering: "Vurdering", vedtak: "Vedtak", vilkar: "Vilkår", droner: "Droner", info: "Til informasjon", klage: "Klageadgang" }
        },
        vilkar: [
            "Flygning er kun tillatt i tidsrommet {FRA} – {TIL}, unntatt disse dagene da flyging ikke er tillatt:\n{FORBUDSDAGER}",
            "Flyging skal skje i henhold til reglene i {REGELSETT}, jf. forskrift om luftfart med ubemannede luftfartøyer.",
            "Flyging er kun tillatt med dronene det er søkt om å bruke. Disse er spesifisert i listen ovenfor under avsnittet «Bakgrunn».",
            "Flyging i forbudsområder for bruk av luftbårne sensorer krever egen tillatelse fra Nasjonal Sikkerhetsmyndighet (NSM).",
            "Supervisor Norway ACC Oslo skal, før flyging, varsles på epost til osopsup@avinor.no.",
            "Et eventuelt pålegg fra Politiet om å stanse flygning skal etterkommes så snart som operasjonelt mulig.",
            "Flyging innenfor restriksjonsområdet skal begrenses i så stor grad som mulig.",
            "Egnet nødlandingsplass skal til enhver tid være tilgjengelig i tilfelle motorbortfall.",
            "Dette dokumentet skal medbringes under aktuell flygning."
        ]
    },
    en: {
        bakgrunn: "Reference is made to the application for {TYPE} of permission to fly with drones in EN R102 – {MOTTAKER}, trade register No: {ORGNR}, operator number: {OPNR}",
        
        regelverk: "Regulation of October 16, 2007, No. 1152 concerning the establishment of a permanent restricted area over the center of Oslo (EN R102 Oslo).",
        
        vurdering: "The restricted area EN R102 Oslo is established to reduce the risk of aviation incidents and the potential consequences such incidents may have regarding central government functions and general public safety.\n\nFlights with a socially beneficial purpose may be granted an exemption from the flight ban based on conditions set by the Civil Aviation Authority (CAA) of Norway. It is the CAA's assessment that <strong>{FORMAL}</strong> can be defined as a socially beneficial purpose.\n\nThe CAA informs Oslo Police District about the permission to fly in R102. Please be advised that the police may issue flight bans on short notice in R102, and this permission does not grant an exemption from such bans.",
        
        vedtak: "Pursuant to the regulation of October 16, 2007, No. 1152 establishing a permanent restricted area over the center of Oslo § 3 third paragraph, exemption from the flight ban in the restricted area EN R102 Oslo, {MOTTAKER} is hereby granted permission to operate unmanned aircraft in accordance with OM including attachments, and the conditions given below.",
        
        gebyr: "A fee of NOK {BELOP} is invoiced for applications for {TYPE} of permission to fly in a restricted area. Reference is made to {FORSKRIFT} § 31.\nThe invoice will be sent separately.\n\nFor future correspondence, please reference the case number found at the top right of this document.",
        
        klage: "This decision may be appealed to the Ministry of Transport. In such case, an appeal must be sent to the Civil Aviation Authority within 3 weeks from receipt of the decision. More information on your right to appeal is provided here: https://www.luftfartstilsynet.no/en/about-us/case-processing/. You may also contact the Civil Aviation Authority for further information.",
        
        kopi: "Oslo Police District, Avinor, Norwegian Armed Forces, NSM, CAA Fees.",
        
        labels: {
            saksbehandler: "Case Officer:", tlf: "Direct line:", dato: "Our Date:", 
            ref: "Our ref:", deres_dato: "Your date:", fra: "From", til: "To",
            hilsen: "Yours sincerely", avdeling: "Unmanned Aviation", stilling: "Flight Operations Inspector",
            elektronisk: "This document has been electronically approved and does not require a signature",
            dok_tittel: "Dispensation",
            tabell: { regelsett: "Regulations", kontakt: "Contact information", oppdrag: "Client", art: "Operation type", tid: "Timeframe", sted: "Area of operation", piloter: "Pilots" },
            header: { bakgrunn: "Background", regelverk: "Regulations", vurdering: "Assessment", vedtak: "Decision", vilkar: "Conditions", droner: "Drones", info: "Information", klage: "Right of Appeal" }
        },
        vilkar: [
            "Flight may only be carried out between {FRA} and {TIL}, except these dates when flying is prohibited:\n{FORBUDSDAGER}",
            "Flights must be carried out according to {REGELSETT}.",
            "Operations are only permitted using the drones specified in the application. These are listed in the above table, under \"Background\".",
            "Flights within areas where the use of airborne sensors is prohibited require a separate permission from the Norwegian National Security Authority (NSM).",
            "Supervisor Norway ACC, Oslo, must be notified via email to osopsup@avinor.no prior to flight.",
            "Any order from the Police to cease flight operations shall be complied with as soon as operationally possible.",
            "Flights within the restricted area should be limited as much as possible.",
            "A suitable emergency landing site must always be available at all times in the event of engine failure.",
            "This document must be carried during the flight operation."
        ]
    }
};