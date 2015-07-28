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
    
    $scope.newEvent = {};
    
    $scope.clicked = function() {
        alert($scope.butt);
    };
    
    $scope.createEvent = function() {
        $scope.newEvent.title = $scope.title;
        $http.post('/createEvent', $scope.newEvent).then(function(res) {
            alert("posted!");
        });
    };
    
    $scope.leftOpen = false;
    $scope.rightOpen = false;
    
    $scope.toggleNav = function(e) {
        $scope.rightOpen = false;
        $scope.leftOpen = true;
        e.stopPropagation();
    };
    
    $scope.toggleFilter = function(e) {
        $scope.leftOpen = false;
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