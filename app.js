import { DecisionTree } from "./libraries/decisiontree.js";
import { VegaTree } from "./libraries/vegatree.js";

//
// DATA
//
const csvFile = "./data/mushrooms.csv"; // dataset
const trainingLabel = "class";
const ignored = ["population"];

//
// laad csv data als json
//
function loadData() {
  Papa.parse(csvFile, {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (results) => trainModel(results.data), // gebruik deze data om te trainen
  });
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
  data.sort(() => Math.random() - 0.5); // get rid of sort on labels
  // todo: splits data in traindata en testdata
  let trainData = data.slice(0, Math.floor(data.length * 0.8));
  let testData = data.slice(Math.floor(data.length * 0.8) + 1);
  console.log(testData);

  // maak het algoritme aan
  let decisionTree = new DecisionTree({
    ignoredAttributes: ["class"],
    trainingSet: trainData,
    categoryAttr: trainingLabel,
  });

  // Model opslaan als JSON
  let json = decisionTree.stringify();
  console.log(json);

  // Teken de decision tree -- node, breedte, hoogte, decision tree
  let visual = new VegaTree("#view", 900, 500, decisionTree.toJSON());

  // todo: maak een prediction met een sample uit de testdata
  const amountCorrect = [];
  const totalAmount = [];

  let correctPAmount = 0;
  let correctEAmount = 0;
  let incorrectEAmount = 0;
  let incorrectPAmount = 0;

  // todo: schrijf een for-loop waarin je alle rijen uit de testdata haalt
  for (let mushroom of testData) {
    const mushroomWithoutClass = { ...mushroom };
    delete mushroomWithoutClass.class;

    let mushroomPrediction = decisionTree.predict(mushroomWithoutClass);
    totalAmount.push(mushroomPrediction);
    console.log(
      `Mushroom label ${mushroom.class} predicted ${mushroomPrediction}`
    );
    console.log(`Goede voorspelling!`);

    if (mushroom.class == mushroomPrediction) {
      amountCorrect.push(mushroomPrediction);
      if (mushroom.class == "e" && mushroomPrediction == "e") {
        correctEAmount++;
      }

      if (mushroom.class == "p" && mushroomPrediction == "p") {
        correctPAmount++;
      }
    } else {
      console.log(`Slechte voorspelling!`);

      if (mushroom.class == "e" && mushroomPrediction == "p") {
        incorrectEAmount++;
      }

      if (mushroom.class == "p" && mushroomPrediction == "e") {
        incorrectPAmount++;
      }
    }
  }

  // todo: bereken de accuracy met behulp van alle testdata
  let accuracy = document.getElementById("accuracy");
  let roundedAccuracy = Math.round(
    (amountCorrect.length / totalAmount.length) * 100
  );
  accuracy.innerText = `Accuracy = ${roundedAccuracy}%`;

  // Maak een confusion matrix
  let correctEdible = document.getElementById(`correctE`);
  let incorrectEdible = document.getElementById(`incorrectE`);
  let correctPoisonous = document.getElementById(`correctP`);
  let incorrectPoisonous = document.getElementById(`incorrectP`);

  correctEdible.innerText = `${correctEAmount}`;
  incorrectEdible.innerText = `${incorrectEAmount}`;
  correctPoisonous.innerText = `${correctPAmount}`;
  incorrectPoisonous.innerText = `${incorrectPAmount}`;
}

loadData();
