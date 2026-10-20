---
name: project-handoff
description: Zapisuje stan pracy nad wybranym projektem w dokumencie handoff i pozwala szybko wrócić do pracy po przerwie (weekend, urlop, zmiana osoby). Użyj, gdy ktoś mówi „zapisz stan”, „zaktualizuj handoff”, „kończę na dziś/tydzień”, „wracam do projektu”, „co się zmieniło od piątku”.
---

# Project handoff: zapisz stan i wróć do pracy

Formuła ma trzy tryby: **ZAPISZ** (pierwszy raz), **ZAKTUALIZUJ** (koniec kolejnej sesji) i **WZNÓW** (start po przerwie).
Działa dla dowolnego projektu. Nazwa projektu to `<projekt>` (slug, np. `comp-ai`).

## Gdzie leży stan

1. **Projekt Claude** (główne miejsce): `claude/<projekt>-handoff-status.md`. Widzi go każda sesja w tym projekcie.
2. **Opcjonalnie lokalny folder projektu**, jeśli jest podłączony. Kopię zapisz tam, gdzie folder trzyma notatki o projekcie (np. `brief/`), zgodnie z jego zasadami struktury.
Brak projektu Claude i folderu: zapisz plik w outputs sesji i powiedz, że trzeba go załączyć przy powrocie.

## Szablon dokumentu

```
# <Projekt>: stan pracy i handoff (aktualizacja: <dzień tyg. DD.MM.RRRR, pora>)

Czytaj ten plik na start każdej sesji. Na koniec sesji: „zaktualizuj handoff”.

## Stan
**Źródła prawdy:** pliki, wersje, pełne ścieżki; linki i ID węzłów (Figma, Notion, ClickUp…).
**Zrobione w ostatniej sesji:** 3–6 punktów, każdy z efektem (plik, wersja, decyzja).

## Decyzje (z datą i źródłem)
- DD.MM: decyzja · kto zdecydował · gdzie zapisana

## Do powiedzenia klientowi / zespołowi
- rzeczy, które ktoś musi usłyszeć, zanim zauważy je sam

## Otwarte decyzje i blokery
- co · kto odpowiada · na czym blokuje

## Następne kroki
1. … (konkretne, w kolejności, z plikiem lub miejscem docelowym)

## Terminy
- najbliższe daty z projektu

## Historia (maks. 5 ostatnich wpisów, najnowszy na górze)
- DD.MM: jedno zdanie o sesji
```

## Tryb ZAPISZ (pierwszy raz)

1. Ustal projekt: podłączony projekt Claude, folder lokalny albo nazwa podana przez użytkownika. Gdy niejasne, zapytaj jednym pytaniem.
2. Zbierz fakty z tej rozmowy i ze źródeł projektu: aktualne pliki i ich wersje, decyzje, otwarte kwestie, terminy. Przeczytaj istniejące dokumenty projektu (brief, notatki, spec), zamiast zgadywać.
3. Wypełnij szablon. Każdy plik z pełną ścieżką, każdy element w narzędziu z linkiem albo ID.
4. Zapisz w projekcie Claude (`project_write`), opcjonalnie kopię lokalnie.
5. Daj użytkownikowi prompt startowy z sekcji „Prompt na powrót” poniżej, z wpisaną nazwą projektu.

## Tryb ZAKTUALIZUJ (koniec sesji)

1. Przeczytaj obecny dokument handoff (`project_read`), nie pisz go od zera.
2. Ustal, co zmieniło się w tej sesji:
   - z rozmowy: decyzje, wykonane zadania, nowe blokery,
   - z plików: w podłączonym folderze znajdź pliki zmienione od daty ostatniej aktualizacji (np. `find . -newermt "<data>" -type f -not -path '*/.git/*'`),
   - z narzędzi, jeśli były używane w sesji (Figma, Slack, ClickUp): tylko to, co faktycznie sprawdzono.
3. Zaktualizuj:
   - nadpisz **Stan** i **Następne kroki**,
   - dopisz nowe **Decyzje** (stare zostają),
   - zamknięte pozycje usuń z **Otwartych decyzji** i przenieś do Decyzji,
   - dodaj wpis na górze **Historii**, usuń najstarszy ponad 5.
4. Zmień datę w nagłówku. Zapisz pełny plik pod tą samą ścieżką.
5. W odpowiedzi pokaż tylko różnice: 3–5 linijek „co się zmieniło w handoffie”.

## Tryb WZNÓW (start po przerwie)

1. Przeczytaj dokument handoff. Zanotuj datę ostatniej aktualizacji.
2. Sprawdź, co zmieniło się od tej daty, tylko w dostępnych źródłach:
   - kanały i wątki komunikacji projektu (Slack, mail): feedback, decyzje, pytania do użytkownika,
   - pliki w folderze zmienione po dacie handoffu (mogły być edytowane ręcznie),
   - zadania i terminy (ClickUp, kalendarz), jeśli są podłączone.
   Źródła niedostępne wypisz jednym zdaniem, zamiast je pomijać po cichu.
3. Odpowiedz w tej kolejności:
   - **Co się zmieniło** (maks. 5 punktów, każdy ze źródłem),
   - **Co to zmienia** w planie, plikach albo decyzjach,
   - **Plan dnia**: „Następne kroki” z handoffu, przestawione według nowości,
   - jedno pytanie, jeśli coś blokuje start.
4. Nie zmieniaj plików ani handoffu w tym trybie, dopóki użytkownik nie zatwierdzi planu.

## Zasady

- Tylko fakty, które da się wskazać (plik, wiadomość, decyzja). Przypuszczenia oznacz jako „do potwierdzenia”.
- Krótko. Dokument ma się czytać w 2 minuty.
- Pełne ścieżki i ID, bo następna sesja nie pamięta tej rozmowy.
- Bez haseł, tokenów i danych osobowych spoza projektu.
- Język dokumentu taki jak język projektu i użytkownika.
- Jeśli w projekcie są inne dokumenty-źródła prawdy (spec, kontrakt, brief), handoff do nich linkuje, a nie powiela ich treść.

## Prompt na powrót

```
Wracam do <projekt>. Tryb WZNÓW z project-handoff: przeczytaj
claude/<projekt>-handoff-status.md, sprawdź nowości od daty aktualizacji
(<kanały/narzędzia>), napisz w 5 punktach, co się zmieniło i co to zmienia,
potem zaproponuj plan dnia.
```

## Prompt na koniec sesji

```
Zaktualizuj handoff (<projekt>).
```
