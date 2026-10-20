# Comp AI: onboarding web designera

*Stan na 13.10.2026, przygotowane dla Michała Paca (web design). Dokument żywy, uzupełniany na bieżąco.*

---

## TL;DR, czyli 10 rzeczy, które trzeba wiedzieć

1. **Klient:** Comp AI to AI-native platforma do compliance i security (SOC 2, ISO 27001, HIPAA, GDPR i inne). We wrześniu 2026 zamknęli Series A na $34M. Mają ok. 1000 klientów i 80% ruchu organicznego. Firma ma nieco ponad rok.
2. **Mój scope:** 80h na responsywne layouty hi-fi dla **Homepage + Pricing + Customers (/case-studies) + Book a Demo (/demo)** razem z copy guidance. Termin: **web design 15.10–2.11**, a **HP ma być live 13.11**.
3. **Kierunek wizualny:** wybrany moodboard **C.2 „Evolution / Built to improve”**. Zieleń zostaje jako kolor bazowy. Dochodzi ciepły red-orange/coral, kierunkowe gradienty, wymiarowe formy i **system symboli**. Klient chce do tego dołożyć wyrafinowanie i ciemne realizacje z C.1.
4. **Light vs dark:** to „dwa głosy jednej marki”. Light jest human-facing (ciepło, support), dark jest AI/agent/developer-facing (techniczny, ostrzejszy). To **idea, nie twarda reguła**.
5. **Twarde „nie”:** zielony tekst na zielonym tle, słaba czytelność na gradientach, generyczna estetyka GRC/cyber (tarcze, kłódki, checkmarki, neonowe gradienty, świecące siatki) i kolejna „czarna AI-strona”.
6. **Wdrożenie:** Next.js + Tailwind + **Sanity jako page builder**. Strona budowana z **sekcji wielokrotnego użytku**, więc projektuję system sekcji, nie pojedyncze makiety. Implementuje **Arek**. Designer robi review PR-ów, możliwy jest też „first pass w kodzie” (Devlooper).
7. **Nowa nawigacja i stopka trafią też na stare podstrony.** Muszą działać w kontekście całej obecnej strony, a to ok. 100 stron poza /hub.
8. **Decyzje po stronie klienta:** feedback konsoliduje i zatwierdza **Teresa Hill**. Founderzy (rodzina Fuentes + Lewis) mają czasem sprzeczne gusta.
9. **Upsell w toku:** Product Overview, podstrony produktowe i About Us. Wiktor czeka na wycenę web designu (Emil). Dev wstępnie: ok. 8h na stronę, do 16h przy pierwszych sekcjach.
10. **Branding nie jest jeszcze domknięty** (cel: 16.10). Logo, typografia i paleta są w toku, więc web design startuje równolegle z finalizacją brandu.

---

## 1. Kim jest klient

- **Comp AI** (prawnie Bubba AI, Inc. d/b/a Comp AI). Biura w Miami (Aventura) i Nowym Jorku, zespół operuje w strefie ET. Ok. 25–30 pracowników.
- **Produkt:** AI pisze polityki na podstawie kwestionariusza onboardingowego, agenci zbierają dowody z ponad 580 integracji. Do tego vendor/risk monitoring, open-source device agent, pentesty, live **Trust Center**, a audyt jest wliczony. Mocny wyróżnik to **support 1:1 na Slacku** prowadzony przez ekspertów in-house (odpowiedź poniżej 3 min). Część kodu jest open source na GitHubie.
- **Teza strategiczna:** przejście od „compliance made easy” do „**software, które robi pracę za ciebie**”. Ambicja na dalszą metę: *continuous security & trust infrastructure*, bo zaufanie nie powinno być okresowym ćwiczeniem. Trzeba wyraźnie rozdzielać, **co działa dziś, co jest budowane, a co jest wizją**.
- **Metryki z kick-offu (Katya ma dosłać pełne dane):** ok. 40% close rate po demo, ok. 1000 klientów, 80% ruchu organicznego (20% Google Ads), około 1000 kanałów Slack z klientami, rating 4.9/5. Hasło „10x less work than Vanta”.
- **Konkurencja:**
  - Legacy / „gen 2”: **Vanta** (fiolet, korporacyjna, najmocniejsza marka incumbentów), **Drata** („nudna”), **Secureframe** (niezróżnicowana).
  - Ankle biters: **Delve** (mocna marka) i **Oneleet** (messaging rezonuje, ale „za edgy”; mocno gra „Cut the theater”).
  - Uwaga na kolory: Delve, Oneleet, Drata i Anthropic są w spektrum orange/coral/red, a Vanta i Secureframe mają elementy zieleni.

## 2. Ludzie

**Comp AI**

| Osoba | Rola | Co warto wiedzieć |
|---|---|---|
| **Teresa Hill** | Fractional marketing / GTM lead (Anchor GTM), osoba, która przyprowadziła klienta | Konsoliduje feedback i ma ostatnie słowo. Bardzo dobrze przygotowana, pisze długie, strukturalne feedbacki (canvasy). Zna tonik z projektu Boundless. |
| **Katya Fuentes** | Head of Growth | Demand gen. **Od połowy listopada idzie na urlop macierzyński**, czyli dokładnie w czasie launchu. |
| **Claudio Fuentes** | Co-founder, COO, a w praktyce też front-end dev | **DRI od review i merge PR-ów.** Nie lubi płaskiej zieleni („usypia”), serifa (kojarzy mu z legacy) ani nadmiernej playfulness. |
| **Mariano Fuentes** | Co-founder, CTO | Lubi prostotę, „pick a theme and go hard”, duże gradienty, Stripe. Wdroży brand w produkcie (osobny scope). |
| **Lewis Carhart** | Co-founder, CEO | „I suck with brand and design stuff.” Za serifem i mass appeal. Chce, żeby marka była „chronically online” (wzór: Corgi, Vercel). |
| **Dan Dizon** | Ops / kalendarze | Umawia spotkania z founderami. |

Lewis i Mariano nie są na kanale klienckim. Ich feedback przechodzi przez wewnętrzny kanał klienta i Teresę.

**tonik**

- Wiktor: PM
- Jacek: senior brand designer, prowadził warsztat
- Olga: brand design, moodboardy, logo
- Mimi: brand communication
- Nervy: ilustracje / 3D (30h, 15–26.10)
- Anton (antonik): motion (70h, 22.10–19.11)
- Arek: dev / implementacja
- Artur: Devlooper
- Goszczu: Head of Engineering
- skubi: Head of No-Code
- Emil: Head of Web Design
- Janek: sprzedaż
- **szyna (Szymon): mój design buddy.** Pytania warto puszczać do niego *zanim* coś trafi na kanał kliencki.

## 3. Oś czasu: kluczowe momenty

| Data | Co się wydarzyło / ma się wydarzyć |
|---|---|
| 08.09 | Handoff projektu. Umowa podpisana. Scope 440h. |
| 17.09 | Comp ogłasza Series A ($34M, TechCrunch). |
| 28.09 | Internal kick-off tonik. |
| 29.09 | Kick-off + 2,5h warsztat brandingowy (FigJam). Przesunięty z 24.09. |
| 30.09 | Klient przysyła referencje werbalne i wizualne. Lewis i Mariano przeniesieni na wewnętrzny kanał klienta. |
| 02.10 | Moodboardy runda 1 (A / B / C). |
| 02.10 | Klient potwierdza 3 podstrony: Pricing, Customers, Demo. Stack: Vercel + Sanity. Domena **zostaje trycomp.ai**. |
| 05.10 | Mimi wysyła Brand Communication Framework v1. |
| 02–08.10 | Feedback do rundy 1: **C (Evolution) wygrywa**. A jest „too soft”, B „too playful/organic”. Klient prosi o rozwinięcie C i kierunek „wildcard”. |
| 08.10 | Runda 2: C.1 „Built to adapt” vs **C.2 „Built to improve”**. |
| 09.10 | **Wybrany C.2** (canvas z feedbackiem). Feedback do frameworku komunikacji: ok. 5 stron uwag, więc framework się jeszcze zmieni. |
| 12.10 | Arek publikuje plan wdrożenia (feature flag, preview domain, page builder w Sanity). Start Michała w tonik. |
| 13.10 | Olga planuje wysłać pierwszy brand proposal (Supercut). Wiktor pyta o wycenę dodatkowych podstron. |
| 14.10 (śr) | Weekly sync z klientem: omówienie brand proposal. |
| **15.10 (czw)** | **Start web designu.** Call z Michałem (handover brand → web). |
| 16.10 | Cel: finalny branding. |
| **02.11** | **Deadline web designu.** Start developmentu. |
| 11.11 | Dzień wolny w PL. |
| **13.11** | **Homepage live.** Klient spodziewa się dużego ruchu i projektu wideo. Teresa prosiła, żeby HP przyspieszyć, jeśli się da. |
| ~17–24.11 | Reszta wdrożenia, QA, koniec projektu. Deck pod koniec listopada / w grudniu. |

## 4. Budżet (stan z 06.10)

Branding 35/120h · Ilustracje 0/30h · **Web design 0/80h** · Motion 0/70h · Development 0/80h · Deck 0/60h. Status wszystkich: 🟢.
Godziny trzeba wbijać w ClickUp (przypomnienie przychodzi w piątki).

## 5. Kierunek wizualny: C.2 „Evolution / Built to improve”

**Słowa klucze z moodboardu:** Bold, Dynamic, Progressive, Vibrant, Energetic, Alive, Confident, Unexpected, Rebellious, Impactful, Intentional.

**Visual language (opis Olgi):** „Vivid greens meet a warm red-orange in bold, directional gradients that give the brand energy and momentum. Clean typography and structured interfaces hold that energy together in one coherent system.”

**Na moodboardzie:** gradienty zieleń → pomarańcz w formie „kapsuł”, miękkie 3D (pianka/glass), sygnet w formie gwiazdy z poświatą, kulisty wireframe (orbita), czysty grotesk na kremowym/off-white tle, ciemne karty z zielonym glow, UI w formie pigułek/czatu („Ask Comp AI…”).

**Feedback klienta do C.2 (09.10), czyli co z tego wynika dla webu:**

1. **Paleta:** zieleń zostaje jako kolor bazowy. Chcą **szerszej palety secondary/tertiary**, dalszych eksperymentów z orange/coral i innymi zestawieniami oraz jasnej hierarchii primary / secondary / tertiary / neutral. Wymóg: **odróżnić się od konkurencji**. Cel to nie więcej kolorów naraz, tylko większy zakres.
2. **Light + dark:** rozwijać oba warianty z intencjonalnymi zastosowaniami. Light jest friendly i human (support), dark jest AI-native i techniczny (złożona technologia, mocne statementy). Wszystko ma wyglądać jak jedna marka.
3. **Kontrast i dostępność:** ❌ zielony tekst na zielonym tle (z tym mają problem na obecnej stronie), ❌ nieczytelny tekst na gradientach. Marka ma być „visually bold and immediately understandable”, także w feedzie.
4. **Typografia:** obecnie sans. Chcą bardziej wyróżniającego się wordmarku, wyraźnej hierarchii H1/H2/H3/eyebrow („żeby nie były wymienne”) i własnych detali typograficznych. Nie może to wyglądać jak „well-executed contemporary SaaS”. Serif kontra sans to dalej otwarta sprawa (Lewis jest za serifem, Claudio przeciw).
5. **System symboli (największa szansa!):** rodzina znaków rozpoznawalnych bez logo. Mają działać także **funkcjonalnie jako trust badges / statusy frameworków** (*monitored, verified, evidence collected*), co łączy brand z produktem. Na webie to świetny materiał na sekcje produktu, trust center i ikonografię.
6. **Test rozpoznawalności:** „Gdyby usunąć logo i oddać identyfikację w czerni i bieli, po czym ktoś poznałby Comp?”
7. **Personality with restraint:** minimalna, mocna baza na co dzień. Ekspresja tylko tam, gdzie daje wartość, i z jasnymi regułami dla gradientów, akcentów i wymiaru. „Not maximalism, intentional expression.”
8. **Web w kontekście C.2:** „Clear, intuitive, credible, sophisticated.” Klient chce zobaczyć „real-world applications”, w tym web.

**Ogólne zasady z warsztatu:**

- „Credible, not corporate. Expressive, not whimsical. Technical, not cold. Premium, not sterile. Unexpected, not confusing.”
- Minimalizm i przestrzeń kojarzą się klientowi z premium.
- Chcą „depth / dimension”, bo obecne grafiki są płaskie.
- **Unikać:** generic GRC/cyber aesthetic, dark backgrounds jako domyślnego tła, neon gradients, glowing grids, shields, locks, checkmarks, generic AI graphics. Z drugiej strony nie chcą też „playful startup identity”, która podważa wiarygodność.
- **Anty-referencje:** „wszystkie czarne i identyczne” AI-strony (Profound, Vercel, Linear jako *wygląd*), Notion/Figma (za playful), Drata, Secureframe.
- **Referencje wizualne:**
  - Stripe: craft, restraint (choć Teresa uważa, że trochę się zestarzał)
  - **Baseten**: clean, high design, a jednak wyrazisty
  - Lovable: bold, approachable
  - PostHog / Corgi / Passionfroot: osobowość, budowanie „własnego świata”
- **Henrick Johansson** to fikcyjna, satyryczna postać „hiper-biurokratycznego europejskiego VC”. *Nie jest* marką Comp, pokazuje tylko zakres, w jakim marka może grać. Czy pojawi się na stronie: otwarte.

## 6. Komunikacja i copy (pod copy guidance)

- **Archetypy:** Magician + Rebel. Klient to akceptuje.
- **Pozycjonowanie v1:** „Comp AI is the AI-native compliance and security platform built to do the work (not just help teams manage it).” Klient chce mocniejszej różnicy niż samo „AI-native” (test „Best in the World For” Dunford).
- **Zasada:** „Instead of selling AI enthusiasm, we sell what AI makes possible.”
- **Magia = time-to-value:** praca znika, gotowość pojawia się dramatycznie szybciej. Na webie trzeba to *pokazać* (dowody, liczby, transformacja), a nie tylko opisać.
- **Trzy ścieżki narracyjne (w testach):**
  - I. *Do the Work. Keep Pace with the Business.*
  - II. *Cut the Theater. Never the Corners.* Emocjonalnie najmocniejsza, ale Oneleet już w niej gra.
  - III. *Magic You Can Trust.*
- **Security i compliance mają być równorzędne.** Nie zamykać się w kategorii „compliance automation”.
- **Ton:** bezpośredni, konkretny, pewny siebie, z humorem wynikającym z obserwacji, nie z „quirky copy”. Mniej słów, mocniejsze claimy, wyższy kontrast („brand should communicate like the visual system looks”).
- **Słowa zakazane:** revolutionary, seamless, next-generation, generyczne „AI-powered”. Unikać też: „trust us” w hero (zaufanie ma być *odczuwalne*, nie wypisane), straszenia compliance, wprost mówionego „zastąpimy ludzi” (zamiast tego: „uwalniamy czas zespołu na ważniejsze rzeczy”).
- **Do zachowania:** „Compliance doesn't have to be boring / hard”, „Comp AI never sleeps”.
- **Referencje werbalne:** PostHog (najmocniejsza dla tonu), Baseten, Corgi, Passionfroot, Lovable. W zakresie zachowań i obecności w sieci: Vercel z Guillermo Rauchem, Ramp, Higgsfield, Midjourney, Anduril.

## 7. Odbiorcy strony

1. **Founder / CTO startupu** (25–35 lat, VC-backed, 0–50 osób, często AI / B2B SaaS). SOC 2 potrzebny „na wczoraj” (inwestor albo pierwszy duży klient). Decyduje szybko. Lubi AI. Potrzebuje: szybkości, „we'll do it for you”, ceny, X/socials.
2. **CISO / Head of Security / GRC** (40+, firmy 50–1000 osób). Sceptyczny wobec AI, unika ryzyka, często ma już SOC 2. Potrzebuje: dowodów, oszczędności czasu, wglądu na bieżąco, „a bit less magic”. **To priorytet przy ruchu upmarket** („focus mid-market without neglecting SMB”).
3. **Partnerzy:** VC polecający spółkom portfelowym oraz audytorzy.
4. **NOWE: agenci / developerzy** jako odbiorca (feedback do frameworku). Jak strona „rozmawia” z agentem i jak wygląda dowód zaufania dla maszyny? Do przemyślenia przy wariancie dark.

## 8. Strona: stan obecny i scope

**Obecna strona (trycomp.ai):**

- Hero: „Compliance that helps you close deals.”
- Sekcje: How it works (5 kroków), Growth stages (Startup / Mid-Market / Enterprise), testimoniale, platform features, integracje (580+), security differentiators, FAQ, końcowe CTA.
- Nawigacja: Product, Frameworks, Customers, Pricing, Get Started.
- Rozbudowana stopka (resources, guides, porównania z Vantą/Dratą/Secureframe, legal).

**Podstrony w scope:**

- **/pricing:** **brak publicznych cen.** „Pricing tailored to your compliance scope”, cena podawana na 20-min callu. Formularz w 3 krokach, 4 czynniki ceny, lista frameworków, FAQ, link do case study.
- **/case-studies (Customers):** grid kart (outcome, cytat, metryki, tagi frameworków). Ok. 11 klientów, m.in. Persona AI ($400K+ ARR, przeszli z Vanty), RiskInMind, Zernio, Luthor AI. Brak filtrów. Klient traktuje tę stronę jako *aspiracyjną* pod upmarket.
- **/demo:** hero „Compliance that closes deals”, flow rezerwacji (RevenueHero), agenda 20-min demo, „no contract”, testimoniale, FAQ.

**Rozmiar całej strony:** ok. 261 URL w sitemapie, z czego ok. 160 to /hub (blog). Poza hubem jest ok. 100 stron, w większości z kilku szablonów: 37 policy, 12 porównań z konkurencją, 11 checklist, 11 case studies, 4 kalkulatory. Unikalnych stron jest ok. 13.

**Ustalenia techniczne:**

- Stack: Next.js monorepo `comp-web-v3` (`apps/web`) + Tailwind, hosting na Vercelu, CMS Sanity (dziś obsługuje /hub, a Outrank publikuje do niego wpisy SEO).
- Integracje: HubSpot forms, RevenueHero (booking), PostHog, gtag, CAPI, wewnętrzne narzędzie analityczne. **Nazwy eventów zostają bez zmian.**
- Wszystkie strony **zachowują URL, metadane, structured data i OG image** (SEO).
- **Page builder w Sanity:** pages, sections, navigation, footer, pricing plans, case studies. Klient chce sam robić rutynowe zmiany bez developera. Nowy *typ* sekcji wymaga już deva.
- **Feature flag i preview domain** (Vercel Auth, noindex). Produkcję przełącza jedna flaga, możliwy rollback.
- **Kolejność PR-ów:** Homepage (2–3 PR-y według grup sekcji), potem Pricing, Customers, Demo, na końcu Nav/Footer.
- **Shared design tokens** w `packages/ui/globals.css` + `design.md` z konwencjami. **Wspólna praca design ↔ dev na starcie.**
- Designer potrzebuje **seata na Vercelu**. Robi review PR-ów na preview razem z klientem.
- Na / i /demo trwa eksperyment PostHog `home_acquisition_redesign_v1`. Otwarte pytanie: czy nowy HP wejdzie jako treatment arm.
- Sunset /hub: klient by chciał, faza do ustalenia.

**Strony poza scope (upsell):** Product Overview (zamiast dzisiejszego /#product), podstrony produktowe, About Us. Klient pytał też o wycenę redesignu reszty strony. Rekomendacja skubiego: wyceniać per szablon, nie per podstronę.

## 9. Co to oznacza dla mojej pracy (wnioski)

- **Projektować system sekcji, nie same ekrany.** Każda sekcja to potencjalny blok w Sanity: warianty (light/dark), stany, treści edytowalne przez marketing. Dobrze od razu nazwać i skatalogować sekcje (np. Hero, Logo wall, Proof/metrics, Feature grid, Testimonial, Case study card, Pricing factors, FAQ, CTA band, Booking).
- **Tokeny najpierw.** Kolory (z hierarchią), typografia, spacing, radius, tryby light/dark. Uzgodnić z Arkiem wcześnie, żeby trafiły do `globals.css` przed sekcjami.
- **Nav + footer to osobny, wysoki priorytet.** Muszą zmieścić całą obecną architekturę informacji (Product, Frameworks, Customers, Pricing, Resources, Guides, Compare) i wyglądać dobrze także nad starymi stronami.
- **Konwersja jest najważniejsza.** Ścieżka to strona, potem 20-min demo (40% close rate). „Get Started” i „Book Demo” trzeba ułożyć w spójną hierarchię CTA. Pricing bez cen ma nadal sprzedawać call.
- **Dwie ścieżki odbiorców na HP:** founder (szybkość, „audit-ready in days”) i CISO (dowody, kontrola, ciągły monitoring). Rozważyć jawne rozgałęzienie (Startup / Mid-market / Enterprise już istnieje).
- **Dowody zamiast deklaracji:** liczby (dni do audit-ready, godziny zaoszczędzone, $ odblokowanych deali), logotypy (wordmark ma „utrzymać się na NASCAR logo wall”), trust center, open source.
- **Light/dark jako narzędzie narracji:** np. sekcje human/support na jasnym, sekcje agentów/techniczne na ciemnym, bez zamieniania strony w „kolejną czarną AI-stronę”.
- **Symbole C.2 jako ikonografia i statusy** (monitored / verified / evidence collected) w sekcjach produktu.
- **Kontrast:** sprawdzać WCAG od pierwszego szkicu. Żadnego zielonego na zielonym.
- **Termin jest ciasny:** design 2.11, a HP live 13.11 (9 dni roboczych). HP warto domknąć i oddać do dev jako pierwszy, sekcjami.

## 10. Otwarte pytania (do Wiktora / na czwartkowy call)

1. Kiedy będzie finalny brand (logo, wordmark, fonty, paleta)? Na czym startuję 15.10, skoro typografia i paleta jeszcze się zmieniają?
2. Czy dostanę dostęp do pliku brand proposal, Supercutów, Notion Communication Framework (link nie działał przez integrację) i wideo z feedbackiem Teresy (CleanShot)?
3. Czy jest finalne copy na HP, czy copy guidance robię ja razem z Mimi? Jak framework komunikacji wpłynie na hero (np. która z trzech ścieżek narracyjnych)?
4. Hierarchia CTA: „Get Started” (self-serve?) vs „Book a Demo”. Co jest celem głównym?
5. Assety: zrzuty i nagrania produktu, logotypy klientów, liczby od Katyi (metryki wciąż „do dosłania”).
6. Ilustracje Nervego i motion Antona: co dokładnie trafia na web i kiedy? Ilustracje 15–26.10 idą równolegle z designem.
7. Henrick: na stronie czy nie?
8. Agent/developer-facing: czy coś dla agentów jest w scope webu (np. dark sekcje, docs, llms.txt), czy to tylko komunikacja?
9. Wycena dodatkowych podstron (Product, About): czy mam ją oszacować razem z Emilem?
10. Kto akceptuje web po stronie klienta, skoro Katya od połowy listopada będzie na urlopie?
11. Narzędzia: seat na Vercelu, dostęp do repo i Sanity dla designera, Figma i ClickUp.

## 11. Materiały

- Slack internal: #p_comp-ai_int · Slack z klientem: #p_comp-ai
- Notion: Int. Ko Agenda - Comp AI (scope, timeline) · Comp AI Brand Communication Framework (v1, w poprawkach)
- FigJam: Comp AI branding workshop
- Figma: Comp AI – Brand Design (moodboardy 1.0 i 1.1, C.2 = slajdy 5–7)
- Canvas: „V2 Visual Moodboard Feedback” (wybór C.2) · „Tonik communications — feedback alignment”
- Nagrania: tl;dv kick-off 29.09 (transkrypt `compai_kickoff_sync.md`), internal KO 28.09 (`comp_internal_ko.md`)
- Produkt: demo wideo (Google Drive, od Katyi) · app.trycomp.ai (można aktywować organizację)
- Plan wdrożenia Arka: wątek „implementation process” na #p_comp-ai (12.10)
