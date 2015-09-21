var Factory = require('../factory');

module.exports = {
  getRequirements: function () {
    return [ Factory.rf("a1r"), Factory.rf("b1r"), Factory.rf("b2r"), Factory.rf("a2r"), Factory.rf("a3r"), Factory.rf("b3r"), Factory.rf("a2r"), Factory.rf("a3r"), Factory.rf("b1r"), Factory.rf("b2r"), Factory.rf("b3r"), Factory.rf("a1r"), Factory.rf("af"), Factory.rf("bf") ];
  },
  getInstants: function () {
    var instants = [];

    var requirement = "a1r";
    var frames = ["a1pr"];
    var pageFault = true;
    var victim = undefined;
    var potentialVictims = ["a1"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b1r";
    frames = ["a1", "b1pr"];
    pageFault = true;
    victim = undefined;
    potentialVictims = ["a1", "b1"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b2r";
    frames = ["a1", "b1", "b2pr"];
    pageFault = true;
    victim = undefined;
    potentialVictims = ["a1", "b2", "b1"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a2r";
    frames = ["a1", "b1", "b2", "a2pr"];
    pageFault = true;
    victim = undefined;
    potentialVictims = ["a1", "b2", "b1", "a2"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a3r";
    frames = ["a3pr", "b1", "b2", "a2"];
    pageFault = true;
    victim = "a1";
    potentialVictims = ["b2", "b1", "a3", "a2"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b3r";
    frames = ["a3", "b1", "b3pr", "a2"];
    pageFault = true;
    victim = "b2";
    potentialVictims = ["b3", "b1", "a3", "a2"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a2r";
    frames = ["a3", "b1", "b3", "a2r"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["a2", "b3", "b1", "a3"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a3r";
    frames = ["a3r", "b1", "b3", "a2"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["a2", "a3", "b3", "b1"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b1r";
    frames = ["a3", "b1r", "b3", "a2"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["a2", "a3", "b1", "b3"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b2r";
    frames = ["a3", "b1", "b3", "b2pr"];
    pageFault = true;
    victim = "a2";
    potentialVictims = ["a3", "b1", "b2", "b3"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b3r";
    frames = ["a3", "b1", "b3r", "b2"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["a3", "b1", "b2", "b3"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a1r";
    frames = ["a1pr", "b1", "b3", "b2"];
    pageFault = true;
    victim = "a3";
    potentialVictims = ["b1", "b2", "b3", "a1"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "af";
    frames = ["fin", "b1", "b3", "b2"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["b1", "b2", "b3"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "bf";
    frames = ["fin", "fin", "fin", "fin"];
    pageFault = false;
    victim = undefined;
    potentialVictims = [];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    return instants;
  }
};
