# 20260223-vurderapage-dummyexam

Git repo: https://github.com/danibir/20260223-vurderapage-dummyexam#

Siden skal registrere wcag vurderinger (forms) om nettsider fra brukere som inneholder op(skaper), tittel, tekst, url, og bilde(r?). Andre bruker kan vurdere vurderingen, en til form med op, og votevalue (enten positive eller negative vurdering). Siden skal arrangsjere nettsider basert på vurderinger


Driftplan

Name		Ip-Address	Rolle
---		---		---
vurder-dev	10.12.15.21	Development server
vurder-mongo	10.12.15.22	Database server
vurder-nginx	10.12.15.23	Image server
vurder-pub	10.12.15.24	Production server



Iteration 1: (x)

Database serveren står stabilt
Bruker kan registrere, logge in eller ut, og slette brukeren sin

Iteration 2: (x)

Brukere kan legge til vurderinger med op, tittel, text, url, som er synlig til brukere. Url skal sende brukere til siden urlen er fra. Brukere skal kunne slette vurderingen

Iteration 3: (x)

Vurderingsformen skal lagre bilder fra brukere
Vurderinger kan bli stemt på

Iteration 4: (x)

God css på siden
Dynamiske flashmessages for errors, info, annet diverse

Iteration 5: (x)

Brukere kan være admin og admins kan slette vurderinger
Brukere kan rapportere vurderinger for uautentistet, varsler admins

Iteration 6: (x)

Implimentert brannmur som beskytter maskiner

Iteration 7: (x)

Legge til faq for brukere
Readme skal ha dokumentert diverse detaljer om prosjektet



Funskjonliste

1. Bruker Funksjoner

Register ny brukere
Logg inn og "authenticate" brukere
Logg ut av sessions
Se bruker profil
Slett bruker profil

2. WCAG Vurdering Funsjoner

Publiser wcag vurdering med bilde og url
Se vurderinger
Slett egene vurderinger
Lik eller mislik vurderinger
Raporter upassende vurderinger

3. Admin Funsjoner

See alle raportet vurderinger
Avvis raporter
Slett vurderinger


4. System og Middleware Funksjoner

Authenticate session
Authenticate brukere
Authorize admin tilgang
Last ned fil fra bruker
Last opp fil til nginx server
Håntering av flash meldinger
Kobling til database