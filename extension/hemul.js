angular.module('hemul', [])
  .controller('hemulController', ['$scope', function($scope) {
    $scope.infobits = [
      {label:'Väderhistorik', value:"testväder"},
      {label:'Valresultat', value:"testvalresultat"}];
 
    $scope.addInfobit = function() {
      $scope.infobits.push({label:$scope.infobitLabel, value:"test3"});
      $scope.infobitLabel = '';
    };
 /*
    $scope.remaining = function() {
      var count = 0;
      angular.forEach($scope.todos, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };
 
    $scope.archive = function() {
      var oldTodos = $scope.todos;
      $scope.todos = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.done) $scope.todos.push(todo);
      });
    }; 
 */
  }]);
  // */