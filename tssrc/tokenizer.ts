enum TokenType {
	Word,
	LineBreak
}

class Token {
	readonly text: string;
	readonly type: TokenType;

	constructor(text: string, type: TokenType) {
		this.text = text;
		this.type = type;
	}
}

class MDTokenizer {
	readonly text: string;
	loc: number;
	start: number;
	tokens: Token[];

	constructor(text: string) {
		this.text = text;
		this.loc = 0;
	}

	peek(): string {
		return this.loc + 1 >= this.text.length ? '\0' : this.text[this.loc + 1];
	}

	currChar(): string {
		return this.loc >= this.text.length ? '\0' : this.text[this.loc];
	}

	isWhitespace(c: string): boolean {
		return (c == ' ' || c == '\n' || c == '\0');
	}

	scanText(): string {
		this.start = this.loc;

		while (!this.isWhitespace(this.currChar()))
			++this.loc;
	
		return this.text.substring(this.start, this.loc);
	}

	skipWhitespace() {
		while (this.isWhitespace(this.currChar()))
			++this.loc;
	}

	scanToken() {
		this.skipWhitespace();

		switch (this.currChar()) {
			case '\0':
				return;
			default:
				const word = this.scanText();
				this.tokens.push(new Token(word, TokenType.Word));
				break;
		}
	}
	
	tokenize(): Token[] {
		this.tokens = [];

		while (this.currChar() != '\0') {
			this.scanToken();			
		}

		return this.tokens;
	}
}

export { MDTokenizer, TokenType };
