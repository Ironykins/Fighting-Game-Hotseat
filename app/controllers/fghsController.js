//Let's do this shit.

app.controller('hotseat', ['$scope', function($scope) {
    $scope.player1 = null;
    $scope.player2 = null;
    $scope.players = [];

    $scope.newName = "";
    $scope.gameType = "winnerStay";
    $scope.maxRounds = 0;

    $scope.addPlayer = function() {
        $scope.players.push(new Player($scope.newName));
        $scope.newName = "";
        $scope.nextPlayers()
    }

    //Hax to get event to fire on enter in text box.
    $scope.newPlayerKeypress = function(event) {
        if (event.charCode == 13) //if enter then hit the search button
            $scope.addPlayer();
    }

    $scope.removePlayer = function(index) {
        $scope.players.splice(index,1);
        $scope.nextPlayers()
    }

    $scope.playerWin = function(winner) {
        loser = $scope.player1 == winner ? $scope.player2 : $scope.player1
        //Track Stats
        winner.games++;
        loser.games++;
        winner.wins++;
        loser.losses++;
        winner.played++;
        loser.played++;

        //Streak Stats
        winner.streak++;
        winner.maxStreak = winner.streak > winner.maxStreak ? winner.streak : winner.maxStreak;
        loser.streak = 0;

        //Decide who's staying
        if ($scope.gameType == "winnerStay") {
            staying = winner;
            leaving = loser;
        }
        else {
            staying = loser;
            leaving = winner;
        }

        $scope.players.splice($scope.players.indexOf(leaving),1)
        $scope.players.push(leaving);
        leaving.played = 0

        // Check the max number of rounds a player can stay.
        if($scope.maxRounds != 0 && staying.played >= $scope.maxRounds) {
            $scope.players.splice($scope.players.indexOf(staying),1)
            $scope.players.push(staying);
            staying.played = 0
        }

        $scope.nextPlayers()
    }
    
    //Get the players for the next match.
    $scope.nextPlayers = function() {
        $scope.player1 = null;
        $scope.player2 = null;

        for(i=0;i<$scope.players.length;i++) {
            if($scope.player1 == null) {
                if ($scope.players[i].active)
                    $scope.player1 = $scope.players[i]
            }
            else if ($scope.player2 == null) {
                if ($scope.players[i].active)
                    $scope.player2 = $scope.players[i]
            }
            else
                break
        }
    }

    //Get the player to skip their match
    $scope.playerSkip = function(skipper) {
        skipper.played = 0
        $scope.players.splice($scope.players.indexOf(skipper),1)
        $scope.players.push(skipper);
        $scope.nextPlayers();
    }

    //Prevent the player from getting put in a match
    $scope.deactivatePlayer = function(player) {
        player.active = !player.active
        $scope.nextPlayers();
    }

    $scope.resetStats = function() {
        $scope.players.forEach(function(player) {
            player.wins = 0;
            player.losses = 0;
            player.maxStreak = 0;
            player.draws = 0;
            player.games = 0;
            player.currentStreak = 0;
        });
    }

    $scope.resetAll = function() {
        $scope.players = [];
        $scope.gameType = "winnerStay";
        $scope.maxRounds = 0;
    }
}]);
