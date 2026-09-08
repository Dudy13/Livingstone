# Séquence Brevo : les six emails, prêts à coller

Ce document est la version opérationnelle de `sequence-emails-cession.md`. Les
placeholders y sont remplacés par la syntaxe Brevo et par les vraies URL du site :
rien ne reste à compléter, tout se copie tel quel.

L'ordre de montage est le suivant :

1. créer les six modèles d'email (Campagnes → Modèles) ;
2. créer l'automatisation qui les enchaîne (Automatisations) ;
3. l'activer.

---

## Avant de commencer : trois réglages qui valent pour les six emails

**Expéditeur.** `Mikael Guéviguian`, adresse nominative authentifiée sur le
domaine : `mikael.gueviguian@livingstone-wealth.com`. Jamais `contact@`, jamais
une adresse Gmail : le domaine est authentifié depuis la mise en route, une
adresse hors domaine repart en indésirables.

**Format.** Éditeur de texte enrichi, pas l'éditeur glisser-déposer. Ces emails
doivent ressembler à un message écrit par un conseiller, pas à une newsletter.
Pas de bandeau graphique, pas de bouton coloré, pas de colonnes.

**Pied de page.** La signature légale ci-dessous se met **une seule fois**, dans
le pied de page du modèle, pas dans le corps de chaque email. C'est le seul moyen
de garantir qu'aucun envoi ne parte sans elle. Le lien de désinscription vient
**en plus** : il relève du RGPD, la signature ORIAS ne le remplace pas, et Brevo
le place automatiquement tant que le bloc de pied de page n'est pas supprimé.

> LIVINGSTONE – SARL au capital social de 500 € - n° 951 716 349 au RCS de Paris – code APE 6619B – 49 rue de Courcelles 75008 Paris – 01 86 27 00 93 – mikael.gueviguian@livingstone-wealth.com – www.livingstone-wealth.com. Enregistré à l'ORIAS sous le n° 23007478 (www.orias.fr) en qualité de : Conseiller en investissement financier adhérent de LA COMPAGNIE CIF, association agréée auprès de l'Autorité des Marchés Financiers ; Intermédiaire en assurance en qualité de courtier adhérent de LA CNCEF, association agréée auprès de l'ACPR ; Assurance auprès d'Assurup Contrat RCP23051083028
>
> Médiateur : MEDIATION CONSOMMATION DÉVELOPPEMENT/MED CONSO DEV — Centre d'Affaires Stéphanois SAS, immeuble l'horizon – Esplanade de France, 3 rue J. CONSTANT MILLERET – 42000 Saint Étienne
>
> Ne peut recevoir aucun fonds, effet, ou valeur.

**Le prénom.** Il est obligatoire sur le formulaire du guide, donc
`{{ contact.PRENOM }}` est toujours rempli pour les contacts qui entrent par là.
Si un contact ajouté à la main n'en a pas, le tag s'affiche vide et la ligne
devient « Bonjour , ». Pour couvrir ce cas :

```
{% if contact.PRENOM %}Bonjour {{ contact.PRENOM }},{% else %}Bonjour,{% endif %}
```

---

## Les trois liens utilisés dans la séquence

| Sert dans | Lien |
|---|---|
| Email 1 | `https://www.livingstone-wealth.com/documents/livingstone-guide-cession-dirigeant.pdf` |
| Email 5 | `https://www.livingstone-wealth.com/cas-pratiques` |
| Email 6 | `https://www.livingstone-wealth.com/merci-guide#rendez-vous` |

Le lien de l'email 6 pointe vers le formulaire de rappel de la page de
remerciement, faute d'agenda en ligne. Le jour où un lien Cal.com est collé dans
`LV_AGENDA` (`merci-guide.html`), c'est ce lien-là qu'il faudra mettre ici à la
place : la personne réservera son créneau elle-même, sans attendre un rappel.

---

## Email 1 : envoi immédiat

**Nom du modèle :** `Cession 1 - Votre guide`
**Objet :** `Votre guide de la cession`

```
Bonjour {{ contact.PRENOM }},

Voici le guide, en téléchargement direct :
https://www.livingstone-wealth.com/documents/livingstone-guide-cession-dirigeant.pdf

Si vous ne deviez lire qu'un chapitre, prenez le 4 : c'est celui qui traite de
l'apport-cession, et c'est aussi celui dont l'oubli coûte le plus cher.

Une précision utile avant de vous laisser lire : la quasi-totalité des leviers
décrits dans ce guide doivent être mis en place avant la signature du protocole
de cession. Après, il est trop tard, la plus-value est due.

Si votre projet est déjà engagé, écrivez-moi : je vous dirai en deux lignes ce
qui est encore ouvert dans votre calendrier.

Bien à vous,
Mikael Guéviguian
Livingstone Family Office
```

---

## Email 2 : J+2

**Nom du modèle :** `Cession 2 - L'erreur a 400 000 euros`
**Objet :** `L'erreur à 400 000 €`

```
Bonjour {{ contact.PRENOM }},

Une situation que je vois revenir régulièrement.

Un dirigeant signe une lettre d'intention. Tout se passe bien. Trois semaines
plus tard, son expert-comptable lui parle d'apport-cession. Il appelle un
conseil, qui lui confirme le mécanisme, et lui explique dans la foulée qu'il est
désormais trop tard : l'apport des titres à une holding devait précéder
l'engagement de cession, faute de quoi l'administration y voit une opération
montée pour les seuls besoins de l'impôt.

Sur une cession de 3 M€, l'écart entre les deux calendriers se chiffre en
centaines de milliers d'euros.

Ce n'est pas une question de compétence. C'est une question de séquence : la
structuration patrimoniale doit commencer douze à vingt-quatre mois avant la
vente, quand rien n'est encore signé et que tout est encore possible.

Le chapitre 4 du guide détaille les délais exacts.

Mikael
```

---

## Email 3 : J+6

**Nom du modèle :** `Cession 3 - Le calendrier`
**Objet :** `Le calendrier d'une cession préparée`

```
Bonjour {{ contact.PRENOM }},

Pour rendre le propos concret, voici le calendrier tel que nous le déroulons
avec les dirigeants que nous accompagnons.

24 à 18 mois avant : état des lieux patrimonial, valorisation de la société,
arbitrage entre les schémas possibles.

18 à 12 mois avant : création de la holding le cas échéant, apport des titres,
mise en place des donations envisagées. C'est la fenêtre décisive, tout ce qui
n'est pas fait ici ne pourra plus l'être.

12 à 6 mois avant : préparation de la cession elle-même, choix des conseils,
structuration du réemploi du produit de vente.

Après la signature : il ne reste que le placement des fonds. C'est important,
mais c'est la partie la moins créatrice de valeur.

La plupart des dirigeants nous appellent pendant la dernière ligne. Ceux qui
appellent pendant la première conservent nettement plus.

Mikael
```

---

## Email 4 : J+12

**Nom du modèle :** `Cession 4 - Et apres la vente`
**Objet :** `Et après la vente ?`

```
Bonjour {{ contact.PRENOM }},

Un angle mort dont on parle peu : le jour où les fonds arrivent.

Un dirigeant qui vient de céder se retrouve avec plusieurs millions sur un
compte courant, et un téléphone qui sonne beaucoup. Toutes les banques privées
de la place l'ont appris. Il prend alors, en quelques semaines et sous pression,
des décisions qui l'engagent pour vingt ans.

Les trois erreurs les plus fréquentes à ce moment précis :

Tout placer d'un coup. Le produit d'une cession n'a pas à être investi en une
fois. L'étalement dans le temps est presque toujours préférable.

Confondre disponibilité et sécurité. Laisser plusieurs millions en compte à vue
le temps de réfléchir est une décision d'investissement, avec un coût réel.

Traiter la question fiscale après. Le réemploi et la fiscalité se pensent
ensemble, surtout quand un engagement de réinvestissement court.

Le chapitre 6 du guide traite cette phase en détail.

Mikael
```

---

## Email 5 : J+20

**Nom du modèle :** `Cession 5 - Family office ou banque privee`
**Objet :** `Pourquoi un family office et pas une banque privée`

```
Bonjour {{ contact.PRENOM }},

Question qui revient souvent, et qui mérite une réponse franche.

Une banque privée est un excellent outil. Elle a une contrainte : elle distribue
en priorité ce qu'elle produit. C'est légitime, c'est son modèle, mais cela
borne le champ de ce qu'elle peut vous proposer.

Un family office indépendant n'a pas de produit maison. Notre travail consiste à
concevoir l'architecture (qui détient quoi, sous quelle forme, avec quelle
fiscalité) puis à aller chercher les meilleurs exécutants pour chaque brique, y
compris des banques privées.

La différence se voit surtout sur les opérations complexes : cession,
transmission, expatriation, financement. C'est-à-dire précisément les moments où
le patrimoine se fait ou se défait.

Vous pouvez voir comment nous travaillons dans nos cas pratiques :
https://www.livingstone-wealth.com/cas-pratiques

Mikael
```

---

## Email 6 : J+30

**Nom du modèle :** `Cession 6 - Vingt minutes`
**Objet :** `Vingt minutes, si c'est utile`

```
Bonjour {{ contact.PRENOM }},

Dernier message de cette série. Je ne vous écrirai plus qu'occasionnellement
ensuite.

Si votre cession est envisagée dans les vingt-quatre mois, un échange de vingt
minutes suffit généralement à identifier deux choses : ce qui doit être
structuré maintenant, et ce qui peut attendre. C'est sans engagement et sans
suite obligée.

https://www.livingstone-wealth.com/merci-guide#rendez-vous

Et si ce n'est pas d'actualité, gardez simplement ce guide de côté. Le bon
moment pour le rouvrir, c'est le jour où vous commencez à y penser sérieusement,
pas celui où vous recevez une offre.

Bien à vous,
Mikael Guéviguian
07 78 51 13 07
```

---

## Monter l'automatisation

**Automatisations → Créer une automatisation → Créer de zéro.**
Nommez-la `Séquence cession`.

**Point de départ :** « Un contact est ajouté à une liste », la liste du guide.
C'est le même déclencheur que l'automatisation de notification déjà en place :
les deux cohabitent sans se gêner, elles partiront en parallèle sur chaque
nouveau contact.

Puis, en alternant *Envoyer un email* et *Attendre* :

| Étape | Bloc | Réglage |
|---|---|---|
| 1 | Envoyer un email | `Cession 1 - Votre guide` |
| 2 | Attendre | 2 jours |
| 3 | Envoyer un email | `Cession 2 - L'erreur a 400 000 euros` |
| 4 | Attendre | 4 jours |
| 5 | Envoyer un email | `Cession 3 - Le calendrier` |
| 6 | Attendre | 6 jours |
| 7 | Envoyer un email | `Cession 4 - Et apres la vente` |
| 8 | Attendre | 8 jours |
| 9 | Envoyer un email | `Cession 5 - Family office ou banque privee` |
| 10 | Attendre | 10 jours |
| 11 | Envoyer un email | `Cession 6 - Vingt minutes` |

Les délais du bloc *Attendre* sont des écarts entre deux emails, pas des dates
depuis l'inscription : 2, 4, 6, 8 et 10 jours donnent bien J+2, J+6, J+12, J+20
et J+30.

**Condition de sortie.** Rien n'est pire que de recevoir « et si on se
parlait ? » trois jours après s'être parlé. Deux façons de la poser, la seconde
étant la plus simple à tenir :

- ajouter en fin de parcours une sortie sur un attribut `RDV_PRIS` que vous
  cochez dans la fiche du contact après un rendez-vous ;
- ou, plus simplement, retirer le contact de la liste du guide dès qu'un
  rendez-vous est pris : l'automatisation s'arrête d'elle-même.

**Activer.** Une automatisation ne se déclenche que sur les contacts **ajoutés
après** son activation. Les contacts de test déjà présents dans la liste ne
recevront donc rien, et il n'y a pas besoin de les sortir avant d'activer.

---

## Le test qui valide le montage

Reprenez le parcours complet avec une adresse à vous, non encore présente dans
la base : `/ceder-son-entreprise-guide-du-dirigeant`, formulaire, arrivée sur
`/merci-guide`, contact créé dans la liste, notification reçue. L'email 1 doit
arriver dans la foulée, avec le prénom correctement substitué et la signature
légale en pied.

Si l'email 1 n'arrive pas alors que le contact est bien créé, l'automatisation
n'est pas activée : c'est de très loin la cause la plus fréquente.

---

## Après la séquence

Au terme des six emails, le contact passe en veille : un envoi par trimestre,
sans rythme imposé. L'objectif de la séquence n'est pas de vendre, il est de
rester présent jusqu'au moment où le déclencheur survient.

Les deux chiffres à regarder ne sont pas les taux d'ouverture, mais le nombre de
rendez-vous pris rapporté au nombre d'entrées en séquence, et le délai entre
l'entrée et le rendez-vous. C'est ce délai qui dira s'il faut prolonger la
séquence au-delà de six emails.
