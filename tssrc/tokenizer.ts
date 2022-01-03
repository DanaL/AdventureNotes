enum TokenType {
	Word,
	LineBreak,
	BoldMarker,
	UnorderedListItem,
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

	isSpecialChar(c: string): boolean {
		switch (c) {
			case '\\':
			case '*':
			case '_':
			case '=':
			case '-':
				return true;
			default:
				return false;
		}
	}

	scanText(): string {
		this.start = this.loc;

		while (!this.isWhitespace(this.currChar()) && !this.isSpecialChar(this.currChar()))
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
			case '*':
				if (this.peek() == '*') {
					this.tokens.push(new Token("", TokenType.BoldMarker));
					this.loc += 2;
				}
				else {
					this.tokens.push(new Token("", TokenType.UnorderedListItem));
					++this.loc;
				}
				break;
			default:
				const word = this.scanText();
				console.log("fuck " + word);
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
