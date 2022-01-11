import { MDTokenizer, Token, TokenType } from "./tokenizer";

enum State {
	Bold,
	Italic,
	UnorderedList,
	OrderedList,
	Link,
	LinkDesc
}

function toEscapedHTML(token: Token): string {
	const backslash = "&#92;";
	switch (token.text) {
		case '*':
			return backslash + "&#42;";
		case '#':
			return backslash + "&#35;";
		case '[':
			return backslash + "&#91;";
		case ']':
			return backslash + "&#93;";
		case '(':
			return backslash + "&#40;";
		case ')':
			return backslash + "&#41;";
		case '.':
			return backslash + "&#46;";
		case '\\':
			return backslash + backslash;
		default:
			return backslash + token.text;
	}
}

function closeList(token: Token): boolean {
	const ttype = token.type
	if (ttype != TokenType.NumberedListItem && ttype != TokenType.UnorderedListItem && ttype != TokenType.Space)
		return true;
	return false;
}

function toHTML(tokens: Token[]): string {
	let prevType: TokenType;
	let stateStack = [];
	let html = "";
	let parsed: string;
	let parsingLink = false;
	let link: [string, string];

	for (let j = 0; j < tokens.length; j++) {
		const t = tokens[j];
		if (!parsingLink)
			parsed = "";

		switch (t.type) {
			case TokenType.Word:
				parsed += t.text;
				break;
			case TokenType.Space:
				parsed += " ";
				break;
			case TokenType.LineBreak:
				parsed += "<br/>";
				break;
			case TokenType.Heading1:
				if (prevType == TokenType.Word)
					parsed += " ";
				parsed += "<h1>" + t.text + "</h1>";
				break;
			case TokenType.Heading2:
				if (prevType == TokenType.Word)
					parsed += " ";
				parsed += "<h2>" + t.text + "</h2>";
				break;
			case TokenType.Heading3:
				if (prevType == TokenType.Word)
					parsed += " ";
				parsed += "<h3>" + t.text + "</h3>";
				break;
			case TokenType.BoldMarker:
				if (stateStack.length > 0 && stateStack[stateStack.length - 1] == State.Bold) {
					parsed += "</strong>";
					stateStack.pop();
				} 
				else {
					if (prevType == TokenType.Word)
						parsed += " ";
					parsed += "<strong>";
					stateStack.push(State.Bold)
				}
				break;
			case TokenType.ItalicMarker:
				if (stateStack.length > 0 && stateStack[stateStack.length - 1] == State.Italic) {
					parsed += "</em>";
					stateStack.pop();
				} 
				else {
					if (prevType == TokenType.Word)
						parsed += " ";
					parsed += "<em>";
					stateStack.push(State.Italic)
				}
				break;
			case TokenType.EscapedChar:
				parsed += toEscapedHTML(t);
				break;
			case TokenType.UnorderedListItem:
				if (stateStack.length == 0 || stateStack[stateStack.length - 1] != State.UnorderedList) {
					stateStack.push(State.UnorderedList);
					parsed += "<ul>";
				}
				parsed += "<li>" + t.text + "</li>";
				if (j == tokens.length - 1 || closeList(tokens[j + 1])) {
					parsed += "</ul>";
					stateStack.pop();
				}
				break;
			case TokenType.NumberedListItem:
				if (stateStack.length == 0 || stateStack[stateStack.length - 1] != State.OrderedList) {
					stateStack.push(State.OrderedList);
					parsed += "<ol>";
				}
				parsed += "<li>" + t.text + "</li>";
				if (j == tokens.length - 1 || closeList(tokens[j + 1])) {
					parsed += "</ol>";
					stateStack.pop();
				}
 
				break;
			case TokenType.LinkDescStart:
				parsingLink = true;
				link = ["", ""];
				break;
			case TokenType.LinkDescEnd:
				link[0] = parsed;
				parsed = ""; // we have the link desc next tokens should be the url itself
				break;
			// I don't actually need TokenType.LinkUrlStart I guess? But it will be using if I want
			// to include error checking functionaily
			case TokenType.LinkUrlEnd:
				link[1] = parsed;
				parsed = `<a href="${link[1]}">${link[0]}</a>`;
				parsingLink = false;
				break;
		}

		if (!parsingLink)
			html += parsed;
		prevType = t.type;
	}

	return html.trim();
}

function toMarkdown(html: string): string {
	let txt = html.replace("<br/>", "\n");
	return txt;
}

export { toHTML, toMarkdown };
