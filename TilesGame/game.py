import random
from collections import deque

initial_state = {
    'a': 7, 'b': 2, 'c': 4,
    'd': 5, 'e': None, 'f': 6,
    'g': 8, 'h': 3, 'i': 1
}

target_state = {
    'a': 7, 'b': 2, 'c': 4,
    'd': 5, 'e': 6, 'f': None,
    'g': 8, 'h': 3, 'i': 1
}

# Number of incorrect positions
def h1(current, target):
    shared_items = {x for x in current.keys() if current[x] == target[x]}
    return len(shared_items)

# Manhattan Distance
def h2(current, target):
    total = 0
    return total

# Number of movements to get tile to the right position
def h3():
    pass

def move(state, origin, destination):
    # Create a copy of state
    tmpSet = state.copy()
    # Assign origin to destination
    tmpSet[destination] = tmpSet[origin]
    # Make origin none
    tmpSet[origin] = None
    return tmpSet

# Using actual state constructs possible states after one movement
def possible_movements(state: set):
    states = []
    if state['a'] == None:
        # Move b to a
        states.append(move(state, 'b', 'a'))
        # Move d to a
        states.append(move(state, 'd', 'a'))
    elif state['b'] == None:
        # Move a to b
        states.append(move(state, 'a', 'b'))
        # Move c to b
        states.append(move(state, 'c', 'b'))
        # Move e to b
        states.append(move(state, 'e', 'b'))
    elif state['c'] == None:
        # Move b to c
        states.append(move(state, 'b', 'c'))
        # Move f to c
        states.append(move(state, 'f', 'c'))
    elif state['d'] == None:
        # Move a to d
        states.append(move(state, 'a', 'd'))
        # Move e to d
        states.append(move(state, 'e', 'd'))
        # Move g to d
        states.append(move(state, 'g', 'd'))
    elif state['e'] == None:
        # Move b to e
        states.append(move(state, 'b', 'e'))
        # Move d to e
        states.append(move(state, 'd', 'e'))
        # Move f to e
        states.append(move(state, 'f', 'e'))
        # Move h to e
        states.append(move(state, 'h', 'e'))
    elif state['f'] == None:
        # Move c to f
        states.append(move(state, 'c', 'f'))
        # Move e to f
        states.append(move(state, 'e', 'f'))
        # Move i to f
        states.append(move(state, 'i', 'f'))
    elif state['g'] == None:
        # Move d to g
        states.append(move(state, 'd', 'g'))
        # Move h to g
        states.append(move(state, 'h', 'g'))
    elif state['h'] == None:
        # Move e to h
        states.append(move(state, 'e', 'h'))
        # Move g to h
        states.append(move(state, 'g', 'h'))
        # Move i to h
        states.append(move(state, 'i', 'h'))
    elif state['i'] == None:
        # Move h to i
        states.append(move(state, 'h', 'i'))
        # Move f to i
        states.append(move(state, 'f', 'i'))
    return states

def solve(current, target):
    visited = deque()
    # Max 10000 iterations for testing
    for i in range(10000):
        # Check answer
        if current == target:
            return i
        # Get possible movements
        future = possible_movements(current)
        totals = []
        for state in future:
            # Compute heuristics
            totals.append(h1(state, target) + h2(state, target))
        # Move according to heuristics
        print(totals)
        print(min(totals))
        current = future[totals.index(min(totals))]
        return hash(current)
    return -1
        


print(solve(initial_state, target_state))