const util = require('../views/scripts/util');

test('Test tokenizer', () => {
	const res = util.tokenizer("The quick brown fox");
	expect(res.length).toEqual(4);
});
