import itertools
import pandas as pd
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt

class lampGame:
    def __init__(self):
        # List represents family members walk speed
        self.startSide = [1, 3, 6, 8, 12]
        # Side 2 is empty
        self.endSide = []
        # Lamp duration
        self.lampTime = 30
        # Lamp location
        self.lampSide = 1
        self.df = pd.DataFrame({ 'from':[], 'to':[]})

    # Returns what persons to pick next
    def h1(self):
        pairs = []
        costs = []
        # If the lamp is on side 1
        # take the shorter and larger number and cross
        if self.lampSide == 1:
            # For every posible pair to move
            for pair in itertools.combinations(self.startSide, r=2):
                # Find the cost -> cost of min + min between return
                if len(self.endSide) != 0:
                    min1 = min(self.endSide)
                else:
                    min1 = 99999
                # Lo que "mueves"
                mueve = sum(pair)
                # El minimo costo de retorno
                retorno = min(min1, min(pair))
                # ratio entre movimiento y costo
                cost = retorno + max(pair)
                ratio = mueve / cost
                pairs.append(pair)
                costs.append(ratio)
        # If lamp is on side 2 return with the fastest person
        else:
            m = min(self.endSide)
            pairs.append((m, None))
            costs.append(m)
        return pairs, costs

    # Updates peoples location and lamp duration
    def cross(self, side1, side2, people):
        for p in people:
            side1.remove(p)
            side2.append(p)
        return side1, side2

    def addToDataFrame(self, node1, node2):
        df2 = pd.DataFrame({ 'from':[node1], 'to':[node2]})
        self.df = self.df.append(df2)

    def bruteForce(self, startSide, endSide, lampTime, lampSide):
        if lampTime == 0:
            return
        # Current node to draw the tree
        currentNode = str(startSide) + str(endSide)
        # Determine all the possible movements from the current point
        if self.lampSide == 1:
            # For every posible pair to move
            for pair in itertools.combinations(self.startSide, r=2):
                # Determine state after move
                side1, side2 = self.cross(startSide[:], endSide[:], pair)
                nextNode = str(side1) + str(side2)
                self.addToDataFrame(currentNode, nextNode)
                # Decide where to go, brute force goes to all
                # self.bruteForce(side1, side2,)
        # If lamp is on side 2 return with the fastest person
        else:
            pass
            



    def recursive(self, endSide, startSide):
        pass

    def start(self):
        # Solve with depth first search
        self.bruteForce(self.startSide[:], self.endSide[:], self.lampTime, self.lampSide)
        # Print paths
        print(self.df)
        G=nx.from_pandas_edgelist(self.df, 'from', 'to')
        # Fruchterman Reingold
        nx.draw(G, with_labels=True, node_size=1500, node_color="skyblue", pos=nx.fruchterman_reingold_layout(G))
        plt.title("fruchterman_reingold")
        plt.show()


game = lampGame()
game.start()