var Scheduler  = require('./src/scheduler');

var req0 =
{
  process: 'A',
  pageNumber: 1,
  mode: "read"
};

var req1 =
{
  process: 'A',
  pageNumber: 2,
  mode: "read"
};

var req2 =
{
  process: 'B',
  pageNumber: 2,
  mode: "read"
};

var req3 =
{
  process: 'A',
  pageNumber: 3,
  mode: "read"
};

var req4 =
{
  process: 'C',
  pageNumber: 1,
  mode: "read"
};

var reqs = [req0, req1, req2, req0, req3, req4, req4];

var sams = new Scheduler();
sams.setAlgorithm("fifo");
sams.setMemorySize(3);
sams.addRequirements(reqs);
var instants = sams.run();
console.log(instants);
