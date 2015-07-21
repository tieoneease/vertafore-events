var app = angular.module("vertafore-events", []);

app.run(function($rootScope) {
    document.addEventListener("keyup", function(e) {
        if (e.keyCode === 27)
            $rootScope.$broadcast("escapePressed", e.target);
    });

    document.addEventListener("click", function(e) {
        $rootScope.$broadcast("documentClicked", e.target);
    });
});

app.controller('mainCtrl', ["$scope", "$http", function ($scope, $http) {
    $scope.leftOpen = false;
    $scope.rightOpen = false;
    
    $scope.toggleNav = function() {
        $scope.leftOpen = true;
    };
    
    $scope.toggleFilter = function() {
        $scope.rightOpen = true;
    };
    
    $scope.closeMenus = function() {
        $scope.leftOpen = false;
        $scope.rightOpen = false;
    };
    
}]);