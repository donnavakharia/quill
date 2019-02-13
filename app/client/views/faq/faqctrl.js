angular.module('reg')
  .controller('FaqCtrl', [
    '$scope',
    function($scope){
		$scope.oneAtATime = true;
		$scope.status = {
			isFirstOpen: false,
			isFirstDisabled: false
		};
    }
  ]);