# Class-Predictor
Predicts a user's best class choice based on a weighted node graph

This project is written in Javascript and uses a custom Node Graph data structure to store a university's classes. A user can then specify their major, what classes they have taken (if any), and a rating for each class. Every class taken removes that node and connects the connections of that node with the rating of that node (1 = best 5 = worst).

Depending on the class reccomendation, the user will start on a particular node. Then, the algorithm will find the shortest path to all surrounding nodes. Then, the algorithm sorts the nodes by the total of the edge weights, and returns a sorted list to the user with the most preferable classes to take based on the user's background and previous experience.

This approach is designed to be extreamly scalable and adaptable to new factors that can dictate class recomendations. A CSV file of all class parameters can be specified, and the more parameters two classes have in common, the lower the edge weight of that connection (classes that have nothing in common start with no connection).

When a user rates a class they have taken, the goal is that all nodes connected to that class will now become interconnected with a weight based on the rating they gave. This allows classes that are related to the class the user took to potentially have less weight by removing one of the weighted edges. However, if a class is rated poorly, the aditional weight to the new edge can offset the loss of the edge, making the class lower in priority.

I will continue to improve on this approach as I run into challenges, but the goal is to keep it as broad as possible to allow easy additions from end users as they request more class details to be added.
