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
	// TODO
	mocha.describe("getPrefix()", () => {});
	// TODO
	mocha.describe("addPrefix()", () => {});
	// TODO
	mocha.describe("removePrefix()", () => {});
	// TODO
	mocha.describe("getParent()", () => {});
	// TODO
	mocha.describe("toArray()", () => {});
	// TODO
	mocha.describe("fromArray()", () => {});
	// TODO
	mocha.describe("create()", () => {});
	// TODO
	mocha.describe("Data of the children", () => {});
});

function create(): Trie {
	return Trie.fromArray(["First", "Second", "Third"]);
}

function iterate(trie: Trie): [number, string[]] {
	let i = 0;
	let result: string[] = [];
	for (const word of trie) {
		i++;
		result.push(word);
	}
	return [i, result];
}
