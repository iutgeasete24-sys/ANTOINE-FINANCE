# Checklist produit

## Navigation

- Ouvrir `/` et vérifier que l'écran répond vite à : quoi regarder aujourd'hui ?
- Vérifier la bottom nav : Accueil, Analyse, Portefeuille, Profil.
- Vérifier que la bottom nav n'affiche que des icônes visibles et des labels accessibles.
- Scroller vers le bas puis vers le haut : la bulle se réduit puis reprend sa taille.
- Vérifier la safe area iPhone et l'alignement Android.

## Recherche

- Cliquer dans la recherche : la barre passe en mode focus et remonte en haut sur mobile.
- Vérifier l'overlay flou, la fermeture par croix, clic extérieur et Escape.
- Sans texte, vérifier que seules trois recherches récentes apparaissent si elles existent.
- Taper `AS`, `AIR`, `Apple`, `Nvidia`, `Vinci`, `DG.PA`.
- Tester un ticker inexistant et vérifier l'état sans résultat.
- Sélectionner une action et vérifier l'ouverture de la fiche action.
- Sélectionner un ETF et vérifier l'ouverture de la fiche ETF.
- Vérifier qu'aucun rectangle vide, badge parasite ou chargement infini n'apparaît.

## Analyse

- Ouvrir `/analysis`.
- Vérifier la recherche principale, les trois accès rapides et les thèmes.
- Ouvrir un thème : Explorer doit reprendre le filtre attendu.
- Ouvrir un score fondamental et vérifier la fiche.
- Vérifier que le texte ne promet aucune performance future.

## Explorer

- Ouvrir `/explorer`.
- Vérifier la sélection courte au repos.
- Tester pays, secteur, sous-secteur, action/ETF, marché et tri.
- Tester `France`, `États-Unis`, `Europe`, `Technologie`, `Santé`, `Semi-conducteurs`, `ETF`.
- Vérifier les chips de sous-secteurs dynamiques.
- Réinitialiser les filtres.
- Vérifier les états vide et résultat.

## Fiche action

- Ouvrir `/stock/ASML`, `/stock/AAPL`, `/stock/NVDA`, `/stock/AIR.PA`.
- Vérifier le premier écran : nom, ticker, secteur, prix, variation, score, décision.
- Vérifier forces, vigilances, qualité des données, source et mise à jour.
- Vérifier que les données d'exemple sont clairement signalées sans jargon.
- Ouvrir le détail du score et contrôler sous-scores, indicateurs et données manquantes.

## ETF

- Ouvrir un ETF depuis Explorer, par exemple `CW8.PA`, `CSPX.L` ou `EQQQ.PA`.
- Vérifier exposition, indice suivi, frais, politique, risque principal et profil d'investisseur.
- Vérifier que la fiche ETF ne ressemble pas à une fiche action.

## Portefeuille

- Ouvrir `/portfolio`.
- Vérifier valeur totale, performance, score, point de vigilance et positions.
- Ajouter, modifier et supprimer une ligne.
- Créer un broker et vérifier le sélecteur premium.
- Essayer de supprimer un broker qui contient encore une ligne.
- Vérifier les allocations secteur, pays, devise, broker et top positions.

## Watchlist

- Ajouter une action depuis sa fiche.
- Ouvrir `/watchlist`.
- Tester les tris : Score, Variation, Décision.
- Supprimer une ligne.
- Vérifier l'état vide.

## Comparaison

- Ouvrir `/compare`.
- Comparer `ASML`, `AVGO`, `NVO`.
- Remplacer par `AAPL`, `NVDA`, `MSFT`.
- Vérifier les cartes, le tableau mobile et l'état loading.

## Données et robustesse

- Vérifier que l’app fonctionne sans aucune clé API payante.
- Vérifier le message : données gratuites, potentiellement différées, utilisation personnelle.
- Vérifier une action US couverte SEC, par exemple `AAPL` ou `MSFT`.
- Vérifier une action non-US, par exemple `ASML.AS`, `DG.PA` ou `AIR.PA`.
- Vérifier qu’un prix indisponible n’empêche pas l’affichage de la fiche.
- Tester un ticker inconnu.
- Vérifier les états loading, empty, error et données partielles.
- Exécuter `npm run lint`.
- Exécuter `npm run build`.
