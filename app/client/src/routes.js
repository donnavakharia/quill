const angular = require('angular');
const SettingsService = require('./services/SettingsService.js');
const UserService = require('./services/UserService.js');

const AdminCtrl = require('../views/admin/AdminCtrl.js');
const AdminSettingsCtrl = require('../views/admin/settings/AdminSettingsCtrl.js');
const AdminStatsCtrl = require('../views/admin/stats/AdminStatsCtrl.js');
const AdminUserCtrl = require('../views/admin/user/AdminUserCtrl.js');
const AdminUsersCtrl = require('../views/admin/users/AdminUsersCtrl.js');
const ApplicationCtrl = require('../views/application/ApplicationCtrl.js');
const ConfirmationCtrl = require('../views/confirmation/ConfirmationCtrl.js');
const DashboardCtrl = require('../views/dashboard/DashboardCtrl.js');
const LoginCtrl = require('../views/login/LoginCtrl.js');
const ResetCtrl = require('../views/reset/ResetCtrl.js');
const SidebarCtrl = require('../views/sidebar/SidebarCtrl.js');
const TeamCtrl = require('../views/team/TeamCtrl.js');
const VerifyCtrl = require('../views/verify/VerifyCtrl.js');

angular.module('reg')
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function(
      $stateProvider,
      $urlRouterProvider,
      $locationProvider) {

    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/404");

    // Set up de states
    $stateProvider
      .state('login', {
        url: "/login",
        templateUrl: "views/login/login.html",
        controller: 'LoginCtrl',
        data: {
          requireLogin: false
        },
        resolve: {
          'settings': function(SettingsService){
            return SettingsService.getPublicSettings();
          }
        }
      })
      .state('faq1',{
      url: "/faq1",
      templateUrl: "views/faq/faq1.html",
      
      data: {
        requireLogin: false
      }
      })
      .state('app', {
        views: {
          '': {
            templateUrl: "views/base.html"
          },
          'sidebar@app': {
            templateUrl: "views/sidebar/sidebar.html",
            controller: 'SidebarCtrl',
            resolve: {
              settings: function(SettingsService) {
                return SettingsService.getPublicSettings();
              }
            }
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state('app.dashboard', {
        url: "/",
        templateUrl: "views/dashboard/dashboard.html",
        controller: 'DashboardCtrl',
        resolve: {
          currentUser: function(UserService){
            return UserService.getCurrentUser();
          },
          settings: function(SettingsService){
            return SettingsService.getPublicSettings();
          }
        },
      })
      .state('app.application', {
        url: "/application",
        templateUrl: "views/application/application.html",
        controller: 'ApplicationCtrl',
        data: {
          requireVerified: true
        },
        resolve: {
          currentUser: function(UserService){
            return UserService.getCurrentUser();
          },
          settings: function(SettingsService){
            return SettingsService.getPublicSettings();
          }
        }
      })
      .state('app.confirmation', {
        url: "/confirmation",
        templateUrl: "views/confirmation/confirmation.html",
        controller: 'ConfirmationCtrl',
        data: {
          requireAdmitted: true
        },
        resolve: {
          currentUser: function(UserService){
            return UserService.getCurrentUser();
          }
        }
      })
      .state('app.team', {
        url: "/team",
        templateUrl: "views/team/team.html",
        controller: 'TeamCtrl',
        data: {
          requireVerified: true
        },
        resolve: {
          currentUser: function(UserService){
            return UserService.getCurrentUser();
          },
          settings: function(SettingsService){
            return SettingsService.getPublicSettings();
          }
        }
      })
      .state('app.faq',{
      url: "/faq",
      templateUrl: "views/faq/faq.html",
      controller: 'FaqCtrl',
      data: {
        requireLogin: true
      }
      })
      .state('app.admin', {
        views: {
          '': {
            templateUrl: "views/admin/admin.html",
            controller: 'AdminCtrl'
          }
        },
        data: {
          requireAdmin: true
        }
      })
      .state('app.admin.stats', {
        url: "/admin",
        templateUrl: "views/admin/stats/stats.html",
        controller: 'AdminStatsCtrl'
      })
      .state('app.admin.users', {
        url: "/admin/users?" +
          '&page' +
          '&size' +
          '&query',
        templateUrl: "views/admin/users/users.html",
        controller: 'AdminUsersCtrl'
      })
      .state('app.admin.user', {
        url: "/admin/users/:id",
        templateUrl: "views/admin/user/user.html",
        controller: 'AdminUserCtrl',
        resolve: {
          'user': function($stateParams, UserService){
            return UserService.get($stateParams.id);
          }
        }
      })
      .state('app.admin.settings', {
        url: "/admin/settings",
        templateUrl: "views/admin/settings/settings.html",
        controller: 'AdminSettingsCtrl',
      })
      .state('reset', {
        url: "/reset/:token",
        templateUrl: "views/reset/reset.html",
        controller: 'ResetCtrl',
        data: {
          requireLogin: false
        }
      })
      .state('verify', {
        url: "/verify/:token",
        templateUrl: "views/verify/verify.html",
        controller: 'VerifyCtrl',
        data: {
          requireLogin: false
        }
      })
      .state('404', {
        url: "/404",
        templateUrl: "views/404.html",
        data: {
          requireLogin: false
        }
      });

    $locationProvider.html5Mode({
      enabled: true,
    });

  }])
  .run($transitions => {
    $transitions.onStart({}, transition => {
      const Session = transition.injector().get("Session");

      var requireLogin = transition.to().data.requireLogin;
      var requireAdmin = transition.to().data.requireAdmin;
      var requireVerified = transition.to().data.requireVerified;
      var requireAdmitted = transition.to().data.requireAdmitted;

      if (requireLogin && !Session.getToken()) {
        return transition.router.stateService.target("login");
      }

      if (requireAdmin && !Session.getUser().admin) {
        return transition.router.stateService.target("app.dashboard");
      }

      if (requireVerified && !Session.getUser().verified) {
        return transition.router.stateService.target("app.dashboard");
      }

      if (requireAdmitted && !Session.getUser().status.admitted) {
        return transition.router.stateService.target("app.dashboard");
      }
    });

    $transitions.onSuccess({}, transition => {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
  });
