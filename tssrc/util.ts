function toHTML(txt: string): string {
	let html = txt.replace("\n", "<br/>");
	return html;
}

function toMarkdown(html: string): string {
	let txt = html.replace("<br/>", "\n");
	return txt;
}

export { toHTML };
export { toMarkdown };
