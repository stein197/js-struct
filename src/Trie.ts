// TODO: compressing
// TODO
export default class Trie {

	// TODO: Should it be replaced with Map with custom generic type?
	private __children: {[key: string]: Trie} = {};
	private __parent: Trie | null = null;
	private __end: boolean = false;
	private __length: number = 0;

	public constructor() {}

	/**
	 * Searches for a passed string.
	 * @param prefix String to search.
	 * @param exact Should the searching be exact. If set to `true` then it will be searched exactly (as a whole word).
	 *              It will be searched as a simple prefix otherwise.
	 * @returns `true` if the match was found.
	 * @example
	 * ```ts
	 * const trie = Trie.fromArray(["apple"]);
	 * trie.hasPrefix("app", true);  // false
	 * trie.hasPrefix("app", false); // true
	 * ```
	 */
	public hasPrefix(prefix: string, exact: boolean): boolean {
		const p = this.getPrefix(prefix, exact);
		return p != null && (p.__end || !exact);
	}

	/**
	 * Returns a trie corresponding to the passed prefix.
	 * @param prefix Prefix to return.
	 * @param exact Should the searching be exact. If set to `true` then it will be searched exactly (as a whole word).
	 *              It will be searched as a simple prefix otherwise.
	 * @returns Matched prefix or `null` if there were no matches.
	 * @example
	 * ```ts
	 * const trie = Trie.fromArray(["apple"]);
	 * trie.getPrefix("app", true);  // null
	 * trie.getPrefix("app", false); // Trie (at "app" position)
	 * ```
	 */
	public getPrefix(prefix: string, exact: boolean): Trie | null {
		let curPrefix: Trie | null = this;
		for (const char of prefix) {
			curPrefix = curPrefix.__children[char];
			if (!curPrefix)
				return null;
		}
		return exact ? (curPrefix.__end ? curPrefix : null) : curPrefix;
	}

	public addPrefix(prefix: string | Trie, exact: boolean = false): void {}

	public removePrefix(prefix: string, exact: boolean = false) {}

	/**
	 * Returns parent trie.
	 * @returns Parent trie of the current one or `null` if this is the root one.
	 */
	public getParent(): Trie | null {
		return this.__parent;
	}

	public toArray(): string[] {}

	public forEach(f: (prefix: string) => void): void {} // TODO: Replace with iterator

	public length(): number {}

	/**
	 * Creates a trie from a string array. Discards duplicates.
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
