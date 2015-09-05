// What the fuck do I return?
// A giant string which is the json form of the resultant object

function buildInstant(requirement, frames, pageFault, victim, potentialVictims)
{
	var resultRequirement =
		"  'requirement': {\n" +
		"    'process': '" + requirement["process"] + "',\n" +
		"    'pageNumber': " + (requirement["pageNumber"] || 0) + ",\n" +
		"    'mode': '" + (requirement["mode"] || "read") + "'\n  }"
	var resultFrames = "  frames: " + "[\n";
	for (var i = 0; i <= frames.length - 1; i++) {
		resultFrames +=
			"  {\n" +
			"    'process': '" + frames[i]["process"] + "',\n" +
			"    'pageNumber': " + frames[i]["pageNumber"] + ",\n" +
			"    'referenced': " + (frames[i]["referenced"] || "false") + ",\n" +
			"    'modified': " + (frames[i]["modified"] || "false") + ",\n" +
			"    'pageFault': " + (frames[i]["pageFault"] || "false") + ",\n" +
			"    'required': " + (frames[i]["required"] || "false") + ",\n" +
			"    'finished': " + (frames[i]["finished"] || "false") + ",\n" +
			"    'reservedForPageBuffering': " + (frames[i]["reserved"] || "false");
		if (frames.length - 1 !== i) {
			resultFrames += "\n  },";
		} else {
			resultFrames += "\n  }";
		}
	}
	resultFrames += "\n]";

	var resultPageFault = "  'pageFault': " + pageFault;

	var resultVictim = "  'victim': ";
	if (victim) {
		resultVictim +=
			"  {\n" +
			"  'process': '" + victim["process"] + "',\n" +
			"  'pageNumber': " + victim["pageNumber"] + ",\n" +
			"  'referenced': " + (victim["referenced"] || "false") + ",\n" +
			"  'modified': " + (victim["modified"] || "false") + " }";
	} else {
		resultVictim += "undefined";
	}

	var resultPotentialVictims = "  'potentialVictims': [\n"
	for (var i = 0; i <= potentialVictims.length - 1; i++) {
		resultPotentialVictims +=
			"  {\n" +
			"    'process': '" + potentialVictims[i]["process"] + "',\n" +
			"    'pageNumber': " + potentialVictims[i]["pageNumber"] + ",\n" +
			"    'referenced': " + 
					(potentialVictims[i]["referenced"] || "false") + ",\n" +
			"    'modified': " + (potentialVictims[i]["modified"] || "false");
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

console.log('[' +
	buildInstant(
		{process: 'B', pageNumber: 2},
		[
			{process: 'B', pageNumber: 2, pageFault: true, required: true}
		],
		true,
		undefined,
		[{process:'B', pageNumber: 2}]
	) + ', ' +
	buildInstant(
		{process: 'B', pageNumber: 4},
		[
			{process: 'B', pageNumber: 2},
			{process: 'B', pageNumber: 4, pageFault: true, required: true}
		],
		true,
		undefined,
		[
			{process:'B', pageNumber: 2},
			{process:'B', pageNumber: 4}
		]
	) + ', ' +
	buildInstant(
		{process: 'A', pageNumber: 1},
		[
			{process: 'B', pageNumber: 2},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1, pageFault: true, required: true}
		],
		true,
		undefined,
		[
			{process:'B', pageNumber: 2},
			{process:'B', pageNumber: 4},
			{process:'A', pageNumber: 1}
		]
	) + ', ' +
	buildInstant(
		{process: 'A', pageNumber: 3},
		[
			{process: 'B', pageNumber: 2},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1},
			{process: 'A', pageNumber: 3, pageFault: true, required: true}
		],
		true,
		undefined,
		[
			{process:'B', pageNumber: 2},
			{process:'B', pageNumber: 4},
			{process:'A', pageNumber: 1},
			{process:'A', pageNumber: 3}
		]
	) + ', ' +
	buildInstant(
		{process: 'A', pageNumber: 1},
		[
			{process: 'B', pageNumber: 2},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1, referenced: true, required: true},
			{process: 'A', pageNumber: 3}
		],
		false,
		undefined,
		[
			{process:'B', pageNumber: 2},
			{process:'B', pageNumber: 4},
			{process:'A', pageNumber: 1, referenced: true},
			{process:'A', pageNumber: 3}
		]
	) + ', ' +
	buildInstant(
		{process: 'C', pageNumber: 1},
		[
			{process: 'B', pageNumber: 2},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'A', pageNumber: 3},
			{process: 'C', pageNumber: 1, pageFault: true, required: true}
		],
		true,
		undefined,
		[
			{process:'B', pageNumber: 2},
			{process:'B', pageNumber: 4},
			{process:'A', pageNumber: 1, referenced: true},
			{process:'A', pageNumber: 3},
			{process: 'C', pageNumber: 1}
		]
	) + ', ' +
	buildInstant(
		{process: 'C', pageNumber: 2},
		[
			{process: 'B', pageNumber: 2},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'A', pageNumber: 3},
			{process: 'C', pageNumber: 1},
			{process: 'C', pageNumber: 2, pageFault: true, required: true}
		],
		true,
		undefined,
		[
			{process:'B', pageNumber: 2},
			{process:'B', pageNumber: 4},
			{process:'A', pageNumber: 1, referenced: true},
			{process:'A', pageNumber: 3},
			{process: 'C', pageNumber: 1},
			{process: 'C', pageNumber: 2}
		]
	) + ', ' +
	buildInstant(
		{process: 'B', pageNumber: 6},
		[
			{process: 'B', pageNumber: 2},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'A', pageNumber: 3},
			{process: 'C', pageNumber: 1},
			{process: 'C', pageNumber: 2},
			{process: 'B', pageNumber: 6, pageFault: true, required: true}
		],
		true,
		undefined,
		[
			{process: 'B', pageNumber: 2},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'A', pageNumber: 3},
			{process: 'C', pageNumber: 1},
			{process: 'C', pageNumber: 2},
			{process: 'B', pageNumber: 6}
		]
	) + ', ' +
	buildInstant(
		{process: 'B', pageNumber: 2},
		[
			{process: 'B', pageNumber: 2, referenced: true, required: true},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'A', pageNumber: 3},
			{process: 'C', pageNumber: 1},
			{process: 'C', pageNumber: 2},
			{process: 'B', pageNumber: 6}
		],
		false,
		undefined,
		[
			{process: 'B', pageNumber: 2, referenced: true},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'A', pageNumber: 3},
			{process: 'C', pageNumber: 1},
			{process: 'C', pageNumber: 2},
			{process: 'B', pageNumber: 6}
		]
	) + ', ' +
	buildInstant(
		{process: 'B', pageNumber: 4},
		[
			{process: 'B', pageNumber: 2, referenced: true},
			{process: 'B', pageNumber: 4, referenced: true, required: true},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'A', pageNumber: 3},
			{process: 'C', pageNumber: 1},
			{process: 'C', pageNumber: 2},
			{process: 'B', pageNumber: 6}
		],
		false,
		undefined,
		[
			{process: 'B', pageNumber: 2, referenced: true},
			{process: 'B', pageNumber: 4, referenced: true},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'A', pageNumber: 3},
			{process: 'C', pageNumber: 1},
			{process: 'C', pageNumber: 2},
			{process: 'B', pageNumber: 6}
		]
	) + ', ' +
	buildInstant(
		{process: 'A', pageNumber: 2},
		[
			{process: 'B', pageNumber: 2},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1},
			{process: 'A', pageNumber: 2, pageFault: true, required: true},
			{process: 'C', pageNumber: 1},
			{process: 'C', pageNumber: 2},
			{process: 'B', pageNumber: 6}
		],
		true,
		{process: 'A', pageNumber: 3},
		[
			{process: 'C', pageNumber: 1},
			{process: 'C', pageNumber: 2},
			{process: 'B', pageNumber: 6},
			{process: 'B', pageNumber: 2},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1},
			{process: 'A', pageNumber: 2}
		]
	) + ', ' +
	buildInstant(
		{process: 'A', pageNumber: 4},
		[
			{process: 'B', pageNumber: 2},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1},
			{process: 'A', pageNumber: 2},
			{process: 'A', pageNumber: 4, pageFault: true, required: true},
			{process: 'C', pageNumber: 2},
			{process: 'B', pageNumber: 6}
		],
		true,
		{process: 'C', pageNumber: 1},
		[
			{process: 'C', pageNumber: 2},
			{process: 'B', pageNumber: 6},
			{process: 'B', pageNumber: 2},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1},
			{process: 'A', pageNumber: 2},
			{process: 'A', pageNumber: 4}
		]
	) + ', ' +
	buildInstant(
		{process: 'A', pageNumber: 1},
		[
			{process: 'B', pageNumber: 2},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1, referenced: true, required: true},
			{process: 'A', pageNumber: 2},
			{process: 'A', pageNumber: 4},
			{process: 'C', pageNumber: 2},
			{process: 'B', pageNumber: 6}
		],
		false,
		undefined,
		[
			{process: 'C', pageNumber: 2},
			{process: 'B', pageNumber: 6},
			{process: 'B', pageNumber: 2},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'A', pageNumber: 2},
			{process: 'A', pageNumber: 4}
		]
	) + ', ' +
	buildInstant(
		{process: 'C', pageNumber: 4},
		[
			{process: 'B', pageNumber: 2},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'A', pageNumber: 2},
			{process: 'A', pageNumber: 4},
			{process: 'C', pageNumber: 4, pageFault: true, required: true},
			{process: 'B', pageNumber: 6}
		],
		true,
		{process: 'C', pageNumber: 2},
		[
			{process: 'B', pageNumber: 6},
			{process: 'B', pageNumber: 2},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'A', pageNumber: 2},
			{process: 'A', pageNumber: 4},
			{process: 'C', pageNumber: 4}
		]
	) + ', ' +
	buildInstant(
		{process: 'C', pageNumber: 8},
		[
			{process: 'B', pageNumber: 2},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'A', pageNumber: 2},
			{process: 'A', pageNumber: 4},
			{process: 'C', pageNumber: 4},
			{process: 'C', pageNumber: 8, pageFault: true, required: true}
		],
		true,
		{process: 'B', pageNumber: 6},
		[
			{process: 'B', pageNumber: 2},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'A', pageNumber: 2},
			{process: 'A', pageNumber: 4},
			{process: 'C', pageNumber: 4},
			{process: 'C', pageNumber: 8}
		]
	) + ', ' +
	buildInstant(
		{process: 'B', pageNumber: 1},
		[
			{process: 'B', pageNumber: 1, pageFault: true, required: true},
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'A', pageNumber: 2},
			{process: 'A', pageNumber: 4},
			{process: 'C', pageNumber: 4},
			{process: 'C', pageNumber: 8}
		],
		true,
		{process: 'B', pageNumber: 2},
		[
			{process: 'B', pageNumber: 4},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'A', pageNumber: 2},
			{process: 'A', pageNumber: 4},
			{process: 'C', pageNumber: 4},
			{process: 'C', pageNumber: 8},
			{process: 'B', pageNumber: 1}
		]
	) + ', ' +
	buildInstant(
		{process: 'B', pageNumber: 8},
		[
			{process: 'B', pageNumber: 1},
			{process: 'B', pageNumber: 8, pageFault: true, required: true},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'A', pageNumber: 2},
			{process: 'A', pageNumber: 4},
			{process: 'C', pageNumber: 4},
			{process: 'C', pageNumber: 8}
		],
		true,
		{process: 'B', pageNumber: 4},
		[
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'A', pageNumber: 2},
			{process: 'A', pageNumber: 4},
			{process: 'C', pageNumber: 4},
			{process: 'C', pageNumber: 8},
			{process: 'B', pageNumber: 1},
			{process: 'B', pageNumber: 8}
		]
	) + ', ' +
	buildInstant(
		{process: 'C', pageNumber: 6},
		[
			{process: 'B', pageNumber: 1},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 1},
			{process: 'C', pageNumber: 6, pageFault: true, required: true},
			{process: 'A', pageNumber: 4},
			{process: 'C', pageNumber: 4},
			{process: 'C', pageNumber: 8}
		],
		true,
		{process: 'A', pageNumber: 2},
		[
			{process: 'A', pageNumber: 4},
			{process: 'C', pageNumber: 4},
			{process: 'C', pageNumber: 8},
			{process: 'B', pageNumber: 1},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 1},
			{process: 'C', pageNumber: 6}
		]
	) + ', ' +
	buildInstant(
		{process: 'C', pageNumber: 1},
		[
			{process: 'B', pageNumber: 1},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 1},
			{process: 'C', pageNumber: 6},
			{process: 'C', pageNumber: 1, pageFault: true, required: true},
			{process: 'C', pageNumber: 4},
			{process: 'C', pageNumber: 8}
		],
		true,
		{process: 'A', pageNumber: 4},
		[
			{process: 'C', pageNumber: 4},
			{process: 'C', pageNumber: 8},
			{process: 'B', pageNumber: 1},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 1},
			{process: 'C', pageNumber: 6},
			{process: 'C', pageNumber: 1}
		]
	) + ', ' +
	buildInstant(
		{process: 'C', pageNumber: 4},
		[
			{process: 'B', pageNumber: 1},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 1},
			{process: 'C', pageNumber: 6},
			{process: 'C', pageNumber: 1},
			{process: 'C', pageNumber: 4, referenced: true, required: true},
			{process: 'C', pageNumber: 8}
		],
		false,
		undefined,
		[
			{process: 'C', pageNumber: 4, referenced: true},
			{process: 'C', pageNumber: 8},
			{process: 'B', pageNumber: 1},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 1},
			{process: 'C', pageNumber: 6},
			{process: 'C', pageNumber: 1}
		]
	) + ', ' +
	buildInstant(
		{process: 'C', pageNumber: 1},
		[
			{process: 'B', pageNumber: 1},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 1},
			{process: 'C', pageNumber: 6},
			{process: 'C', pageNumber: 1, referenced: true, required: true},
			{process: 'C', pageNumber: 4, referenced: true},
			{process: 'C', pageNumber: 8}
		],
		false,
		undefined,
		[
			{process: 'C', pageNumber: 4, referenced: true},
			{process: 'C', pageNumber: 8},
			{process: 'B', pageNumber: 1},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 1},
			{process: 'C', pageNumber: 6},
			{process: 'C', pageNumber: 1, referenced: true}
		]
	) + ', ' +
	buildInstant(
		{process: 'A', pageNumber: 5},
		[
			{process: 'B', pageNumber: 1},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 1},
			{process: 'C', pageNumber: 6},
			{process: 'C', pageNumber: 1, referenced: true},
			{process: 'C', pageNumber: 4},
			{process: 'A', pageNumber: 5, pageFault: true, required: true}
		],
		true,
		{process: 'C', pageNumber: 8},
		[
			{process: 'B', pageNumber: 1},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 1},
			{process: 'C', pageNumber: 6},
			{process: 'C', pageNumber: 1, referenced: true},
			{process: 'C', pageNumber: 4},
			{process: 'A', pageNumber: 5}
		]
	) + ', ' +
	buildInstant(
		{process: 'A', pageNumber: 1},
		[
			{process: 'B', pageNumber: 1},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 1, referenced: true, required: true},
			{process: 'C', pageNumber: 6},
			{process: 'C', pageNumber: 1, referenced: true},
			{process: 'C', pageNumber: 4},
			{process: 'A', pageNumber: 5}
		],
		false,
		undefined,
		[
			{process: 'B', pageNumber: 1},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'C', pageNumber: 6},
			{process: 'C', pageNumber: 1, referenced: true},
			{process: 'C', pageNumber: 4},
			{process: 'A', pageNumber: 5}
		]
	) + ', ' +
	buildInstant(
		{process: 'A', pageNumber: 4},
		[
			{process: 'A', pageNumber: 4, pageFault: true, required: true},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'C', pageNumber: 6},
			{process: 'C', pageNumber: 1, referenced: true},
			{process: 'C', pageNumber: 4},
			{process: 'A', pageNumber: 5}
		],
		true,
		{process: 'B', pageNumber: 1},
		[
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'C', pageNumber: 6},
			{process: 'C', pageNumber: 1, referenced: true},
			{process: 'C', pageNumber: 4},
			{process: 'A', pageNumber: 5},
			{process: 'A', pageNumber: 4}
		]
	) + ', ' +
	buildInstant(
		{process: 'B', pageNumber: 3},
		[
			{process: 'A', pageNumber: 4},
			{process: 'B', pageNumber: 3, pageFault: true, required: true},
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'C', pageNumber: 6},
			{process: 'C', pageNumber: 1, referenced: true},
			{process: 'C', pageNumber: 4},
			{process: 'A', pageNumber: 5}
		],
		true,
		{process: 'B', pageNumber: 8},
		[
			{process: 'A', pageNumber: 1, referenced: true},
			{process: 'C', pageNumber: 6},
			{process: 'C', pageNumber: 1, referenced: true},
			{process: 'C', pageNumber: 4},
			{process: 'A', pageNumber: 5},
			{process: 'A', pageNumber: 4},
			{process: 'B', pageNumber: 3}
		]
	) + ', ' +
	buildInstant(
		{process: 'B', pageNumber: 1},
		[
			{process: 'A', pageNumber: 4},
			{process: 'B', pageNumber: 3},
			{process: 'A', pageNumber: 1},
			{process: 'B', pageNumber: 1, pageFault: true, required: true},
			{process: 'C', pageNumber: 1, referenced: true},
			{process: 'C', pageNumber: 4},
			{process: 'A', pageNumber: 5}
		],
		true,
		{process: 'C', pageNumber: 6},
		[
			{process: 'C', pageNumber: 1, referenced: true},
			{process: 'C', pageNumber: 4},
			{process: 'A', pageNumber: 5},
			{process: 'A', pageNumber: 4},
			{process: 'B', pageNumber: 3},
			{process: 'A', pageNumber: 1},
			{process: 'B', pageNumber: 1}
		]
	) + ', ' +
	buildInstant(
		{process: 'B', pageNumber: 8},
		[
			{process: 'A', pageNumber: 4},
			{process: 'B', pageNumber: 3},
			{process: 'A', pageNumber: 1},
			{process: 'B', pageNumber: 1},
			{process: 'C', pageNumber: 1},
			{process: 'B', pageNumber: 8, pageFault: true, required: true},
			{process: 'A', pageNumber: 5}
		],
		true,
		{process: 'C', pageNumber: 4},
		[
			{process: 'A', pageNumber: 5},
			{process: 'A', pageNumber: 4},
			{process: 'B', pageNumber: 3},
			{process: 'A', pageNumber: 1},
			{process: 'B', pageNumber: 1},
			{process: 'C', pageNumber: 1},
			{process: 'B', pageNumber: 8}
		]
	) + ', ' +
	buildInstant(
		{process: 'C', mode: "finish"},
		[
			{process: 'A', pageNumber: 4},
			{process: 'B', pageNumber: 3},
			{process: 'A', pageNumber: 1},
			{process: 'B', pageNumber: 1},
			{process: 'C', pageNumber: 1, finished: true},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 5}
		],
		false,
		undefined,
		[
			{process: 'A', pageNumber: 5},
			{process: 'A', pageNumber: 4},
			{process: 'B', pageNumber: 3},
			{process: 'A', pageNumber: 1},
			{process: 'B', pageNumber: 1},
			{process: 'B', pageNumber: 8}
		]
	) + ', ' +
	buildInstant(
		{process: 'A', pageNumber: 7},
		[
			{process: 'A', pageNumber: 4},
			{process: 'B', pageNumber: 3},
			{process: 'A', pageNumber: 1},
			{process: 'B', pageNumber: 1},
			{process: 'A', pageNumber: 7, pageFault: true, required: true},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 5}
		],
		true,
		undefined,
		[
			{process: 'A', pageNumber: 5},
			{process: 'A', pageNumber: 4},
			{process: 'B', pageNumber: 3},
			{process: 'A', pageNumber: 1},
			{process: 'B', pageNumber: 1},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 7}
		]
	) + ', ' +
	buildInstant(
		{process: 'A', pageNumber: 9},
		[
			{process: 'A', pageNumber: 4},
			{process: 'B', pageNumber: 3},
			{process: 'A', pageNumber: 1},
			{process: 'B', pageNumber: 1},
			{process: 'A', pageNumber: 7},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 9, pageFault: true, required: true}
		],
		true,
		{process: 'A', pageNumber: 5},
		[
			{process: 'A', pageNumber: 4},
			{process: 'B', pageNumber: 3},
			{process: 'A', pageNumber: 1},
			{process: 'B', pageNumber: 1},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 7},
			{process: 'A', pageNumber: 9}
		]
	) + ', ' +
	buildInstant(
		{process: 'A', pageNumber: 4},
		[
			{process: 'A', pageNumber: 4, referenced: true, required: true},
			{process: 'B', pageNumber: 3},
			{process: 'A', pageNumber: 1},
			{process: 'B', pageNumber: 1},
			{process: 'A', pageNumber: 7},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 9}
		],
		false,
		undefined,
		[
			{process: 'A', pageNumber: 4, referenced: true},
			{process: 'B', pageNumber: 3},
			{process: 'A', pageNumber: 1},
			{process: 'B', pageNumber: 1},
			{process: 'B', pageNumber: 8},
			{process: 'A', pageNumber: 7},
			{process: 'A', pageNumber: 9}
		]
	) + ', ' +
	buildInstant(
		{process: 'B', mode: "finish"},
		[
			{process: 'A', pageNumber: 4, referenced: true},
			{process: 'B', pageNumber: 3, finished: true},
			{process: 'A', pageNumber: 1},
			{process: 'B', pageNumber: 1, finished: true},
			{process: 'A', pageNumber: 7},
			{process: 'B', pageNumber: 8, finished: true},
			{process: 'A', pageNumber: 9}
		],
		false,
		undefined,
		[
			{process: 'A', pageNumber: 4, referenced: true},
			{process: 'A', pageNumber: 1},
			{process: 'A', pageNumber: 7},
			{process: 'A', pageNumber: 9}
		]
	) + ', ' +
	buildInstant(
		{process: 'A', mode: "finish"},
		[
			{process: 'A', pageNumber: 4, finished: true},
			{process: 'B', pageNumber: 3, finished: true},
			{process: 'A', pageNumber: 1, finished: true},
			{process: 'B', pageNumber: 1, finished: true},
			{process: 'A', pageNumber: 7, finished: true},
			{process: 'B', pageNumber: 8, finished: true},
			{process: 'A', pageNumber: 9, finished: true}
		],
		false,
		undefined,
		[
			
		]
	) +
']');