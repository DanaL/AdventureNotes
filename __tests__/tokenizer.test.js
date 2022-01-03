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
	const t = new tokenizer.MDTokenizer("foo b12lah");
	let s = t.scanText();
	expect(s).toEqual("foo");

	t.skipWhitespace();

	s = t.scanText();
	expect(s).toEqual("b12lah");
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

test('Test bold', () => {
	const t = new tokenizer.MDTokenizer("Here is some **bold** stuff!");
	res = t.tokenize();

	expect(res[0].text).toBe("Here");
	expect(res[1].text).toBe("is");
	expect(res[2].text).toBe("some");
	expect(res[3].type).toBe(tokenizer.TokenType.BoldMarker);
	expect(res[4].text).toBe("bold");
	expect(res[5].type).toBe(tokenizer.TokenType.BoldMarker);
	expect(res[6].text).toBe("stuff!");
});

test('Ordered list', () => {
	const t = new tokenizer.MDTokenizer("* One\n* Two\n * Three");
	res = t.tokenize();

	expect(res[0].type).toBe(tokenizer.TokenType.UnorderedListItem);
	expect(res[1].type).toBe(tokenizer.TokenType.Word);
	expect(res[1].text).toBe("One");
	expect(res[2].type).toBe(tokenizer.TokenType.UnorderedListItem);
	expect(res[3].type).toBe(tokenizer.TokenType.Word);
	expect(res[3].text).toBe("Two");
	expect(res[4].type).toBe(tokenizer.TokenType.UnorderedListItem);
	expect(res[5].type).toBe(tokenizer.TokenType.Word);
	expect(res[5].text).toBe("Three");
});

test('Test link', () => {
	const t = new tokenizer.MDTokenizer("A link: [link name]  (http://foo.com)");
	res = t.tokenize();

	expect(res[0].type).toBe(tokenizer.TokenType.Word);
	expect(res[0].text).toBe("A");
	expect(res[1].type).toBe(tokenizer.TokenType.Word);
	expect(res[1].text).toBe("link:");
	expect(res[2].type).toBe(tokenizer.TokenType.LinkDescStart);
	expect(res[3].type).toBe(tokenizer.TokenType.Word);
	expect(res[3].text).toBe("link");
	expect(res[4].type).toBe(tokenizer.TokenType.Word);
	expect(res[4].text).toBe("name");
	expect(res[5].type).toBe(tokenizer.TokenType.LinkDescEnd);
	expect(res[6].type).toBe(tokenizer.TokenType.LinkUrlStart);
	expect(res[7].type).toBe(tokenizer.TokenType.Word);
	expect(res[7].text).toBe("http://foo.com");
	expect(res[8].type).toBe(tokenizer.TokenType.LinkUrlEnd);
});

test('Test escaped characters', () => {
	const t = new tokenizer.MDTokenizer("Test\\*foo\\*");
	res = t.tokenize();
	
	expect(res[0].type).toBe(tokenizer.TokenType.Word);
	expect(res[0].text).toBe("Test");
	expect(res[1].type).toBe(tokenizer.TokenType.EscapedChar);
	expect(res[1].text).toBe("*");
	expect(res[2].type).toBe(tokenizer.TokenType.Word);
	expect(res[2].text).toBe("foo");
	expect(res[3].type).toBe(tokenizer.TokenType.EscapedChar);
	expect(res[3].text).toBe("*");
});
