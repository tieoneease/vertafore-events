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
    $scope.newUser = {};
    $scope.loginUser = {};
    
    $scope.clicked = function() {
        alert($scope.butt);
    };
    
    $scope.createEvent = function() {
        $scope.newEvent.title = $scope.title;
        $scope.newEvent.desc = $scope.description;
        $scope.newEvent.type = $scope.type;
        $scope.newEvent.date = $scope.date;
        $scope.newEvent.time = $scope.time;
        $http.post('/createEvent', $scope.newEvent).then(function(res) {
            //close the popup here
            alert("posted!");
        });
    };
    
    $scope.createUser = function() {
        if($scope.newpassword != $scope.newpassword2){
            alert("Passwords Don't Match");   
        }
        else {  
            $scope.newUser.email = $scope.newemail;
            $scope.newUser.name = $scope.newname;
            $scope.newUser.password = $scope.newpassword;
            $http.post('/createUser', $scope.newUser).then(function(res) {
                alert("user created!");     
            });
        }
    };
    
    //TODO - login stuff
    /*$scope.login = function() {
        $scope.loginUser.email = $scope.email;
        $scope.loginUser.password = $scope.password;
        $http.post('/login', $scope.loginUser).then(function(res) {
            window.location.href = "/"; 
        });
        
    };*/
    
    $http.get('/events').then(function(res) {
        $scope.events = res.data;
    });
                  
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