# AGENTS.md

## Projet

Ce projet est une application Next.js d'analyse financiere pedagogique.

## Regles produit

- Le produit ne doit jamais promettre de gains.
- Le produit ne doit jamais donner de conseil personnalise.
- Eviter les mots et formulations suivants : acheter, vendre, signal, gain garanti, meilleure action.
- Utiliser plutot des formulations prudentes : profil favorable, profil equilibre, profil prudent, valorisation exigeante, a surveiller, a approfondir.

## Regles donnees et securite

- Ne jamais ajouter d'API payante.
- Ne jamais exposer de cle API cote client.
- Les donnees gratuites, partielles ou differees doivent etre indiquees clairement.

## Regles techniques

- Ne jamais installer une dependance inutile sans justification.
- Priorite au mobile-first.
- Apres chaque modification, verifier que `npm run build` fonctionne.
- Le code doit rester simple, maintenable et compatible Vercel.
