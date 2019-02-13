angular.module('reg')
  .factory('UserService', [
  '$http',
  'Session', '$q',
  function($http, Session, $q){

    var users = '/api/users';
    var base = users + '/';

    return {

      // ----------------------
      // Basic Actions
      // ----------------------
      getCurrentUser: function(){
        return $http.get(base + Session.getUserId());
      },

      get: function(id){
        return $http.get(base + id);
      },

      getAll: function(){
        return $http.get(base);
      },

      getPage: function(page, size, text){
        return $http.get(users + '?' + $.param(
          {
            text: text,
            page: page ? page : 0,
            size: size ? size : 50
          })
        );
      },

      updateProfile: function(id, profile){
        return $http.put(base + id + '/profile', {
          profile: profile
        });
      },

      updateConfirmation: function(id, confirmation){
        return $http.put(base + id + '/confirm', {
          confirmation: confirmation
        });
      },

      declineAdmission: function(id){
        return $http.post(base + id + '/decline');
      },

      // ------------------------
      // Team
      // ------------------------
      joinOrCreateTeam: function(code){
        return $http.put(base + Session.getUserId() + '/team', {
          code: code
        });
      },

      leaveTeam: function(){
        return $http.delete(base + Session.getUserId() + '/team');
      },

      getMyTeammates: function(){
        return $http.get(base + Session.getUserId() + '/team');
      },

      // -------------------------
      // Admin Only
      // -------------------------

      getStats: function(){
        return $http.get(base + 'stats');
      },

      admitUser: function(id){
        return $http.post(base + id + '/admit');
      },

      checkIn: function(id){
        return $http.post(base + id + '/checkin');
      },

      checkOut: function(id){
        return $http.post(base + id + '/checkout');
      },

      getTeamsDetails: function(){
        var defer = $q.defer();

        var promise = $http.get('/api/teams/'+Session.getUserId());            
        $q.when(promise).then(function (response){
          var teams = [];
          var data = response.data;
          for (var i = 0; i < data.length; i++){
            teams.push({
                          _id: data[i]._id,
                          isSelected: false,
                          teamname: data[i].teamname,
                        //  ideasummary: data[i].ideasummary,
                         // ideadescription: data[i].ideadescription,
                          teammates: data[i].teammates
                       });
          }
          defer.resolve(teams);
        }, function (err) {
          defer.reject(err);
        });

        return defer.promise;
      },

      createTeam: function(team){
        var defer = $q.defer();
        var request = {
          team: team
        }

        var promise = $http.post('/api/addteam/'+Session.getUserId(), request, request);

        $q.when(promise).then(function(res){
          defer.resolve('Successfully created new team');
        }, function(err){
          defer.reject(err);
        });
        return defer.promise;
      },


      joinTeam: function(selectedTeamId, teammates){
        var defer = $q.defer();
        var request = {
          teamid: selectedTeamId,
          teammates: teammates
        }

        var promise = $http.post('/api/updateteam/'+Session.getUserId(), request, request);

        $q.when(promise).then(function(res){
          defer.resolve('Successfully created new team');
        }, function(err){
          defer.reject(err);
        });
        return defer.promise;
      },

      updateTeamDeails: function(selectedTeamId) {//, ideasummary, ideadescription){
        var defer = $q.defer();
        var request = {
          teamid: selectedTeamId//,
          //ideasummary: ideasummary,
          //ideadescription: ideadescription
        }

        var promise = $http.post('/api/updateteamdetails/'+Session.getUserId(), request, request);

        $q.when(promise).then(function(res){
          defer.resolve('Successfully created new team');
        }, function(err){
          defer.reject(err);
        });
        return defer.promise;
      },

      makeAdmin: function(id){
        return $http.post(base + id + '/makeadmin');
      },

      removeAdmin: function(id){
        return $http.post(base + id + '/removeadmin');
      },
    };
  }
  ]);
