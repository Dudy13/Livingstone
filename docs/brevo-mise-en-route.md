# Brevo : mise en route

Le site est prêt. Il ne manque qu'une URL à coller. Ce document donne la marche
à suivre exacte, dans l'ordre, avec les noms de champs à respecter. Ils sont
imposés par le site, pas par Brevo, et une faute de frappe casse la remontée
silencieusement.

Comptez vingt minutes.

---

## 1. Créer les attributs de contact

**Contacts → Paramètres → Attributs de contact → Ajouter un attribut.**

Créez exactement ceux-ci. Le nom doit être identique, en majuscules :

| Nom de l'attribut | Type | Ce qu'il reçoit |
|---|---|---|
| `PRENOM` | Texte | le prénom saisi |
| `SMS` | Numéro de téléphone | le téléphone, **facultatif** |
| `CONSENTEMENT_APPEL` | Booléen | coché ou non par le visiteur |
| `SOURCE` | Texte | la page d'où vient le lead (`/ceder-son-entreprise-guide-du-dirigeant`) |

`EMAIL` existe déjà, ne le recréez pas.

`SOURCE` est celui qui vous servira le plus vite : c'est lui qui dira quelles
pages produisent des leads, et lesquelles n'en produisent aucune.

---

## 2. Créer la liste

**Contacts → Listes → Créer une liste.** Nommez-la `Guide cession`.

C'est la liste qui déclenchera la séquence. N'y mettez rien d'autre.

---

## 3. Créer le formulaire

**Contacts → Formulaires → Créer un formulaire.**

- Champs à inclure : `EMAIL`, `PRENOM`, `SMS`, `CONSENTEMENT_APPEL`, `SOURCE`.
- Liste de destination : `Guide cession`.
- **Page de confirmation → rediriger vers une URL :**
  `https://www.livingstone-wealth.com/merci-guide`
  C'est ce qui remplace le `_next` de Formspree. Sans cette redirection, le
  visiteur ne reçoit jamais le PDF ni la proposition de rendez-vous.

L'apparence du formulaire Brevo n'a aucune importance : il ne sera jamais
affiché. Le site garde le sien et ne fait qu'envoyer vers celui-ci.

**Récupérez l'URL.** Dans le code d'intégration proposé par Brevo, prenez la
valeur de `action=`, de la forme `https://sibforms.com/serve/MUIFA...`.

### Simple ou double opt-in ?

Brevo propose les deux. Le double opt-in (email de confirmation avant
inscription) protège votre délivrabilité et lève toute ambiguïté sur le
consentement, mais il coûte des contacts : une partie ne confirme jamais et ne
reçoit donc pas le guide.

Recommandation : **simple opt-in**, la personne demandant explicitement un
document, avec un lien de désinscription visible sur chaque envoi. Si votre
association CIF vous demande une traçabilité plus stricte du consentement,
basculez en double opt-in : c'est un réglage, pas une refonte.

---

## 4. Coller l'URL dans le site

Une seule ligne à modifier, dans `analytics.js` :

```js
var LV_BREVO_FORM = 'https://sibforms.com/serve/MUIFA…';
```

Rien d'autre. Au chargement de la page, le formulaire du guide est retargeté
vers Brevo et ses champs renommés automatiquement (`prenom` → `PRENOM`,
`telephone` → `SMS`, etc.). Le visiteur ne voit aucune différence.

Tant que la valeur est vide, tout continue de partir vers Formspree.

---

## 5. Vous notifier des nouveaux leads

**Attention à ce point** : en basculant sur Brevo, vous perdez l'email de
notification que Formspree vous envoyait. Sans cette étape, des leads
arriveront sans que vous le sachiez.

**Automatisations → Créer → Point de départ : « Un contact est ajouté à une
liste »** (`Guide cession`) **→ Action : envoyer un email** à
`mikael.gueviguian@livingstone-wealth.com`, avec `EMAIL`, `PRENOM`, `SMS`,
`SOURCE` et `CONSENTEMENT_APPEL` dans le corps.

Faites-la avant tout le reste : c'est votre filet.

---

## 6. Monter la séquence

Les six emails sont rédigés dans `sequence-emails-cession.md`, avec leurs
objets, leurs délais et la signature légale.

**Automatisations → Créer → « Un contact est ajouté à une liste »**
(`Guide cession`), puis alternez *Envoyer un email* et *Attendre* selon les
délais : immédiat, J+2, J+6, J+12, J+20, J+30.

Trois réglages qui comptent :

- **Expéditeur** : `Mikael Guéviguian`, adresse nominative, jamais `contact@`.
- **Pied de page du modèle** : la signature légale ORIAS, une fois pour toutes,
  plutôt que recopiée dans chaque email. C'est le seul moyen qu'aucun envoi ne
  parte sans elle.
- **Condition de sortie** : un rendez-vous pris doit interrompre la séquence.
  Rien n'est pire que de recevoir « et si on se parlait ? » trois jours après
  s'être parlé.

---

## 7. Authentifier le domaine

**Paramètres → Expéditeurs et adresses IP → Domaines.**

Ajoutez `livingstone-wealth.com` et publiez les enregistrements DKIM et DMARC
que Brevo indique, chez votre hébergeur DNS.

Ce n'est pas une formalité : sans authentification, vos emails partent en
indésirables chez une bonne partie des destinataires, et une séquence que
personne ne lit ne sert à rien.

---

## Ce qu'il ne faut pas faire

**N'appelez jamais quelqu'un qui n'a pas coché `CONSENTEMENT_APPEL`.** Depuis
le passage du démarchage téléphonique à l'opt-in, cette case est la seule base
valable pour un appel. Un numéro présent dans la base sans la case cochée est
une ligne morte, et un risque.

**Ne mettez pas de clé API Brevo dans le code du site.** Elle serait lisible par
n'importe quel visiteur. Le formulaire hébergé décrit ici n'en demande aucune :
c'est précisément pourquoi c'est cette méthode qui a été retenue.

---

## Pour vérifier que tout marche

1. Ouvrez `/ceder-son-entreprise-guide-du-dirigeant`, remplissez le formulaire
   avec une adresse à vous, sans cocher la case téléphone.
2. Vous devez arriver sur `/merci-guide`.
3. Le contact doit apparaître dans `Guide cession`, avec `SOURCE` renseigné.
4. Vous devez recevoir la notification de l'étape 5.
5. Le premier email de la séquence doit arriver dans la foulée.

Si l'étape 3 échoue, c'est presque toujours un nom d'attribut qui diffère de
l'étape 1.
