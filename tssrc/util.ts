enum ParseState {
	Text,
	Italics
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
export { toMarkdown };
