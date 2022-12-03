import type {Cloneable, ObjectMap} from "@stein197/ts-util";

// TODO: compressing
/**
 * Trie data structure. Allows to quickly search, insert and remove strings. Instead of storing strings in an array,
 * they could be stored in a trie. For example, this array:
 * ```ts
 * [
 * 	"bot",
 * 	"bottle",
 * 	"bottom"
 * ]
 * ```
 * will be represented in a trie like this:
 * ```
 * B
 * ╚═ O
 *    ╚═ T
 *       ╚═ T
 *          ╠═ O
 *          ║  ╚═ M
 *          ╚═ L
 *             ╚═ E
 * ```
 * The trie can also hold values like regular maps. By default tries don't contain any values and behave much like
 * arrays. But you can store data associated with prefix much like maps:
 * ```ts
 * trie.setValue("apple", 10);
 * trie.getValue("apple"); // 10
 * ```
 * Not that it works only with completed words, non-final prefixes cannot contain values.
 * @typeParam T - Type of the values stored in a trie.
 */
class Trie<T = null> implements Cloneable<Trie<T>> {

	/** @private */
	private readonly __children: {[key: string]: Trie<T>} = {}; // TODO: Should it be replaced with Map with custom generic type?
	/** @private */
	private __parent: Trie<T> | null = null;
	/** @private */
	private __end: boolean = false;
	/** @private */
	private __length: number = 0;
	/** @private */
	private __value: T | null = null;

	/**
	 * Returns total amount of words in the trie.
	 */
	public get length(): number {
		return this.__length;
	}

	private constructor(private readonly __key: string) {}

	/**
	 * Iterates over strings. Words are returning in order they were inserted.
	 * @example
	 * ```ts
	 * for (const [prefix] of Trie.fromArray(["bot", "bottle", "bottom"]))
	 * 	console.log(prefix);
	 * > "bot"
	 * > "bottle"
	 * > "bottom"
	 * for (const [prefix, value] of Trie.fromMap({First: 1, Second: 2, Third: 3}))
	 * 	console.log(prefix, value);
	 * > "First" 1
	 * > "Second" 2
	 * > "Third" 3
	 * ```
	 */
	public *[Symbol.iterator](): Generator<[string, T | null]> {
		for (const trie of Trie.iterate(this)) {
			let string = "";
			let curTrie: Trie<T> | null = trie;
			const curValue = curTrie.__value;
			while (curTrie) {
				string = curTrie.__key + string;
				curTrie = curTrie.__parent;
			}
			yield [string, curValue];
		}
	}

	/**
	 * Stringifies the current trie - returns the string path from the root trie till the current trie.
	 * @returns The full string path from the root till the current trie.
	 * @example
	 * ```ts
	 * const t = Trie.fromArray(["bot", "bottle"]);
	 * t.getPrefix("bott", false).toString(); // "bott"
	 * ```
	 */
	public toString(): string {
		let result = "";
		let curTrie: Trie<T> | null = this;
		while (curTrie) {
			result = curTrie.__key + result;
			curTrie = curTrie.__parent;
		}
		return result;
	}

	/**
	 * Searches for a passed string.
	 * @param prefix String to search.
	 * @param exact Should the searching be exact. If set to `true` then it will be searched to exactly match the
	 *              prefix, i.e. the same as if searching for a string in an array of strings. Otherwise, the searching
	 *              will be performed to search for any string that starts with the specified prefix, i.e. the same as a
	 *              searching for a string, that starts with a specified substring in an array of strings.
	 * @returns `true` if the match was found.
	 * @example
	 * ```ts
	 * const trie = Trie.fromArray(["apple"]);
	 * trie.hasPrefix("apple", true);  // true
	 * trie.hasPrefix("app", true);    // false
	 * trie.hasPrefix("app", false);   // true
	 * ```
	 */
	public hasPrefix(prefix: string, exact: boolean = true): boolean {
		const p = this.getPrefix(prefix, exact);
		return p != null && (p.__end || !exact);
	}

	/**
	 * Returns a trie corresponding to the passed prefix.
	 * @param prefix Prefix to return.
	 * @param exact Should the searching be exact. If set to `true` then it will be searched to exactly match the
	 *              prefix, i.e. the same as if searching for a string in an array of strings. Otherwise, the searching
	 *              will be performed to search for any string that starts with the specified prefix, i.e. the same as a
	 *              searching for a string, that starts with a specified substring in an array of strings.
	 * @returns Matched prefix or `null` if there were no matches.
	 * @example
	 * ```ts
	 * const trie = Trie.fromArray(["apple"]);
	 * trie.getPrefix("apple", true);  // Trie (at "apple" position)
	 * trie.getPrefix("app", true);    // null
	 * trie.getPrefix("app", false);   // Trie (at "app" position)
	 * ```
	 */
	public getPrefix(prefix: string, exact: boolean = true): Trie<T> | null {
		let curPrefix: Trie<T> | null = this;
		for (const char of prefix) {
			curPrefix = curPrefix.__children[char];
			if (!curPrefix)
				return null;
		}
		return exact ? (curPrefix.__end ? curPrefix : null) : curPrefix;
	}

	/**
	 * Adds a prefix (word) to the trie.
	 * @param prefix Prefix (word) to add.
	 */
	public addPrefix(prefix: string): void {
		if (this.hasPrefix(prefix, true))
			return;
		let curPrefix: Trie<T> = this;
		let tmpPrefix = curPrefix.__parent;
		while (tmpPrefix != null) {
			tmpPrefix.__length++;
			tmpPrefix = tmpPrefix.__parent;
		}
		for (const char of prefix) {
			curPrefix.__length++;
			if (!curPrefix.__children[char]) {
				const childPrefix = new Trie<T>(char);
				childPrefix.__parent = curPrefix;
				curPrefix.__children[char] = childPrefix;
			}
			curPrefix = curPrefix.__children[char];
		}
		curPrefix.__length++;
		curPrefix.__end = true;
	}

	/**
	 * Removes a prefix (word) from the trie.
	 * @param prefix Prefix (word) to remove.
	 */
	public removePrefix(prefix: string): void {
		let curPrefix = this.getPrefix(prefix, true);
		if (!curPrefix)
			return;
		curPrefix.__end = false;
		while (curPrefix) {
			curPrefix.__length--;
			const parentPrefix: Trie<T> | null = curPrefix.__parent;
			if (!curPrefix.__length) {
				curPrefix.__parent = null;
				delete parentPrefix!.__children[curPrefix.__key];
			}
			curPrefix = parentPrefix;
		}
	}

	/**
	 * Sets a value associated with specified word.
	 * @param prefix Word at which to set value.
	 * @param value Value to set or null to delete.
	 */
	public setValue(prefix: string, value: T | null): void {
		const trie = this.getPrefix(prefix, true);
		if (trie)
			trie.__value = value;
	}

	/**
	 * Returns a value associated with specified word.
	 * @param prefix Associated word at which to return value.
	 * @returns Value associated with word.
	 */
	public getValue(prefix: string): T | null {
		const trie = this.getPrefix(prefix, true);
		return trie?.__value ?? null;
	}

	/**
	 * Returns parent trie.
	 * @returns Parent trie of the current one or `null` if this is the root one.
	 */
	public getParent(): Trie<T> | null {
		return this.__parent;
	}

	/**
	 * Returns all words as an array. It's the opposite of {@link Trie.fromArray}. Words will be returned in order they
	 * were inserted.
	 * @returns All words in the trie.
	 * @example
	 * ```ts
	 * Trie.fromArray(["apple"]).toArray(); // ["apple"]
	 * ```
	 */
	public toArray(): string[] {
		return [...this].map(([key]) => key);
	}

	/**
	 * Returns all words and their values as a plain map. It's the opposite of {@link Trie.fromMap}.
	 * @returns All words and corresponding values.
	 */
	public toMap(): ObjectMap<T | null> {
		const result: ObjectMap<T | null> = {};
		for (const [key, value] of this)
			result[key] = value;
		return result;
	}

	/**
	 * Performs deep clone.
	 * @returns Cloned trie.
	 */
	public clone(): Trie<T> {
		return Trie.fromMap<T>(this.toMap());
	}

	/**
	 * Creates a trie from a string array. Discards duplicates. The opposite of it is {@link Trie.toArray}
	 * @param data An array of strings.
	 * @returns A trie that contains all strings in {@link data}.
	 */
	public static fromArray(data: string[]): Trie {
		const result = Trie.create();
		for (const string of data)
			result.addPrefix(string);
		return result;
	}

	/**
	 * Creates a trie from map. The opposite of it is {@link Trie.toMap}.
	 * @param data Map to parse. Could be plain maps or {@link Map}.
	 * @returns A trie that contains all strings and their corresponding values in {@link data}.
	 */
	public static fromMap<T>(data: ObjectMap<T | null>): Trie<T> {
		const result = Trie.create<T>();
		for (const key in data) {
			result.addPrefix(key);
			result.setValue(key, data[key]);
		}
		return result;
	}

	/**
	 * Creates an empty trie.
	 * @returns An empty trie.
	 */
	public static create<T = null>(): Trie<T> {
		return new Trie<T>("");
	}

	private static *iterate<T>(trie: Trie<T>): Generator<Trie<T>> {
		if (trie.__end)
			yield trie;
		for (const char in trie.__children)
			yield* Trie.iterate(trie.__children[char]);
	}
}

export = Trie;
