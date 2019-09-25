import itertools

class lampGame:
    def __init__(self):
        # List represents family members walk speed
        self.initialSide = [1, 3, 6, 8, 12]
        # Side 2 is empty
        self.endSide = []
        # Lamp duration
        self.lamp = 30
        # Lamp location
        self.lampSide = 1

    # Returns what persons to pick next
    def h1(self):
        pairs = []
        costs = []
        # If the lamp is on side 1
        # take the shorter and larger number and cross
        if self.lampSide == 1:
            # For every posible pair to move
            for pair in itertools.combinations(self.initialSide, r=2):
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
    def cross(self, p1, p2):
        # Take person 1 and 2 from side 1 and move to side 2
        if self.lampSide == 1:
            # Take person 1 and 2 from side 1 and move to side 2
            self.initialSide.remove(p1)
            self.initialSide.remove(p2)
            self.endSide.append(p1)
            self.endSide.append(p2)
            self.lampSide = 0
        # Take person 1 and 2 from side 2 and move to side 1
        else:
            self.endSide.remove(p1)
            self.initialSide.append(p1)
            self.lampSide = 1
        # Longer walking speed is substracted to lamp
        if p2 == None:
            p2 = 0
        self.lamp -= max(p1, p2)

    def start(self):
        # While not all people have crossed
        while len(self.initialSide):
            if self.lamp < 0:
                print('SOLUTION NOT FOUND, EMPTY LAMP')
                return -1
            # Calculate heuristic
            pairs, costs = self.h1()
            # Move according to heuristic, get the min cost
            mi = min(costs)
            print(mi)
            # If two mins go for the little
            print('Chooosing ' + str(pairs[mi]))
            self.cross(*pairs[mi])
            print('Lamp left:' + str(self.lamp))
        print('Done')

game = lampGame()
game.start()