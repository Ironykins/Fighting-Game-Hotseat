/*
 * model.js
 * Author: Konrad Aust, aka Ironykins
 * App Stuff and data structures for fighting game hotseat program
 */
var app = angular.module('fighter-hotseat', ['ngCookies']);

// Constructor for a player object.
function Player(name) {
    this.name = name;
    this.title = get_description();
    this.wins = 0;
    this.losses = 0;
    this.draws = 0;
    this.games = 0;
    this.streak = 0;
    this.played = 0;
    this.maxStreak = 0;
    this.active = true;
}

