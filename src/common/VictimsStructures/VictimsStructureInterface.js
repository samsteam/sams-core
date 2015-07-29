var cocktail = require('cocktail');

//Using a trait as an interface.
cocktail.mix({
	'@exports': module,

	'@requires': [
		'add',
		'addAll',
		'clone',
		'first',
		'peek',
		'remove',
		'contains',
		'pageOf',
		'size',
		'clear'
	]
});
