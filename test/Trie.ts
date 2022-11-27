import * as assert from "assert";
import * as mocha from "mocha";
import Trie from "../src/Trie";

mocha.describe("Trie", () => {
	// TODO
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
	// TODO
	mocha.describe("*[Symbol.iterator]()", () => {});
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
