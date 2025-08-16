// La régression linéaire cherche à trouver la meilleure ligne droite qui passe 
// au plus près de tous les points d'un nuage de données. Cette ligne suit l'équation : y = mx + b
// où m est la pente de la ligne et b est l'ordonnée à l'origine.
// Dans ce code, nous allons analyser la relation entre les heures d'étude et les notes obtenues par des étudiants.
// Nous allons calculer la pente, l'ordonnée à l'origine, le coefficient de corrélation et le coefficient de détermination (R²).
// Nous afficherons également des statistiques détaillées et des prédictions basées sur la régression linéaire.

// Le coefficient de corrélation r (aussi appelé coefficient de Pearson) 
// mesure la force et la direction de la relation linéaire entre deux variables.
// Il varie entre -1 et 1, où 1 indique une corrélation positive parfaite,
// -1 une corrélation négative parfaite, et 0 aucune corrélation.
// r peut être négatif (corrélation inverse)

// Le coefficient de détermination R² indique quel pourcentage de la variation
// de la variable y est expliqué par la variable x.
// R² est toujours positif (entre 0 et 1) 


// Interface pour définir un point de données
interface DataPoint {
  x: number; // Heures d'étude
  y: number; // Note obtenue
}

// Interface pour les résultats de la régression
interface RegressionResult {
  slope: number;           // Pente (m)
  intercept: number;       // Ordonnée à l'origine (b)
  rSquared: number;        // Coefficient de détermination R²
  correlation: number;     // Coefficient de corrélation r
  equation: string;        // Équation de la droite
}

// Classe principale pour la régression linéaire
class LinearRegression {
  private data: DataPoint[];

  constructor(data: DataPoint[]) {
    this.data = data;
  }

  // Méthode principale pour calculer la régression linéaire
  public calculate(): RegressionResult {
    const n = this.data.length;
    
    // Calcul des sommes nécessaires
    const sumX = this.data.reduce((sum, point) => sum + point.x, 0);
    const sumY = this.data.reduce((sum, point) => sum + point.y, 0);
    const sumXY = this.data.reduce((sum, point) => sum + (point.x * point.y), 0);
    const sumXSquared = this.data.reduce((sum, point) => sum + (point.x * point.x), 0);
    const sumYSquared = this.data.reduce((sum, point) => sum + (point.y * point.y), 0);

    // Calcul de la pente (m) et de l'ordonnée à l'origine (b)
    const slope = (n * sumXY - sumX * sumY) / (n * sumXSquared - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calcul du coefficient de corrélation (r)
    const numerator = n * sumXY - sumX * sumY;
    const denominatorX = Math.sqrt(n * sumXSquared - sumX * sumX);
    const denominatorY = Math.sqrt(n * sumYSquared - sumY * sumY);
    const correlation = numerator / (denominatorX * denominatorY);

    // Calcul du coefficient de détermination (R²)
    const rSquared = correlation * correlation;

    // Formation de l'équation
    const equation = `y = ${slope.toFixed(3)}x + ${intercept.toFixed(3)}`;

    return {
      slope,
      intercept,
      rSquared,
      correlation,
      equation
    };
  }

  // Méthode pour faire des prédictions
  public predict(hoursStudied: number, result: RegressionResult): number {
    return result.slope * hoursStudied + result.intercept;
  }

  // Méthode pour calculer l'erreur quadratique moyenne (RMSE)
  public calculateRMSE(result: RegressionResult): number {
    const errors = this.data.map(point => {
      const predicted = this.predict(point.x, result);
      return Math.pow(point.y - predicted, 2);
    });
    
    const meanSquaredError = errors.reduce((sum, error) => sum + error, 0) / this.data.length;
    return Math.sqrt(meanSquaredError);
  }

  // Méthode pour afficher les statistiques détaillées
  public displayStatistics(result: RegressionResult): void {
    const separator = Array(61).join("=");
    console.log(separator);
    console.log("📊 ANALYSE DE RÉGRESSION LINÉAIRE");
    console.log("📚 Relation: Heures d'étude → Notes obtenues");
    console.log(separator);
    
    console.log("\n🔍 DONNÉES D'ENTRÉE:");
    console.log(`Nombre d'étudiants analysés: ${this.data.length}`);
    
    const avgHours = this.data.reduce((sum, p) => sum + p.x, 0) / this.data.length;
    const avgGrade = this.data.reduce((sum, p) => sum + p.y, 0) / this.data.length;
    
    console.log(`Moyenne des heures d'étude: ${avgHours.toFixed(2)} heures`);
    console.log(`Moyenne des notes: ${avgGrade.toFixed(2)}/20`);

    console.log("\n📈 RÉSULTATS DE LA RÉGRESSION:");
    console.log(`Équation de la droite: ${result.equation}`);
    console.log(`Pente (m): ${result.slope.toFixed(4)}`);
    console.log(`Ordonnée à l'origine (b): ${result.intercept.toFixed(4)}`);
    console.log(`Coefficient de corrélation (r): ${result.correlation.toFixed(4)}`);
    console.log(`Coefficient de détermination (R²): ${result.rSquared.toFixed(4)}`);
    console.log(`RMSE (Erreur quadratique moyenne): ${this.calculateRMSE(result).toFixed(4)}`);

    console.log("\n💡 INTERPRÉTATION:");
    console.log(`• Chaque heure d'étude supplémentaire augmente la note de ${result.slope.toFixed(3)} points`);
    console.log(`• Sans étudier (0h), la note prédite serait de ${result.intercept.toFixed(2)}/20`);
    console.log(`• ${(result.rSquared * 100).toFixed(1)}% de la variation des notes est expliquée par les heures d'étude`);
    
    if (result.rSquared > 0.8) {
      console.log(`• ✅ Corrélation très forte`);
    } else if (result.rSquared > 0.6) {
      console.log(`• ⚡ Corrélation forte`);
    } else if (result.rSquared > 0.3) {
      console.log(`• ⚠️ Corrélation modérée`);
    } else {
      console.log(`• ❌ Corrélation faible`);
    }
  }

  // Méthode pour afficher les prédictions
  public showPredictions(result: RegressionResult): void {
    console.log("\n🎯 PRÉDICTIONS POUR DIFFÉRENTS TEMPS D'ÉTUDE:");
    const dashLine = Array(41).join("-");
    console.log(dashLine);
    
    const testHours = [1, 2, 3, 5, 8, 10, 12];
    testHours.forEach(hours => {
      const predictedGrade = this.predict(hours, result);
      const clampedGrade = Math.max(0, Math.min(20, predictedGrade)); // Limiter entre 0 et 20
      const hoursStr = hours < 10 ? " " + hours : hours.toString();
      console.log(`${hoursStr} heures d'étude → ${clampedGrade.toFixed(2)}/20`);
    });
  }
}

// Jeu de données : 20 étudiants avec leurs heures d'étude et notes obtenues
const studentsData: DataPoint[] = [
  { x: 1.5, y: 8.2 },   // 1.5h d'étude → 8.2/20
  { x: 2.0, y: 9.5 },   // 2h d'étude → 9.5/20
  { x: 2.5, y: 10.1 },  // 2.5h d'étude → 10.1/20
  { x: 3.0, y: 11.3 },  // 3h d'étude → 11.3/20
  { x: 3.5, y: 10.8 },  // 3.5h d'étude → 10.8/20
  { x: 4.0, y: 12.6 },  // 4h d'étude → 12.6/20
  { x: 4.5, y: 13.2 },  // 4.5h d'étude → 13.2/20
  { x: 5.0, y: 14.0 },  // 5h d'étude → 14.0/20
  { x: 5.5, y: 13.8 },  // 5.5h d'étude → 13.8/20
  { x: 6.0, y: 15.1 },  // 6h d'étude → 15.1/20
  { x: 6.5, y: 15.8 },  // 6.5h d'étude → 15.8/20
  { x: 7.0, y: 16.2 },  // 7h d'étude → 16.2/20
  { x: 7.5, y: 16.9 },  // 7.5h d'étude → 16.9/20
  { x: 8.0, y: 17.3 },  // 8h d'étude → 17.3/20
  { x: 8.5, y: 17.0 },  // 8.5h d'étude → 17.0/20
  { x: 9.0, y: 18.1 },  // 9h d'étude → 18.1/20
  { x: 9.5, y: 18.5 },  // 9.5h d'étude → 18.5/20
  { x: 10.0, y: 19.2 }, // 10h d'étude → 19.2/20
  { x: 10.5, y: 18.8 }, // 10.5h d'étude → 18.8/20
  { x: 11.0, y: 19.6 }  // 11h d'étude → 19.6/20
];

// Fonction principale d'exécution
function main(): void {
  console.log("🚀 Démarrage de l'analyse de régression linéaire...\n");
  
  // Création de l'instance de régression linéaire
  const regression = new LinearRegression(studentsData);
  
  // Calcul de la régression
  const result = regression.calculate();
  
  // Affichage des statistiques détaillées
  regression.displayStatistics(result);
  
  // Affichage des prédictions
  regression.showPredictions(result);
  
  const separator = Array(61).join("=");
  const dashLine = Array(16).join("-");
  console.log("\n" + separator);
  console.log("📋 DONNÉES BRUTES UTILISÉES:");
  console.log(separator);
  console.log("Heures | Note");
  console.log(dashLine);
  studentsData.forEach((point, index) => {
    const xStr = point.x < 10 ? "  " + point.x : " " + point.x;
    const yStr = point.y < 10 ? "  " + point.y : " " + point.y;
    console.log(`${xStr} | ${yStr}`);
  });
  
  console.log("\n✅ Analyse terminée avec succès!");
}

// Exécution du programme
main();