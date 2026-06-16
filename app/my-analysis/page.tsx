import type { Metadata } from "next";
import { MyAnalysisClient } from "@/app/my-analysis/my-analysis-client";

export const metadata: Metadata = {
  title: "Ma grille d’analyse | Antoine Capital Analyzer",
  description:
    "Construire une grille d’analyse financière personnalisée avec des widgets sauvegardés localement."
};

export default function MyAnalysisPage() {
  return <MyAnalysisClient />;
}
