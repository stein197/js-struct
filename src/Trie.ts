// TODO: compressing
// TODO
export default class Trie {

	// TODO: Should it be replaced with Map with custom generic type?
	private __children: {[key: string]: Trie} = {};
	private __parent: Trie | null = null;
	private __end: boolean = false;
	private __length: number = 0;

	public *[Symbol.iterator]() {}

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
	public getPrefix(prefix: string, exact: boolean = true): Trie | null {
		let curPrefix: Trie | null = this;
		for (const char of prefix) {
			curPrefix = curPrefix.__children[char];
			if (!curPrefix)
				return null;
		}
		return exact ? (curPrefix.__end ? curPrefix : null) : curPrefix;
	}

	/**
	 * Adds a prefix to the trie.
	 * @param prefix Prefix to add.
	 * @param exact Should the insertion be exact. If set to `true` then the prefix will be inserted as a whole word
	 *              (just like an adding string to an array).
	 */
	public addPrefix(prefix: string, exact: boolean = true): void {
		if (exact && this.hasPrefix(prefix, true))
			return;
		let curPrefix: Trie = this;
		for (const char of prefix) {
			if (exact)
				curPrefix.__length++;
			if (!curPrefix.__children[char]) {
				const childPrefix = new Trie();
				childPrefix.__parent = curPrefix;
				curPrefix.__children[char] = childPrefix;
			}
			curPrefix = curPrefix.__children[char];
		}
		if (!exact)
			return;
		curPrefix.__length++;
		curPrefix.__end = true;
	}

	public removePrefix(prefix: string, exact: boolean = false) {}

	/**
	 * Returns parent trie.
	 * @returns Parent trie of the current one or `null` if this is the root one.
	 */
	public getParent(): Trie | null {
		return this.__parent;
	}

	/**
	 * Returns all words as an array. It's the opposite of {@link Trie.fromArray}.
	 * @returns All words in the trie.
	 * @example
	 * ```ts
	 * Trie.fromArray(["apple"]).toArray(); // ["apple"]
	 * ```
	 */
	public toArray(): string[] {
		const result = new Array(this.__length);
		let i = 0;
		for (const prefix of this)
			result[i++] = prefix;
		return result;
	}

	public length(): number {}

	/**
	 * Creates a trie from a string array. Discards duplicates. The opposite of it is {@link Trie.toArray}
	 * @param data An array of strings.
	 * @returns A trie that contains all strings in {@link data}.
	 */
	public static fromArray(data: string[]): Trie {
		const result = new Trie();
		for (const string of data)
			result.addPrefix(string, true);
		return result;
	}
}
