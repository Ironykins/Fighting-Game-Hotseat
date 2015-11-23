//Let's do this shit.
var app = angular.module('fighter-hotseat', []);

app.controller('hotseat', ['$scope', function($scope) {
    $scope.players = [];

    //Index of players 1 and 2.
    //These don't actually need to change.
    $scope.p1i = 0;
    $scope.p2i = 1;

    $scope.newName = "";
    $scope.gameType = "winnerStay";
    $scope.maxRounds = 0;
    $scope.currentStreak = 0;
    $scope.currentStreaker = ""; //Name of streaker.

    $scope.addPlayer = function() {
        $scope.players.push(new Player($scope.newName));
        $scope.newName = "";
    }

    //Hax to get event to fire on enter in text box.
    $scope.newPlayerKeypress = function(event)
    {
        if (event.charCode == 13) //if enter then hit the search button
            $scope.addPlayer();
    }

    $scope.removePlayer = function(index) {
        $scope.players.splice(index,1);
    }

    $scope.playerWin = function(player) {
        winner = player == 1 ? $scope.p1i : $scope.p2i;
        loser = player == 1 ? $scope.p2i : $scope.p1i;

        if($scope.gameType == "loserStay") {
            temp = winner;
            winner = loser;
            loser = temp;
        }

        if($scope.players[winner].name == $scope.currentStreaker)
            $scope.currentStreak++;
        else
            $scope.currentStreak = 1;

        $scope.currentStreaker = $scope.players[winner].name;
        if($scope.players[winner].maxStreak < $scope.currentStreak)
            $scope.players[winner].maxStreak = $scope.currentStreak;

        $scope.players[winner].wins++;
        $scope.players[loser].losses++;
        $scope.players.push($scope.players[loser]);

        //Finished their max streak? Winner switches too.
        if($scope.maxRounds != 0 && $scope.currentStreak >= $scope.maxRounds){
            $scope.players.push($scope.players[winner]);
            $scope.players.splice(0,1);
            $scope.players.splice(0,1);
            console.log("derp");
            $scope.currentStreak = 0;
        }
        else
            $scope.players.splice(loser,1);
    }

    $scope.resetStats = function() {
        $scope.players.forEach(function(player) {
            player.wins = 0;
            player.losses = 0;
        });
        $scope.currentStreak = 0;
    }

    $scope.resetAll = function() {
        $scope.players = [];
        $scope.currentStreak = 0;
    }
}]);
