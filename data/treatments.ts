export type Language = "en" | "tw" | "dag";

export const TREATMENTS: Record<string, Record<Language, string[]>> = {
 "Common_Rust": {
        "en": [
            "Common Rust (Puccinia sorghi) detected — fungal disease requiring prompt action.",
            "Apply fungicides containing azoxystrobin, propiconazole, or mancozeb.",
            "Remove heavily infected leaves.",
            "Plant rust-resistant maize varieties.",
            "Rotate maize with legumes.",
            "Maintain proper spacing for airflow.",
            "Monitor fields every week."
        ],
        "tw": [
            "Common Rust (Puccinia sorghi) ahyia — ɛyɛ fungus yaree a ɛhia sɛ wobɛyɛ no ntɛm.",
            "Fa fungicides a ɛwɔ azoxystrobin, propiconazole, anaa mancozeb gu so.",
            "Yi ahaban a yaree no atra mu no nyinaa.",
            "Dua aburow a ɛnnyɛ rust yaree.",
            "Dua aburow ne nkesua nnɔbae.",
            "Siesie anammɔn a ɛfata ma mframa.",
            "Hwɛ afuo no abɔso biara."
        ],
        "dag": [
            "Common Rust (Puccinia sorghi) n-nya — fungus yɛl' ni sɔŋsim pampam.",
            "Zaŋ fungicides ni azoxystrobin, propiconazole, bee mancozeb gu so.",
            "Yihi kpamli ni yɛl' atra mu.",
            "Dug maize ni biɛla rust yɛl'.",
            "Dug maize ni nkesua sal'.",
            "Kpaŋsim anammɔn ni mframa tuuli.",
            "Kpaŋsim afuo nyɔŋɔ."
        ]
    },
    "Gray_Leaf_Spot": {
        "en": [
            "Gray Leaf Spot detected.",
            "Apply recommended foliar fungicides.",
            "Improve drainage.",
            "Practice crop rotation.",
            "Destroy infected crop residue.",
            "Use resistant maize varieties."
        ],
        "tw": [
            "Grey Leaf Spot ahyia.",
            "Fa foliar fungicides a wɔakyerɛw gu so.",
            "Siesie nsu a ɛbɛfiri fam no.",
            "Dua nnɔbae ahorow.",
            "Sɛe nnɔbae a yaree no atra mu no.",
            "Fa aburow a ɛnnyɛ yaree no."
        ],
        "dag": [
            "Gray Leaf Spot n-nya.",
            "Zaŋ foliar fungicides ni wɔkyɛn gu so.",
            "Kpaŋsim nsu niŋsim.",
            "Dug sal' a zaa.",
            "Sɛɛ sal' ni yɛl' atra mu.",
            "Zaŋ maize ni biɛla yɛl'."
        ]
    },
    "Healthy": {
        "en": [
            "Excellent! No disease detected.",
            "Continue regular crop monitoring.",
            "Maintain proper fertilization.",
            "Keep weeds under control.",
            "Inspect plants weekly.",
            "Keep following good agronomic practices."
        ],
        "tw": [
            "Ayɛ papa! Yaree biara nni hɔ.",
            "Toa so hwɛ nnɔbae no.",
            "Siesie aduane a ɛfata.",
            "Hwɛ sɛ nwura no nni hɔ.",
            "Hwɛ nnɔbae no abɔso biara.",
            "Toa so di kuayɛ a ɛyɛ yie no so."
        ],
        "dag": [
            "Chɛli! Yɛl' biɛla biɛla.",
            "Tuuli kpamli sal' kpaŋsim.",
            "Kpaŋsim aduane niŋsim.",
            "Kpaŋsim nwura.",
            "Kpaŋsim sal' nyɔŋɔ.",
            "Tuuli kuayɛ ni nyɛ yɛn."
        ]
    },
    "MSV": {
        "en": [
            "Maize Streak Virus detected.",
            "Remove severely infected plants immediately.",
            "Control leafhopper vectors.",
            "Plant resistant maize varieties.",
            "Avoid continuous maize cropping.",
            "There is no cure for infected plants.",
            "Prevent spread to healthy plants."
        ],
        "tw": [
            "Maize Streak Virus ahyia.",
            "Yi nnɔbae a yaree no atra mu no ntɛm.",
            "Kɔ leafhopper a wɔde yaree no kɔma nnɔbae no so.",
            "Dua aburow a ɛnnyɛ yaree.",
            "Nyɛ aburow daa.",
            "Yaree no nni ayaresa.",
            "Si kwan ma yaree no ankɔ nnɔbae a apɔwmuden wom so."
        ],
        "dag": [
            "Maize Streak Virus n-nya.",
            "Yihi sal' ni yɛl' atra mu pampam.",
            "Kpaŋsim leafhopper ni yɛl' to sal' so.",
            "Dug maize ni biɛla yɛl'.",
            "Dolima maize daa.",
            "Yɛl' ayaresa biɛla.",
            "Sɔŋsim yɛl' ni n-kɔ sal' ni kpalim zaa so."
        ]
    },
    "Northern_Leaf_Blight": {
        "en": [
            "Northern Leaf Blight detected.",
            "Apply fungicides early.",
            "Improve field airflow.",
            "Destroy infected residues.",
            "Rotate crops.",
            "Plant resistant hybrids."
        ],
        "tw": [
            "Northern Leaf Blight ahyia.",
            "Fa fungicides gu so ntɛm.",
            "Ma mframa nya kwan wɔ afuo no mu.",
            "Sɛe nnɔbae a yaree no atra mu no.",
            "Dua nnɔbae ahorow.",
            "Dua nnɔbae a ɛnnyɛ yaree."
        ],
        "dag": [
            "Northern Leaf Blight n-nya.",
            "Zaŋ fungicides gu so pampam.",
            "Kpaŋsim mframa wɔ afuo ni.",
            "Sɛɛ sal' ni yɛl' atra mu.",
            "Dug sal' a zaa.",
            "Dug sal' ni biɛla yɛl'."
        ]
    },
    "Southern_Leaf_Blight": {
        "en": [
            "Southern Leaf Blight detected.",
            "Apply fungicides immediately.",
            "Remove infected plants.",
            "Improve drainage.",
            "Use certified seed.",
            "Rotate crops."
        ],
        "tw": [
            "Southern Leaf Blight ahyia.",
            "Fa fungicides gu so ntɛm.",
            "Yi nnɔbae a yaree no atra mu no.",
            "Siesie nsu a ɛbɛfiri fam no.",
            "Fa nnuaba a wɔahwɛ so.",
            "Dua nnɔbae ahorow."
        ],
        "dag": [
            "Southern Leaf Blight n-nya.",
            "Zaŋ fungicides gu so pampam.",
            "Yihi sal' ni yɛl' atra mu.",
            "Kpaŋsim nsu niŋsim.",
            "Zaŋ nnuaba ni wɔkpaŋsi.",
            "Dug sal' a zaa."
        ]
    },
    "Uncertain": {
        "en": [
            "The image could not be confidently classified.",
            "Please upload a clearer maize leaf image.",
            "Ensure the leaf occupies most of the picture.",
            "Take the picture in natural daylight.",
            "Avoid blurry images.",
            "Make sure the image actually shows a maize leaf."
        ],
        "tw": [
            "Yɛnntumi ankyekyɛ mfonini no.",
            "Yɛsrɛ wo twe aburow ahaban mfonini a ɛyɛ kyerɛ.",
            "Hwɛ sɛ ahaban no wɔ mfonini no mu.",
            "Twe mfonini no wɔ awia mu.",
            "Nyɛ mfonini a ɛnnyɛ kyerɛ.",
            "Hwɛ sɛ mfonini no kyerɛ aburow ahaban."
        ],
        "dag": [
            "N-tum kpari nimli maa.",
            "Yɛn zaŋ maize kpamli nimli ni nyɛ yɛn.",
            "Kpaŋsim kpamli n-nya nimli ni pahi.",
            "Twa nimli wɔ awia ni.",
            "Dolima nimli ni biɛla.",
            "Kpaŋsim nimli n-nya maize kpamli."
        ]
    }
};

export function getTreatment(prediction: string, lang: Language): string[] {
  return TREATMENTS[prediction]?.[lang] ?? TREATMENTS["Uncertain"]?.[lang] ?? [];
}

export function getSeverity(prediction: string): string {
  return {
    Healthy: "none",
    Common_Rust: "medium",
    Gray_Leaf_Spot: "medium",
    MSV: "high",
    Northern_Leaf_Blight: "high",
    Southern_Leaf_Blight: "critical",
    Uncertain: "low",
  }[prediction] ?? "low";
}

export function getColor(prediction: string): string {
  return {
    Healthy: "green",
    Common_Rust: "orange",
    Gray_Leaf_Spot: "purple",
    MSV: "red",
    Northern_Leaf_Blight: "amber",
    Southern_Leaf_Blight: "rose",
    Uncertain: "yellow",
  }[prediction] ?? "yellow";
}

export function computeNormalizedEntropy(probs: Record<string, number>): number {
  let values = Object.values(probs).filter((p) => p > 0);
  if (values.length <= 1) return 0;

  // Auto-detect percentages and normalize to fractions
  if (values.some((v) => v > 1)) {
    values = values.map((v) => v / 100);
  }

  const entropy = -values.reduce((sum, p) => sum + p * Math.log(p), 0);
  const maxEntropy = Math.log(values.length);
  return maxEntropy > 0 ? entropy / maxEntropy : 0;
}