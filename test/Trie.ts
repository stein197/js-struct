import * as assert from "assert";
import * as mocha from "mocha";
import Trie = require("../src/Trie");

mocha.describe("Trie", () => {
	mocha.describe("get length()", () => {
		mocha.it("Should return 0 for empty trie", () => {
			assert.equal(Trie.fromArray([]).length, 0);
			assert.equal(Trie.create().length, 0);
		});
		mocha.it("Should decrease after removing an existing prefix", () => {
			const t = createArrayed();
			t.removePrefix("First");
			assert.equal(t.length, 2);
		});
		mocha.it("Should be the same after an attempt to remove non-existing prefix", () => {
			const t = createArrayed();
			t.removePrefix("Fourth");
			assert.equal(t.length, 3);
		});
		mocha.it("Should be the same after an attempt to remove partial (not exact) prefix", () => {
			const t = createArrayed();
			t.removePrefix("Firs");
			assert.equal(t.length, 3);
		});
		mocha.it("Should increase after adding a prefix", () => {
			const t = createArrayed();
			t.addPrefix("Fourth");
			assert.equal(t.length, 4);
		});
		mocha.it("Should increase after an adding existing non-final prefix", () => {
			const t = createArrayed();
			t.addPrefix("Fi");
			assert.equal(t.length, 4);
		});
		mocha.it("Should be the same after an attempt to add an existing prefix", () => {
			const t = createArrayed();
			t.addPrefix("First");
			assert.equal(t.length, 3);
		});
		mocha.it("Should be the same after removing an empty string if the trie does not contain an empty one", () => {
			const t = createArrayed();
			t.removePrefix("");
			assert.equal(t.length, 3);
		});
		mocha.it("Should decrease after removing an empty string if the trie contain an empty one", () => {
			const t = Trie.fromArray(["First", "Second", "Third", ""]);
			assert.equal(t.length, 4);
			t.removePrefix("");
			assert.equal(t.length, 3);
		});
		mocha.it("Should increase after adding an empty string", () => {
			const t = createArrayed();
			assert.equal(t.length, 3);
			t.addPrefix("");
			assert.equal(t.length, 4);
		});
		mocha.it("Should return correct number", () => {
			const t = createArrayed();
			assert.equal(t.length, 3);
		});
	});
	mocha.describe("toString()", () => {
		mocha.it("Should return empty string when stringifying root trie", () => {
			const t = createArrayed();
			assert.equal(t.toString(), "");
		});
		mocha.it("Should return correct result", () => {
			const t = createArrayed();
			assert.equal(t.getPrefix("Fi", false)!.toString(), "Fi");
		});
	});
	mocha.describe("*[Symbol.iterator]()", () => {
		mocha.it("The loop should be empty when a trie is empty", () => {
			const t = Trie.fromArray([]);
			const [i, array] = iterate(t);
			assert.equal(i, 0);
			assert.deepStrictEqual(array, []);
		});
		mocha.it("The loop iterations count should be decreased after removing an existing prefix", () => {
			const t = createArrayed();
			t.removePrefix("First");
			const [i, array] = iterate(t);
			assert.equal(i, 2);
			assert.deepStrictEqual(array, ["Second", "Third"]);
		});
		mocha.it("The loop should have the same amount of iterations after an attempt to remove non-existing prefix", () => {
			const t = createArrayed();
			t.removePrefix("Fourth");
			const [i, array] = iterate(t);
			assert.equal(i, 3);
			assert.deepStrictEqual(array, ["First", "Second", "Third"]);
		});
		mocha.it("The loop should have the same amount of iterations after an attempt to remove partial (not exact) prefix", () => {
			const t = createArrayed();
			t.removePrefix("Firs");
			const [i, array] = iterate(t);
			assert.equal(i, 3);
			assert.deepStrictEqual(array, ["First", "Second", "Third"]);
		});
		mocha.it("The loop should increase the amount of iterations after adding a prefix", () => {
			const t = createArrayed();
			t.addPrefix("Fourth");
			const [i, array] = iterate(t);
			assert.equal(i, 4);
			assert.deepStrictEqual(array, ["First", "Fourth", "Second", "Third"]);
		});
		mocha.it("The loop should increase the amount of iterations after adding an existing non-final prefix", () => {
			const t = createArrayed();
			t.addPrefix("Fi");
			const [i, array] = iterate(t);
			assert.equal(i, 4);
			assert.deepStrictEqual(array, ["Fi", "First", "Second", "Third"]);
		});
		mocha.it("The loop should have the same amount of iterations after an attempt to add an existing prefix", () => {
			const t = createArrayed();
			t.addPrefix("First");
			const [i, array] = iterate(t);
			assert.equal(i, 3);
			assert.deepStrictEqual(array, ["First", "Second", "Third"]);
		});
		mocha.it("The loop should iterate through a trie in alphabetical order", () => {
			const t = Trie.fromArray(["ghi", "def", "abc"]);
			const [, array] = iterate(t);
			assert.deepStrictEqual(array, ["abc", "def", "ghi"]);
		});
		mocha.it("The loop should have an expected amount of iterations", () => {
			const t = createArrayed();
			const [i, array] = iterate(t);
			assert.equal(i, 3);
			assert.deepStrictEqual(array, ["First", "Second", "Third"]);
		});
		mocha.it("The loop should have the same amount of iterations after removing an empty string if the trie does not contain an empty one", () => {
			const t = createArrayed();
			t.removePrefix("");
			const [i, array] = iterate(t);
			assert.equal(i, 3);
			assert.deepStrictEqual(array, ["First", "Second", "Third"]);
		});
		mocha.it("The loop should should decrease the amount of iterations after removing an empty string if the trie contain an empty one", () => {
			const t = Trie.fromArray(["First", "Second", "Third", ""]);
			t.removePrefix("");
			const [i, array] = iterate(t);
			assert.equal(i, 3);
			assert.deepStrictEqual(array, ["First", "Second", "Third"]);
		});
		mocha.it("The loop should should increase the amount of iterations after adding an empty string", () => {
			const t = createArrayed();
			t.addPrefix("");
			const [i, array] = iterate(t);
			assert.equal(i, 4);
			assert.deepStrictEqual(array, ["", "First", "Second", "Third"]);
		});
		mocha.it("Iterator should return both keys and values", () => {
			const t = Trie.fromMap({
				bot: 1,
				bottle: 2
			});
			t.addPrefix("bottom");
			t.setValue("bot", null);
			t.setValue("bottom", 3);
			let result: [string, number | null][] = [];
			for (const entry of t)
				result.push(entry);
			assert.deepStrictEqual(result, [["bot", null], ["bottle", 2], ["bottom", 3]]);
		});
	});
	mocha.describe("hasPrefix()", () => {
		mocha.it("Should always return true for empty string (exact == false)", () => {
			const t = Trie.create();
			assert.equal(t.hasPrefix("", false), true)
		});
		mocha.it("Should always return false for empty tries", () => {
			const t = createArrayed();
			assert.equal(t.hasPrefix("a", false), false);
		});
		mocha.it("Should return true when searching for existing word (exact == true)", () => {
			const t = createArrayed();
			assert.equal(t.hasPrefix("First", true), true);
		});
		mocha.it("Should return false when searching for non-existent word (exact == true)", () => {
			const t = createArrayed();
			assert.equal(t.hasPrefix("Fourth", true), false);
		});
		mocha.it("Should return true when searching for existing prefix and exact == false", () => {
			const t = createArrayed();
			assert.equal(t.hasPrefix("Fi", false), true);
		});
		mocha.it("Should return false when searching for non-existent prefix and exact == true", () => {
			const t = createArrayed();
			assert.equal(t.hasPrefix("Fo", true), false);
		});
		mocha.it("Should return false when searching for non-existent prefix and exact == false", () => {
			const t = createArrayed();
			assert.equal(t.hasPrefix("Fo", false), false);
		});
		mocha.it("Should return false for empty string when a trie does not contain it (exact == true)", () => {
			const t = createArrayed();
			assert.equal(t.hasPrefix("", true), false);
		});
		mocha.it("Should return true for empty string when a trie contain it (exact == true)", () => {
			const t = createArrayed();
			t.addPrefix("");
			assert.equal(t.hasPrefix("", true), true);
		});
		mocha.describe("After adding an existing prefix", () => {
			mocha.it("Should return true when searching for existing word (exact == true)", () => {
				const t = createArrayed();
				t.addPrefix("First");
				assert.equal(t.hasPrefix("First", true), true);
			});
			mocha.it("Should return false when searching for non-existent word (exact == true)", () => {
				const t = createArrayed();
				t.addPrefix("First");
				assert.equal(t.hasPrefix("Fourth", true), false);
			});
			mocha.it("Should return true when searching for existing prefix and exact == false", () => {
				const t = createArrayed();
				t.addPrefix("First");
				assert.equal(t.hasPrefix("Fi", false), true);
			});
			mocha.it("Should return false when searching for non-existent prefix and exact == true", () => {
				const t = createArrayed();
				t.addPrefix("First");
				assert.equal(t.hasPrefix("Fo", true), false);
			});
			mocha.it("Should return false when searching for non-existent prefix and exact == false", () => {
				const t = createArrayed();
				t.addPrefix("First");
				assert.equal(t.hasPrefix("Fo", false), false);
			});
		});
		mocha.describe("After removing an existing prefix", () => {
			mocha.it("Should return false when searching for removed word (exact == true)", () => {
				const t = createArrayed();
				t.removePrefix("First");
				assert.equal(t.hasPrefix("First", true), false);
			});
			mocha.it("Should return true when searching for an existing word that starts with removed prefix", () => {
				const t = Trie.fromArray(["bot", "bottle"]);
				assert.equal(t.hasPrefix("bot", true), true);
				t.removePrefix("bot");
				assert.equal(t.hasPrefix("bot", true), false);
				assert.equal(t.hasPrefix("bottle", true), true);
			});
		});
		mocha.describe("After adding non-existent prefix", () => {
			mocha.it("Should return true when searching for added word (exact == true)", () => {
				const t = createArrayed();
				t.addPrefix("Fourth");
				assert.equal(t.hasPrefix("Fourth", true), true);
			});
		});
		mocha.describe("After removing non-existent prefix", () => {
			mocha.it("Should return true when searching for existing word (exact == true)", () => {
				const t = createArrayed();
				t.removePrefix("Fourth");
				assert.equal(t.hasPrefix("First", true), true);
			});
			mocha.it("Should return false when searching for non-existent word (exact == true)", () => {
				const t = createArrayed();
				t.removePrefix("Fourth");
				assert.equal(t.hasPrefix("Fourth", true), false);
			});
			mocha.it("Should return true when searching for existing prefix and exact == false", () => {
				const t = createArrayed();
				t.removePrefix("Fourth");
				assert.equal(t.hasPrefix("Fi", false), true);
			});
			mocha.it("Should return false when searching for non-existent prefix and exact == true", () => {
				const t = createArrayed();
				t.removePrefix("Fourth");
				assert.equal(t.hasPrefix("Fo", true), false);
			});
			mocha.it("Should return false when searching for non-existent prefix and exact == false", () => {
				const t = createArrayed();
				t.removePrefix("Fourth");
				assert.equal(t.hasPrefix("Fo", false), false);
			});
		});
	});
	mocha.describe("getPrefix()", () => {
		mocha.it("Should always return the current trie for empty string (exact == false)", () => {
			const t = Trie.create();
			assert.equal(t.getPrefix("", false), t);
		});
		mocha.it("Should always return null for empty tries", () => {
			const t = createArrayed();
			assert.equal(t.getPrefix("a", false), null);
		});
		mocha.it("Should return prefix when searching for existing word (exact == true)", () => {
			const t = createArrayed();
			assert.equal(t.getPrefix("First", true)!.toString(), "First");
			assert.equal(t.getPrefix("First", true)!.length, 1);
		});
		mocha.it("Should return null when searching for non-existent word (exact == true)", () => {
			const t = createArrayed();
			assert.equal(t.getPrefix("Fourth", true), null);
		});
		mocha.it("Should return prefix when searching for existing prefix and exact == false", () => {
			const t = createArrayed();
			assert.equal(t.getPrefix("Fi", false)!.toString(), "Fi");
			assert.equal(t.getPrefix("Fi", false)!.length, 1);
		});
		mocha.it("Should return null when searching for non-existent prefix and exact == true", () => {
			const t = createArrayed();
			assert.equal(t.getPrefix("Fo", true), null);
		});
		mocha.it("Should return null when searching for non-existent prefix and exact == false", () => {
			const t = createArrayed();
			assert.equal(t.getPrefix("Fo", false), null);
		});
		mocha.it("Should return null for empty string when a trie does not contain it (exact == true)", () => {
			const t = createArrayed();
			assert.equal(t.getPrefix("", true), null);
		});
		mocha.it("Should return root prefix for empty string when a trie contain it (exact == true)", () => {
			const t = createArrayed();
			t.addPrefix("");
			assert.equal(t.getPrefix("", true), t);
		});
		mocha.it("Should return null when searching for non-existent word (exact == true) after adding an existing prefix", () => {
			const t = createArrayed();
			t.addPrefix("First");
			assert.equal(t.getPrefix("Fourth", true), null);
		});
		mocha.it("Should return true when searching for added word (exact == true) after adding non-existent prefix", () => {
			const t = createArrayed();
			t.addPrefix("Fourth");
			assert.equal(t.getPrefix("Fourth", true)!.toString(), "Fourth");
		});
		mocha.describe("After removing an existing prefix", () => {
			mocha.it("Should return null when searching for removed word (exact == true)", () => {
				const t = createArrayed();
				t.removePrefix("First");
				assert.equal(t.getPrefix("First", true), null);
			});
			mocha.it("Should return prefix when searching for an existing word that starts with removed prefix", () => {
				const t = Trie.fromArray(["bot", "bottle"]);
				t.removePrefix("bot");
				assert.equal(t.getPrefix("bot", true), null);
				assert.equal(t.getPrefix("bottle", true)!.toString(), "bottle");
			});
		});	
	});
	mocha.describe("addPrefix()", () => {
		mocha.it("Should add a prefix when adding nonexistent prefix", () => {
			const t = createArrayed();
			t.addPrefix("Fourth");
			assert.deepStrictEqual(t.toArray(), ["First", "Fourth", "Second", "Third"]);
		});
		mocha.it("Should not add a prefix when adding existent prefix", () => {
			const t = createArrayed();
			t.addPrefix("First");
			assert.deepStrictEqual(t.toArray(), ["First", "Second", "Third"]);
		});
	});
	mocha.describe("removePrefix()", () => {
		mocha.it("Should remove prefix when removing existing prefix", () => {
			const t = createArrayed();
			t.removePrefix("First");
			assert.deepStrictEqual(t.toArray(), ["Second", "Third"]);
		});
		mocha.it("Should not remove prefix when removing nonexistent prefix", () => {
			const t = createArrayed();
			t.removePrefix("Fourth");
			assert.deepStrictEqual(t.toArray(), ["First", "Second", "Third"]);
		});
	});
	mocha.describe("setValue()", () => {
		mocha.it("Cannot set a value for non-final prefix", () => {
			const t = createMapped();
			t.setValue("fi", 12);
			assert.equal(t.getValue("fi"), null);
		});
		mocha.it("Cannot set a value for nonexistent prefix", () => {
			const t = createMapped();
			t.setValue("fourth", 12);
			assert.equal(t.getValue("fourth"), null);
		});
		mocha.it("Should return null after unsetting a value for a prefix that had one", () => {
			const t = createMapped();
			t.setValue("first", null);
			assert.equal(t.getValue("first"), null);
		});
		mocha.it("Should return new value after updatding a value for a prefix that had one", () => {
			const t = createMapped();
			t.setValue("first", 12);
			assert.equal(t.getValue("first"), 12);
		});
		mocha.it("Should return value after setting a value for a prefix that didn't have one", () => {
			const t = createMapped();
			t.addPrefix("fourth");
			t.setValue("fourth", 12);
			assert.equal(t.getValue("fourth"), 12);
		});
	});
	mocha.describe("getValue()", () => {
		mocha.it("Should return null when getting a value from non-final prefix", () => {
			const t = createMapped();
			assert.equal(t.getValue(""), null);
			assert.equal(t.getValue("fourth"), null);
		});
		mocha.it("Should return null when getting the corresponding prefix does not have a value", () => {
			const t = createArrayed();
			assert.equal(t.getValue("First"), null);
		});
		mocha.it("Should return correct result", () => {
			const t = createMapped();
			assert.equal(t.getValue("second"), 12);
		});
	});
	mocha.describe("getParent()", () => {
		mocha.it("Should return parent trie when the current one is not the root", () => {
			const t = createArrayed();
			assert.equal(t.getPrefix("F", false)!.getParent(), t);
		});
		mocha.it("Should return null when the current trie is root", () => {
			const t = createArrayed();
			assert.equal(t.getParent(), null);
		});
	});
	mocha.describe("toArray()", () => {
		mocha.it("Should return an empty array when the trie is empty", () => {
			const t = Trie.create();
			assert.deepStrictEqual(t.toArray(), []);
		});
		mocha.it("Should return an array of words sorted alphabetically", () => {
			const t = Trie.fromArray(["abc", "aab", "aba"]);
			assert.deepStrictEqual(t.toArray(), ["aab", "aba", "abc"]);
		});
	});
	mocha.describe("toMap()", () => {
		mocha.it("Should return an empty object when the trie is empty", () => {
			const t = Trie.create();
			assert.deepStrictEqual(t.toMap(), {});
		});
		mocha.it("Should return an object with nulls when there are no values", () => {
			const t = createArrayed();
			assert.deepStrictEqual(t.toMap(), {First: null, Second: null, Third: null});
		});
		mocha.it("Should return an object equal to the one that is passed to Trie.fromMap()", () => {
			const t = createMapped();
			assert.deepStrictEqual(t.toMap(), {first: 5, second: 12, third: 197});
		});
		mocha.it("Should return correct result after adding an entry", () => {
			const t = createMapped();
			t.addPrefix("fourth");
			assert.deepStrictEqual(t.toMap(), {first: 5, second: 12, third: 197, fourth: null});
		});
		mocha.it("Should return correct result after removing an entry", () => {
			const t = createMapped();
			t.removePrefix("third");
			assert.deepStrictEqual(t.toMap(), {first: 5, second: 12});
		});
		mocha.it("Should return correct result after adding a value to a prefix", () => {
			const t = createMapped();
			t.setValue("third", 100);
			assert.deepStrictEqual(t.toMap(), {first: 5, second: 12, third: 100});
		});
		mocha.it("Should return correct result after removing a valur from a prefix", () => {
			const t = createMapped();
			t.setValue("third", null);
			assert.deepStrictEqual(t.toMap(), {first: 5, second: 12, third: null});
		});
	});
	mocha.describe("clone()", () => {
		mocha.it("Should return an empty trie when cloning an empty one", () => {
			const t = Trie.create().clone();
			assert.deepStrictEqual(t.toMap(), {});
		});
		mocha.it("Should return correct result", () => {
			const t = createMapped().clone();
			assert.deepStrictEqual(t.toMap(), {first: 5, second: 12, third: 197});
		});
		mocha.it("Should return different object reference", () => {
			const t = createArrayed();
			const tClone = t.clone();
			assert.notEqual(t, tClone);
		});
		mocha.it("Should not affect the original trie when modifying a cloned one", () => {
			const t = createArrayed();
			const tClone = t.clone()
			tClone.addPrefix("Fourth");
			assert.deepStrictEqual(t.toArray(), ["First", "Second", "Third"]);
			assert.deepStrictEqual(tClone.toArray(), ["First", "Fourth", "Second", "Third"]);
		});
	});
	mocha.describe("fromArray()", () => {
		mocha.it("Should create an empty trie when an array is empty", () => {
			const t = Trie.fromArray([]);
			assert.deepStrictEqual(t.toArray(), []);
		});
		mocha.it("Should create a trie with specified entries", () => {
			const t = Trie.fromArray(["first", "second", "third"]);
			assert.deepStrictEqual(t.toArray(), ["first", "second", "third"]);
		});
	});
	mocha.describe("fromMap()", () => {
		mocha.it("Should create an empty trie when a map is empty", () => {
			const t = Trie.fromMap({});
			assert.deepStrictEqual(t.toMap(), {});
		});
		mocha.it("Should create a trie with specified entries", () => {
			const t = Trie.fromMap({first: 5, second: 12, third: 197});
			assert.deepStrictEqual(t.toMap(), {first: 5, second: 12, third: 197});
		});
	});
	mocha.describe("create()", () => {
		mocha.it("Should create an empty trie", () => {
			assert.equal(Trie.create().length, 0);
			assert.equal([...Trie.create()].length, 0);
		});
	});
});

function createArrayed(): Trie {
	return Trie.fromArray(["First", "Second", "Third"]);
}

function createMapped(): Trie<number> {
	return Trie.fromMap({
		first: 5,
		second: 12,
		third: 197
	});
}

function iterate(trie: Trie): [number, string[]] {
	let i = 0;
	let result: string[] = [];
	for (const [key] of trie) {
		i++;
		result.push(key);
	}
	return [i, result];
}
