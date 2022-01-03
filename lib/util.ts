enum ParseState {
	Text,
	Italics
}

enum TokenType {
	Word,
	LineBreak
}

enum TokenState {
	Word,
	Asterisk,
	Octothorpe,
	Linebreak
}

class Token {
	text: string;
	type: TokenType;

	constructor(text: string, type: TokenType) {
		this.text = text;
		this.type = type;
	}
}

function tokenizer(txt: string): string[] {
	let tokens = []

	let c = 0;
	let word = "";
	while (c < txt.length) {
		if (txt[c] == ' ') {
			tokens.push(word);
			word = "";
			++c;
			continue;
		}
		
		word += txt[c];

		/*
		switch (word) {
			case "**"
		}
		*/

		++c;
	}


	return tokens;
}

function toHTML(txt: string): string {
	let state =  ParseState.Text;
	let html = "";
	let subString = "";

	for (let j = 0; j < txt.length; j++) {
		switch (state) {
			case ParseState.Text:
				if (txt[j] == '\n')
					html += "<br/>";
				else if (txt[j] == '_')
					state = ParseState.Italics; 
				else
					html += txt[j];
				break;
			case ParseState.Italics:
				if (txt[j] == '_') {
					html += `<em>${subString}</em>`;
					subString = "";
					state = ParseState.Text;
				}
				else {
					subString += txt[j];
				}
				break;
		}
	}

	if (subString.length > 0)
		html += subString;

	return html;
}

function toMarkdown(html: string): string {
	let txt = html.replace("<br/>", "\n");
	return txt;
}

export { toHTML };
export { tokenizer };
export { toMarkdown };
