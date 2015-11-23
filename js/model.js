/*
 * model.js
 * Author: Konrad Aust, aka Ironykins
 * The model for the fighting game hotseat program.
 */

// Creates a new player.
function Player(name) {
    this.name = name;
    this.wins = 0;
    this.losses = 0;
    this.maxStreak = 0;
}

