var Scheduler  = require('./src/scheduler');


//HACK: string like "a1r"
//      or also     "bf"
//  First char is name.
//  Second char is page nummber or finished flag.
//  In case of a page number, a mode is required.
function rf(string) {
  string = string.toLowerCase();
  var req = {};
  req.process = string[0];
  if (string[1] == "f") {
    req.pageNumber = 0;
    req.mode = "finish";
  } else {
    req.pageNumber = string[1];
    switch (string[2]) {
      case "r":
        req.mode = "read";
        break;
      case "m":
        req.mode = "write";
        break;
      default:
        req.mode = "read";
    }
  }
  return req;
};

//HACK: string like "a1premfb"
//  First char is name.
//  Second is page number.
//  Next chars are all optional with this meaning:
//  p: Pagefault.
//  r: Required.
//  e: rEferenced.
//  m: Modified.
//  f: Finished.
//  b: reservedforpageBuffering.

function ff(string) {
  string = string.toLowerCase();
  var frame = {};
  frame.process = string[0];
  frame.pageNumber = string[1];
  string = string.slice(2, string.length);
  frame.pageFault = string.includes('p');
  frame.required = string.includes('r');
  frame.referenced = string.includes('e');
  frame.modified = string.includes('m');
  frame.finished = string.includes('f');
  //frame.reservedForPageBuffering = string.includes('b');

  return frame;
}

function pb() {
  string = string.toLowerCase();
  var frame = {};
  frame.process = "";
  frame.pageNumber = 0;
  frame.pageFault = false;
  frame.required = false;
  frame.referenced = false;
  frame.modified = false;
  frame.finished = false;
  frame.reservedForPageBuffering = true;
}

//HACK: string like "a1emf"
//  First char is name.
//  Second is page number.
//  Next chars are all optional with this meaning:
//  e: rEferenced.
//  m: Modified.
//  f: Finished.
function vf(string) {
  string = string.toLowerCase();
  var frame = {};
  frame.process = string[0];
  frame.pageNumber = string[1];
  string = string.slice(2, string.length);
  frame.referenced = string.includes('e');
  frame.modified = string.includes('m');
  frame.finished = string.includes('f');

  return frame;
}

var A1R = rf("A1R");

var A1M = rf("A1M");

var A2R = rf("A2R");

var A3R = rf("A3R");

var AF = rf("AF");

var B1R = rf("B1R");

var B2R = rf("B2R");

var B3R = rf("B3R");

var BF = rf("BF");

var C1R = rf("C1R");

var C2R = rf("C2R");

var C3R = rf("C3R");

var CF = rf("CF");

var reqs = [A1R, B1R, C1R, A2R, A1R, C1R, A2R, C2R];

var frame = ff("a1r");
var frame2 = ff("a1mr");
var frame3= ff("")
var pageBuffering = pb();
var victim = vf();

var sams = new Scheduler();
sams.setAlgorithm("lru");
sams.setMemorySize(4);
// sams.setSecondChanceFilter(true);
// sams.setLocalReplacementPolicy(true);
// sams.setPageBufferingFilter(true);
// sams.setFixedEvenAssignmentPolicy(2);
sams.addRequirements(reqs);
var instants;
instants = sams.run();
instants.forEach(function(instant, index) {
  console.log("Moment: " + index);
  console.log(instant);
});
