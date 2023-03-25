import { DecisionTree } from "./libraries/decisiontree.js";
import { VegaTree } from "./libraries/vegatree.js";

let inputElement = document.getElementById("giftig");
let submitButton = document.getElementById("submit-button");
let personalPrediction = document.getElementById("personal-prediction");
let predictionResult = document.getElementById("prediction-result");

submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (!inputElement.value) {
    alert("Please type something in the input field");
  } else {
    loadSavedModel(inputElement.value);
  }
});

function loadSavedModel(value) {
  fetch("./model.json")
    .then((response) => response.json())
    .then((model) => modelLoaded(model, value));
}

function modelLoaded(model, value) {
  let decisionTree = new DecisionTree(model);

  // test om te zien of het werkt
  let mushroom = { class: value, bruises: "w", population: "s" };
  let prediction = decisionTree.predict(mushroom);
  console.log("predicted " + prediction);

  if (value == "p") {
    personalPrediction.innerText = `Your personal prediction was p`;
    predictionResult.innerText = `Predicted ${prediction}`;
  }

  if (value == "e") {
    personalPrediction.innerText = `Your personal prediction was e`;
    predictionResult.innerText = `Predicted ${prediction}`;
  }

  let visual = new VegaTree("#view", 900, 500, decisionTree.toJSON());
}

loadSavedModel();
