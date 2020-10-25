Backend API server for the trading app
======================================

To run the project
======================
`npm start`



Krav 1 Backend
==============

För att skapa databasen och de olika tabellerna har jag som vi gjort tidigare i kursen använt mig av sqlite. Jag har två olika filer migrate.sql för att skapa databasen med tabellerna och items.sql lägger till de olika objekten och en test användare i databasen. Sedan med hjälp av trading.sqlite läser vi in de två filerna.

I app.js inkluderar jag de olika routes som jag använder. Jag använder Cors för att tillåta cross-domain communication från webbläsaren sedan använder jag bodyParser som middleware och parserjson.

Servern har två olika mappar, modules och routes. Filerna i routes mappen sköter allt med routerna och kollar om ett token existerar, när en användare blir autentiserad, hämtas email adressen från de skickade token och sparas i req.user.email som vi sen använder i andra moduler.

När en ny användrare registerar sig så kopplas det direkt en depå till den användaren. Depån går att nå via routen depots/view, där får vi email, saldo och de objekt som är kopplade till kontot.

Krav 3 Realtid
===================
Är det kravet som tog mest tid för att implementera, jag valde att integrera min micro-service i min Backend. För att skapa den använde jag mig av paketet Socket-io. Jag ville att webbplatsen ska se så realistisk ut so möjligt, därför valde jag att ha Samsung, Apple och Nasdaq aktier som objekt man kan handla och sälja. För att slumpa fram ett värde för aktierna använde jag mig av math.floor(math.random) på detta sättet Math.floor(Math.random() * (yValue.max - yValue.min + 1)) + yValue.min. där min och maxvärde sätts när objektet skapas. Jag har också använt mig en timer interval som jag satt till 5 sekunder så att värdet uppdateras varje fem skeunder. När det nya värdet skapas så sparas det i ett objekt där y = det nya värdet och x är tiden den skapades. Socket.io skickar sedan en array med objekten till frontenden.
