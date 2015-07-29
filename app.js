var app = angular.module("vertafore-events", ['ui.bootstrap']);

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
    $scope.modalOpen = false;
    
    
    $scope.typefield = "office";
    
    $http.get('/events').then(function(res) {
        $scope.events = res.data;
    });
    
    $scope.cancelEvent = function() {
        $scope.titlefield = "";
        $scope.descfield = "";
        $scope.locationfield = "";
        $scope.fromfield = "";
        $scope.tofield = "";
    };
    
    $scope.createEvent = function(e) {
        var newEvent = {
            title: $scope.titlefield,
            desc: $scope.descfield,
            location: $scope.locationfield,
            type: $scope.typefield,
            from: $scope.fromfield,
            to: $scope.tofield
        }
        $http.post('/createEvent', newEvent).then(function(res) {
            $http.get('/events').then(function(res) {
                $scope.events = res.data;
            });
        });
        $scope.modalOpen = false;
        $scope.cancelEvent();
    };
    
    $scope.toGlyphClass = function(type) {
        if (type === 'office')
            return 'glyphicon-briefcase';
        if (type === 'gaming')
            return 'glyphicon-king';
        if (type === 'sports')
            return 'glyphicon-record';
        if (type === 'social')
            return 'glyphicon-glass';
        if (type === 'volunteer')
            return 'glyphicon-plus';
    };
    
    
    $scope.toggleNav = function(e) {
        $scope.modalOpen = false;
        $scope.rightOpen = false;
        $scope.leftOpen = true;
        e.stopPropagation();
    };
    
    $scope.toggleFilter = function(e) {
        $scope.modalOpen = false;
        $scope.leftOpen = false;
        $scope.rightOpen = true;
        e.stopPropagation();
    };

    $scope.showModal = function(e) {
        $scope.leftOpen = false;
        $scope.rightOpen = false;
        $scope.modalOpen = true;
        e.stopPropagation();
    }
    
    $scope.closeMenus = function() {
        $scope.leftOpen = false;
        $scope.rightOpen = false;
    };
    
    $scope.closeModal = function() {
        $scope.modalOpen = false;
        $scope.closeMenus();
    };
    
    $rootScope.$on("escapePressed", _close);

    function _close() {
        $scope.$apply(function() {
            $scope.modalOpen = false;
            $scope.closeMenus();
        });
    }
}]);