// Classe principale pour la régression linéaire
var LinearRegression = /** @class */ (function () {
    function LinearRegression(data) {
        this.data = data;
    }
    // Méthode principale pour calculer la régression linéaire
    LinearRegression.prototype.calculate = function () {
        var n = this.data.length;
        // Calcul des sommes nécessaires
        var sumX = this.data.reduce(function (sum, point) { return sum + point.x; }, 0);
        var sumY = this.data.reduce(function (sum, point) { return sum + point.y; }, 0);
        var sumXY = this.data.reduce(function (sum, point) { return sum + (point.x * point.y); }, 0);
        var sumXSquared = this.data.reduce(function (sum, point) { return sum + (point.x * point.x); }, 0);
        var sumYSquared = this.data.reduce(function (sum, point) { return sum + (point.y * point.y); }, 0);
        // Calcul de la pente (m) et de l'ordonnée à l'origine (b)
        var slope = (n * sumXY - sumX * sumY) / (n * sumXSquared - sumX * sumX);
        var intercept = (sumY - slope * sumX) / n;
        // Calcul du coefficient de corrélation (r)
        var numerator = n * sumXY - sumX * sumY;
        var denominatorX = Math.sqrt(n * sumXSquared - sumX * sumX);
        var denominatorY = Math.sqrt(n * sumYSquared - sumY * sumY);
        var correlation = numerator / (denominatorX * denominatorY);
        // Calcul du coefficient de détermination (R²)
        var rSquared = correlation * correlation;
        // Formation de l'équation
        var equation = "y = ".concat(slope.toFixed(3), "x + ").concat(intercept.toFixed(3));
        return {
            slope: slope,
            intercept: intercept,
            rSquared: rSquared,
            correlation: correlation,
            equation: equation
        };
    };
    // Méthode pour faire des prédictions
    LinearRegression.prototype.predict = function (hoursStudied, result) {
        return result.slope * hoursStudied + result.intercept;
    };
    // Méthode pour calculer l'erreur quadratique moyenne (RMSE)
    LinearRegression.prototype.calculateRMSE = function (result) {
        var _this = this;
        var errors = this.data.map(function (point) {
            var predicted = _this.predict(point.x, result);
            return Math.pow(point.y - predicted, 2);
        });
        var meanSquaredError = errors.reduce(function (sum, error) { return sum + error; }, 0) / this.data.length;
        return Math.sqrt(meanSquaredError);
    };
    // Méthode pour afficher les statistiques détaillées
    LinearRegression.prototype.displayStatistics = function (result) {
        var separator = Array(61).join("=");
        console.log(separator);
        console.log("📊 ANALYSE DE RÉGRESSION LINÉAIRE");
        console.log("📚 Relation: Heures d'étude → Notes obtenues");
        console.log(separator);
        console.log("\n🔍 DONNÉES D'ENTRÉE:");
        console.log("Nombre d'\u00E9tudiants analys\u00E9s: ".concat(this.data.length));
        var avgHours = this.data.reduce(function (sum, p) { return sum + p.x; }, 0) / this.data.length;
        var avgGrade = this.data.reduce(function (sum, p) { return sum + p.y; }, 0) / this.data.length;
        console.log("Moyenne des heures d'\u00E9tude: ".concat(avgHours.toFixed(2), " heures"));
        console.log("Moyenne des notes: ".concat(avgGrade.toFixed(2), "/20"));
        console.log("\n📈 RÉSULTATS DE LA RÉGRESSION:");
        console.log("\u00C9quation de la droite: ".concat(result.equation));
        console.log("Pente (m): ".concat(result.slope.toFixed(4)));
        console.log("Ordonn\u00E9e \u00E0 l'origine (b): ".concat(result.intercept.toFixed(4)));
        console.log("Coefficient de corr\u00E9lation (r): ".concat(result.correlation.toFixed(4)));
        console.log("Coefficient de d\u00E9termination (R\u00B2): ".concat(result.rSquared.toFixed(4)));
        console.log("RMSE (Erreur quadratique moyenne): ".concat(this.calculateRMSE(result).toFixed(4)));
        console.log("\n💡 INTERPRÉTATION:");
        console.log("\u2022 Chaque heure d'\u00E9tude suppl\u00E9mentaire augmente la note de ".concat(result.slope.toFixed(3), " points"));
        console.log("\u2022 Sans \u00E9tudier (0h), la note pr\u00E9dite serait de ".concat(result.intercept.toFixed(2), "/20"));
        console.log("\u2022 ".concat((result.rSquared * 100).toFixed(1), "% de la variation des notes est expliqu\u00E9e par les heures d'\u00E9tude"));
        if (result.rSquared > 0.8) {
            console.log("\u2022 \u2705 Corr\u00E9lation tr\u00E8s forte");
        }
        else if (result.rSquared > 0.6) {
            console.log("\u2022 \u26A1 Corr\u00E9lation forte");
        }
        else if (result.rSquared > 0.3) {
            console.log("\u2022 \u26A0\uFE0F Corr\u00E9lation mod\u00E9r\u00E9e");
        }
        else {
            console.log("\u2022 \u274C Corr\u00E9lation faible");
        }
    };
    // Méthode pour afficher les prédictions
    LinearRegression.prototype.showPredictions = function (result) {
        var _this = this;
        console.log("\n🎯 PRÉDICTIONS POUR DIFFÉRENTS TEMPS D'ÉTUDE:");
        var dashLine = Array(41).join("-");
        console.log(dashLine);
        var testHours = [1, 2, 3, 5, 8, 10, 12];
        testHours.forEach(function (hours) {
            var predictedGrade = _this.predict(hours, result);
            var clampedGrade = Math.max(0, Math.min(20, predictedGrade)); // Limiter entre 0 et 20
            var hoursStr = hours < 10 ? " " + hours : hours.toString();
            console.log("".concat(hoursStr, " heures d'\u00E9tude \u2192 ").concat(clampedGrade.toFixed(2), "/20"));
        });
    };
    return LinearRegression;
}());
// Jeu de données : 20 étudiants avec leurs heures d'étude et notes obtenues
var studentsData = [
    { x: 1.5, y: 8.2 }, // 1.5h d'étude → 8.2/20
    { x: 2.0, y: 9.5 }, // 2h d'étude → 9.5/20
    { x: 2.5, y: 10.1 }, // 2.5h d'étude → 10.1/20
    { x: 3.0, y: 11.3 }, // 3h d'étude → 11.3/20
    { x: 3.5, y: 10.8 }, // 3.5h d'étude → 10.8/20
    { x: 4.0, y: 12.6 }, // 4h d'étude → 12.6/20
    { x: 4.5, y: 13.2 }, // 4.5h d'étude → 13.2/20
    { x: 5.0, y: 14.0 }, // 5h d'étude → 14.0/20
    { x: 5.5, y: 13.8 }, // 5.5h d'étude → 13.8/20
    { x: 6.0, y: 15.1 }, // 6h d'étude → 15.1/20
    { x: 6.5, y: 15.8 }, // 6.5h d'étude → 15.8/20
    { x: 7.0, y: 16.2 }, // 7h d'étude → 16.2/20
    { x: 7.5, y: 16.9 }, // 7.5h d'étude → 16.9/20
    { x: 8.0, y: 17.3 }, // 8h d'étude → 17.3/20
    { x: 8.5, y: 17.0 }, // 8.5h d'étude → 17.0/20
    { x: 9.0, y: 18.1 }, // 9h d'étude → 18.1/20
    { x: 9.5, y: 18.5 }, // 9.5h d'étude → 18.5/20
    { x: 10.0, y: 19.2 }, // 10h d'étude → 19.2/20
    { x: 10.5, y: 18.8 }, // 10.5h d'étude → 18.8/20
    { x: 11.0, y: 19.6 } // 11h d'étude → 19.6/20
];
// Fonction principale d'exécution
function main() {
    console.log("🚀 Démarrage de l'analyse de régression linéaire...\n");
    // Création de l'instance de régression linéaire
    var regression = new LinearRegression(studentsData);
    // Calcul de la régression
    var result = regression.calculate();
    // Affichage des statistiques détaillées
    regression.displayStatistics(result);
    // Affichage des prédictions
    regression.showPredictions(result);
    var separator = Array(61).join("=");
    var dashLine = Array(16).join("-");
    console.log("\n" + separator);
    console.log("📋 DONNÉES BRUTES UTILISÉES:");
    console.log(separator);
    console.log("Heures | Note");
    console.log(dashLine);
    studentsData.forEach(function (point, index) {
        var xStr = point.x < 10 ? "  " + point.x : " " + point.x;
        var yStr = point.y < 10 ? "  " + point.y : " " + point.y;
        console.log("".concat(xStr, " | ").concat(yStr));
    });
    console.log("\n✅ Analyse terminée avec succès!");
}
// Exécution du programme
main();
