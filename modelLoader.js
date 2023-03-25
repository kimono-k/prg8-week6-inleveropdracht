import { DecisionTree } from "./libraries/decisiontree.js";
import { VegaTree } from "./libraries/vegatree.js";

function loadSavedModel() {
  fetch("./model.json")
    .then((response) => response.json())
    .then((model) => modelLoaded(model));
}

function modelLoaded(model) {
  let decisionTree = new DecisionTree(model);

  // test om te zien of het werkt
  let mushroom = { class: "p", bruises: "w", population: "s" };
  let prediction = decisionTree.predict(mushroom);
  console.log("predicted " + prediction);

  let visual = new VegaTree("#view", 900, 500, decisionTree.toJSON());
}

loadSavedModel();
