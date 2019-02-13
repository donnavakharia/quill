angular.module('reg')
  .controller('TeamCtrl', [
    '$scope',
    'currentUser',
    'settings',
    'Utils',
    'UserService',
    'TEAM',
    function($scope, currentUser, settings, Utils, UserService, TEAM){
      // Get the current user's most recent data.
      var Settings = settings.data;

      $scope.showTable = false;
      $scope.createTable = false;

      UserService.getTeamsDetails()
                 .then(function(teams){
                  $scope.teams = teams;
                  $scope.showTable = true;
                 }, function(err){
                  $scope.error = err;
                 });
      $scope.regIsOpen = Utils.isRegOpen(Settings);

      $scope.user = currentUser.data;

      $scope.TEAM = TEAM;

      

      function _populateTeammates() {
        UserService
          .getMyTeammates()
          .then(response => {
            $scope.error = null;
            $scope.teammates = response.data;
          })
      }

      if ($scope.user.teamCode){
        _populateTeammates();
      }

      $scope.joinTeam = function(){
        UserService
          .joinOrCreateTeam($scope.code)
          .then(response => {
            $scope.error = null;
            $scope.user = response.data;
            _populateTeammates();
          }, response => {
            $scope.error = response.data.message;
          });
      };

      $scope.leaveTeam = function(){
        UserService
          .leaveTeam()
          .then(response => {
            $scope.error = null;
            $scope.user = response.data;
            $scope.teammates = [];
          }, response => {
            $scope.error = response.data.message;
          });
      };

      $scope.createTeam = function(){
        $scope.createTable = true;
        //$scope.showTable = false;
      }

      $scope.updateSelected = function(user){
        for(var i = 0 ; i < $scope.teams.length; i++){
          if($scope.teams[i].teamName !== user.teamName){
            $scope.teams[i].isSelected = false;
          }
        }
      }

    }]);