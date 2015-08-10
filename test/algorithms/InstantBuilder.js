// Every argument will be an array. Composed arguments will be arrays of arrays
// I know this is pretty awful but I want to get it done rigth now. Hopefully
// this comment will go away and this function will be completely changed.
// The promise above is full of bullshit.
function buildInstant(requirement, frames, pageFault, victim, potentialVictims) {
	var resultRequirement =
		"  requirement: {\n" +
		"    process: '" + requirement[0] + "',\n" +
		"    pageNumber: " + requirement[1] + ",\n" +
		"    mode: '" + requirement[2] + "'\n  }"
	var resultFrames = "  frames: " + "[\n";
	for (var i = 0; i <= frames.length - 1; i++) {
		resultFrames +=
			"  {\n" +
			"    process: '" + frames[i][0] + "',\n" +
			"    pageNumber: " + frames[i][1] + ",\n" +
			"    referenced: " + frames[i][2] + ",\n" +
			"    modified: " + frames[i][3] + ",\n" +
			"    pageFault: " + frames[i][4] + ",\n" +
			"    reservedForAsyncFlush: " + frames[i][5];
		if (frames.length - 1 !== i) {
			resultFrames += "\n  },";
		} else {
			resultFrames += "\n  }";
		}
	}
	resultFrames += "\n]";

	var resultPageFault = "  pageFault: " + pageFault;

	var resultVictim = "  victim: ";
	if (victim) {
		resultVictim +=
			"  {\n" +
			"  process: '" + victim[0] + "',\n" +
			"  pageNumber: " + victim[1] + ",\n" +
			"  referenced: " + victim[2] + ",\n" +
			"  modified: " + victim[3] + " }";
	} else {
		resultVictim += "undefined";
	}

	var resultPotentialVictims = "  potentialVictims: [\n"
	for (var i = 0; i <= potentialVictims.length - 1; i++) {
		resultPotentialVictims +=
			"  {\n" +
			"    process: '" + potentialVictims[i][0] + "',\n" +
			"    pageNumber: " + potentialVictims[i][1] + ",\n" +
			"    referenced: " + potentialVictims[i][2] + ",\n" +
			"    modified: " + potentialVictims[i][3];
		if (potentialVictims.length - 1 !== i) {
			resultPotentialVictims += "\n  },";
		} else {
			resultPotentialVictims += "\n  }";
		}
	}
	resultPotentialVictims += "\n]";

	var result =
		"{\n" +
		resultRequirement + ",\n" +
		resultFrames + ",\n" +
		resultPotentialVictims + ",\n" +
		resultPageFault + ",\n" +
		resultVictim + "\n}";

	return result;
}

// example 1
// function main () {
// 	var requirement = ['B', 2, 'read'];
// 	var pageFault = true;
// 	var frames = [
// 		['B', 2, false, false, true, false]
// 	];
// 	var victim = undefined;
// 	var potentialVictims = [
// 		['B', 2, false, false]
// 	]
//
// 	var instant = buildInstant(requirement, frames, pageFault, victim, potentialVictims);
//
// 	console.log(instant);
// }

// example2
// function main2 () {
// 	var instant = buildInstant(
// 		['B', 2, 'read'],
// 		[['B', 2, false, false, true, false]],
// 		true,
// 		undefined,
// 		[['B', 2, false, false]]
// 	);
// 	console.log(instant);
// }
