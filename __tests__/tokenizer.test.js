const tk = require('../views/scripts/tokenizer');

test("Test charAt()", () => {
	const t = new tk.MDTokenizer("foo");

	expect(t.currChar()).toEqual('f');

	t.loc = 2;
	expect(t.currChar()).toEqual('o');

	t.loc = 3;
	expect(t.currChar()).toEqual('\0');
});

test("Test peek()", () => {
	const t = new tk.MDTokenizer("ab");
	expect(t.peek()).toEqual('b');
	++t.loc;
	expect(t.peek()).toEqual('\0');
});

test("Test scanText()", () => {
	const t = new tk.MDTokenizer("foo b12lah");
	let s = t.scanText();
	expect(s).toEqual("foo");

	++t.loc;

	s = t.scanText();
	expect(s).toEqual("b12lah");
});

test("Test isWhitespace()", () => {
	const t = new tk.MDTokenizer("foo");
	expect(t.isWhitespace(' ')).toBe(true);
	expect(t.isWhitespace('\n')).toBe(true);
	expect(t.isWhitespace('\0')).toBe(true);
	expect(t.isWhitespace('a')).toBe(false);
});

test('Basic string split', () => {
	const t = new tk.MDTokenizer("The quick brown fox");
	res = t.tokenize();
	expect(res.length).toEqual(7);

	expect(res[0].text).toBe("The");
	expect(res[0].type).toBe(tk.TokenType.Word);
	expect(res[1].type).toBe(tk.TokenType.Space);
	expect(res[2].text).toBe("quick");
	expect(res[2].type).toBe(tk.TokenType.Word);
	expect(res[3].type).toBe(tk.TokenType.Space);
	expect(res[4].text).toBe("brown");
	expect(res[4].type).toBe(tk.TokenType.Word);
	expect(res[5].type).toBe(tk.TokenType.Space);
	expect(res[6].text).toBe("fox");
	expect(res[6].type).toBe(tk.TokenType.Word);
});

test('Test bold', () => {
	const t = new tk.MDTokenizer("Here is some **bold** stuff!");
	res = t.tokenize();

	expect(res[0].text).toBe("Here");
	expect(res[1].type).toBe(tk.TokenType.Space);
	expect(res[2].text).toBe("is");
	expect(res[3].type).toBe(tk.TokenType.Space);
	expect(res[4].text).toBe("some");
	expect(res[5].type).toBe(tk.TokenType.Space);
	expect(res[6].type).toBe(tk.TokenType.BoldMarker);
	expect(res[7].text).toBe("bold");
	expect(res[8].type).toBe(tk.TokenType.BoldMarker);
	expect(res[9].type).toBe(tk.TokenType.Space);
	expect(res[10].text).toBe("stuff!");
});

test('Bullet list', () => {
	const t = new tk.MDTokenizer("* One\n* Two\n* Three and four");
	res = t.tokenize();

	expect(res[0].type).toBe(tk.TokenType.UnorderedListItem);
	expect(res[0].text).toEqual("One");

	expect(res[1].type).toBe(tk.TokenType.UnorderedListItem);
	expect(res[1].text).toEqual("Two");

	expect(res[2].type).toBe(tk.TokenType.UnorderedListItem);
	expect(res[2].text).toEqual("Three and four");
});

test('Numbered list', () => {
	const t = new tk.MDTokenizer("1. Test\n  3. Another item   \n2. X \n0. last one");

	res = t.tokenize();

	expect(res[0].type).toBe(tk.TokenType.NumberedListItem);
	expect(res[0].text).toEqual("Test");

	expect(res[1].type).toBe(tk.TokenType.Space);

	expect(res[2].type).toBe(tk.TokenType.NumberedListItem);
	expect(res[2].text).toEqual("Another item");

	expect(res[3].type).toBe(tk.TokenType.NumberedListItem);
	expect(res[3].text).toEqual("X");

	expect(res[4].type).toBe(tk.TokenType.NumberedListItem);
	expect(res[4].text).toEqual("last one");
});

test('Test link', () => {
	const t = new tk.MDTokenizer("A link: [link name]  (http://foo.com)");
	res = t.tokenize();

	expect(res[0].type).toBe(tk.TokenType.Word);
	expect(res[0].text).toBe("A");
	expect(res[1].type).toBe(tk.TokenType.Space);
	expect(res[2].type).toBe(tk.TokenType.Word);
	expect(res[2].text).toBe("link:");
	expect(res[3].type).toBe(tk.TokenType.Space);
	expect(res[4].type).toBe(tk.TokenType.LinkDescStart);
	expect(res[5].type).toBe(tk.TokenType.Word);
	expect(res[5].text).toBe("link");
	expect(res[6].type).toBe(tk.TokenType.Space);
	expect(res[7].type).toBe(tk.TokenType.Word);
	expect(res[7].text).toBe("name");
	expect(res[8].type).toBe(tk.TokenType.LinkDescEnd);
	expect(res[9].type).toBe(tk.TokenType.Space);
	expect(res[10].type).toBe(tk.TokenType.LinkUrlStart);
	expect(res[11].type).toBe(tk.TokenType.Word);
	expect(res[11].text).toBe("http://foo.com");
	expect(res[12].type).toBe(tk.TokenType.LinkUrlEnd);
});

test('Test escaped characters', () => {
	const t = new tk.MDTokenizer("Test\\*foo\\*");
	res = t.tokenize();
	
	expect(res[0].type).toBe(tk.TokenType.Word);
	expect(res[0].text).toBe("Test");
	expect(res[1].type).toBe(tk.TokenType.EscapedChar);
	expect(res[1].text).toBe("*");
	expect(res[2].type).toBe(tk.TokenType.Word);
	expect(res[2].text).toBe("foo");
	expect(res[3].type).toBe(tk.TokenType.EscapedChar);
	expect(res[3].text).toBe("*");
});

test('Test scan heading', () => {
	const t = new tk.MDTokenizer("# Header 1\n## A sub-heading  \n###Will I even need 3 levels??");
	res = t.tokenize();

	expect(res[0].type).toBe(tk.TokenType.Heading1);
	expect(res[0].text).toBe("Header 1");

	expect(res[1].type).toBe(tk.TokenType.LineBreak);

	expect(res[2].type).toBe(tk.TokenType.Heading2);
	expect(res[2].text).toBe("A sub-heading");

	expect(res[3].type).toBe(tk.TokenType.LineBreak);

	expect(res[4].type).toBe(tk.TokenType.Heading3);
	expect(res[4].text).toBe("Will I even need 3 levels??");
});

test('Test scan linebreaks', () => {
	const t = new tk.MDTokenizer("Text\n**more text**");
	const res = t.tokenize();

	expect(res[0].type).toBe(tk.TokenType.Word);
	expect(res[0].text).toBe("Text");

	expect(res[1].type).toBe(tk.TokenType.LineBreak);

	expect(res[2].type).toBe(tk.TokenType.BoldMarker);

	expect(res[3].type).toBe(tk.TokenType.Word);
	expect(res[3].text).toBe("more");

	expect(res[4].type).toBe(tk.TokenType.Space);

	expect(res[5].type).toBe(tk.TokenType.Word);
	expect(res[5].text).toBe("text");

	expect(res[6].type).toBe(tk.TokenType.BoldMarker);
});

test('Test scan italics markers', () => {
	const t = new tk.MDTokenizer("_this is italicized_");
	const res = t.tokenize();

	expect(res[0].type).toBe(tk.TokenType.ItalicMarker);

	expect(res[1].type).toBe(tk.TokenType.Word);
	expect(res[1].text).toBe("this");
	
	expect(res[2].type).toBe(tk.TokenType.Space);

	expect(res[3].type).toBe(tk.TokenType.Word);
	expect(res[3].text).toBe("is");

	expect(res[4].type).toBe(tk.TokenType.Space);

	expect(res[5].type).toBe(tk.TokenType.Word);
	expect(res[5].text).toBe("italicized");

	expect(res[6].type).toBe(tk.TokenType.ItalicMarker);
});
