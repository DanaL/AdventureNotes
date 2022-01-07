const tk = require('../views/scripts/tokenizer');
const util = require('../views/scripts/util');
const toHTML = util.toHTML;

// I think eventually I will want to retain mulitple whitespace so the expected
// return html would be: Some test text. &nbsp;&nbsp;
// But not yet 100% sure that's the behaviour I want for the editor
test("Test simple text", () => {
	const t = new tk.MDTokenizer("Some test text.   ");
	const html = toHTML(t.tokenize());
	expect(html).toEqual("Some test text.");
});

test("Test with line breaks", () => {
	const t = new tk.MDTokenizer("One\nTwo\nThree");
	const html = toHTML(t.tokenize());
	expect(html).toEqual("One<br/>Two<br/>Three");
});

test("Test headings", () => {
	let t = new tk.MDTokenizer("# A heading");
	let html = toHTML(t.tokenize());
	expect(html).toEqual("<h1>A heading</h1>");

	t = new tk.MDTokenizer("## A heading");
	html = toHTML(t.tokenize());
	expect(html).toEqual("<h2>A heading</h2>");

	t = new tk.MDTokenizer("### A heading");
	html = toHTML(t.tokenize());
	expect(html).toEqual("<h3>A heading</h3>");
});

test("Test bold", () => {
	const t = new tk.MDTokenizer("This **is bold**!");
	const html = toHTML(t.tokenize());
	expect(html).toEqual("This <strong>is bold</strong>!");
});

test("Test italics", () => {
	const t = new tk.MDTokenizer("_italicized_");
	const html = toHTML(t.tokenize());
	expect(html).toEqual("<em>italicized</em>");
});

test("Test nested bold/italics", () => {
	const t = new tk.MDTokenizer("**bold _and italicized_!!**");
	const html = toHTML(t.tokenize());
	expect(html).toEqual("<strong>bold <em>and italicized</em>!!</strong>");
});

test("Test escaped characters", () => {
	const t = new tk.MDTokenizer("\\#foo\\[\\a");
	const html = toHTML(t.tokenize());
	expect(html).toEqual("&#92;&#35;foo&#92;&#91;&#92;a");
});

test("Test unordered list", () => {
	const t = new tk.MDTokenizer("*One\n* Two\n* Three and four");
	const html = toHTML(t.tokenize());
	expect(html).toEqual("<ul><li>One</li><li>Two</li><li>Three and four</li></ul>");
});

test("Test ordered list", () => {
	const t = new tk.MDTokenizer("1. Test\n  3. Another item   \n  2. X \n 0. last one");
	const html = toHTML(t.tokenize());
	expect(html).toEqual("<ol><li>Test</li><li>Another item</li><li>X</li><li>last one</li></ol>");
});

test("Test url", () => {
	let t = new tk.MDTokenizer("[Link to an NPC](/npc/44)");
	let html = toHTML(t.tokenize());
	expect(html).toEqual("<a href=\"/npc/44\">Link to an NPC</a>");

	t = new tk.MDTokenizer("[**bold link**](/npc/44)");
	html = toHTML(t.tokenize());
	expect(html).toEqual("<a href=\"/npc/44\"><strong>bold link</strong></a>");
});

