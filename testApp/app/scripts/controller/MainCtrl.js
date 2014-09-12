angular.module('angularPeekerTest')
    .controller('MainCtrl', [
        '$scope',
        function ($scope) {
            $scope.sayHello = function () {
                alert('Hello');
            };
            $scope.englishLeague = {
                teams: [
                    {
                        name: 'Chelsea',
                        matchesPlayed: 3,
                        wins: 3,
                        draws: 0,
                        losses: 0,
                        goalsFor: 11,
                        goalsAgainst: 4
                    },
                    {
                        name: 'Swansea City ',
                        matchesPlayed: 3,
                        wins: 3,
                        draws: 0,
                        losses: 0,
                        goalsFor: 6,
                        goalsAgainst: 1
                    },
                    {
                        name: 'Aston Villa ',
                        matchesPlayed: 3,
                        wins: 2,
                        draws: 1,
                        losses: 0,
                        goalsFor: 3,
                        goalsAgainst: 1
                    },
                    {
                        name: 'Manchester City ',
                        matchesPlayed: 3,
                        wins: 2,
                        draws: 0,
                        losses: 1,
                        goalsFor: 5,
                        goalsAgainst: 2
                    }

                ]
            };
        }
    ]);
