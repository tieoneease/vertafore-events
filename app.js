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

app.controller('mainCtrl', ["$rootScope", "$scope", "$http", function ($rootScope, $scope, $http) {
    $scope.leftOpen = false;
    $scope.rightOpen = false;
    
    $scope.toggleNav = function(e) {
        $scope.leftOpen = true;
        e.stopPropagation();
    };
    
    $scope.toggleFilter = function(e) {
        $scope.rightOpen = true;
        e.stopPropagation();
    };
    
    $scope.closeMenus = function() {
        $scope.leftOpen = false;
        $scope.rightOpen = false;
    };
    
    $rootScope.$on("escapePressed", _close);

    function _close() {
        $scope.$apply(function() {
            $scope.closeMenus();
        });
    }
}]);