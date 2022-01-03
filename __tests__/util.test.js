const tk = require('../views/scripts/tokenizer');
const util = require('../views/scripts/util');
const toHTML = util.toHTML;

// I think eventually I will want to retain mulitple whitespace so the expected
// return html would be: Some test text. &nbsp;&nbsp;
// But not yet 100% sure that's the behaviour I want for the editor
test("Test simple text", () => {
	const t = new tk.MDTokenizer("Some test text.   ");
	const tokens = t.tokenize();

	const html = toHTML(tokens);

	expect(html).toEqual("Some test text.");
});

test("Test with line breaks", () => {
	const t = new tk.MDTokenizer("One\nTwo\nThree");
	const tokens = t.tokenize();

	const html = toHTML(tokens);

	expect(html).toEqual("One<br/>Two<br/>Three");
});


test("Test headings", () => {
	let t = new tk.MDTokenizer("# A heading");
	const tokens = t.tokenize();

	const html = toHTML(tokens);

	expect(html).toEqual("<h1>A heading</h1>");
});

test("Test bold", () => {
	let t = new tk.MDTokenizer("This **is bold**!");
	const html = toHTML(t.tokenize());
	expect(html).toEqual("This <strong>is bold</strong>!");
});

test("Test italics", () => {
	let t = new tk.MDTokenizer("_italicized_");
	const html = toHTML(t.tokenize());
	expect(html).toEqual("<em>italicized</em>");
});

test("Test nested bold/italics", () => {
	let t = new tk.MDTokenizer("**bold _and italicized_!!**");
	const html = toHTML(t.tokenize());
	expect(html).toEqual("<strong>bold <em>and italicized</em>!!</strong>");
});

test("Test escaped characters", () => {
	let t = new tk.MDTokenizer("\\#foo\\[\\a");
	const html = toHTML(t.tokenize());
	expect(html).toEqual("&#92;&#35;foo&#92;&#91;&#92;a");
});
