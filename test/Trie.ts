import * as assert from "assert";
import * as mocha from "mocha";
import Trie from "../src/Trie";

mocha.describe("Trie", () => {
	mocha.describe("get length()", () => {
		mocha.it("Should return 0 for empty trie", () => {
			assert.equal(Trie.fromArray([]).length, 0);
			assert.equal(Trie.create().length, 0);
		});
		mocha.it("Should decrease after removing an existing prefix", () => {
			const t = create();
			t.removePrefix("First");
			assert.equal(t.length, 2);
		});
		mocha.it("Should be the same after an attempt to remove non-existing prefix", () => {
			const t = create();
			t.removePrefix("Fourth");
			assert.equal(t.length, 3);
		});
		mocha.it("Should be the same after an attempt to remove partial (not exact) prefix", () => {
			const t = create();
			t.removePrefix("Firs");
			assert.equal(t.length, 3);
		});
		mocha.it("Should increase after adding a prefix", () => {
			const t = create();
			t.addPrefix("Fourth");
			assert.equal(t.length, 4);
		});
		mocha.it("Should increase after an adding existing non-final prefix", () => {
			const t = create();
			t.addPrefix("Fi");
			assert.equal(t.length, 4);
		});
		mocha.it("Should be the same after an attempt to add an existing prefix", () => {
			const t = create();
			t.addPrefix("First");
			assert.equal(t.length, 3);
		});
		mocha.it("Should be the same after removing an empty string if the trie does not contain an empty one", () => {
			const t = create();
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
			const t = create();
			assert.equal(t.length, 3);
			t.addPrefix("");
			assert.equal(t.length, 4);
		});
		mocha.it("Should return correct number", () => {
			const t = create();
			assert.equal(t.length, 3);
		});
	});
	// TODO: Test that iterator returns both keys and values
	mocha.describe("*[Symbol.iterator]()", () => {
		mocha.it("The loop should be empty when a trie is empty", () => {
			const t = Trie.fromArray([]);
			const [i, array] = iterate(t);
			assert.equal(i, 0);
			assert.deepStrictEqual(array, []);
		});
		mocha.it("The loop iterations count should be decreased after removing an existing prefix", () => {
			const t = create();
			t.removePrefix("First");
			const [i, array] = iterate(t);
			assert.equal(i, 2);
			assert.deepStrictEqual(array, ["Second", "Third"]);
		});
		mocha.it("The loop should have the same amount of iterations after an attempt to remove non-existing prefix", () => {
			const t = create();
			t.removePrefix("Fourth");
			const [i, array] = iterate(t);
			assert.equal(i, 3);
			assert.deepStrictEqual(array, ["First", "Second", "Third"]);
		});
		mocha.it("The loop should have the same amount of iterations after an attempt to remove partial (not exact) prefix", () => {
			const t = create();
			t.removePrefix("Firs");
			const [i, array] = iterate(t);
			assert.equal(i, 3);
			assert.deepStrictEqual(array, ["First", "Second", "Third"]);
		});
		mocha.it("The loop should increase the amount of iterations after adding a prefix", () => {
			const t = create();
			t.addPrefix("Fourth");
			const [i, array] = iterate(t);
			assert.equal(i, 4);
			assert.deepStrictEqual(array, ["First", "Fourth", "Second", "Third"]);
		});
		mocha.it("The loop should increase the amount of iterations after adding an existing non-final prefix", () => {
			const t = create();
			t.addPrefix("Fi");
			const [i, array] = iterate(t);
			assert.equal(i, 4);
			assert.deepStrictEqual(array, ["Fi", "First", "Second", "Third"]);
		});
		mocha.it("The loop should have the same amount of iterations after an attempt to add an existing prefix", () => {
			const t = create();
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
			const t = create();
			const [i, array] = iterate(t);
			assert.equal(i, 3);
			assert.deepStrictEqual(array, ["First", "Second", "Third"]);
		});
		mocha.it("The loop should have the same amount of iterations after removing an empty string if the trie does not contain an empty one", () => {
			const t = create();
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
			const t = create();
			t.addPrefix("");
			const [i, array] = iterate(t);
			assert.equal(i, 4);
			assert.deepStrictEqual(array, ["", "First", "Second", "Third"]);
		});
	});
	mocha.describe("hasPrefix()", () => {
		mocha.it("Should always return true for empty string (exact == false)", () => {
			const t = Trie.create();
			assert.equal(t.hasPrefix("", false), true)
		});
		mocha.it("Should always return false for empty tries", () => {
			const t = create();
			assert.equal(t.hasPrefix("a", false), false);
		});
		mocha.it("Should return true when searching for existing word (exact == true)", () => {
			const t = create();
			assert.equal(t.hasPrefix("First", true), true);
		});
		mocha.it("Should return false when searching for non-existent word (exact == true)", () => {
			const t = create();
			assert.equal(t.hasPrefix("Fourth", true), false);
		});
		mocha.it("Should return true when searching for existing prefix and exact == false", () => {
			const t = create();
			assert.equal(t.hasPrefix("Fi", false), true);
		});
		mocha.it("Should return false when searching for non-existent prefix and exact == true", () => {
			const t = create();
			assert.equal(t.hasPrefix("Fo", true), false);
		});
		mocha.it("Should return false when searching for non-existent prefix and exact == false", () => {
			const t = create();
			assert.equal(t.hasPrefix("Fo", false), false);
		});
		mocha.it("Should return false for empty string when a trie does not contain it (exact == true)", () => {
			const t = create();
			assert.equal(t.hasPrefix("", true), false);
		});
		mocha.it("Should return false for empty string when a trie contain it (exact == true)", () => {
			const t = create();
			t.addPrefix("");
			assert.equal(t.hasPrefix("", true), true);
		});
		mocha.describe("After adding an existing prefix", () => {
			mocha.it("Should return true when searching for existing word (exact == true)", () => {
				const t = create();
				t.addPrefix("First");
				assert.equal(t.hasPrefix("First", true), true);
			});
			mocha.it("Should return false when searching for non-existent word (exact == true)", () => {
				const t = create();
				t.addPrefix("First");
				assert.equal(t.hasPrefix("Fourth", true), false);
			});
			mocha.it("Should return true when searching for existing prefix and exact == false", () => {
				const t = create();
				t.addPrefix("First");
				assert.equal(t.hasPrefix("Fi", false), true);
			});
			mocha.it("Should return false when searching for non-existent prefix and exact == true", () => {
				const t = create();
				t.addPrefix("First");
				assert.equal(t.hasPrefix("Fo", true), false);
			});
			mocha.it("Should return false when searching for non-existent prefix and exact == false", () => {
				const t = create();
				t.addPrefix("First");
				assert.equal(t.hasPrefix("Fo", false), false);
			});
		});
		mocha.describe("After removing an existing prefix", () => {
			mocha.it("Should return false when searching for removed word (exact == true)", () => {
				const t = create();
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
				const t = create();
				t.addPrefix("Fourth");
				assert.equal(t.hasPrefix("Fourth", true), true);
			});
		});
		mocha.describe("After removing non-existent prefix", () => {
			mocha.it("Should return true when searching for existing word (exact == true)", () => {
				const t = create();
				t.removePrefix("Fourth");
				assert.equal(t.hasPrefix("First", true), true);
			});
			mocha.it("Should return false when searching for non-existent word (exact == true)", () => {
				const t = create();
				t.removePrefix("Fourth");
				assert.equal(t.hasPrefix("Fourth", true), false);
			});
			mocha.it("Should return true when searching for existing prefix and exact == false", () => {
				const t = create();
				t.removePrefix("Fourth");
				assert.equal(t.hasPrefix("Fi", false), true);
			});
			mocha.it("Should return false when searching for non-existent prefix and exact == true", () => {
				const t = create();
				t.removePrefix("Fourth");
				assert.equal(t.hasPrefix("Fo", true), false);
			});
			mocha.it("Should return false when searching for non-existent prefix and exact == false", () => {
				const t = create();
				t.removePrefix("Fourth");
				assert.equal(t.hasPrefix("Fo", false), false);
			});
		});
	});
	// TODO
	mocha.describe("getPrefix()", () => {});
	// TODO
	mocha.describe("addPrefix()", () => {});
	// TODO
	mocha.describe("removePrefix()", () => {});
	// TODO
	mocha.describe("setValue()", () => {});
	// TODO
	mocha.describe("getValue()", () => {});
	// TODO
	mocha.describe("getParent()", () => {});
	// TODO
	mocha.describe("toArray()", () => {});
	// TODO
	mocha.describe("toMap()", () => {});
	// TODO
	mocha.describe("clone()", () => {});
	// TODO
	mocha.describe("fromArray()", () => {});
	// TODO
	mocha.describe("fromMap()", () => {});
	mocha.describe("create()", () => {
		mocha.it("Should create an empty trie", () => {
			assert.equal(Trie.create().length, 0);
			assert.equal([...Trie.create()].length, 0);
		});
	});
	// TODO
	mocha.describe("Data of the children", () => {});
});

function create(): Trie {
	return Trie.fromArray(["First", "Second", "Third"]);
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
