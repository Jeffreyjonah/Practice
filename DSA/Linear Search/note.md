If we were to describe the efficiency of linear search in its totality, we’d say that linear search is O(1) in
a best-case scenario, and O(N) in a worst-case scenario.

With linear search, if the value we’re searching for is in the final cell or is
greater than the value in the final cell, we have to inspect each and every
element.

For an array of size 100, this would take 100 steps.

When we use binary search, however, each guess we make eliminates half of
the possible cells we’d have to search. In our very first guess, we get to eliminate a whopping 50 cells.
