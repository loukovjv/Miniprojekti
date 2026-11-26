# Miniprojekti
Linkki backlogiin:
https://docs.google.com/spreadsheets/d/1WayfNkpoHvOcAOdy8c5m09TdD7xJp7ZiMURIZMBVYho/edit?gid=0#gid=0

Linkki CI-palveluun:
[![CI](https://github.com/loukovjv/Miniprojekti/actions/workflows/main.yml/badge.svg)](https://github.com/loukovjv/Miniprojekti/actions/workflows/main.yml)

Linkki sivustolle:
https://users.jyu.fi/~loukovjv/miniprojekti/index.html

Linkki lisenssiin:
[MIT-lisenssi](LICENSE)

# Definition of Done							
User Story voidaan merkitä valmiiksi, kun seuraavat ehdot täyttyvät:							
							
- User Storylle on määritelty selkeät hyväksymiskriteerit.							
- Kaikki hyväksymiskriteerit täyttyvät.							
- Sprintistä 2 alkaen hyväksymiskriteerit on dokumentoitu Robot Frameworkin syntaksilla ja toteutettu automaattisiksi testeiksi.							
- Toteutetulle sovelluslogiikalle on kirjoitettu tarkoituksenmukaiset automaattiset testit.							
- Kaikki automaattiset testit menevät läpi.							
- GitHub Actionsin CI-tarkistukset onnistuvat.							
- JavaScript-koodi noudattaa ryhmän sopimia ESLint-sääntöjä.							
- Koodi on selkeästi nimetty ja noudattaa sovittua arkkitehtuuria.							
- Vähintään yksi toinen ryhmäläinen on katselmoinut toteutuksen.							
- Muutokset on yhdistetty projektin päähaaraan.							
- Ohjelmisto toimii muutosten jälkeen ja toiminnallisuus voidaan esitellä asiakkaalle.							
- Dokumentaatio on päivitetty tarvittaessa.							

## Hyväksymistestit

Robot Frameworkin selaintestit ovat kansiossa `tests/acceptance`. Niiden ajoskripti käynnistää paikallisen palvelimen ja sulkee sen ajon päättyessä.

Asenna Python 3.10 tai uudempi ja aja projektikansiossa PowerShellillä:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r tests\acceptance\requirements.txt
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location).Path ".playwright"
.\.venv\Scripts\rfbrowser.exe install chromium
```

Aja testit:

```powershell
.\.venv\Scripts\python.exe tests\acceptance\run.py
```

Tarkempi raportti on tiedostossa `robot-results/log.html`. JavaScriptin yksikkötestit ajetaan edelleen komennolla `npm test`.
