COMP AI / skills / comp-ai-section-contract
==========================================

Pliki wielokrotnego użytku (input dla Claude) do budowania strony Comp AI
z sekcji: sitemap -> wireframe -> design (Figma) -> Sanity -> kod.
Kopie są też w projekcie Claude „Comp AI” (folder claude/).


1. comp-ai-section-contract-spec.md
   Kontrakt sekcji, czyli źródło prawdy.
   - paszport każdej sekcji: pola Sanity, limity znaków, tone, warianty,
     komponenty, status i blokery (§8)
   - reguły modelowania R1–R15, nazewnictwo, tokeny, typy stron
   - bramki jakości G1–G5, kolejność PR-ów, otwarte decyzje
   Kiedy: przed każdą nową sekcją albo zmianą pola. Zmiany wpisuj do changelogu (§14).

2. comp-ai-figma-wireframe-check-prompt.md
   Prompt dla Claude z Figma MCP. Skopiuj blok PROMPT i wybierz tryb:
   - GENERUJ: buduje lo-fi ramki sekcji z kontraktu
   - AUDYT:   sprawdza Figmę z kontraktem (tabela niezgodności)
   - SYNC:    porównuje Figmę i kontrakt w obie strony po zmianach
   - SCHEMA:  (opcjonalnie, Sanity MCP) porównuje schemat na stagingu z kontraktem
   Kiedy: po wireframe sekcji (G2), przed oddaniem grupy do Arka (G3),
   po feedbacku klienta.


Jak zacząć nową makietę (np. w czacie Sitemap)
----------------------------------------------
Napisz do Claude: „Przeczytaj skills/comp-ai-section-contract/comp-ai-section-contract-spec.md
i skills/comp-ai-section-contract/comp-ai-figma-wireframe-check-prompt.md, użyj trybu GENERUJ
dla strony home, a na koniec zrób AUDYT”.


Zasady
------
- Kontrakt jest ważniejszy od Figmy. Najpierw zmiana w kontrakcie, potem w designie.
- Po zmianie pliku zaktualizuj też kopię w projekcie Claude.
- Nowa wersja: zostaw tę samą nazwę i podbij numer wersji w nagłówku pliku.
  Stare wersje trafiają do skills/comp-ai-section-contract/_archive/.

Ostatnia aktualizacja: 16.10.2026 (v0.1), Michał Pac
