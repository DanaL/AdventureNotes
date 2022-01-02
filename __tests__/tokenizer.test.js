const tokenizer = require('../views/scripts/tokenizer');

test("Test charAt()", () => {
	const t = new tokenizer.MDTokenizer("foo");

	expect(t.currChar()).toEqual('f');

	t.loc = 2;
	expect(t.currChar()).toEqual('o');

	t.loc = 3;
	expect(t.currChar()).toEqual('\0');
});

test("Test peek()", () => {
	const t = new tokenizer.MDTokenizer("ab");
	expect(t.peek()).toEqual('b');
	++t.loc;
	expect(t.peek()).toEqual('\0');
});

test("Test scanText()", () => {
	const t = new tokenizer.MDTokenizer("foo b1*lah");
	let s = t.scanText();
	expect(s).toEqual("foo");

	t.skipWhitespace();

	s = t.scanText();
	expect(s).toEqual("b1*lah");
});

test("Test isWhitespace()", () => {
	const t = new tokenizer.MDTokenizer("foo");
	expect(t.isWhitespace(' ')).toBe(true);
	expect(t.isWhitespace('\n')).toBe(true);
	expect(t.isWhitespace('\0')).toBe(true);
	expect(t.isWhitespace('a')).toBe(false);
});


test('Basic string split', () => {
	const t = new tokenizer.MDTokenizer("The quick brown fox");
	res = t.tokenize();
	expect(res.length).toEqual(4);
	expect(res[0].text).toBe("The");
	expect(res[0].type).toBe(tokenizer.TokenType.Word);
	expect(res[1].text).toBe("quick");
	expect(res[1].type).toBe(tokenizer.TokenType.Word);
	expect(res[2].text).toBe("brown");
	expect(res[2].type).toBe(tokenizer.TokenType.Word);
	expect(res[3].text).toBe("fox");
	expect(res[3].type).toBe(tokenizer.TokenType.Word);
});

