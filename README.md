# Antoine Capital Analyzer

Application fintech mobile-first pour comprendre rapidement la qualité d'une action, d'un ETF et d'un portefeuille long terme.

Le produit aide à structurer une analyse rationnelle : score, forces, vigilances, qualité des données et exposition portefeuille. Il ne constitue pas un conseil financier et ne prédit pas la performance future.

## Lancer en local

```bash
npm install
npm run dev
```

Ouvrir `http://localhost:3000`.

## Stratégie données 0 €

L'application est conçue pour un usage personnel sans coût mensuel.

- Stooq : prix et historiques gratuits quand disponibles.
- SEC EDGAR : fondamentaux gratuits pour certaines sociétés américaines.
- Base locale : univers de titres, ETF, secteurs, devises et métadonnées.
- Fallback local : l'interface reste utilisable si une source gratuite est indisponible.

Aucune API payante n'est nécessaire. Aucune clé API n'est exposée côté client.

## Parcours disponibles

- Accueil : valeur portefeuille, performance, score, alerte principale et accès recherche.
- Analyse : recherche centrale, accès Explorer, comparaison, watchlist et scores fondamentaux.
- Fiche action : score global, décision, prix, variation, forces, vigilances, qualité des données et détail du score.
- Fiche ETF : exposition, indice suivi, frais, risque, horizon et score ETF dédié.
- Portefeuille : lignes locales, brokers, performance, concentration, allocations et alertes.
- Explorer : recherche, filtres pays/secteur/type/marché, sous-secteurs dynamiques et tri.
- Watchlist : suivi local et tri par score, variation ou décision.
- Comparaison : lecture côte à côte de trois actions maximum.

## Données et limites

- Les prix gratuits peuvent être différés ou indisponibles selon le ticker.
- Les fondamentaux complets gratuits sont surtout disponibles pour les sociétés US couvertes par SEC EDGAR.
- Les prix du portefeuille ne sont pas encore rafraîchis automatiquement.
- Les taux de change sont fixes dans `lib/portfolio.ts`.
- La watchlist et le portefeuille sont stockés dans le navigateur.
- Supabase est préparé mais la synchronisation utilisateur n'est pas activée.
- Le moat et certains risques restent partiellement qualitatifs.
- Le thème clair n'est pas encore livré.
- L'univers de titres est local et devra être synchronisé avec une source de marché complète.

## Fichiers clés

- `app/page.tsx` : accueil.
- `app/analysis/page.tsx` : centre de recherche.
- `app/explorer/page.tsx` : découverte de titres.
- `app/stock/[ticker]/page.tsx` : fiche action.
- `app/etf/[ticker]/page.tsx` : fiche ETF.
- `app/portfolio/portfolio-client.tsx` : portefeuille local.
- `components/TickerSearchAutocomplete.tsx` : recherche premium.
- `lib/scoring.ts` : scoring action.
- `lib/etf.ts` : scoring ETF.
- `lib/portfolio.ts` : score et alertes portefeuille.
- `lib/free-data.ts` : Stooq, SEC EDGAR et fallback local.
- `lib/fmp.ts` : pont de compatibilité vers `free-data`, sans appel payant.

## Vérification

```bash
npm run lint
npm run build
```

## Avertissement

Les scores servent à organiser l'analyse avec les données gratuites disponibles, parfois différées ou partielles. Ils ne remplacent pas une recherche personnelle, un conseiller financier ou une décision d'investissement indépendante.
# ANTOINE-FINANCE
