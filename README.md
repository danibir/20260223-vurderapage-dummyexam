## Om systemet 

Dette er en norsk webapplikasjon hvor brukere kan vurdere WCAG‑tilgjengeligheten til ulike nettsider. Løsningen lagrer vurderinger permanent, viser eksempelbilder, og lar brukere besøke nettstedene direkte. Administratorer kan moderere vurderinger innenfor webapplikasjonen.

---

## Funksjonelle krav

- Brukere kan registrere, logge inn og administrere konto.
- Brukere kan publisere WCAG-vurderinger med tekst URL og bilde.
- Brukere kan se nettsidevurderinger om WCAG og besøke nettstedene.
- Brukere kan gi positiv/negativ tilbakemelding på vurderinger.
- Vurderinger sorteres basert på tilbakemeldinger.
- Brukere kan rapportere upassende vurderinger.
- Administratorer kan se rapporter og slette eller godkjenn vurderinger.

---

## Driftplan

| Name         | IP Address   | Rolle               |
|--------------|--------------|---------------------|
| vurder-dev   | 10.12.15.21  | Development server  |
| vurder-mongo | 10.12.15.22  | Database server     |
| vurder-nginx | 10.12.15.23  | Image server        |
| vurder-pub   | 10.12.15.24  | Production server   |

Løsningen består av fire maskiner. Det var planlagt at de skulle ligge i et segmentert nettverk, men pga tekniske problemer har det ikke endt opp som en sterk prioritet til å fikse. Det er UFW på alle serverene, og nginxserveren har en spesiell STFP-bruker som er chroot jailed til å bare ha tilgang til bildemappen og trenger ssh key til å gi tilgang. 

---

## Risikoanalyse

Mulige trusler:
- Uautorisert tilgang til database
- Skadelige filer lastet opp av brukere
- DDoS mot produksjonsserver
- Feilkonfigurerte brannmurregler
- Tap av data uten backup

Tiltak:
- Segmentert nettverk
- Brannmur mellom alle maskiner
- Filvalidering og begrensede filtyper
- Tilgangskontroll og admin‑autorisering
- Regelmessige sikkerhetskopier

---


## Tidsestimat

Total utviklingstid: ca. 22-26 timer  
- Behovsanalyse og planlegging: 2–3 timer  
- Backend‑utvikling: 10-11 timer  
- Frontend‑utvikling: 3–4 timer  
- Admin‑system og rapportering: 3 timer  
- Testing, drift og dokumentasjon: 4–5 timer  

---

## Kommunikasjonsplan

- Kunden får ukentlige statusoppdateringer.  
- Endringer avtales skriftlig før implementasjon.  
- Feil og support håndteres innenfor avtalte tidsvinduer.  
- All kommunikasjon skjer via e‑post eller avtalt kanal.

---

## FAQ

**Hvordan publiserer jeg en vurdering?**  
Gå til “Ny vurdering”, fyll inn skjemaet og last opp et bilde.

**Hvordan fungerer stemmesystemet?**  
Du kan gi positiv eller negativ tilbakemelding. Rangering baseres på positiv - negativ * 0.3.

**Hvordan rapporterer jeg en vurdering?** 
Trykk “Rapporter” på bunnen av en vurderingsside. Administrator vil gjennomgå vurderingen og enten autentisere eller slette vurderingen.

**Hvordan blir jeg administrator?**  
Administratorroller settes manuelt av systemeier.

---

## Installasjon

```bash
git clone https://github.com/danibir/20260223-vurderapage-dummyexam
cd 20260223-vurderapage-dummyexam
npm i

#For å starte programmet
nodemon app.js