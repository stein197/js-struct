// TODO: compressing
// TODO
export default class Trie {

	// TODO: Should it be replaced with Map with custom generic type?
	private __children: {[key: string]: Trie} = {};
	private __parent: Trie | null = null;
	private __end: boolean = false;

	public constructor() {}

	public hasPrefix(prefix: string, exact: boolean = false): boolean {}

	public getPrefix(prefix: string, exact: boolean = false): Trie | null {}

	public addPrefix(prefix: string, exact: boolean = false): void {}

	public removePrefix(prefix: string, exact: boolean = false) {}

	public getParent(): Trie | null {}

	public toArray(): string[] {}

	public forEach(f: (prefix: string) => void): void {} // TODO: Replace with iterator

	public length(): number {}
	
	public static fromArray(data: string): Trie {}
}
