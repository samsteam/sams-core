var cocktail = require('cocktail');

//Using a trait as an interface.
cocktail.mix({
	'@exports': module,

	'@requires': ['hasFreeFrameFor']
});
