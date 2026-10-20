PROJECT HANDOFF
===============

Uniwersalna formuła do zapisywania stanu pracy nad projektem i szybkiego
powrotu po przerwie (weekend, urlop, przekazanie innej osobie).
Działa w każdym projekcie Claude. Plik formuły: project-handoff.md


Trzy tryby
----------
ZAPISZ        Pierwszy raz. Tworzy dokument claude/<projekt>-handoff-status.md
              w projekcie Claude: źródła prawdy, decyzje, blokery, kolejne kroki.
ZAKTUALIZUJ   Koniec sesji. Czyta istniejący dokument i nadpisuje tylko to,
              co się zmieniło (stan, kroki, decyzje, historia).
WZNÓW         Start po przerwie. Czyta handoff, sprawdza nowości od daty
              aktualizacji (Slack, pliki, zadania) i proponuje plan dnia.
              Niczego nie zmienia bez zgody.


Jak użyć
--------
Koniec dnia/tygodnia:
  „Zaktualizuj handoff (comp-ai).”

Poniedziałek:
  „Wracam do comp-ai. Tryb WZNÓW z project-handoff: przeczytaj
  claude/comp-ai-handoff-status.md, sprawdź nowości od daty aktualizacji
  (Slack #p_comp-ai, #p_comp-ai_int), napisz w 5 punktach, co się zmieniło
  i co to zmienia, potem zaproponuj plan dnia.”

Nowy projekt:
  „Przeczytaj skills/project-handoff/project-handoff.md i zrób tryb ZAPISZ
  dla projektu <nazwa>.”


Wskazówki
---------
- Jeśli coś zmieniasz ręcznie (Figma, pliki), powiedz to w pierwszym
  zdaniu sesji albo przed aktualizacją handoffu.
- Dokument ma się czytać w 2 minuty. Szczegóły zostają w specach i briefach,
  handoff tylko do nich linkuje.
- Plik na dysku to wzorzec. Żeby Claude używał go sam, bez wskazywania
  ścieżki, zapisz go jako skill w Claude (karta „Save skill”).

Ostatnia aktualizacja: 16.10.2026 (v0.1), Michał Pac
