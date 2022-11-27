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
			const t = Trie.fromArray(["First", "Second", "Third"]);
			t.removePrefix("First");
			assert.equal(t.length, 2);
		});
		mocha.it("Should be the same after an attempt to remove non-existing prefix", () => {
			const t = Trie.fromArray(["First", "Second", "Third"]);
			t.removePrefix("Fourth");
			assert.equal(t.length, 3);
		});
		mocha.it("Should be the same after an attempt to remove partial (not exact) prefix", () => {
			const t = Trie.fromArray(["First", "Second", "Third"]);
			t.removePrefix("Firs");
			assert.equal(t.length, 3);
		});
		mocha.it("Should increase after adding a prefix", () => {
			const t = Trie.fromArray(["First", "Second", "Third"]);
			t.addPrefix("Fourth");
			assert.equal(t.length, 4);
		});
		mocha.it("Should increase after an adding existing non-final prefix", () => {
			const t = Trie.fromArray(["First", "Second", "Third"]);
			t.addPrefix("Fi");
			assert.equal(t.length, 4);
		});
		mocha.it("Should be the same after an attempt to add an existing prefix", () => {
			const t = Trie.fromArray(["First", "Second", "Third"]);
			t.addPrefix("First");
			assert.equal(t.length, 3);
		});
		mocha.it("Should return correct number", () => {
			const t = Trie.fromArray(["First", "Second", "Third"]);
			assert.equal(t.length, 3);
		});
	});
	mocha.describe("*[Symbol.iterator]()", () => {
		mocha.it("The loop should be empty when a trie is empty", () => {
			const t = Trie.fromArray([]);
			let i = 0;
			let array: string[] = [];
			for (const word of t) {
				i++;
				array.push(word);
			}
			assert.equal(i, 0);
			assert.deepStrictEqual(array, []);
		});
		mocha.it("The loop iterations count should be decreased after removing an existing prefix", () => {
			const t = Trie.fromArray(["First", "Second", "Third"]);
			t.removePrefix("First");
			let i = 0;
			let array: string[] = [];
			for (const word of t) {
				i++;
				array.push(word);
			}
			assert.equal(i, 2);
			assert.deepStrictEqual(array, ["Second", "Third"]);
		});
		mocha.it("The loop should have the same amount of iterations after an attempt to remove non-existing prefix", () => {
			const t = Trie.fromArray(["First", "Second", "Third"]);
			t.removePrefix("Fourth");
			let i = 0;
			let array: string[] = [];
			for (const word of t) {
				i++;
				array.push(word);
			}
			assert.equal(i, 3);
			assert.deepStrictEqual(array, ["First", "Second", "Third"]);
		});
		mocha.it("The loop should have the same amount of iterations after an attempt to remove partial (not exact) prefix", () => {
			const t = Trie.fromArray(["First", "Second", "Third"]);
			t.removePrefix("Firs");
			let i = 0;
			let array: string[] = [];
			for (const word of t) {
				i++;
				array.push(word);
			}
			assert.equal(i, 3);
			assert.deepStrictEqual(array, ["First", "Second", "Third"]);
		});
		mocha.it("The loop should increase the amount of iterations after adding a prefix", () => {
			const t = Trie.fromArray(["First", "Second", "Third"]);
			t.addPrefix("Fourth");
			let i = 0;
			let array: string[] = [];
			for (const word of t) {
				i++;
				array.push(word);
			}
			assert.equal(i, 4);
			assert.deepStrictEqual(array, ["First", "Fourth", "Second", "Third"]);
		});
		mocha.it("The loop should increase the amount of iterations after adding an existing non-final prefix", () => {
			const t = Trie.fromArray(["First", "Second", "Third"]);
			t.addPrefix("Fi");
			let i = 0;
			let array: string[] = [];
			for (const word of t) {
				i++;
				array.push(word);
			}
			assert.equal(i, 4);
			assert.deepStrictEqual(array, ["Fi", "First", "Second", "Third"]);
		});
		mocha.it("The loop should have the same amount of iterations after an attempt to add an existing prefix", () => {
			const t = Trie.fromArray(["First", "Second", "Third"]);
			t.addPrefix("First");
			let i = 0;
			let array: string[] = [];
			for (const word of t) {
				i++;
				array.push(word);
			}
			assert.equal(i, 3);
			assert.deepStrictEqual(array, ["First", "Second", "Third"]);
		});
		mocha.it("The loop should iterate through a trie in alphabetical order", () => {
			const t = Trie.fromArray(["ghi", "def", "abc"]);
			let array: string[] = [];
			for (const word of t) {
				array.push(word);
			}
			assert.deepStrictEqual(array, ["abc", "def", "ghi"]);
		});
		mocha.it("The loop should have an expected amount of iterations", () => {
			const t = Trie.fromArray(["First", "Second", "Third"]);
			let i = 0;
			let array: string[] = [];
			for (const word of t) {
				i++;
				array.push(word);
			}
			assert.equal(i, 3);
			assert.deepStrictEqual(array, ["First", "Second", "Third"]);
		});
	});
	// TODO
	mocha.describe("hasPrefix()", () => {});
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
