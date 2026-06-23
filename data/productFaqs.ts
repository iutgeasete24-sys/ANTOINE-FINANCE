export interface ProductFaq {
  question: string;
  answer: string;
}

export const productFaqs: ProductFaq[] = [
  {
    question: "Est-ce que l’application donne des conseils d’investissement ?",
    answer: "Non, elle fournit des informations générales et pédagogiques."
  },
  {
    question: "Est-ce que l’application promet de gagner de l’argent ?",
    answer: "Non, investir comporte un risque de perte en capital."
  },
  {
    question: "D’où viennent les données ?",
    answer:
      "Les sources sont affichées quand elles sont disponibles. Les données manquantes sont signalées."
  },
  {
    question: "À qui s’adresse l’application ?",
    answer:
      "Aux investisseurs particuliers qui veulent mieux comprendre les entreprises cotées."
  },
  {
    question: "Pourquoi personnaliser ses widgets ?",
    answer:
      "Chaque investisseur ne regarde pas les mêmes indicateurs. La grille personnalisée permet d’afficher les critères importants pour l’utilisateur."
  },
  {
    question: "Quelle différence avec une app de portefeuille ?",
    answer:
      "Le cœur du produit est l’analyse et la compréhension des entreprises. Le portefeuille est une fonctionnalité complémentaire."
  }
];
