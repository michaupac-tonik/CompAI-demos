# Comp AI: kontrakt sekcji (section spec)

> **Wersja:** v0.13 (21.10.2026) · **Właściciel:** Michał Pac (web design)
> **Status:** draft roboczy tonik, jeszcze nieuzgodniony z Arkiem ani z klientem
> **Gdzie leży:** `skills/comp-ai-section-contract/comp-ai-section-contract-spec.md` (źródło prawdy) + kopia w projekcie Claude „Comp AI”
> **Prompt do weryfikacji w Figmie:** `skills/comp-ai-section-contract/comp-ai-figma-wireframe-check-prompt.md`

---

## 0. Po co ten plik i jak go używać

Strona Comp AI powstaje jako **page builder w Sanity**: marketing składa strony z gotowych sekcji, a nowy *typ* sekcji wymaga już developera. Każda sekcja przechodzi więc przez pięć etapów i na każdym musi wyglądać tak samo:

```
Sitemap  →  Wireframe  →  Design (Figma)  →  Schemat Sanity  →  Komponent + PR
(gdzie)     (co i w jakiej    (jak wygląda,    (co edytuje        (jak się renderuje,
             kolejności)       tokeny, stany)   marketing)         preview, tracking)
```

Ten plik jest **kontraktem**: jedna sekcja ma jeden paszport (§8) i jedną nazwę (§5) na wszystkich etapach. Zasady:

1. **Najpierw kontrakt, potem ekran.** Nowa sekcja albo nowe pole w designie trafia najpierw tutaj (do §8 i do changelogu w §14), dopiero potem do Figmy.
2. **Figma nie może zawierać niczego, czego nie ma w kontrakcie.** Dotyczy to pól, wariantów, sekcji i tokenów. Prompt weryfikacyjny sprawdza to automatycznie.
3. **Kontrakt nie może obiecywać niczego, czego nie da się wyklikać w Sanity.** Jeśli element designu nie ma pola, to albo jest stały w kodzie (i tak go opisujemy), albo dostaje pole.
4. **Zmiana po zatwierdzeniu designu** to wpis w changelogu i ping do Arka. Bez cichych zmian.

---

## 1. Kontekst wdrożenia (fakty, stan 16.10)

| Temat | Ustalenie | Źródło |
|---|---|---|
| Repo | `comp-web-v3`, Next.js monorepo (`apps/web`), Tailwind, hosting Vercel | Teresa, wątek implementation process |
| CMS | Sanity. Dziś obsługuje tylko `/hub`. WordPress wycofany. | Teresa |
| Studio | Embed pod `/studio` w repo + dataset staging | Claudio, 16.10 |
| Page builder | Schematy: pages, sections, navigation, footer, pricing plans, case studies. Draft preview + webhook publikacji. | Plan Arka, 12.10 |
| Migracja | Pricing i case studies są dziś zahardkodowane w repo. Przejdą do Sanity przez testowane skrypty migracji. | Plan Arka |
| Edycja bez deva | Copy, obrazy, plany cenowe, case studies, linki nav/footer, **nowe strony złożone z istniejących sekcji**. Nowy typ sekcji wymaga deva. | Plan Arka (odpowiedź dla Teresy) |
| Tokeny | Wspólne tokeny w `packages/ui/globals.css` + `design.md` z konwencjami. Na start sama podstawa. | Plan Arka, Goszczu |
| Wspólne klocki | Button, section wrapper, typografia: osobny PR w fazie Foundation | Plan Arka |
| Preview | Osobna domena preview (Vercel Auth, noindex). `proxy.ts` wybiera wersję po hoście. | Plan Arka |
| Launch | Jedna flaga (env/Edge Config, nie PostHog). Rollback przez przełączenie flagi. Strony statyczne. | Plan Arka |
| Kolejność PR | Foundation → Sanity → HP (2–3 PR-y grupami sekcji) → Pricing → Customers (`/case-studies`) → Demo (`/demo`) → Nav + Footer → tracking → QA → flip flagi → PR sprzątający | Plan Arka |
| Review | Claudio jest DRI od review i merge. Michał robi review na preview razem z klientem. Michał potrzebuje seata na Vercelu. | Teresa, plan Arka |
| Nav + footer | Osobne komponenty CMS. **Stare strony (~100 poza /hub) dostają nowy nav i footer** przez tę samą flagę. | Teresa, plan Arka |
| SEO | Każda strona zachowuje URL, metadane, structured data i OG image. Domena zostaje `trycomp.ai`. | Plan Arka, Teresa |
| Tracking | HubSpot forms, RevenueHero, PostHog, gtag, HubSpot webhook, CAPI. **Nazwy eventów bez zmian.** Test end-to-end na preview. | Plan Arka |
| Eksperyment | `home_acquisition_redesign_v1` (/ i /demo) zostanie zakończony, a zwycięzca promowany | Claudio, 16.10 |
| /hub | Klient chce wygasić. Decyzja Teresy. Outrank nieaktywny od miesięcy. | Claudio, 16.10 |

**Konsekwencja dla designu:** HP oddaję do dev **grupami sekcji**, w kolejności PR-ów (§12), a nie jako jedną makietę na końcu.

---

## 2. Zasady modelowania (twarde reguły)

Zasady wynikają z dokumentacji Sanity (page building, content modeling) i z ustaleń projektu. Numery służą do odwoływania się w review („łamie R3”).

| # | Reguła | Dlaczego |
|---|---|---|
| **R1** | **Modelujemy znaczenie, nie wygląd.** W schemacie nie ma pól typu kolor, wyrównanie, rozmiar, układ kolumn czy odstęp. Wygląd wynika z typu bloku i tokenów. | Treść przetrwa redesign, a marketing nie zepsuje designu. |
| **R2** | **Jedyny wyjątek to `tone: light \| dark`** na poziomie sekcji. Wyraża „dwa głosy marki”: light jest human/support, dark jest AI/agent/techniczny. Domyślny `tone` każdego bloku jest zapisany w §8. | Light/dark to decyzja narracyjna, nie dekoracja. |
| **R3** | **Maks. 2 warianty układu na blok** (np. `layout: default \| compact`). Trzeci wariant oznacza osobny blok. Wariant musi mieć własną miniaturę. | Zalecenie Sanity: jedna miniatura nie pokaże wielu wariantów, a edytor się gubi. |
| **R4** | **Domyślnie obiekt, referencja tylko dla treści współdzielonej:** case study, FAQ, moduł produktu, framework, logo klienta, ustawienia CTA. | Obiekty łatwiej odpytać. Referencje dają jedno źródło prawdy tam, gdzie treść się powtarza. |
| **R5** | **Moduły produktu to jeden typ dokumentu (`productModule`)**, który zasila nav (Product ▾), sekcję Platform, stopkę i strony produktowe. | Nazwy modułów mają być identyczne wszędzie (bloker w sections v0.2). |
| **R6** | **CTA to obiekt `cta`** z polami `label` i `action: bookDemo \| bookPricing \| signIn \| internalLink \| externalLink` (`bookPricing` od C28) oraz `href` dla linków. Event trackingu wynika z `action` w kodzie, a edytor go nie wpisuje. | Etykieta głównego CTA jest nierozstrzygnięta (Book a demo vs Get started), więc zmienia się ją w CMS, a tracking zostaje nietknięty. |
| **R7** | **Formularze i booking jako typ, nie jako kod:** `form: hubspotDemo \| hubspotContact`, `booking: revenueHero`. Frontend wie, jak je wyrenderować. | Zalecenie Sanity. Integracje i eventy zostają w kodzie. |
| **R8** | **Poziom nagłówka ustala frontend z pozycji sekcji:** pierwszy blok na stronie dostaje `h1`, reszta `h2`. Edytor tego nie wybiera. | Jedno `h1` na stronę, poprawne SEO i a11y. |
| **R9** | **Każdy obraz ma wymagane `alt`** (walidacja). Wyjątek: dekoracja oznaczona `decorative: true`. | Dostępność. |
| **R10** | **Limity długości tekstu** wynikają z **pojemności komponentu w makiecie hi-fi** (ile znaków mieści się w liniach zaprojektowanych dla pola) i z zasad czytelności, a nie z lo-fi. Każde pole ma dwa poziomy: **zalecany** (`warning`, można opublikować) i **maksymalny** (`error`, blokuje publikację). Wartości i metoda: §8e (C49). | Design nie rozjedzie się po zmianie copy, a edytor nie jest blokowany bez powodu. |
| **R11** | **Każdy typ strony ma ograniczoną listę dozwolonych bloków** (§9). | Mniej wyboru to mniej błędów. Zalecenie Sanity. |
| **R12** | **Każdy blok ma podgląd w Studio** (`preview`: tytuł = nagłówek, podtytuł = nazwa bloku, ikona) i **miniaturę 600×400 PNG** w insert menu. | Edytor odróżnia bloki. Miniatury eksportuję z Figmy (§5). |
| **R13** | **Nieznany blok renderuje widoczny placeholder** w preview i nic na produkcji. | Bezpieczne dodawanie nowych typów. |
| **R14** | **Pola tylko „wyświetlane”, ale stałe** (np. etykieta „Live” na karcie modułu) opisuję w §8 jako `stała w kodzie` albo dostają pole. Nic pomiędzy. | R3 kontraktu z §0. |
| **R15** | **Copy na makietach to placeholder** do czasu domknięcia messagingu (analyst deck 24.10). Struktura pól nie zależy od treści. | Messaging się zmienia. |

---

## 3. Pipeline i bramki jakości

Każdy etap kończy się bramką. Sekcja nie przechodzi dalej, dopóki checklista nie jest zielona.

### G1 · Sitemap / architektura
- [ ] Strona ma typ (§9), URL (stary URL zachowany) i właściciela treści.
- [ ] Lista sekcji to wyłącznie bloki z katalogu §8 (albo nowy blok dopisany do §8 z dopiskiem `proponowany`).
- [ ] Zaznaczone, które bloki są współdzielone z innymi stronami (np. `ctaBand`, `logoBand`).

### G2 · Wireframe (lo-fi, greyscale)
- [ ] Ramka sekcji nazywa się `Section/<_type>` (§5).
- [ ] Każdy widoczny element tekstowy lub obrazowy odpowiada polu z paszportu albo jest oznaczony jako stały w kodzie.
- [ ] Listy (karty, logotypy, kroki) pokazują **maks. liczbę elementów** z paszportu, a min. jest w notatce przy liście.
- [ ] Oznaczony domyślny `tone`.
- [ ] Brak brandu: szarości, PP Formula, placeholder copy.

### G3 · Design (hi-fi)
- [ ] **Każdy kolor, typ, odstęp i radius to zmienna (Figma Variables)**, bez wartości wpisanych na sztywno.
- [ ] Sekcja istnieje w **obu tonach**, jeśli paszport mówi `tone: light | dark`. Ton przełącza tryb kolekcji `Semantic`, a nie ręczne przemalowanie.
- [ ] Elementy to **instancje komponentów z biblioteki** (§7), a nie odłączone kopie.
- [ ] Właściwości komponentów (Figma component properties) mają te same nazwy co propsy i pola w Sanity (`title`, `intro`, `primaryCta`…).
- [ ] Breakpointy: desktop 1440 + mobile 320 (tablet do ustalenia z Arkiem, §10).
- [ ] Stany: hover/focus/active dla interaktywnych, pusty/skrajny stan treści (najdłuższy tytuł, 1 vs maks. elementów).
- [ ] Kontrast WCAG AA. Żadnego zielonego tekstu na zielonym tle ani tekstu na gradiencie bez sprawdzonego kontrastu.
- [ ] Wyeksportowana miniatura `block-previews/<_type>.png` (600×400).

### G4 · Schemat Sanity (Arek, review: Michał)
- [ ] Nazwa typu = `_type` z paszportu. Pola i walidacje jak w paszporcie.
- [ ] `preview` + miniatura + grupa w insert menu.
- [ ] Blok dopuszczony tylko w typach stron z §9.
- [ ] TypeGen wygenerowany (typy propsów komponentu wynikają ze schematu).

### G5 · Komponent + PR (Arek, review: Michał + klient na preview)
- [ ] Komponent `<PascalCase>` w `sections/` używa wyłącznie tokenów z `globals.css`.
- [ ] Preview na domenie preview zgadza się z Figmą na 1440 i 320 (porównanie zrzutów).
- [ ] Visual Editing działa (klik w tekst otwiera pole w Studio, drag & drop sekcji).
- [ ] CTA i formularze odpalają **istniejące** nazwy eventów.
- [ ] Metadane, structured data (np. FAQPage) i OG zachowane.
- [ ] Lighthouse / a11y bez regresji względem obecnej strony.

---

### Odłożone do etapu UI (C48, 21.10)

Elementy obecne w makietach hi-fi, które celowo nie są jeszcze rozstrzygnięte w kontrakcie. Na etapie UI każdy dostaje decyzję i, jeśli trzeba, wpis w changelogu.

| Temat | Stan w makietach hi-fi | Decyzja na etapie UI |
|---|---|---|
| Ikony i elementy UI (np. glyphy statusu jako punktory list, strzałki) | Używane roboczo | Zakres i miejsca użycia ikon; czy glyphy statusu mogą być ozdobnikiem |
| Typy przycisków | `Button`: primary / secondary + warianty roboczo (light, ghost, glass, small); strzałki w etykietach | Finalne typy przycisków; ikona jako część komponentu, nie etykiety (R6) |
| Dwukolorowe tytuły (szara część tytułu) i łamanie linii | Szara część i ręczne łamanie w HTML; pola tytułów to `string` | Czy zostaje, a jeśli tak: jak edytor oznacza wyróżnienie (znacznik w tytule albo osobne pole) |
| Krój i typescale | Lausanne, rozmiary z HP v08 (C47) | Finalny krój, typescale, guidelines |
| Dostępność (kontrast szarości, stany focus) | Niesprawdzana w hi-fi | Audyt WCAG AA na UI (G3) |

## 4. Słownik pojęć

- **Blok / sekcja:** jeden element tablicy `content` strony w Sanity, a w Figmie jedna ramka `Section/<_type>`. Na całej szerokości strony.
- **Komponent:** mniejszy klocek używany *wewnątrz* sekcji (Button, Card, StatRow…). Nie jest wybierany przez edytora.
- **Dokument współdzielony:** osobny dokument w Sanity (case study, FAQ, moduł…), do którego sekcje się odwołują.
- **Tone:** `light` albo `dark`, czyli jedyne pole „wizualne” (R2).
- **Wariant:** maks. 2 układy bloku (R3).

---

## 5. Nazewnictwo (jedna nazwa na wszystkich etapach)

| Etap | Konwencja | Przykład |
|---|---|---|
| Sanity `_type` (źródło nazwy) | camelCase, rzeczownik, bez słowa „section” | `featureGrid` |
| Figma: ramka sekcji | `Section/<_type>` + `/<tone>` + `/<breakpoint>` | `Section/featureGrid/light/1440` |
| Figma: komponent | `Component/<PascalCase>` + właściwości = propsy | `Component/FeatureCard` (`title`, `body`, `status`, `href`) |
| React | PascalCase, plik kebab-case | `FeatureGrid` w `sections/feature-grid.tsx` |
| Miniatura w Studio | `public/block-previews/<_type>.png`, 600×400 | `block-previews/featureGrid.png` |
| Zmienne Figma ↔ CSS | `kolekcja/grupa/nazwa` ↔ `--grupa-nazwa` | `color/bg/surface` ↔ `--color-bg-surface` |
| Pliki w folderze | `comp-ai-<temat>[-vN].*` | `comp-ai-section-contract-spec.md` |

---

## 6. Tokeny (Figma Variables ↔ `globals.css`)

Wartości dostarczy finalny brand (cel 21.10). Do tego czasu ustalam **strukturę i nazwy**, a wartości w wireframe są szare. Struktura zgodna z trójwarstwowym modelem tokenów i standardem W3C DTCG 2025.10. W Tailwind v4 tokeny trafiają do `@theme` w `globals.css`.

**Kolekcje w Figmie:**

| Kolekcja | Tryby | Zawartość | Kto używa |
|---|---|---|---|
| `Primitives` | — | surowa paleta (`green/500`, `coral/400`, `neutral/0…1000`), skala spacingu, promienie, rodziny fontów | tylko inne zmienne, **nigdy warstwy w designie** |
| `Semantic` | **Light, Dark** | role: `color/bg/page`, `bg/surface`, `bg/inverse`, `text/primary`, `text/secondary`, `text/on-accent`, `border/subtle`, `accent/primary`, `accent/secondary`, `status/monitored`, `status/verified`, `status/evidence`, `focus/ring` | wszystkie warstwy designu |
| `Layout` | Desktop, Mobile | `space/section-y`, `space/stack-*`, `grid/columns`, `grid/gutter`, `container/max` | ramki sekcji |
| `Type` | Desktop, Mobile | `display`, `h1`, `h2`, `h3`, `eyebrow`, `body-lg`, `body`, `caption` (rozmiar, interlinia, tracking) | style tekstu |

**Zasady:**
- `tone` sekcji = tryb kolekcji `Semantic` ustawiony na ramce sekcji. W kodzie odpowiada mu `data-tone="dark"` na wrapperze, który podmienia zmienne CSS.
- Hierarchia H1/H2/H3/eyebrow ma być wyraźnie różna (feedback klienta: „żeby nie były wymienne”).
- **Krój (C44, zmienione C47):** makiety hi-fi (HTML) używają Lausanne (decyzja 20.10); Figma używa Inter do czasu instalacji Lausanne. Wireframe’y lo-fi zostają w Inter. **Finalny krój wybieramy na etapie UI.**
- **Skala typograficzna (C40, do weryfikacji z brandem):** ratio 1,272, baza 16 px, wartości zaokrąglone do pełnych px: 10 · 13 · 16 · 20 · 26 · 33 · 42 · 53 · 68 · 86 · 110. Każdy rozmiar tekstu w designie to stopień tej skali. Desktop (style `Type/Desktop/*`): `display` 86 · `h1` 53 · `h2` 42 · `h3` 20 · `body-lg` 20 · `body` 16 · `caption` 13 · `eyebrow` 13 (uppercase, tracking 8%). Rozróżnienie `h3`/`body-lg` i `caption`/`eyebrow` wagą i stylem, nie rozmiarem. Mobile: do ustalenia po akceptacji desktopu.
- **Rozmiary w hi-fi (C47):** do etapu UI makiety hi-fi trzymają się rozmiarów z HP hi-fi v08 (h1 68, h2 42, h3 26 i rozmiary pomocnicze z v08); każda nowa strona używa tylko rozmiarów, które już są na HP. **Finalny typescale i guidelines powstają na etapie UI** i zastąpią skalę C40.
- Statusy `monitored / verified / evidence` to tokeny od razu, bo system symboli C.2 ma działać jako statusy w sekcjach produktu.
- Eksport: Figma Variables → JSON (DTCG) → `globals.css`. Narzędzie (Tokens Studio, Style Dictionary albo ręcznie na start) uzgodnić z Arkiem.

---

## 7. Komponenty współdzielone (wewnątrz sekcji)

Z wireframe v01. Właściwości w Figmie = propsy w kodzie.

| Komponent | Właściwości (propsy) | Uwagi |
|---|---|---|
| `SectionHeader` | `eyebrow? (≤ 30)`, `title (≤ 70)`, `intro? (≤ 120, C43)`, `cta?` | Poziom nagłówka z R8. Limity obowiązują we wszystkich sekcjach z `header` |
| `Button` | `label`, `action`, `href?`, `variant: primary \| secondary`, `size: md \| lg` | Jeden primary na ekran. Wyjątek: `navigation.primaryCta` (globalny, zawsze widoczny) |
| `Card` | `title`, `body?`, `media?`, `href?` | Baza dla kart poniżej. **C42:** karta z `href` jest klikalna w całości i ma ikonę strzałki (stała w kodzie), bez etykiety typu „Learn more” / „Read the story” / „See a demo”. Dotyczy `FeatureCard`, `StoryCard` (`compact`), `FrameworkCard`. Etykiety zostają tylko przy linkach poza kartą (np. „All customer stories →”) i przy `StoryCard` `featured` |
| `FeatureCard` | `title`, `body`, `status`, `media`, `href` | `status` z tokenów statusu |
| `StepCard` | `index`, `title`, `body`, `media?`, `meta?` (≤ 12) | `meta` = krótka etykieta obok numeru, np. czas trwania w agendzie `bookingEmbed` (C24). Na HP nieużywane |
| `PointCard` | `title`, `body`, `link?` | |
| `PathCard` | `segment`, `audience`, `need`, `proofPoints[]`, `story` (ref) | |
| `QuoteCard` | `quote (≤ 200)`, `person`, `role (≤ 40)`, `company`, `logo?`, `photo?` (z dokumentu `testimonial`) | Karta cytatu w `testimonials` (`grid` i `single`) (C23). **C46:** avatar = `photo` (edytowalne w CMS); gdy puste, inicjały z `person` (stała w kodzie) |
| `StoryCard` | `variant: featured \| compact`, ref `caseStudy` | Ten sam na HP, /pricing i `/case-studies`. `compact` pokazuje logo, `metrics[0]`, etykiety `frameworks[]` (C35) i link, **bez `summary`** (C51; jak w hi-fi HP v08 i /pricing). `summary` zostaje w karcie w `audiencePaths`, w `featured` i na `/case-studies/<slug>`; siatka na `/case-studies` do decyzji przy jej hi-fi |
| `FrameworkCard` | ref `framework` | |
| `LogoGrid` | `logos[]` (ref `customerLogo` / `integration`), `columns` stałe w kodzie | |
| `StatRow` | `stats[]`: `value`, `label` | 3–4 elementy |
| `Chip` | `label`, `href?` | |
| `LinkList` | `title?`, `links[]` | Nav, footer |
| `Accordion` | `items[]` | FAQ |
| `MediaSlot` | `image` + `alt` / `video` / `uiSnippet` | Ilustracje i 3D na hold do brandu |
| `ComparePanel` | `before`, `after` (z `steps.beforeAfter`) | Renderowanie istniejącego pola, bez nowych pól w CMS. Etykiety „Before” / „After” stałe w kodzie (C38). W Figmie dziś `_Client/ComparePanel` |
| `SlackThread` | `messages[]` (z `MediaSlot.uiSnippet`) | Wizual `featureHighlight.media` jako `uiSnippet`: anonimizowany wątek, treść w kodzie lub jako obraz, bez nowych pól w CMS (C38). W Figmie dziś `_Client/SlackThread` |
| `PricingBanner` | z `pricingTeaser` (`banner`) | Wariant `banner` istniejącego bloku (C17), nie nowy blok (C38). W Figmie dziś `_Client/PricingBanner` |

---

## 8. Katalog sekcji: paszporty

**Szablon paszportu** (dla każdej nowej sekcji):

```
### <nr> · <_type>  — <nazwa ludzka>
Cel: jedno zdanie, po co ta sekcja.
Strony: gdzie dozwolona (§9).
Tone: domyślny | dozwolone.
Warianty: brak | a / b (maks. 2).
Pola: nazwa: typ (walidacja, limit znaków) — co to jest.
Stałe w kodzie: co widać, ale nie jest edytowalne.
Komponenty: z §7.
Dane współdzielone: referencje.
Tracking/SEO: eventy, structured data.
Media: proporcje każdego MediaSlot (np. 4:3).
Responsywność: zachowanie 1440 → 768 → 320 (np. „grid 4 → 2 → 1”).
Status: gotowe do wireframe | do designu | zablokowane (czym).
```

**Limity znaków (C49):** obowiązują wartości z §8e (pomiar hi-fi). Liczby w paszportach poniżej pochodzą z lo-fi i zostaną zsynchronizowane z §8e przy handoffie dla dev; do tego czasu, przy rozbieżności, rozstrzyga §8e.

### 01 · `announcementBar` — Top bar (globalny)
- **Cel:** jedna linijka newsa (dziś Series A, po launchu news o launchu).
- **Strony:** globalnie, dokument singleton. **Tone:** dark. **Warianty:** brak.
- **Pola:** `enabled: boolean` · `text: string (≤ 90)` · `link: cta?`
- **Responsywność:** na 320 tekst w 2 liniach, link pod tekstem.
- **Status:** do designu.

### 01b · `navigation` — Nawigacja (globalna, dokument singleton)
- **Cel:** wejście na każdą stronę, także ~100 starych.
- **Pola:** `items[]`: `label (≤ 16)`, `type: link | menu`, `href?`, `menu?` (`source: productModules | frameworks | manual`, `links[]`) · `secondaryLink: cta` (Sign in) · `primaryCta: cta` (Book a demo).
- **Stałe w kodzie:** logo, zachowanie mobile (drawer), sticky.
- **Responsywność:** poniżej 1024 drawer z `items[]`; `primaryCta` zostaje widoczny w pasku.
- **Dane współdzielone:** Product ▾ = `productModule[]` (R5), Frameworks ▾ = `framework[]`.
- **Uwaga:** musi wyglądać dobrze nad starymi szablonami (policy, porównania, checklisty, kalkulatory).
- **/demo (C18, D9 zamknięte):** ta sama nawigacja co na wszystkich stronach, bez osobnego wariantu. `primaryCta` z `action: bookDemo` na /demo i /demo/[framework] przewija do formularza `bookingEmbed` (zachowanie w kodzie, bez pola w CMS).
- **Status:** zablokowane: oficjalna lista modułów, finalny zestaw stron (Product overview, About).

### 02 · `hero`
- **Cel:** co robi Comp AI, dla kogo, jedna główna akcja.
- **Strony:** home, page, productPage. **Tone:** light (dark opcjonalnie). **Warianty:** `default` (media obok) / `centered` (zatwierdzony C34: wyśrodkowany tekst, bez media; np. /case-studies).
- **Pola:** `eyebrow?: string (≤ 40)` · `title: string (≤ 55)` · `intro: text (≤ 120, C43)` · `primaryCta: cta` · `secondaryCta?: cta` · `rating?: boolean` (G2 4.9/5, wartość z `siteSettings`) · `badges[]: ref framework (≤ 4)` · `media: MediaSlot` (wymagane w `default`, opcjonalne w `centered`, C34)
- **Media:** `media` 4:3.
- **Responsywność:** 2 kolumny → media pod tekstem; na 320 CTA na pełną szerokość, jeden pod drugim.
- **Status:** do wireframe. Zablokowane w treści: etykieta głównego CTA, odbiorca, claimy (audit included, ~10 vs 14 dni). Struktura gotowa dzięki R6.

### 03 · `logoBand` — Proof band
- **Cel:** logotypy i 3–4 twarde liczby tuż pod hero.
- **Strony:** home, page (Demo, Pricing). **Tone:** light. **Warianty:** `withStats` / `logosOnly`. **Na `home` od C41: `logosOnly`** (liczby powtarzały hero i tytuł pasa; „< 3 min” jest w `featureHighlight.stats`). `withStats` zostaje w schemacie.
- **Pola:** `title?: string (≤ 70)` · `logos[]: ref customerLogo (6–12)` · `stats[]: { value (≤ 8), label (≤ 40) } (0–4)`
- **Responsywność:** logotypy 6 → 4 → 3 kolumny; liczby 4 → 2×2.
- **Status:** do designu (liczba „X dni” do potwierdzenia).

### 04 · `steps` — How it works
- **Cel:** proces od podłączenia narzędzi do audytu, na jednym ekranie.
- **Strony:** home, productPage. **Tone:** light. **Warianty:** `withBeforeAfter` / `stepsOnly`.
- **Pola:** `header: SectionHeader` · `beforeAfter?: { before: {title (≤ 40), body (≤ 60)}, after: {title (≤ 40), body (≤ 60)} }` · `steps[]: { title (≤ 40), body (≤ 60), media? } (3–4)` (C43)
- **Stałe w kodzie:** numeracja.
- **Media:** `steps[].media` 4:3.
- **Komponenty:** `StepCard`, `ComparePanel` (renderuje `beforeAfter`, C38).
- **Responsywność:** kroki 4 → 2 → 1; before/after 2 → 1.
- **Status:** do designu.

### 05 · `integrations`
- **Cel:** „Czy działa z naszym stackiem?”.
- **Strony:** home, productPage. **Tone:** light. **Warianty:** brak.
- **Pola:** `header: SectionHeader` · `count: string (≤ 6)` („580+”) · `featured[]: ref integration (8–20)` · `cta: cta` (pełna lista)
- **Responsywność:** 2 kolumny → nagłówek nad siatką; logotypy 5 → 4 kolumny.
- **Status:** do designu.

### 06 · `featureGrid` — Platform
- **Cel:** moduły produktu, każdy prowadzi do swojej strony produktowej.
- **Strony:** home, productPage. **Tone:** light. **Warianty:** `full` / `teaser` (gdy powstanie Product overview).
- **Pola:** `header: SectionHeader` · `modules[]: ref productModule (3–8)`. Karta bierze z modułu `name`, `summary (≤ 60, C43)`, `status`, `media`, `slug`.
- **Stałe w kodzie:** etykieta statusu (`Live` itd.) mapowana z `productModule.status`.
- **Media:** `productModule.media` 16:10.
- **Responsywność:** karty 4 → 2 → 1.
- **Status:** zablokowane: oficjalna lista i nazwy modułów.

### 07 · `proofPoints` — Security
- **Cel:** „verify, don't trust”: open source, prawdziwe dowody, testy, trust center.
- **Strony:** home, productPage. **Tone:** **dark** (domyślnie), light dozwolony. **Warianty:** brak.
- **Pola:** `header: SectionHeader` · `points[]: { title (≤ 40), body (≤ 60, C43), link?: cta } (3–4)` · `links[]: cta (≤ 2)` (GitHub, Trust center) · `media?: MediaSlot`
- **Media:** `media` 4:5.
- **Responsywność:** 2 kolumny → media pod treścią; punkty 2 → 1.
- **Status:** do designu. Treść: tylko claimy z obecnej strony.

### 08 · `frameworkList` — Frameworks
- **Cel:** „zacznij od jednego, dodaj kolejny bez zaczynania od nowa”.
- **Strony:** page (np. /pricing). **Na `home` nie od C17:** frameworki są w hero (`badges`) i w nav, a przekaz „dodaj kolejny” niesie intro `audiencePaths`. **Tone:** light. **Warianty:** brak.
- **Pola:** `header: SectionHeader` · `featured[]: ref framework (4)` · `more[]: ref framework (0–12)` · `moreNote?: string (≤ 30)` (dopisek za chipami, np. „and more on request”, C33). Link frameworka = `framework.demoHref` (na razie strona demo).
- **Responsywność:** `featured` 4 → 2 → 1; `more` jako zawijane chipy.
- **Status:** do designu.

### 09 · `featureHighlight` — Experts on Slack
- **Cel:** support 1:1 na Slacku, ludzka strona marki.
- **Strony:** home, page, productPage. **Tone:** light. **Warianty:** `mediaRight` / `mediaLeft`.
- **Pola:** `header: SectionHeader` · `stats[]: { value (≤ 8), label (≤ 40) } (1–3)` · `media: MediaSlot` (anonimizowany wątek Slack: `uiSnippet` renderowany przez `SlackThread`, C38)
- **Uwaga:** blok uniwersalny („jedna rzecz + dowód + wizual”), nadaje się też na strony produktowe.
- **Media:** `media` 4:3.
- **Responsywność:** 2 kolumny → media pod tekstem.
- **Status:** do designu.

### 10 · `audiencePaths` — Who it's for
- **Cel:** ścieżki Startup / Mid-Market / Enterprise obok siebie.
- **Strony:** home. **Tone:** light. **Warianty:** brak.
- **Pola:** `header: SectionHeader` · `paths[]: { segment (≤ 30), audience (≤ 40), need (≤ 60, C43), proofPoints[] (≤ 3 × 60), story: ref caseStudy } (3)`
- **Responsywność:** karty 3 → 1.
- **Status:** do wireframe (persony to założenie z warsztatu).

### 11 · `caseStudies` — Customer stories
- **Cel:** dowód od podobnych firm.
- **Strony:** home, page, productPage. Na `/case-studies` jako pełny grid. **Tone:** light. **Warianty:** `featuredPlusList` / `grid`.
- **Pola:** `header: SectionHeader` · `featured?: ref caseStudy` · `items[]: ref caseStudy` (`featuredPlusList`: 0–3, `grid`: 0–24) · `cta: cta`
- **Dane współdzielone:** `caseStudy` (`company`, `logo`, `summary`, `metrics[]`, `quote`, `person`, `frameworks[]`, `slug`), migrowane z repo.
- **Responsywność:** `items` 3 → 2 → 1; `featured` zawsze na pełną szerokość.
- **Karty `compact` (C35):** pokazują etykiety `frameworks[]` (wszędzie: HP, /pricing, /case-studies).
- **/case-studies (C36):** dwa bloki jeden pod drugim: `featuredPlusList` tylko z `featured` (items 0) i `grid` z pozostałymi historiami (edytor wybiera ręcznie, bez wyróżnionej). Filtr po frameworku: nie na start; wraca, gdy historii będzie więcej niż ok. 15.
- **Status:** do designu.

### 12 · `pricingTeaser`
- **Cel:** jak powstaje cena, wycena na 20-minutowym callu.
- **Strony:** home, productPage, page (/pricing, C29). **Tone:** light. **Warianty:** `section` (pełna sekcja) / `banner` (lekki pas między sekcjami; **na `home` od C17**).
- **Pola:** `header: SectionHeader` · `factors[]: ref pricingFactor (4)` · `primaryCta?: cta` · `secondaryCta?: cta` (→ /pricing). **C29:** przyciski opcjonalne; na /pricing bez przycisków (formularz jest nad sekcją).
- **Wariant `banner`:** wyświetla tylko `header.title` (≤ 60, ostrzeżenie powyżej), `factors[].title` jako chipy i `secondaryCta` (→ /pricing). Nie wyświetla `header.eyebrow`, `header.intro`, `factors[].body` ani `primaryCta` (jeden primary na widok, a za banerem jest `ctaBand`). Tło pasa: stała w kodzie (`bg/surface`). Komponent: `PricingBanner` (C38).
- **Dane współdzielone:** `pricingFactor`, te same co na /pricing.
- **Responsywność:** `section`: czynniki 4 → 2 → 1, CTA na 320 jeden pod drugim. `banner`: tytuł + chipy po lewej, CTA po prawej → na 320 jedno pod drugim, CTA na pełną szerokość.
- **Status:** do designu.

### 13 · `faq`
- **Cel:** ostatnie obiekcje przed bookingiem.
- **Strony:** home, page, productPage. **Tone:** light. **Warianty:** brak.
- **Pola:** `header: SectionHeader` · `items[]: ref faq (3–12)`
- **SEO:** generuje structured data **FAQPage** (zachowana z obecnej strony).
- **Responsywność:** 2 kolumny → nagłówek nad listą.
- **Status:** do designu.

### 14 · `ctaBand` — Final CTA
- **Cel:** zamknięcie strony jedną akcją.
- **Strony:** wszystkie typy. **Tone:** dark (domyślnie), light dozwolony. **Warianty:** brak.
- **Pola:** `title: string (≤ 60)` · `primaryCta: cta` · `reassurance[]: string (≤ 3 × 30)` („20-minute call · Quote emailed after · No contract”). Czas zawsze w formie „20-minute call” (C39)
- **Responsywność:** na 320 CTA na pełną szerokość.
- **Status:** do designu. Etykieta CTA w CMS (R6).

### 15 · `footer` (globalny, dokument singleton)
- **Cel:** linkuje całą stronę (SEO starych podstron).
- **Pola:** `columns[]: { title, links[] (label ≤ 30) }` (Product z `productModule[]`) · `offices[]` · `socials[]` · `legalLinks[]` · `statusLink`
- **Stałe w kodzie:** logo, copyright, badge zgodności, wskaźnik statusu.
- **Responsywność:** 5 kolumn (Product, Resources, Guides, Compare, Legal; Status to `statusLink`, nie kolumna) → 3 → 2 kolumny (bez akordeonu, żeby linki SEO były widoczne).
- **Status:** do designu. Kolumny i linki jak dziś.

### 8b · Dokumenty współdzielone (R4, R5)

Pola i limity dokumentów, do których odwołują się sekcje. Limity to propozycja z wireframe v02 (R10).

| Dokument | Pola | Używają |
|---|---|---|
| `productModule` | `name: string (≤ 40)` · `slug` · `summary: string (≤ 60, C43)` · `status: live \| beta \| soon` · `media: MediaSlot (16:10)` · `order: number` | navigation, featureGrid, footer, productPage |
| `framework` | `name: string (≤ 20)` · `slug` · `demoHref: url` · `order: number` · `demoTitle?: string (≤ 55)` · `demoIntro?: text (≤ 180)` · `demoFormTitle?: string (≤ 40)` (C22: podmiany na /demo/[framework]; puste = teksty z /demo) | hero (badges), frameworkList, navigation, bookingEmbed |
| `customerLogo` | `company: string` · `logo: image` · `alt` (R9) | logoBand |
| `integration` | `name: string` · `logo: image` · `alt` (R9) | integrations |
| `caseStudy` | `company`, `logo`, `summary (≤ 120)`, `metrics[]: { value (≤ 8), label (≤ 40) } (1–3)`, `testimonial?: ref testimonial` (C20, zamiast `quote` + `person`), `frameworks[]`, `slug` | caseStudies, audiencePaths, `/case-studies` |
| `faq` | `question: string (≤ 90)` · `answer: portable text` · `group?` | faq (FAQPage) |
| `pricingFactor` | `title: string (≤ 30)` · `body: string (≤ 80)` (C43; wcześniej ≤ 160 z C29) | pricingTeaser, pricingFactors |
| `testimonial` *(proponowany, C20)* | `quote: string (≤ 200)` · `person` · `role (≤ 40)` · `company` · `logo?` · `photo?: image` + `alt` (R9, C46; 1:1) | testimonials, caseStudy (karta featured na HP, `/case-studies/<slug>`) · D11: rekomendacja, do potwierdzenia z Arkiem |
| `post` *(istnieje, /hub)* | bez zmian | postGrid, articleHeader |
| `job` *(proponowany)* | `title (≤ 60)` · `team` · `location` · `type` · `slug` · `body: portable text` | jobList, articleHeader |

### 8c · Bloki proponowane z mapy obecnej strony

Źródło: `web/architecture/comp-ai-sitemap-current-v03.html`, czyli mapa trycomp.ai z 16.10: 29 szablonów, 264 URL (v02 z 21.10: /pricing zweryfikowane na żywej stronie, dopisane `steps`, `frameworkList`, `linkDirectory`). Te bloki powtarzają się na obecnej stronie, a katalog §8 ich nie pokrywa. Wszystkie mają status **`proponowany`** (G1) do czasu uzgodnienia z Arkiem.

**Priorytet.** W zakresie redesignu (HP, Pricing, Case Studies, Demo, strony produktowe) potrzebne są od razu `testimonials` (/demo, case study; na HP nie, C15) i `articleHeader` (`/case-studies/<slug>`). `cardGrid` i `comparisonTable` przydadzą się na stronach produktowych i przy migracji guides/compare. `postGrid`, `linkDirectory`, `toolEmbed` i `jobList` dotyczą stron legacy, więc rozpisujemy je dopiero wtedy, gdy te strony przejdą do CMS (D13).

| `_type` | Szablony / URL dziś | Gdzie |
|---|---|---|
| `cardGrid` | 12 / 67 | guides, compare, tools, careers, partnerships, /legal |
| `comparisonTable` | 6 / 11 | compare, guides |
| `testimonials` | 4 / 17 | HP, /demo, /demo/[framework], case study |
| `articleHeader` | 6 / 178 | case study, hub, press, oferta pracy, legal, archiwa huba |
| `postGrid` | 4 / 159 | /hub, kategorie i tagi, /press, „Keep reading” |
| `linkDirectory` | 3 / 169 | /tools, strony narzędzi, archiwa huba |
| `toolEmbed` | 1 / 53 | generatory polityk, checklisty, kalkulatory |
| `jobList` | 1 / 1 | /careers |

### 16 · `cardGrid` — Karty
- **Cel:** N równorzędnych punktów w jednej siatce (powody, korzyści, koszty, odbiorcy, konkurenci). Najczęstszy wzorzec poza HP.
- **Strony:** page, productPage. **Tone:** light (dark dozwolony). **Warianty:** `grid` / `stacked` (karty na pełną szerokość jedna pod drugą, np. lista konkurentów z plusami i minusami).
- **Pola:** `header: SectionHeader` · `cards[]: { eyebrow? (≤ 20), title (≤ 50), body? (≤ 160), bullets[]? (≤ 6 × 80), link?: cta, media?: MediaSlot } (2–8)`
- **Stałe w kodzie:** liczba kolumn wynika z liczby kart (2 → 2, 3 → 3, 4 → 4, 6 → 3). Edytor jej nie wybiera (R1).
- **Komponenty:** `Card`, `PointCard`.
- **Media:** `cards[].media` 1:1 (ikona, na hold do brandu).
- **Responsywność:** `grid` 4 → 2 → 1. `stacked` bez zmian.
- **Uwaga:** `proofPoints` i `pricingFactors` zostają osobnymi blokami, bo mają inne dane i domyślny ton.
- **Status:** proponowany.

### 17 · `comparisonTable` — Porównanie
- **Cel:** Comp AI kontra inni albo opcja A kontra B (SOC 1 vs SOC 2, Type I vs Type II).
- **Strony:** page, productPage. **Tone:** light. **Warianty:** `table` (macierz wierszy i kolumn) / `columns` (2–3 kolumny z listami).
- **Pola:** `header: SectionHeader` · `columns[]: { label (≤ 24), highlight: boolean, items[]? (≤ 8 × 80) } (2–4)` · `rows[]: { label (≤ 40), cells[]: { value? (≤ 60), state?: yes | no | partial } } (3–20)` (tylko `table`) · `footnote?: string (≤ 200)` · `cta?: cta`
- **Stałe w kodzie:** symbole `state` z systemu statusów C.2 (§6), a nie checkmarki (twarde „nie” klienta, §10).
- **SEO:** renderuje się jako semantyczna `<table>`.
- **Dane współdzielone:** brak. Do rozważenia dokument `competitor` (nazwa, ceny), gdy strony compare przejdą do CMS.
- **Responsywność:** `table` na 320 zamienia się w karty per kolumna, bez poziomego scrolla. `columns` 3 → 1.
- **Status:** proponowany.

### 18 · `testimonials` — Cytaty klientów
- **Cel:** krótki dowód społeczny bez pełnego case study („Trusted by teams who ship fast”).
- **Strony:** page, productPage (na `home` niedozwolony, C15). **Tone:** light. **Warianty:** `grid` / `single` (jeden duży cytat, np. w case study).
- **Pola:** `header?: SectionHeader` · `items[]: ref testimonial (1–6)`
- **Komponenty:** `SectionHeader`, `QuoteCard` (C23).
- **Dane współdzielone:** `testimonial` (§8b, D11).
- **Responsywność:** `grid` 3 → 2 → 1.
- **/demo (C20):** wariant `grid`, 3 cytaty w jednym rzędzie, pierwszy Persona AI.
- **Status:** do designu (C27: dozwolony w `page`; na `productPage` nadal proponowany). Potrzebny na /demo i w `/case-studies/<slug>`. **Na HP nie na start (C15):** dowód społeczny na HP daje `caseStudies` (cytat w karcie featured). Powrót na HP = dopisanie bloku do listy `home` w §9, bez nowego typu.

### 19 · `articleHeader` — Nagłówek strony treściowej
- **Cel:** otwarcie strony-dokumentu zamiast `hero`: case study, artykuł, press, oferta pracy, dokument prawny, archiwum.
- **Strony:** caseStudy, page, legacy. **Tone:** light. **Warianty:** `default` / `withStats` (case study: metryki i cytat).
- **Pola:** `eyebrow?: string (≤ 30)` (kategoria albo „firma · miasto”) · `title: string (≤ 110)` · `intro?: text (≤ 200)` · `date?` · `updated?` · `author?` · `media?: MediaSlot` · `stats[]?: { value (≤ 8), label (≤ 40) } (0–3)`
- **Stałe w kodzie:** czas czytania (liczony z treści), breadcrumbs.
- **Dane współdzielone:** na `/case-studies/<slug>` pola pochodzą z dokumentu `caseStudy` i nie są wpisywane drugi raz.
- **SEO:** zawsze `h1` (R8). Naprawia brak `H1` na /press, /legal, /legal/* i w archiwach huba.
- **Media:** `media` 16:9.
- **Responsywność:** media pod tytułem.
- **Status:** proponowany. Potrzebny przy `/case-studies/<slug>`.

### 20 · `postGrid` — Lista wpisów
- **Cel:** lista artykułów albo informacji prasowych.
- **Strony:** page, legacy. **Tone:** light. **Warianty:** `grid` / `list` (press).
- **Pola:** `header?: SectionHeader` · `source: latest | category | tag | manual` · `filter?: ref category | tag` · `items[]?: ref post` (tylko `manual`) · `limit: number (3–24)`
- **Stałe w kodzie:** paginacja, zakładki kategorii na /hub.
- **Dane współdzielone:** `post` (już w Sanity dla /hub).
- **Responsywność:** 3 → 2 → 1.
- **Status:** proponowany. Zależy od decyzji o wygaszeniu /hub (§1).

### 21 · `linkDirectory` — Katalog linków
- **Cel:** pogrupowane linki wewnętrzne (szablony polityk, kategorie i tagi). Głównie dla SEO.
- **Strony:** page, legacy. **Tone:** light. **Warianty:** `grouped` / `chips`.
- **Pola:** `header?: SectionHeader` · `source: manual | toolPages | hubCategories | hubTags` · `groups[]?: { title? (≤ 30), links[]: { label (≤ 50), href } (≤ 40) } (1–10)` (tylko `manual`)
- **Uwaga:** dzisiejsze „More Resources” (sam nagłówek) i „Policy Templates” łączymy w jeden blok.
- **Responsywność:** `grouped` 4 → 2 → 1 kolumn. `chips` zawijane.
- **/pricing (C30):** wariant `chips`, `source: manual`, jedna grupa: cenniki Vanty, Draty, Secureframe i przewodnik o koszcie SOC 2. Linki wewnętrzne (strony compare/guides), otwierane w tej samej karcie.
- **Status:** do designu na /pricing (C30); dla stron legacy nadal proponowany.

### 22 · `toolEmbed` — Narzędzie
- **Cel:** interaktywne narzędzie lead-gen (generator polityki, checklista, kalkulator, assessment).
- **Strony:** legacy (strony narzędzi). **Tone:** light. **Warianty:** `wizard` (wiele kroków) / `calculator` (jeden ekran).
- **Pola:** `tool: enum` (lista narzędzi z kodu) · `form?: hubspotLead`. Logika i pytania zostają w kodzie (R7).
- **Tracking:** obecne eventy narzędzi bez zmian (§11).
- **Status:** proponowany. Potrzebny dopiero, gdy strony narzędzi przejdą do CMS.

### 23 · `jobList` — Oferty pracy
- **Cel:** lista otwartych ról na /careers.
- **Strony:** page. **Tone:** light. **Warianty:** brak.
- **Pola:** `header: SectionHeader` · `jobs[]: ref job`
- **Stałe w kodzie:** filtry (zespół, lokalizacja).
- **Dane współdzielone:** `job` (§8b).
- **Status:** proponowany. Niski priorytet (dziś 3 oferty).

### 24 · `bookingEmbed` — Rezerwacja (pierwszy ekran /demo i /pricing) (C19)
- **Cel:** pierwszy ekran strony konwersji: nagłówek strony, argumenty i formularz rezerwacji obok siebie, a w wariancie `demo` także agenda rozmowy. Zastępuje `hero` na /demo, więc `hero` nie dostaje trzeciego wariantu (R3).
- **Strony:** page (/demo, /demo/[framework], /pricing). **Tone:** light. **Warianty:** `demo` (z agendą) / `pricing` (bez agendy).
- **Pola:** `eyebrow?: string (≤ 30)` · `title: string (≤ 55)` (h1, R8) · `intro: text (≤ 120, C43)` · `highlights[]: string (3–4 × ≤ 50)` · `booking: revenueHero` (R7) · `formTitle: string (≤ 40)` · `formIntro?: text (≤ 120)` · `reassurance[]: string (3 × ≤ 24)` (czas w formie „20-minute call”, C39) · `agendaTitle: string (≤ 40)` (tylko `demo`, C25) · `agenda[]: { title (≤ 40), duration (≤ 8), body (≤ 60, C43) } (3)` (tylko `demo`) · `framework?: ref framework` · `badges[]: ref framework (≤ 4)` (C45, jak `hero.badges`)
- **Stałe w kodzie:** ocena G2 (z `siteSettings`), widget RevenueHero i jego kroki, zgoda z linkami Terms i Privacy, link „Interested in partnering?”. W wariancie `pricing` `highlights[]` mają numerację 01–03 (kroki do ceny) zamiast znaczników statusu (C50).
- **Komponenty:** `Chip` (ocena i `badges`, ten sam co w `hero`, C45), `StepCard` (agenda, bez media; `duration` → `StepCard.meta`, C24), slot formularza (`codeBox` w wireframe).
- **Dane współdzielone:** `framework` (C22): na /demo/[framework] `title`, `intro` i `formTitle` biorą się z `framework.demoTitle`, `demoIntro`, `demoFormTitle`; puste pola = teksty z /demo.
- **Tracking:** eventy RevenueHero i HubSpot bez zmian (§11). Anchor formularza = cel `bookDemo` (wariant `demo`, C18) albo `bookPricing` (wariant `pricing`, C28). Formularz RevenueHero (demo / wycena) wybiera kod na podstawie wariantu, bez pola w CMS (C28).
- **Media:** brak. Formularz zajmuje prawą kolumnę.
- **Responsywność:** 2 kolumny (tekst | formularz) → formularz pod argumentami; agenda 3 → 1.
- **Status:** do wireframe (/demo v01). Limity to propozycja (R10).

### Bloki przewidziane dla pozostałych stron (do rozpisania przy ich wireframe)

| `_type` | Strona | Uwagi |
|---|---|---|
| ~~`pricingFactors`~~ | /pricing | **Niepotrzebny (C29):** /pricing używa `pricingTeaser` (`section`). Formularz wyceny = `bookingEmbed` (`pricing`) |
| ~~`bookingEmbed`~~ | /demo, /pricing | **Rozpisany:** paszport 24 (C19) |
| ~~`caseStudyGrid`~~ | /case-studies | **Niepotrzebny.** Mapa z 16.10 pokazuje, że /case-studies to `hero` + `caseStudies` (`grid`) + `ctaBand` |
| `richText` | strony produktowe | jeśli potrzebny dłuższy opis |

### 8e · Limity znaków: pomiar hi-fi i poziomy walidacji (C49, 21.10)

**Źródło liczb.** Makieta hi-fi, nie lo-fi (lo-fi to wynik audytu i propozycja struktury). Pomiar: HP hi-fi v08, /demo hi-fi v01 i /pricing hi-fi v01 (C50), 1440 px, krój Lausanne, rozmiary z hi-fi. Dla każdego pola: rzeczywista szerokość elementu i styl tekstu, przykładowy angielski tekst marketingowy, liczba znaków mieszcząca się w liniach zaprojektowanych dla pola. Dokładność ok. ±10% (zależy od długości słów). Skrypt: `web/tools/comp-ai-char-capacity.js` (do ponownego uruchomienia po zmianach UI).

**Co mówi Sanity.** Sanity daje mechanizm, nie wartości: `Rule.max()` / `min()`; przekroczenie domyślnie jest błędem i blokuje publikację, `.warning()` pozwala opublikować. W oficjalnych szablonach i w agent-toolkit długość tekstu to zawsze `warning` z komunikatem, a pole ma `description` z zaleceniem (np. SEO: meta title `max(60).warning(...)`, meta description `max(160).warning(...)`; excerpt `max(200).warning(...)`). Błąd: pola wymagane, minimalna liczba elementów, format (URL, slug).

**Poziomy (do schematu):**

| Poziom | Walidacja Sanity | Kiedy | Komunikat dla edytora |
|---|---|---|---|
| Zalecany | `max(n).warning(...)` + liczba w `description` pola | Tekst przekracza liczbę linii zaprojektowaną w hi-fi; układ się trzyma, ale wygląda inaczej niż w designie | „Recommended: up to n characters (fits X lines in the design).” |
| Maksymalny | `max(n).error(...)` | Tekst wychodzi o więcej niż 1 linię poza projekt albo łamie element jednoliniowy (pasek, liczba, rząd reassurance); układ się psuje | „Too long for this section: max n characters.” |
| Struktura | `min()/max()` na listach, `required()` | Liczba elementów i pola wymagane z paszportów (bez zmian) | — |

Reguła liczenia: zalecany = pojemność na liniach z hi-fi (zaokrąglona w dół do 5); maksymalny = pojemność na liniach z hi-fi + 1 (w dół do 5). Elementy jednoliniowe: maksymalny = pojemność 1 linii. Sufit czytelności tylko tam, gdzie pojemność jest nieproporcjonalnie duża (oznaczone „czyt.”).

**Wartości (desktop 1440):**

| Pole | Gdzie zmierzone | Linie w hi-fi | Zalecany (`warning`) | Maks. (`error`) | Lo-fi (było) |
|---|---|---|---|---|---|
| `announcementBar.text` | pasek, 13,5 px, ~1080 px | 1 | 90 (czyt.: czytane jednym rzutem oka) | 170 | 90 |
| `hero.title` | h1 68 px, 560 px | 3 | 55 | 75 | 55 |
| `hero.intro` | 20 px, 440 px | 3 | 140 | 185 | 120 |
| `logoBand.title` | 20 px, 287 px | 3 | 85 | 115 | 70 |
| `SectionHeader.title` (domyślnie, 7 kol.) | h2 42 px, 736 px | 2 | 75 | 110 | 70 |
| `SectionHeader.title` w `featureHighlight` (5 kol.) | h2 42 px, 495 px | 3 | 75 | 100 | 70 |
| `SectionHeader.title` w `faq` (4 kol.) | h2 42 px, 410 px | 2 | 35 | 60 | 70 |
| `SectionHeader.intro` (najwęższe użycie: `integrations`) | 16 px, 400 px | 2 | 105 | 150 | 120 |
| `steps.beforeAfter.*.body` | 16 px, ~545 px (pół rzędu) | 1 (jednoliniowy) | 70 | 70 | 60 |
| `steps[].title` | 20 px, 266 px | 2 | 55 | 80 | 40 |
| `steps[].body` | 14 px, 266 px | 2 | 75 | 110 | 60 |
| `productModule.name` | 26 px, 358 px (najwęższa karta) | 2 | 50 | 75 | 40 |
| `productModule.summary` | 15 px, 358 px | 2 | 95 | 145 | 60 |
| `integrations.count` | 86 px | 1 (jednoliniowy) | 10 | 10 | 6 |
| `proofPoints.points[].title` | 20 px, 437 px | 1 | 45 | 95 | 40 |
| `proofPoints.points[].body` | 16 px, 360 px | 2 | 95 | 145 | 60 |
| `audiencePaths.paths[].need` | 33 px, 600 px | 2 | 85 | 130 | 60 |
| `audiencePaths.paths[].proofPoints[]` | 16 px, ~630 px | 1 | 85 | 165 | 60 |
| `caseStudy.summary` | 14 px, 426 px (karta w `audiencePaths`) | 3 | 190 | 255 | 120 |
| `caseStudy.metrics[].value` | 68 px, 322 px | 1 (jednoliniowy) | 10 | 10 | 8 |
| `caseStudy.metrics[].label` | 15 px, 322 px | 2 | 85 | 135 | 40 |
| `testimonial.quote` (najwęższe użycie: `QuoteCard`) | 26 px, 358 px | 5 | 145 | 170 | 200 |
| `testimonial.role` + `company` (jedna linia w `QuoteCard`) | 14 px, 306 px | 1 | 45 łącznie | 95 łącznie | role 40 |
| `pricingTeaser.header.title` (`banner`) | 26 px, 554 px | 1 | 50 | 95 | 60 |
| `faq.question` | 20 px, 685 px | 1 | 75 | 145 | 90 |
| `ctaBand.title` | 68 px, 860 px | 2 | 60 | 85 | 60 |
| `ctaBand.reassurance[]` | 14 px, ~340 px (⅓ rzędu) | 1 (jednoliniowy) | 30 (czyt.: krótka fraza) | 50 | 30 |
| `footer.columns[].links[].label` | 14 px, 165 px | 1 | 20 | 45 | 30 |
| `bookingEmbed.title` | h1 68 px, 560 px | 3 | 55 | 75 | 55 |
| `bookingEmbed.intro` | 20 px, 460 px | 3 | 145 | 190 | 120 |
| `bookingEmbed.highlights[]` (najwęższe użycie: wariant `pricing`, numerowane, C50) | 16 px, 518 px | 1 | 65 | 130 | 50 |
| `bookingEmbed.formTitle` | 26 px, 486 px | 1 | 40 | 80 | 40 |
| `bookingEmbed.formIntro` | 16 px, 486 px | 2 | 125 | 190 | 120 |
| `bookingEmbed.reassurance[]` (3 frazy w jednym rzędzie karty, C51) | 13,5 px, rząd 486 px | 1 (jednoliniowy) | łącznie 55 | łącznie 60 (przy równych frazach ~21 na frazę) | 24 |
| `bookingEmbed.agendaTitle` | 26 px, 320 px | 2 | 50 | 75 | 40 |
| `bookingEmbed.agenda[].title` | 20 px, 232 px | 1 | 20 | 45 | 40 |
| `bookingEmbed.agenda[].body` | 15 px, 232 px | 2 | 65 | 95 | 60 |
| `pricingFactor.title` (karta w `pricingTeaser` `section`) | 26 px, 266 px | 2 | 30 (czyt.: ten sam tekst to chip w banerze na HP) | 65 | 30 |
| `pricingFactor.body` | 15 px, 250 px | 2 | 65 | 95 | 80 |
| `framework.name` (`FrameworkCard` we `frameworkList`) | 33 px, 254 px | 1 | 15 | 30 | 20 |
| `frameworkList.moreNote` | 14 px, za chipami `more[]` | 1 | 30 (zasada) | 30 | 30 |
| `linkDirectory.header.title` (`chips`, pas na /pricing) | 20 px, ~570 px obok 4 chipów | 1 (jednoliniowy) | 30 (czyt.: krótkie pytanie) | 60 | 75 |
| `linkDirectory.groups[].links[].label` (`chips`) | 13,5 px, chip | 1 | 30 (czyt.) | 50 | 50 |

**Bez zmian (zasada, nie pomiar):** wszystkie `eyebrow` (etykieta 1–3 słowa: 30/40), `agenda[].duration` (format „12 min”: 8), pola SEO dokumentów (meta title 60 i meta description 160 jako `warning`, wzorzec z szablonów Sanity), liczności list.

**Sprawdzone na /pricing bez zmian (C50):** `SectionHeader.title` (7 kol., `caseStudies`, `faq`), `SectionHeader.intro` (na /pricing pojemność 160/215, ale wiąże najwęższe użycie: `integrations`), `faq.question`, `caseStudy.metrics[]` (karta w siatce szersza niż na HP; wiąże HP), `ctaBand`, `bookingEmbed.reassurance[]`.

**Jeszcze nie zmierzone:** bloki bez makiety hi-fi (/case-studies, `cardGrid`, `comparisonTable`, `articleHeader`, `postGrid`, `linkDirectory` `grouped`, `jobList`) — mierzymy przy ich hi-fi tym samym skryptem. Statystyki w `featureHighlight` (karty o szerokości wg treści) i etykiety chipów/tabów (`audiencePaths.segment`, `audience`) — limit z czytelności do ustalenia na UI.

**Zastrzeżenia.** (1) Tylko desktop 1440; mobile 320 sprawdzić po jego zaprojektowaniu (tam pojemność linii jest mniejsza, więc limity mogą spaść). (2) Po etapie UI (typescale, krój) i po treściach z TOV pomiar powtarzamy. (3) `steps.beforeAfter.*.title` nie jest wyświetlany w hi-fi (etykiety Before/After są stałe) — do decyzji, czy pole zostaje.

---

## 9. Typy stron i dozwolone bloki

| Typ (Sanity) | Strony | Dozwolone bloki | Uwagi |
|---|---|---|---|
| `siteSettings` (singleton) | — | — | `homePage` (ref), G2 rating, domyślne SEO/OG, `announcementBar` |
| `home` (przez `siteSettings.homePage`) | `/` | hero, logoBand, steps, featureGrid, integrations, proofPoints, featureHighlight, audiencePaths, caseStudies, pricingTeaser, faq, ctaBand | **Kolejność na HP (C17):** jak na liście. `pricingTeaser` w wariancie `banner`. 10 sekcji + baner. Uzasadnienie: `claude/comp-ai-homepage-length-research.md` |
| `page` | `/pricing`, `/case-studies`, `/demo`, przyszłe | hero, logoBand, steps, integrations, proofPoints, frameworkList, featureHighlight, audiencePaths, caseStudies, faq, ctaBand, pricingFactors, bookingEmbed, testimonials (C27), pricingTeaser (C29), linkDirectory (C30) · *proponowane:* cardGrid, comparisonTable | **/demo (C21):** `bookingEmbed` (`demo`) · `logoBand` (`logosOnly`) · `testimonials` (`grid`, 3) · `proofPoints` · `integrations` · `faq` · `ctaBand` (7 bloków; `audiencePaths` dozwolony w `page`, ale na /demo nie używany). Nav bez zmian (C18). Linki wychodzące w `proofPoints` i `integrations` na /demo otwierają się w nowej karcie (kod, bez pola w CMS, C26; od C52 zasada dla wszystkich stron konwersji). **/demo/[framework] (C22):** ten sam dokument /demo z podmianami z `framework`, bez osobnych dokumentów `page`. **/pricing (C31):** `bookingEmbed` (`pricing`) · `logoBand` (`logosOnly`) · `pricingTeaser` (`section`, bez przycisków) · `frameworkList` · `caseStudies` (`grid`, 3 krótkie karty, bez wyróżnionej, C32) · `linkDirectory` (`chips`, wąski pas) · `faq` · `ctaBand` (`bookPricing`) (8 bloków, ~4 250 px na 1440 przy realnej treści; dziś ~3 770 px). Nav bez zmian: `primaryCta` „Book a demo” prowadzi na /demo (osobny call, C28). Linki zewnętrzne w sekcjach w nowej karcie (C52). **/case-studies (C36):** `hero` (`centered`, bez media) · `logoBand` (`logosOnly`) · `caseStudies` (`featuredPlusList`, tylko `featured`) · `caseStudies` (`grid`, 9, C37) · `ctaBand` (5 bloków; ~4 300 px w makiecie lo-fi, dziś ~4 520). |
| `productPage` *(założenie)* | `/product/<slug>`? | hero, steps, integrations, featureHighlight, proofPoints, caseStudies, pricingTeaser, faq, ctaBand · *proponowane:* testimonials, cardGrid, comparisonTable | Jeden szablon, różne copy. URL do ustalenia. |
| `caseStudy` | `/case-studies/<slug>` | — (dokument strukturalny) | Istniejące URL zostają. Renderowany jako `articleHeader` (`withStats`) + `richText` + `testimonials` (`single`) + `ctaBand` |
| strony legacy | ~100 stron w kodzie | — | Dostają tylko nowy `navigation` + `footer` |

Globalne singletony `announcementBar`, `navigation` i `footer` renderują się na każdym typie strony (także legacy) poza tablicą `content`, więc nie ma ich na listach dozwolonych bloków.

Każdy dokument strony ma też pola SEO: `title`, `description`, `ogImage`, `slug` (zachowujemy obecne wartości).

---

## 10. Responsywność, dostępność, motion

- **Breakpointy (propozycja do potwierdzenia z Arkiem):** projektuję 1440 i 320. Tablet 768/1024 jako zachowanie pośrednie opisane w paszporcie (np. „grid 4 → 2 → 1”). Breakpointy w kodzie = domyślne Tailwind, chyba że ustalimy inaczej.
- **Kontener i grid:** zmienne `Layout` (§6). Sekcje pełnej szerokości, treść w kontenerze.
- **WCAG 2.1 AA** od wireframe: kontrast tekstu, focus visible, cele dotyku ≥ 44 px na mobile, kolejność nagłówków (R8), alt (R9).
- **Twarde „nie” klienta:** zielony tekst na zielonym, tekst na gradiencie bez kontrastu, tarcze, kłódki, checkmarki, neonowe siatki.
- **Motion (Anton, 22.10–19.11):** w paszporcie tylko informacja, *czy* sekcja ma animację i jaką (wejście, pętla). Zawsze `prefers-reduced-motion`. Animacje nie mogą psuć statycznego renderu.
- **Ilustracje i 3D (Nervy):** `MediaSlot` z proporcjami zdefiniowanymi w paszporcie. Treść na hold do brandu.

---

## 11. SEO i tracking (nie do ruszenia)

- URL, `<title>`, description, structured data (FAQPage i inne obecne), OG image: **jak dziś**.
- Nazwy eventów: **jak dziś**. Lista do spisania z Arkiem z obecnego kodu i wklejenia tutaj (TODO). Event przypisany do `cta.action` w kodzie (R6), nie w CMS.
- Formularze: HubSpot. Booking: RevenueHero. Analityka: PostHog, gtag, CAPI, wewnętrzne narzędzie klienta.
- Nowa sekcja z CTA musi przejść test konwersji end-to-end na preview przed launchem.

---

## 12. Kolejność oddawania do dev (grupy PR dla HP)

Propozycja podziału HP na 3 PR-y, do potwierdzenia z Arkiem:

| PR | Sekcje |
|---|---|
| Foundation | tokeny, `Button`, `SectionHeader`, wrapper sekcji z `tone`, typografia |
| HP-1 „nad zgięciem” | announcementBar, hero, logoBand, steps, integrations |
| HP-2 „produkt i dowody” | featureGrid, proofPoints, featureHighlight |
| HP-3 „decyzja” | audiencePaths, caseStudies, pricingTeaser (`banner`), faq, ctaBand |
| Nav + Footer | navigation, footer |
| Pricing → Customers → Demo | wg §8 + bloki stron |

Grupy PR nie muszą odpowiadać kolejności na stronie (kolejność ustawia CMS). `featureGrid` celowo nie jest w HP-1, bo czeka na D2.


---

## 13. Otwarte decyzje (blokery kontraktu)

| # | Decyzja | Wpływa na | Kto |
|---|---|---|---|
| D1 | Etykieta i typ głównego CTA (Book a demo vs Get started / self-serve) | hero, ctaBand, nav, R6 | Klient (Teresa) |
| D2 | Oficjalna lista i nazwy modułów produktu | navigation, featureGrid, footer, productPage | Klient |
| D3 | Zakres stron (Product overview, About, strony produktowe) | §9, navigation, wariant `featureGrid` | Wiktor + klient |
| D4 | Które claimy security są live | proofPoints | Klient |
| D5 | Odbiorca pierwszy na HP (founder vs security lead) | hero, audiencePaths | Klient |
| D6 | Breakpointy i tablet | §10, wszystkie paszporty | Michał + Arek |
| D7 | Narzędzie eksportu tokenów (Tokens Studio / Style Dictionary / ręcznie) | §6 | Michał + Arek |
| D8 | Lista nazw eventów z obecnego kodu | §11 | Arek |
| ~~D9~~ | ~~Wariant nav dla /demo~~ **Zamknięte 19.10 (C18):** nav bez zmian | navigation | Michał |
| D10 | Kto edytuje treści po stronie klienta | szkolenie Studio | Klient |
| D11 | Cytaty jako osobny dokument `testimonial` czy pole `caseStudy.quote` (nie każdy cytat ma case study) · **Rekomendacja 19.10 (C20): dokument `testimonial`, `caseStudy.testimonial` jako ref.** Do potwierdzenia z Arkiem | testimonials, caseStudies | Michał + Arek |
| D12 | /security ma 9 punktów, a `proofPoints` pozwala na 3–4: podnieść limit czy użyć `cardGrid` | proofPoints, /security | Michał |
| D13 | Czy strony legacy (guides, compare, narzędzia, hub) przechodzą do CMS, czy dostają tylko nav i footer | §8c, §9 | Teresa + Arek |

---

## 14. Changelog

| Data | Wersja | Zmiana | Kto |
|---|---|---|---|
| 16.10.2026 | v0.1 | Pierwsza wersja z sections v0.2, wireframe v01, planu Arka i odpowiedzi Claudia | Michał + Claude |
| 16.10.2026 | v0.2 | **C1** §7 `SectionHeader`: `eyebrow ≤ 30`, `title ≤ 70`, `intro ≤ 180`. *Schemat.* | Michał + Claude |
| 16.10.2026 | v0.2 | **C2** §8 `caseStudies.items[]`: `featuredPlusList` 0–3, `grid` 0–24 (było 0–12; przy 12 sekcja miała 2 761 px na 1440). *Schemat.* | Michał + Claude |
| 16.10.2026 | v0.2 | **C3** §8 `hero.title`: ≤ 55 (było ≤ 70; 70 znaków = 5 linii h1 na 1440 i 375). *Schemat.* | Michał + Claude |
| 16.10.2026 | v0.2 | **C4** Szablon paszportu: pole „Media”. Proporcje: hero 4:3, steps 4:3, featureGrid 16:10, proofPoints 4:5, featureHighlight 4:3. | Michał + Claude |
| 16.10.2026 | v0.2 | **C5** Brakujące limity: `steps.beforeAfter` (40/120), `featureHighlight.stats` (8/40), `integrations.count` (6), `navigation.items[].label` (16), linki w stopce (30). *Schemat.* | Michał + Claude |
| 16.10.2026 | v0.2 | **C6** Nowa sekcja §8b „Dokumenty współdzielone” z polami i limitami. `framework.demoHref` zastępuje opis „link frameworka = strona demo”. *Schemat.* | Michał + Claude |
| 16.10.2026 | v0.2 | **C7** §8 `ctaBand`: domyślny ton `dark`, `light` dozwolony. *Schemat (initialValue).* | Michał + Claude |
| 16.10.2026 | v0.2 | **C8** §7 `Button`: `navigation.primaryCta` jest wyjątkiem od zasady „jeden primary na ekran”. | Michał + Claude |
| 16.10.2026 | v0.2 | **C9** Szablon paszportu: pole „Responsywność” (1440 → 768 → 375), wypełnione dla wszystkich sekcji. G2: maks. liczność narysowana, min. w notatce. | Michał + Claude |
| 16.10.2026 | v0.2 | **C10** §9: `announcementBar`, `navigation`, `footer` to globalne singletony poza `content`. | Michał + Claude |
| 16.10.2026 | v0.3 | **C11** Nowa sekcja §8c: 8 bloków `proponowany` z mapy obecnej strony (`cardGrid`, `comparisonTable`, `testimonials`, `articleHeader`, `postGrid`, `linkDirectory`, `toolEmbed`, `jobList`). *Schemat.* | Michał + Claude |
| 16.10.2026 | v0.3 | **C12** §8b: dokumenty `testimonial` i `job` (proponowane), `post` (istnieje). *Schemat.* | Michał + Claude |
| 16.10.2026 | v0.3 | **C13** §9 `page`: dopuszczone `steps`, `integrations`, `proofPoints`, `audiencePaths`, bo /demo ich dziś używa. `caseStudy` renderowany z bloków §8c. *Schemat.* | Michał + Claude |
| 16.10.2026 | v0.3 | **C14** `caseStudyGrid` usunięty (wystarcza `caseStudies` `grid`). Nowe decyzje D11–D13. | Michał + Claude |
| 16.10.2026 | v0.4 | **C15** `testimonials` **nie trafia na HP** (opcja B): §8c i §18 poprawione, §9 `home` bez zmian. Uwaga: obecna HP ma sekcję „Trusted by teams who ship fast”, więc to świadome ograniczenie, do pokazania klientowi. Rozwiązuje sprzeczność §8c ↔ §9 z audytu v02. | Michał + Claude |
| 16.10.2026 | v0.4 | **C16** §8 `footer`: 5 kolumn, nie 6 (Status to `statusLink`). Zgodne z obecną stopką i wireframe v02. Wireframe v03: karta featured w `caseStudies` z `company`, `summary`, `frameworks[]`; `items[].metric` → `items[].metrics[0]`. | Michał + Claude |
| 19.10.2026 | v0.5 | **C17** HP: 10 sekcji + baner (było 13). Nowa kolejność §9 (`featureGrid` przed `integrations`). `frameworkList` usunięty z `home` (zostaje dla `page`). `pricingTeaser` dostaje wariant `banner` i stoi między `caseStudies` a `faq`. §12 HP-2 bez `frameworkList`. Uzasadnienie (konkurencja 11–16 sekcji, NN/g: 74% uwagi na 2 pierwszych ekranach): `claude/comp-ai-homepage-length-research.md`. Wireframe v04. *Schemat (wariant `banner`).* | Michał + Claude |
| 19.10.2026 | v0.6 | **C18** D9 zamknięte: /demo ma tę samą nawigację co reszta strony. `primaryCta` (`bookDemo`) na /demo przewija do formularza (kod). | Michał + Claude |
| 19.10.2026 | v0.6 | **C19** Nowy paszport 24 `bookingEmbed` (warianty `demo` / `pricing`): pierwszy ekran /demo i /pricing zamiast `hero` (R3). Pola, limity i stałe w kodzie w paszporcie. | Michał + Claude |
| 19.10.2026 | v0.6 | **C20** D11: rekomendacja dokumentu `testimonial` (do potwierdzenia z Arkiem). `caseStudy.quote` + `person` → `caseStudy.testimonial: ref`; `testimonial.caseStudy` usunięte. `testimonials` na /demo: `grid`, 3 cytaty. | Michał + Claude |
| 19.10.2026 | v0.6 | **C21** §9: kolejność bloków /demo (7): bookingEmbed · logoBand · testimonials · proofPoints · integrations · faq · ctaBand. `audiencePaths` nie na /demo. | Michał + Claude |
| 19.10.2026 | v0.6 | **C22** §8b `framework`: `demoTitle?`, `demoIntro?`, `demoFormTitle?`. /demo/[framework] renderuje dokument /demo z tymi podmianami (bez 4 kopii `page`). | Michał + Claude |
| 19.10.2026 | v0.6 | **C25** Paszport 24 `bookingEmbed`: nowe pole `agendaTitle (≤ 40)` w wariancie `demo` (nagłówek agendy, np. „What happens on your 20-minute demo”; pole, a nie stała w kodzie, bo długość demo może się zmienić). Z rewizji copy wersji dla klienta. | Michał + Claude |
| 19.10.2026 | v0.6 | **C26** §9 /demo: linki wychodzące w `proofPoints` i `integrations` otwierają się w nowej karcie, żeby nie wyprowadzać ze strony konwersji. Zachowanie w kodzie, bez pola w CMS. | Michał + Claude |
| 19.10.2026 | v0.6 | **C23** §7: nowy komponent `QuoteCard` (`quote`, `person`, `role`, `company`, `logo?`) dla `testimonials` (`grid` i `single`). Z audytu /demo. | Michał + Claude |
| 19.10.2026 | v0.6 | **C24** §7: `StepCard.meta?` (≤ 12), krótka etykieta obok numeru; w `bookingEmbed` wyświetla `agenda[].duration`. Na HP nieużywane. Z audytu /demo. | Michał + Claude |
| 19.10.2026 | v0.6 | **C27** §9 `page`: `testimonials` przeniesiony z „proponowane” do dozwolonych bloków (ma paszport, komponent `QuoteCard` i jest użyty na /demo). Status paszportu 18 → do designu. Z audytu /demo. | Michał + Claude |
| 19.10.2026 | v0.6 | **C28** Dwa osobne calle: demo i wycena. R6: nowa akcja `bookPricing` (na /pricing przewija do formularza wyceny, gdzie indziej → /pricing#book; event jak dziś). `bookingEmbed`: formularz RevenueHero wybiera kod po wariancie. Nav na /pricing bez zmian (→ /demo). | Michał + Claude |
| 19.10.2026 | v0.6 | **C29** `pricingTeaser` dozwolony w `page` (/pricing, wariant `section`); `primaryCta` i `secondaryCta` opcjonalne; `pricingFactor.body` ≤ 160 (było ≤ 100). `pricingFactors` jako osobny blok niepotrzebny. | Michał + Claude |
| 19.10.2026 | v0.6 | **C30** `linkDirectory` (`chips`) dozwolony w `page` dla linków do porównań na /pricing; status do designu. | Michał + Claude |
| 19.10.2026 | v0.6 | **C31** §9: kolejność 8 bloków /pricing. | Michał + Claude |
| 19.10.2026 | v0.6 | **C32** §9 /pricing: `caseStudies` w wariancie `grid` z 3 kartami (było `featuredPlusList`), żeby skrócić stronę o ~550 px; `linkDirectory` jako wąski pas (odstępy na hi-fi). | Michał + Claude |
| 19.10.2026 | v0.6 | **C33** `frameworkList`: nowe pole `moreNote?` (≤ 30), zwykły tekst za chipami (np. „and more on request”) zamiast chipa „+ more”, który wyglądał jak przycisk. Z rewizji copy /pricing. | Michał + Claude |
| 19.10.2026 | v0.6 | **C34** `hero`: wariant `centered` zatwierdzony (bez media); `media` opcjonalne w `centered`, wymagane w `default`. Z /case-studies. | Michał + Claude |
| 19.10.2026 | v0.6 | **C35** `StoryCard` `compact` pokazuje etykiety `frameworks[]` (HP, /pricing, /case-studies). | Michał + Claude |
| 19.10.2026 | v0.6 | **C36** §9 /case-studies: 5 bloków, dwa bloki `caseStudies` (wyróżniona + siatka 10); filtr po frameworku odłożony do > ~15 historii. | Michał + Claude |
| 19.10.2026 | v0.6 | **C37** §9 /case-studies: siatka ma 9 historii (3 równe rzędy) zamiast 10; dziesiąta (docdocjob) tylko na swojej podstronie. Z rewizji copy. | Michał + Claude |
| 19.10.2026 | v0.7 | **C38** §7: `ComparePanel`, `SlackThread`, `PricingBanner` to komponenty renderujące istniejące pola (`steps.beforeAfter`, `featureHighlight.media` jako `uiSnippet`, `pricingTeaser` w wariancie `banner`), nie nowe typy bloków ani pola w CMS. W Figmie zostają jako `_Client/*` do przeniesienia do biblioteki dev na hi-fi. Z audytu desktop. | Michał + Claude |
| 19.10.2026 | v0.7 | **C39** Konwencja copy: długość calla zawsze „20-minute call” (w `reassurance[]` `bookingEmbed` i `ctaBand`, w tekstach o wycenie). Nagłówki mogą mówić „20 minutes away” / „20-minute demo”. Usunięte „20-min call”. Z audytu desktop. | Michał + Claude |
| 19.10.2026 | v0.8 | **C40** §6: skala typograficzna 1,272 (baza 16, zaokrąglona). `Type/Desktop/*`: display 88→86, h1 56→53, h2 40→42, body-lg 19→20, eyebrow 12→13 (h3, body, caption bez zmian). HTML (dev i klient): każdy rozmiar przyciągnięty do najbliższego stopnia; adnotacje, instrukcje i mobile bez zmian. Kopie sprzed zmiany: `web/wireframes/*/_archive/pre-typescale-1272/`. | Michał + Claude |
| 19.10.2026 | v0.9 | **C41** `logoBand` na `home`: `logosOnly` (było `withStats`). Liczby powtarzały hero (G2, „days”) i tytuł pasa („1,000+”); „< 3 min” przeniesione do `featureHighlight.stats`. Z rewizji tekstów. | Michał + Claude |
| 19.10.2026 | v0.9 | **C42** §7: karty z `href` (`FeatureCard`, `StoryCard` `compact`, `FrameworkCard`) klikalne w całości, ze strzałką; bez etykiet „Learn more” / „Read the story” / „See a demo”. Z rewizji tekstów. | Michał + Claude |
| 19.10.2026 | v0.9 | **C43** Krótsze limity (R10): `SectionHeader.intro`, `hero.intro`, `bookingEmbed.intro` 180 → 120 · `steps.body`, `beforeAfter.*.body` 120 → 60 · `productModule.summary` 100 → 60 · `proofPoints.points[].body` 140 → 60 · `audiencePaths.need` 80 → 60 · `bookingEmbed.agenda[].body` 140 → 60 · `pricingFactor.body` 160 → 80. `caseStudy.summary` bez zmian (120). Placeholdery w wireframe dev skrócone. Z rewizji tekstów (makiety klienta v02: −11 do −22% słów). | Michał + Claude |
| 19.10.2026 | v0.9 | **C44** §6: Inter jako jedyny krój w wireframe’ach (HTML i Figma, także adnotacje) do odwołania. | Michał + Claude |
| 21.10.2026 | v0.10 | **C45** Paszport 24 `bookingEmbed`: nowe pole `badges[]: ref framework (≤ 4)`, renderowane tym samym `Chip` co `hero.badges`. Z audytu /demo hi-fi v01. *Schemat.* | Michał + Claude |
| 21.10.2026 | v0.10 | **C46** `QuoteCard` / `testimonial`: `photo?: image` (+ `alt`, 1:1), edytowalne w CMS; bez zdjęcia inicjały z `person` (stała w kodzie). Z audytu /demo. *Schemat.* | Michał + Claude |
| 21.10.2026 | v0.10 | **C47** §6: hi-fi w Lausanne (C44 dotyczy już tylko lo-fi i Figmy do instalacji fontu); rozmiary tekstu w hi-fi spójne z HP v08; finalny krój i typescale na etapie UI. | Michał |
| 21.10.2026 | v0.10 | **C48** §3: lista tematów odłożonych do etapu UI (ikony, typy przycisków, dwukolorowe tytuły, krój i typescale, dostępność). Z audytu /demo. | Michał |
| 21.10.2026 | v0.11 | **C49** R10 i nowa §8e: limity znaków liczone z pojemności komponentów w hi-fi (HP v08, /demo v01, 1440), nie z lo-fi; dwa poziomy walidacji: zalecany (`warning`) i maksymalny (`error`), zgodnie z konwencją Sanity (długość = `warning`, błąd tylko gdy psuje układ). Liczby w paszportach do synchronizacji przy handoffie dla dev. Oznaczenie „*Schemat*” w changelogu zastępuje „*Schemat Arka*” (brak wytycznych dev na tym etapie). | Michał + Claude |
| 21.10.2026 | v0.12 | **C50** /pricing hi-fi v01 (8 bloków wg C31). `bookingEmbed` `pricing`: układ jak /demo bez agendy, `highlights[]` numerowane (stała w kodzie), kroki formularza wyceny jak w /demo do potwierdzenia z klientem. `pricingTeaser` `section`: 4 karty w jednym pasie z „+” między nimi (stała w kodzie), bez przycisków (C29). `frameworkList`: `FrameworkCard` = `name` + strzałka (C42), bez ikony; `more[]` jako chipy bez linków + `moreNote`. `caseStudies` `grid`: 3 karty `StoryCard` `compact` jak na HP. `linkDirectory` `chips`: tytuł i chipy w jednym pasie, chipy ze strzałką, ta sama karta. §8e: nowe pola zmierzone (`pricingFactor`, `framework.name`, `moreNote`, `linkDirectory`), `bookingEmbed.highlights[]` 70/135 → 65/130. | Michał + Claude |
| 21.10.2026 | v0.12 | **C51** Z audytu architektury /pricing (`claude/comp-ai-architecture-audit-pricing-2026-10-21.md`). (1) §7 `StoryCard` `compact` bez `summary` (HP, /pricing; `/case-studies` do decyzji przy hi-fi); lo-fi HP v06 i /pricing v04 poprawione. (2) §8e `bookingEmbed.reassurance[]`: limit łączny rzędu 55 / 60 zamiast 19 na frazę (pomiar: rząd mieści 3 × ~21 znaków; dzisiejsze „20-minute call · Pick your own time · Money-back guarantee” = 52); w schemacie walidacja na tablicy (custom rule). Lo-fi /demo v03 i /pricing v04. (3) Stałe w kodzie na /pricing: etykieta „Also quoted” przed chipami `frameworkList.more[]` i numery 01–04 kart `pricingTeaser` `section`. (4) Na /pricing `navigation.primaryCta` → /demo (C28) poprawione w hi-fi v01. | Michał + Claude |
| 21.10.2026 | v0.12 | **C52** C26 rozszerzone: na stronach konwersji (/demo, /demo/[framework], /pricing) linki **zewnętrzne** w sekcjach (poza domenę trycomp.ai, np. GitHub, Trust Center, docs) otwierają się w nowej karcie, żeby nie zamykać formularza. Linki wewnętrzne (porównania, historie, /demo/[framework]) w tej samej karcie (C30). Nav i stopka bez zmian (globalne). Zachowanie w kodzie na podstawie typu strony i domeny linku, bez pola w CMS. Mapa obecnej strony: v02. | Michał |
| 21.10.2026 | v0.13 | **C53** Mobile projektujemy na **320 px** (zamiast 375) we wszystkich makietach, paszportach i bramkach (§3 G3/G5, §8 „Responsywność”, §8e, §10). Desktop bez zmian (1440). Makiety lo-fi dla dev (HP v07 i inne) mają jeszcze widok 375 jako wcześniejsze założenie; przy kolejnej wersji → 320. Limity §8e do ponownego pomiaru na 320. | Michał |

---

## 15. Narzędzia (z GitHuba sanity-io)

| Narzędzie | Co daje | Kto i kiedy |
|---|---|---|
| [`agent-toolkit`](https://github.com/sanity-io/agent-toolkit): skille `sanity-best-practices` (m.in. przewodniki `page-builder`, `schema`, `visual-editing`, `typegen`, `migration`, `seo`) i `content-modeling-best-practices` | Oficjalne reguły Sanity w formie, którą agent czyta przed pisaniem schematów | Arek w Claude Code: `/plugin install sanity@claude-plugins-official` (MCP + skille + `/sanity-review`, `/typegen`, `/deploy-schema`) albo `npx skills add sanity-io/agent-toolkit` |
| Sanity MCP (`https://mcp.sanity.io`) | Agent widzi schemat i treść projektu (`query_documents`, `deploy_schema`, `create_release`…) | **G4:** porównanie wdrożonego schematu z paszportami z §8 (nazwy pól, walidacje, dozwolone bloki). Dostęp tylko do datasetu **staging**. |
| [`next-sanity`](https://github.com/sanity-io/next-sanity) + [`visual-editing`](https://github.com/sanity-io/visual-editing) | `defineLive`, draft mode, Presentation, overlaye click-to-edit, drag & drop sekcji | Arek, faza Sanity. Kryterium G5 („Visual Editing działa”). |
| `seo-aeo-best-practices` (agent-toolkit) | Structured data (JSON-LD), techniczne SEO | Weryfikacja §11 przed launchem |
| `content-experimentation-best-practices` (agent-toolkit) | Metodyka A/B | Gdyby klient chciał mierzyć nowy HP (eksperyment PostHog na dziś kończą) |

Repo `sanity-io/ui` to design system samego Studio, więc nie dotyczy designu strony.

---

## 16. Źródła

**Projekt**
- Plan wdrożenia Arka, 12.10, i odpowiedzi Claudia, 16.10 (#p_comp-ai, wątek „implementation process”)
- Flow Goszcza, 06.10 (#p_comp-ai_int)
- `web/architecture/comp-ai-sitemap-current-v03.html` (mapa trycomp.ai, 16.10; /pricing zweryfikowane 21.10; v01 w `_archive/`)
- `web/architecture/comp-ai-homepage-sections-v0-2.html`, `web/tests/_archive/comp-ai-homepage-wireframe-v01.html`, `web/wireframes/dev/_archive/comp-ai-homepage-wireframe-v02.html` (audyt G2, 16.10), `web/wireframes/dev/_archive/comp-ai-homepage-wireframe-v03.html`, `web/wireframes/dev/comp-ai-homepage-wireframe-v04.html` (aktualny, zgodny z v0.5)
- Onboarding web design (projekt Claude), notatki robocze z 14–16.10

**Dobre praktyki**
- Sanity: [How to use structured content for page building](https://www.sanity.io/docs/developer-guides/how-to-use-structured-content-for-page-building)
- Sanity Learn: [Build landing pages with Next.js](https://www.sanity.io/learn/course/page-building) (schematy bloków, insert menu z miniaturami, PageBuilder, drag & drop, pułapki skalowania)
- Sanity: [Visual Editing with Next.js App Router](https://www.sanity.io/docs/nextjs/visual-editing-with-next-js-app-router)
- Sanity: [TypeGen](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen) · [next-sanity](https://npmjs.com/package/next-sanity)
- Sanity agent toolkit: [Content modeling best practices](https://tessl.io/registry/skills/github/sanity-io/agent-toolkit/content-modeling-best-practices)
- W3C DTCG: [Design Tokens Format Module 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/)
- Tailwind v4: [Theme variables (`@theme`)](https://tailwindcss.com/docs/theme)
- DESIGN.md (konwencja dla agentów AI): [przegląd](https://ossinsight.io/blog/design-md-protocol-2026)
