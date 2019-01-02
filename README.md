# AI Libraries
This Github repository is a collection of libraries that I am creating in several different languages as I gain experience build Neural Networks. If you click through there will be an Examples directory inside each of the languages folder. Those examples will contain the code, and display a simple example of how to use each of the different libraries.

## Javascript
So far, for the Javascript library I have built a simple Matrix class, and I have also built a NeuralNetwork class. The Matrix class consists of some functions that perform matrix operations, and some functions that help me copy matrices etc. I know there are several libraries already available that do this, but in my quest for knowledge I wanted to build everything from the ground up, so that I have complete understanding of the material.

#### Neural Network Initialization Example
Here is some code demonstrating a simple use of the neural network class:

```
// Create neural network with 5 inputs, 3 hidden nodes, and 2 outputs
let nn = new NeuralNetwork(5, 3, 2);
let someInputs = [0.5, 0.2, 0.4, 0.3, 0.2];
let output = nn.feedforward(someInputs);
```

This code will create a Neural Network consisting of 5 input nodes, 3 hidden nodes, and 2 output nodes. This neural network will only have 1 hidden layer. I may expand it to accept multiple hidden layers in the future.

You can pass in an array for the inputs, and it gets converted to a Matrix object internally, then it outputs a 2D array. The output will look something like this:

```
[
  [0.2313213],
  [0.1231234]
]
```

So, to access any particular output node you would simply type in <code>output[i][0]</code> where <code>i</code> is the output node you are trying to access.

#### Evolution Example
Let's say you wanted to make your neural network evolve based on two of the strongest pairs. It is relatively simple to do using the library in its current state.

There are two ways you can go about this, you can either create "baby" neural networks using to parents, or you can clone a neural network and simply mutate the genes. Here is two coded examples using my library, the examples assume that you have two strong neural networks named <code>strongOne</code> and <code>strongOne2</code>.

```
// Create a baby using two neural networks
let baby = NeuralNetwork.makeBaby(strongOne, strongOne2);
baby.mutate(0.001);

// Create a baby using one neural network
let otherBaby = strongOne.clone();
otherBaby.mutate(0.001);
```

In the above example, I have declared a variable called baby that inherits the genes from two parents. The two parents are assumed to be NeuralNetwork objects. What happens internally is that the two parents genes are averaged and passed on to the child, so this provides a child that is "in between" the parents genes.

Then, I mutate it. Right now, the mutation function works by taking a maximum mutation allowed as a parameter, then all the biases and weights are mutated no more than plus or minus the maximum mutation rate. I may change this to randomly mutate only a few genes in the future.

If you only want to use one neural network to make a baby, you can simply clone the neural network and then mutate the genes.

## Some Pictures
Here are some pictures of Artificial Intelligence I have created using this library.

![SimpleAI](/Images/SimpleAI.png)

This AI was training the blue dots to reach the green dot in as fast a time as possible.
