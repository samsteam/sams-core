var cocktail = require('cocktail');

//Using a trait as an interface.
cocktail.mix({
	'@exports': module,

	'@requires': [
		'victimFor',
		'addPage',
		'getPage',
		'update',
		'recycle',
		'clearPolicies',
		'setLocalReplacementPolicy',
		'setAsyncFlushReplacementPolicy',
		'setSecondChanceReplacementPolicy',
	]
});
