*** Settings ***
Library           Browser
Suite Setup       New Browser    chromium    headless=${True}
Test Setup        Open Reference App
Test Teardown     Close Context

*** Test Cases ***
Tallennettu viite säilyy sivun päivityksen jälkeen
    Fill Reference    Aino Esimerkki    Ohjelmistotuotannon perusteet    2024
    Click    css=#reference-form button[type="submit"]
    Get Text    css=#reference-list li    ==    Aino Esimerkki. (2024). Ohjelmistotuotannon perusteet.
    Reload
    Get Text    css=#reference-list li    ==    Aino Esimerkki. (2024). Ohjelmistotuotannon perusteet.

Lomakkeen tyhjennys palauttaa oletusarvot
    Fill Reference    Aino Esimerkki    Ohjelmistotuotannon perusteet    2024
    Click    css=#reference-form button[type="reset"]
    Get Property    css=#author    value    ==    ${EMPTY}
    Get Property    css=#title    value    ==    ${EMPTY}
    Get Property    css=#year    value    ==    2000
    Get Element Count    css=#reference-list li    ==    0

Samaa viitettä ei voi tallentaa kahdesti
    Fill Reference    Aino Esimerkki    Ohjelmistotuotannon perusteet    2024
    Click    css=#reference-form button[type="submit"]
    Fill Reference    Aino Esimerkki    Ohjelmistotuotannon perusteet    2024
    Click    css=#reference-form button[type="submit"]
    Get Text    css=#message    *=    viite on jo tallennettu
    Get Element Count    css=#reference-list li    ==    1

Puuttuva tekijä estää tallentamisen
    Fill Reference    ${EMPTY}    Ohjelmistotuotannon perusteet    2024
    Click    css=#reference-form button[type="submit"]
    Get Element Count    css=#reference-list li    ==    0
    Get Element Count    css=#author:invalid    ==    1

*** Keywords ***
Open Reference App
    New Context
    New Page    ${APP_URL}

Fill Reference
    [Arguments]    ${author}    ${title}    ${year}
    Fill Text    css=#author    ${author}
    Fill Text    css=#title    ${title}
    Fill Text    css=#year    ${year}
