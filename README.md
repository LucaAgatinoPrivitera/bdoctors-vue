# BDoctors (Front-office) #
Il progetto prevedeva di realizzare un sito web gestionale per strutture mediche private.

## Home ##
L'utente trova la lista di tutti i dottori che sono sponsorizzati.
I dati contengono: Immagine di profilo, nome e cognome, indirizzo, numero di telefono, bio, lista specializzazioni, e voto medio del dottore dato dagli utenti sotto forma di stelle.
I dottori che hanno la sponsorizzazione hanno un badge nella card.

## Filtrare per specializzazioni ##
Dalla home è possibile filtrare per specializzazioni. Al click l'utente verrà mandato su un'altra pagina nella quale saranno presenti tutti i dottori che hanno quella specializzazione.
I dottori sponsorizzati vengono mostrati come primi.
L'utente può vedere chi è sponsorizzato grazie a un badge nella card.

## Visualizza profilo ##
Verranno mostrati all'utente i relativi dati del dottore, ovvero: Nome e cognome, immagine, indirizzo, numero di telefono, bio, le specializzazioni e le recensioni che ha ricevuto. Inoltre saranno presenti i pulsanti per mandare un messaggio al dottore e per creare una recensione.

# Progettazione #
Il sito è stato realizzato utilizzando Vue.js.
Il sito si aggancia alle API realizzate nella parte di Back-office.
I form presenti nella part di Front-office sono validati.
Per la visualizzazione del profilo è stato utilizzato una slug, al posto dell'id.
