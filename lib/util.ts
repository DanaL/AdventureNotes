import { MDTokenizer, Token, TokenType } from "./tokenizer";

enum State {
	Normal,
	Bold,
	Italic
}

function toHTML(tokens: Token[]): string {
	let prevType: TokenType;
	let stateStack = [];
	let html = "";

	for (const t of tokens) {
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
