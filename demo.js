var Scheduler  = require('./src/scheduler');

function reqFactory(string) {

  var req = {};

  req.process = string[0];

  if (string[1] == "F") {
    req.pageNumber = 0;
    req.mode = "finish";
  } else {
    req.pageNumber = string[1];
    switch (string[2]) {
      case "R":
        req.mode = "read";
        break;
      case "M":
        req.mode = "write";
        break;
      default:
        req.mode = "read";
    }
  }
  return req;
};

var A1R = reqFactory("A1R");

var A1M = reqFactory("A1M");

var A2R = reqFactory("A2R");

var A3R = reqFactory("A3R");

var AF = reqFactory("AF");

var B1R = reqFactory("B1R");

var B2R = reqFactory("B2R");

var B3R = reqFactory("B3R");

var BF = reqFactory("BF");

var C1R = reqFactory("C1R");

var C2R = reqFactory("C2R");

var C3R = reqFactory("C3R");

var CF = reqFactory("CF");

var reqs = [B1R, A1R, A2R, B2R, AF, C1R, C2R, C3R];

var sams = new Scheduler();
sams.setAlgorithm("fifo");
sams.setSecondChanceFilter(true);
// sams.setLocalReplacementPolicy(true);
// sams.setPageBufferingFilter(true);
sams.setMemorySize(4);
// sams.setFixedEvenAssignmentPolicy(2);
sams.addRequirements(reqs);
var instants;
instants = sams.run();
// sams.setMemorySize(6);
// instants = sams.run();
instants.forEach(function(instant, index) {
  console.log("Moment: " + index);
  console.log(instant);
});
