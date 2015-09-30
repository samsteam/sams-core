var Factory = require('../factory');

module.exports = {
  getRequirements: function () {
    return [ Factory.rf("B2"), Factory.rf("B4"), Factory.rf("A1"), Factory.rf("A3"), Factory.rf("A1"), Factory.rf("C1"), Factory.rf("C2"), Factory.rf("B6"), Factory.rf("B2"), Factory.rf("B4"), Factory.rf("A2"), Factory.rf("A4"), Factory.rf("A1"), Factory.rf("C4"), Factory.rf("C8"), Factory.rf("B1"), Factory.rf("B8"), Factory.rf("C6"), Factory.rf("C1"), Factory.rf("C4"), Factory.rf("C1"), Factory.rf("A5"), Factory.rf("A1"), Factory.rf("CF"), Factory.rf("A4"), Factory.rf("B3"), Factory.rf("B1"), Factory.rf("B8"), Factory.rf("A7"), Factory.rf("BF"), Factory.rf("A9"), Factory.rf("A4"), Factory.rf("AF") ];
  },
  getInstants: function () {
    var instants = [];

    var requirement = "b2";
    var frames = ["b2pr"];
    var pageFault = true;
    var victim = undefined;
    var potentialVictims = ["b2"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b4";
    frames = ["b2", "b4pr"];
    pageFault = true;
    victim = undefined;
    potentialVictims = ["b2", "b4"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a1";
    frames = ["b2", "b4", "a1pr"];
    pageFault = true;
    victim = undefined;
    potentialVictims = ["b2", "b4", "a1"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a3";
    frames = ["b2", "b4", "a1", "a3pr"];
    pageFault = true;
    victim = undefined;
    potentialVictims = ["b2", "b4", "a1", "a3"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a1";
    frames = ["b2", "b4", "a1r", "a3"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["b2", "b4", "a1", "a3"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "c1";
    frames = ["b2", "b4", "a1", "a3", "c1pr"];
    pageFault = true;
    victim = undefined;
    potentialVictims = ["b2", "b4", "a1", "a3", "c1"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "c2";
    frames = ["b2", "b4", "a1", "a3", "c1", "c2pr"];
    pageFault = true;
    victim = undefined;
    potentialVictims = ["b2", "b4", "a1", "a3", "c1", "c2"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b6";
    frames = ["b2", "b4", "a1", "a3", "c1", "c2", "b6pr"];
    pageFault = true;
    victim = undefined;
    potentialVictims = ["b2", "b4", "a1", "a3", "c1", "c2", "b6"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b2";
    frames = ["b2r", "b4", "a1", "a3", "c1", "c2", "b6"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["b2", "b4", "a1", "a3", "c1", "c2", "b6"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b4";
    frames = ["b2", "b4r", "a1", "a3", "c1", "c2", "b6"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["b2", "b4", "a1", "a3", "c1", "c2", "b6"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a2";
    frames = ["b2", "b4", "a1", "a3", "c1", "c2", "b6", "a2pr"];
    pageFault = true;
    victim = undefined;
    potentialVictims = ["b2", "b4", "a1", "a3", "c1", "c2", "b6", "a2"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a4";
    frames = ["b2", "b4", "a4pr", "a3", "c1", "c2", "b6", "a2"];
    pageFault = true;
    victim = "a1";
    potentialVictims = ["b2", "b4", "a3", "c1", "c2", "b6", "a2", "a4"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a1";
    frames = ["b2", "b4", "a4", "a1pr", "c1", "c2", "b6", "a2"];
    pageFault = true;
    victim = "a3";
    potentialVictims = ["b2", "b4", "c1", "c2", "b6", "a2", "a4", "a1"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "c4";
    frames = ["b2", "b4", "a4", "a1", "c1", "c2", "b6", "a2", "c4pr"];
    pageFault = true;
    victim = undefined;
    potentialVictims = ["b2", "b4", "c1", "c2", "b6", "a2", "a4", "a1", "c4"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "c8";
    frames = ["b2", "b4", "a4", "a1", "c8pr", "c2", "b6", "a2", "c4"];
    pageFault = true;
    victim = "c1";
    potentialVictims = ["b2", "b4", "c2", "b6", "a2", "a4", "a1", "c4", "c8"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b1";
    frames = ["b1pr", "b4", "a4", "a1", "c8", "c2", "b6", "a2", "c4"];
    pageFault = true;
    victim = "b2";
    potentialVictims = ["b4", "c2", "b6", "a2", "a4", "a1", "c4", "c8", "b1"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b8";
    frames = ["b1", "b8pr", "a4", "a1", "c8", "c2", "b6", "a2", "c4"];
    pageFault = true;
    victim = "b4";
    potentialVictims = ["c2", "b6", "a2", "a4", "a1", "c4", "c8", "b1", "b8"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "c6";
    frames = ["b1", "b8", "a4", "a1", "c8", "c6pr", "b6", "a2", "c4"];
    pageFault = true;
    victim = "c2";
    potentialVictims = ["b6", "a2", "a4", "a1", "c4", "c8", "b1", "b8", "c6"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "c1";
    frames = ["b1", "b8", "a4", "a1", "c8", "c6", "b6", "a2", "c1pr"];
    pageFault = true;
    victim = "c4";
    potentialVictims = ["b6", "a2", "a4", "a1", "c8", "b1", "b8", "c6", "c1"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "c4";
    frames = ["b1", "b8", "a4", "a1", "c4pr", "c6", "b6", "a2", "c1"];
    pageFault = true;
    victim = "c8";
    potentialVictims = ["b6", "a2", "a4", "a1", "b1", "b8", "c6", "c1", "c4"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "c1";
    frames = ["b1", "b8", "a4", "a1", "c4", "c6", "b6", "a2", "c1r"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["b6", "a2", "a4", "a1", "b1", "b8", "c6", "c1", "c4"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a5";
    frames = ["b1", "b8", "a4", "a1", "c4", "c6", "b6", "a5pr", "c1"];
    pageFault = true;
    victim = "a2";
    potentialVictims = ["b6", "a4", "a1", "b1", "b8", "c6", "c1", "c4", "a5"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a1";
    frames = ["b1", "b8", "a4", "a1r", "c4", "c6", "b6", "a5", "c1"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["b6", "a4", "a1", "b1", "b8", "c6", "c1", "c4", "a5"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "cf";
    frames = ["b1", "b8", "a4", "a1", "fin", "fin", "b6", "a5", "fin"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["b6", "a4", "a1", "b1", "b8", "a5"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a4";
    frames = ["b1", "b8", "a4r", "a1", "fin", "fin", "b6", "a5", "fin"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["b6", "a4", "a1", "b1", "b8", "a5"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b3";
    frames = ["b1", "b8", "a4", "a1", "fin", "fin", "b3pr", "a5", "fin"];
    pageFault = true;
    victim = "b6";
    potentialVictims = ["a4", "a1", "b1", "b8", "a5", "b3"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b1";
    frames = ["b1r", "b8", "a4", "a1", "fin", "fin", "b3", "a5", "fin"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["a4", "a1", "b1", "b8", "a5", "b3"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "b8";
    frames = ["b1", "b8r", "a4", "a1", "fin", "fin", "b3", "a5", "fin"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["a4", "a1", "b1", "b8", "a5", "b3"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a7";
    frames = ["b1", "b8", "a7pr", "a1", "fin", "fin", "b3", "a5", "fin"];
    pageFault = true;
    victim = "a4";
    potentialVictims = ["a1", "b1", "b8", "a5", "b3", "a7"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "bf";
    frames = ["fin", "fin", "a7", "a1", "fin", "fin", "fin", "a5", "fin"];
    pageFault = false;
    victim = undefined;
    potentialVictims = ["a1", "a5", "a7"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a9";
    frames = ["fin", "fin", "a7", "a9pr", "fin", "fin", "fin", "a5", "fin"];
    pageFault = true;
    victim = "a1";
    potentialVictims = ["a5", "a7", "a9"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "a4";
    frames = ["fin", "fin", "a7", "a9", "fin", "fin", "fin", "a4pr", "fin"];
    pageFault = true;
    victim = "a5";
    potentialVictims = ["a7", "a9", "a4"];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    requirement = "af";
    frames = ["fin", "fin", "fin", "fin", "fin", "fin", "fin", "fin", "fin"];
    pageFault = false;
    victim = undefined;
    potentialVictims = [];
    instants.push(Factory.make(requirement, frames, pageFault, victim, potentialVictims));

    return instants;
  }
};
