function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

class NeuralNetwork {
  constructor(numOfInputNodes, numOfHiddenNodes, numOfOutputNodes) {
    this.numOfInputNodes = numOfInputNodes;
    this.numOfHiddenNodes = numOfHiddenNodes;
    this.numOfOutputNodes = numOfOutputNodes;

    this.inputWeights = new Matrix(this.numOfHiddenNodes, this.numOfInputNodes);
    this.hiddenWeights = new Matrix(this.numOfOutputNodes, this.numOfHiddenNodes);

    this.inputWeights.randomize();
    this.hiddenWeights.randomize();

    this.hiddenBias = new Matrix(this.numOfHiddenNodes, 1);
    this.outputBias = new Matrix(this.numOfOutputNodes, 1);
    this.hiddenBias.randomize();
    this.outputBias.randomize();
  }

  feedforward(input) {
    if (!(input instanceof Matrix)) input = Matrix.toMatrix(input);
    //input.print();

    let hidden = Matrix.multiply(this.inputWeights, input);
    hidden.add(this.hiddenBias);
    hidden.map(sigmoid);

    let output = Matrix.multiply(this.hiddenWeights, hidden);
    output.add(this.outputBias);
    output.map(sigmoid);

    return output;
  }

  copy() {
    let numOfInputNodes = this.numOfInputNodes;
    let numOfHiddenNodes = this.numOfHiddenNodes;
    let numOfOutputNodes = this.numOfOutputNodes;
    let copy = new NeuralNetwork(numOfInputNodes, numOfHiddenNodes, numOfOutputNodes);
    copy.inputWeights = this.inputWeights.copy();
    copy.hiddenWeights = this.hiddenWeights.copy();
    copy.hiddenBias = this.hiddenBias.copy();
    copy.outputBias = this.outputBias.copy();
    return copy;
  }

  static makeBaby(nn1, nn2) {
    let babyNeuralNetwork = new NeuralNetwork(nn1.numOfInputNodes, nn1.numOfHiddenNodes, nn1.numOfOutputNodes);
    let avgInputWeights = nn1.inputWeights.copy();
    avgInputWeights.add(nn2.inputWeights);
    avgInputWeights.multiply(0.5);
    let avgHiddenWeights = nn1.hiddenWeights.copy();
    avgHiddenWeights.add(nn2.hiddenWeights);
    avgHiddenWeights.multiply(0.5);
    let avgHiddenBias = nn1.hiddenBias.copy();
    avgHiddenBias.add(nn2.hiddenBias);
    avgHiddenBias.multiply(0.5);
    let avgOutputBias = nn1.outputBias.copy();
    avgOutputBias.add(nn2.outputBias);
    avgOutputBias.multiply(0.5);
    babyNeuralNetwork.inputWeights = avgInputWeights;
    babyNeuralNetwork.hiddenWeights = avgHiddenWeights;
    babyNeuralNetwork.hiddenBias = avgHiddenBias;
    babyNeuralNetwork.outputBias = avgOutputBias;
    return babyNeuralNetwork;
  }

  mutate(maxMutation) {
    this.inputWeights.map(function(element) {
      var ranMutation = (Math.random() * 2 - 1) * maxMutation;
      return ranMutation + element;
    });

    this.hiddenWeights.map(function(element) {
      var ranMutation = (Math.random() * 2 - 1) * maxMutation;
      return ranMutation + element;
    });

    this.hiddenBias.map(function(element) {
      var ranMutation = (Math.random() * 2 - 1) * maxMutation;
      return ranMutation + element;
    });

    this.outputBias.map(function(element) {
      var ranMutation = (Math.random() * 2 - 1) * maxMutation;
      return ranMutation + element;
    });
  }
}
