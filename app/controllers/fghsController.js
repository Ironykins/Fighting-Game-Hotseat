//Let's do this shit.

app.controller('hotseat', ['$scope','$cookies',function($scope,$cookies) {
    $scope.player1 = null;
    $scope.player2 = null;
    $scope.players = [];

    $scope.newName = "";
    $scope.gameType = "winnerStay";
    $scope.maxRounds = 0;

    $scope.saveCookie = function() {
        savedState = {
            'playerList': $scope.players,
            'gameType': $scope.gameType,
            'maxRounds': $scope.maxRounds,
        }
        $cookies.putObject('savedState', savedState);
    }

    $scope.loadCookie = function() {
        loadedState = $cookies.getObject('savedState');
        if (loadedState != undefined) {
            $scope.players = loadedState.playerList;
            $scope.gameType = loadedState.gameType;
            $scope.maxRounds = loadedState.maxRounds;
            $scope.nextPlayers();
        }
    }

    $scope.addPlayer = function(name) {
        if(name.length > 15 || name.length == 0)
            return; // Quietly don't do it. Our View shouldn't allow names this long.

        $scope.players.push(new Player(name));
        $scope.newName = "";
        $scope.nextPlayers();
    }

    $scope.removePlayer = function(index) {
        $scope.players.splice(index,1);
        $scope.nextPlayers();
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
        $scope.lastWinner = winner

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

    $scope.draw = function() {
        //Track Stats
        $scope.player1.games++;
        $scope.player2.games++;
        $scope.player1.draws++;
        $scope.player2.draws++;
        $scope.player1.played++;
        $scope.player2.played++;
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
        player.active = !player.active;
        if(player == $scope.player1 || player == $scope.player2 || 
            $scope.player1 == null || $scope.player2 == null)
            $scope.nextPlayers();
    }

    $scope.resetStats = function() {
        $scope.players.forEach(function(player) {
            player.wins = 0;
            player.losses = 0;
            player.maxStreak = 0;
            player.draws = 0;
            player.games = 0;
            player.streak = 0;
        });
    }

    $scope.resetAll = function() {
        $scope.players = [];
        $scope.gameType = "winnerStay";
        $scope.maxRounds = 0;
        $scope.player1 = null;
        $scope.player2 = null;
    }

    //If we have a cookie, may as well load it.
    $scope.loadCookie();
}]);
