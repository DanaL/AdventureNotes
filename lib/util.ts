import { MDTokenizer, Token, TokenType } from "./tokenizer";

enum State {
	Bold,
	Italic,
	UnorderedList
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

function toHTML(tokens: Token[]): string {
	let prevType: TokenType;
	let stateStack = [];
	let html = "";

	for (let j = 0; j < tokens.length; j++) {
		const t = tokens[j];
		switch (t.type) {
			case TokenType.Word:
				if (prevType == TokenType.Word)
					html += " ";
				html += t.text;
				break;
			case TokenType.LineBreak:
				html += "<br/>";
				break;
			case TokenType.Heading1:
				if (prevType == TokenType.Word)
					html += " ";
				html += "<h1>" + t.text + "</h1>";
				break;
			case TokenType.Heading2:
				if (prevType == TokenType.Word)
					html += " ";
				html += "<h2>" + t.text + "</h2>";
				break;
			case TokenType.Heading3:
				if (prevType == TokenType.Word)
					html += " ";
				html += "<h3>" + t.text + "</h3>";
				break;
			case TokenType.BoldMarker:
				if (stateStack.length > 0 && stateStack[stateStack.length - 1] == State.Bold) {
					html += "</strong>";
					stateStack.pop();
				} 
				else {
					if (prevType == TokenType.Word)
						html += " ";
					html += "<strong>";
					stateStack.push(State.Bold)
				}
				break;
			case TokenType.ItalicMarker:
				if (stateStack.length > 0 && stateStack[stateStack.length - 1] == State.Italic) {
					html += "</em>";
					stateStack.pop();
				} 
				else {
					if (prevType == TokenType.Word)
						html += " ";
					html += "<em>";
					stateStack.push(State.Italic)
				}
				break;
			case TokenType.EscapedChar:
				html += toEscapedHTML(t);
				break;
			case TokenType.UnorderedListItem:
				if (stateStack.length == 0 && stateStack[stateStack.length - 1] != State.UnorderedList) {
					stateStack.push(State.UnorderedList);
					html += "<ul>";
				}
				html += "<li>" + t.text + "</li>";
				if (j == tokens.length - 1 || tokens[j + 1].type != TokenType.UnorderedListItem) {
					html+= "</ul>";
					stateStack.pop();
				}
				break;
		}

		prevType = t.type;
	}

	return html.trim();
}

function toMarkdown(html: string): string {
	let txt = html.replace("<br/>", "\n");
	return txt;
}

export { toHTML, toMarkdown };
