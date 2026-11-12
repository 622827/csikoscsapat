---
name: remd
description: A repó CLAUDE.md fájljának frissítése. Használat - /remd csikoscsapat (a repó neve). Végignézi, mi változott az utolsó CLAUDE.md-módosítás óta, kijavítja az elavult sorokat, felveszi az új buktatókat, és feltölti a main-re.
argument-hint: "<repó neve, pl. csikoscsapat>"
---

# /remd – a CLAUDE.md frissítése

Cél: a repó gyökerében lévő `CLAUDE.md` legyen **rövid és igaz**. Csak azt tartalmazza, amit a kódból nem lehet kiolvasni (buktatók, nem nyilvánvaló szabályok).

## Menet
1. **Melyik repó?** Az argumentum a repó neve. Ha nincs megadva, vagy ez a repó, akkor az aktuális munkakönyvtár repója. Ha másik repót neveztek meg, és az nincs a munkamenetben, mondd meg, hogy előbb csatolni kell, ne találgass.
2. **Mi változott?** Keresd meg a `CLAUDE.md` utolsó módosító commitját (`git log -1 --format=%H -- CLAUDE.md`), majd nézd meg az azóta történteket (`git log <sha>..HEAD --stat`). Csak a releváns fájlokat olvasd el, ne az egész repót.
3. **Ellenőrizd a meglévő sorokat.** Minden állítást vess össze a kóddal (`grep`), és ami már nem igaz, javítsd vagy töröld. Elavult sor rosszabb, mint a hiány.
4. **Vedd fel az újat**, de csak ha a kódból nem olvasható ki, és hibát okozna, ha az ügynök nem tudná: új gyorsítótár-szokás, új adatforrás vagy lap, átnevezett dolog, eltérő név-szabály, kézi lépés (pl. Apps Script telepítés), új függőség egy oldalpár között.
5. **Írd át a fájlt.** A régi helyére írj, ne bővíts: ha egy szabály módosult, cseréld a sort. Maximum kb. 60 sor. Magyarul írj, tömören.
6. **Tilos a fájlba tenni:** jelszót, tokent, kulcsot, bankszámlaszámot, munkatársak teljesítmény- vagy személyes adatát. Ha ilyet látsz a fájlban, vedd ki.
7. **Töltsd fel** a `main`-re (a tulajdonos közvetlen pusht kér, PR nem kell): rövid, magyar commit-üzenettel.
8. **Jelentés:** 3–5 sorban mondd meg, mit javítottál, mit vettél fel, mit töröltél. Ha nem volt mit változtatni, mondd ki, hogy a fájl naprakész, és ne írj át semmit.
