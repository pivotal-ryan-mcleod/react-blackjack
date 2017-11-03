import {toEqualInAnyOrderMatcher} from "./toEqualInAnyOrder";

expect.extend(toEqualInAnyOrderMatcher);

it('passes for the exact same array', () => {
    expect([1, 2, 3]).toEqualInAnyOrder([1, 2, 3]);
});

it('fails for completely different arrays', () => {
    expect([1, 2, 3]).not.toEqualInAnyOrder(['a', 'b', 'c']);
});

it('passes for the same array in a different order', () => {
    expect([1, 2, 3]).toEqualInAnyOrder([2, 1, 3])
});

it('fails if one of the arrays have extra items', () => {
    expect([1, 2, 3, 4]).not.toEqualInAnyOrder([2, 1, 3]);
    expect([1, 2, 3]).not.toEqualInAnyOrder([2, 4, 1, 3]);
});

it('uses deep equality', () => {
    expect([{'a': 1}, {'b': [1, 2]}]).toEqualInAnyOrder([{'b': [1, 2]}, {'a': 1}]);
    expect([{'a': 1}, {'b': [1, 2, 3]}]).not.toEqualInAnyOrder([{'b': [1, 2]}, {'a': 1}])
});