var Factory = require('../factory');

module.exports = {
  getRequirements: function () {
    return [ Factory.rf("c1r"), Factory.rf("a1r"), Factory.rf("a2r"), Factory.rf("c3r"), Factory.rf("b1r"), Factory.rf("a1r"), Factory.rf("c1m"), Factory.rf("b2r"), Factory.rf("b5r"), Factory.rf("a7r"), Factory.rf("c5r"), Factory.rf("b2m"), Factory.rf("a2m"), Factory.rf("b2r"), Factory.rf("b1r"), Factory.rf("a2r"), Factory.rf("b4r"), Factory.rf("b5r"), Factory.rf("c1r"), Factory.rf("c4r"), Factory.rf("c2r"), Factory.rf("a7r"), Factory.rf("bf"), Factory.rf("a3r"), Factory.rf("a2r"), Factory.rf("c3r"), Factory.rf("af"), Factory.rf("cf") ];
  },
  getInstants: function () {
    var instants = [];

    var requirement = "c1r";
    var frames = ["pb", "c1pr"];
    var pageFault = true;
    var victim = undefined;
    var potentialVictims = ["c1"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a1r";
    frames = ["pb", "c1", "a1pr"];
    pageFault = true;
    victim = undefined;
    potentialVictims = ["c1", "a1"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a2r";
    frames = ["pb", "c1", "a1", "a2pr"];
    pageFault = true;
    victim = undefined;
    potentialVictims = ["c1", "a1", "a2"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "c3r";
    frames = ["pb", "c1", "a1", "a2", "c3pr"];
    pageFault = true;
    victim = undefined;
    potentialVictims = ["c1", "a1", "a2", "c3"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b1r";
    frames = ["pb", "c1", "a1", "a2", "c3", "b1pr"];
    pageFault = true;
    victim = undefined;
    potentialVictims = ["c1", "a1", "a2", "c3", "b1"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a1r";
    frames = ["pb", "c1", "a1r", "a2", "c3", "b1"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["c1", "a1", "a2", "c3", "b1"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "c1m";
    frames = ["pb", "c1rm", "a1", "a2", "c3", "b1"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["c1m", "a1", "a2", "c3", "b1"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b2r";
    frames = ["pb", "c1m", "a1", "a2", "c3", "b1", "b2pr"];
    pageFault = true;
    victim = undefined;
    potentialVictims = ["c1m", "a1", "a2", "c3", "b1", "b2"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b5r";
    frames = ["b5pr", "pb", "a1", "a2", "c3", "b1", "b2"];
    pageFault = true;
    victim = "c1m";
    potentialVictims = ["a1", "a2", "c3", "b1", "b2", "b5"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a7r";
    frames = ["b5", "pb", "a7pr", "a2", "c3", "b1", "b2"];
    pageFault = true;
    victim = "a1";
    potentialVictims = ["a2", "c3", "b1", "b2", "b5", "a7"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "c5r";
    frames = ["b5", "pb", "a7", "c5pr", "c3", "b1", "b2"];
    pageFault = true;
    victim = "a2";
    potentialVictims = ["c3", "b1", "b2", "b5", "a7", "c5"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b2m";
    frames = ["b5", "pb", "a7", "c5", "c3", "b1", "b2mr"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["c3", "b1", "b2m", "b5", "a7", "c5"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a2m";
    frames = ["b5", "pb", "a7", "c5", "a2prm", "b1", "b2m"];
    pageFault = true;
    victim = "c3";
    potentialVictims = ["b1", "b2m", "b5", "a7", "c5", "a2m"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b2r";
    frames = ["b5", "pb", "a7", "c5", "a2m", "b1", "b2rm"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["b1", "b2m", "b5", "a7", "c5", "a2m"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b1r";
    frames = ["b5", "pb", "a7", "c5", "a2m", "b1r", "b2m"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["b1", "b2m", "b5", "a7", "c5", "a2m"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a2r";
    frames = ["b5", "pb", "a7", "c5", "a2rm", "b1", "b2m"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["b1", "b2m", "b5", "a7", "c5", "a2m"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b4r";
    frames = ["b5", "pb", "a7", "c5", "a2m", "b4pr", "b2m"];
    pageFault = true;
    victim = "b1";
    potentialVictims = ["b2m", "b5", "a7", "c5", "a2m", "b4"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b5r";
    frames = ["b5r", "pb", "a7", "c5", "a2m", "b4", "b2m"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["b2m", "b5", "a7", "c5", "a2m", "b4"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "c1r";
    frames = ["b5", "c1pr", "a7", "c5", "a2m", "b4", "pb"];
    pageFault = true;
    victim = "b2m";
    potentialVictims = ["b5", "a7", "c5", "a2m", "b4", "c1"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "c4r";
    frames = ["c4pr", "c1", "a7", "c5", "a2m", "b4", "pb"];
    pageFault = true;
    victim = "b5";
    potentialVictims = ["a7", "c5", "a2m", "b4", "c1", "c4"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "c2r";
    frames = ["c4", "c1", "c2pr", "c5", "a2m", "b4", "pb"];
    pageFault = true;
    victim = "a7";
    potentialVictims = ["c5", "a2m", "b4", "c1", "c4", "c2"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));


    requirement = "a7r";
    frames = ["c4", "c1", "c2", "a7pr", "a2m", "b4", "pb"];
    pageFault = true;
    victim = "c5";
    potentialVictims = ["a2m", "b4", "c1", "c4", "c2", "a7"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "bf";
    frames = ["c4", "c1", "c2", "a7", "a2m", "fin", "pb"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["a2m", "c1", "c4", "c2", "a7"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a3r";
    frames = ["c4", "c1", "c2", "a7", "a2m", "a3pr", "pb"];
    pageFault = true;
    victim = undefined;
    potentialVictims = ["a2m", "c1", "c4", "c2", "a7", "a3"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a2r";
    frames = ["c4", "c1", "c2", "a7", "a2rm", "a3", "pb"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["a2m", "c1", "c4", "c2", "a7", "a3"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "c3r";
    frames = ["c4", "c1", "c2", "a7", "pb", "a3", "c3pr"];
    pageFault = true;
    victim = "a2m";
    potentialVictims = ["c1", "c4", "c2", "a7", "a3", "c3"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "af";
    frames = ["c4", "c1", "c2", "fin", "pb", "fin", "c3"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["c1", "c4", "c2", "c3"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "cf";
    frames = ["fin", "fin", "fin", "fin", "pb", "fin", "fin"];
    pageFault = false;
    victim = undefined;
    potentialVictims = [];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    return instants;
  }
};
