enum TokenType {
	Word,
	LineBreak,
	BoldMarker,
	UnorderedListItem,
	LinkDescStart,
	LinkDescEnd,
	LinkUrlStart,
	LinkUrlEnd,
	EscapedChar,
	Heading1,
	Heading2,
	Heading3
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
			case '#':
			case '[':
			case ']':
			case '(':
			case ')':
				return true;
			default:
				return false;
		}
	}

	// For my purposes, a heading starts at an unescaped # character and covers
	// the rest of the line
	scanHeading(): Token {
		let heading: number;
		for (heading = 0; this.currChar() == '#'; ++this.loc, ++heading)
			;

		let start = this.loc;
		while (this.peek() != '\n' && this.peek() != '\0')
			++this.loc;

		let h: TokenType;
		if (heading == 1)
			h = TokenType.Heading1;
		else if (heading == 2)
			h = TokenType.Heading2;
		else
			h = TokenType.Heading3;

		const text = this.text.substring(start, this.loc + 1).trim();
		const t = new Token(text, h);

		++this.loc;

		return t;
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
			case '[':
				this.tokens.push(new Token("", TokenType.LinkDescStart));
				++this.loc;
				break;
			case ']':
				this.tokens.push(new Token("", TokenType.LinkDescEnd));
				++this.loc;
				break;
			case '(':
				this.tokens.push(new Token("", TokenType.LinkUrlStart));
				++this.loc;
				break;
			case ')':
				this.tokens.push(new Token("", TokenType.LinkUrlEnd));
				++this.loc;
				break;
			case '\\':
				this.tokens.push(new Token(this.peek(), TokenType.EscapedChar));
				this.loc += 2;
				break;
			case '#':
				const token = this.scanHeading();
				this.tokens.push(token);
				break;
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
