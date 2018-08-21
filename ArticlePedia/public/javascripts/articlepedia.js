var app = angular.module('ArticlePedia', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider){
  $routeProvider
      .when('/', {
          templateUrl: 'partials/home.html',
          controller: 'HomeCtrl'
      })
      .when('/viewcomments/:articleid', {
          templateUrl: 'partials/article-detail.html',
          controller: 'EditMovieCtrl'
      })
      .otherwise({
          redirectTo: '/'
      });
}]);

app.factory('Notes', ['$resource', function($resource) {
    return $resource('/api/articles/:articleid', {id: '@_id'},
        {
            'update': { method:'PUT' }
        });
}]);
    

app.controller('HomeCtrl', ['$scope','$resource', '$location','$route', '$routeParams', 'Notes', '$http',
    function($scope, $resource, $location, $route, $routeParams, Notes, $http){
        var Articles = $resource('/api/articles');
        Articles.query(function(articles){
            $scope.articles = articles;
        });
        $scope.add = function(){
            Articles.save($scope.article, function(){
                $route.reload();
            });
        };
        $scope.delete = function(id){
            Articles = $resource('/api/articles/:articleid');
            Articles.delete({ articleid: id }, function(article){       
                 $route.reload();
            });
        };
        $scope.upVote = function(id, votes){
            var newVotes = votes + 1;
            $http.put('/api/articles/'+ id, { articleid: id, votes: newVotes}).success(function(response){
                $route.reload();
            });
        }
        $scope.downVote = function(id, votes){
            var newVotes = votes - 1;
            $http.put('/api/articles/'+ id, { articleid: id, votes: newVotes}).success(function(response){
                $route.reload();
            });
        }
}]);

app.controller('EditMovieCtrl', ['$scope','$resource', '$location','$route', '$routeParams', '$http',
    function($scope, $resource, $location, $route, $routeParams, $http){
        var Articles = $resource('/api/articles/:articleid');
        console.log($routeParams.articleid);
        Articles.get({ articleid: $routeParams.articleid }, function(article){
            console.log(article);
            $scope.article = article;
        });
        $scope.addComment = function(){
            var max = Math.max.apply(Math,$scope.article.comments.map(function(item){return item.commentid;}));
            if($scope.article.comments.length == 0){
                max = 1;
                console.log(max);
            }else{
                max = max+1;
            }
            var date = new Date();
            var dateString = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
            var newComment = {
                "commentid" : max,
                "user" : "Admin",
                "date" : dateString,
                "votes" : 0,
                "body" : $scope.comment.body
            };
            console.log(newComment);
            $scope.article.comments.push(newComment);
            console.log($scope.article.comments);
            $http.post('/api/articles/'+ $scope.article._id + '/' + newComment.commentid, {comments: $scope.article.comments}).success(function(response){
                $route.reload();
            });
        };
        $scope.deleteComment = function(commentid){
            $scope.article.comments = $scope.article.comments.filter(function(item) {
                return item.commentid != commentid;
            });
            $http({
                method: 'DELETE',
                url: '/api/articles/'+ $scope.article._id + '/' + commentid,
                data: {
                    comments : $scope.article.comments
                },
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            }).then(function(response){
                $route.reload();
            });
        };
        $scope.upVoteComment = function(commentid, votes){
            var newVotes = votes+1;
            console.log(newVotes);
            $http.put('/api/articles/'+ $scope.article._id + '/' + commentid, {votes: newVotes}).success(function(response){
                $route.reload();
            });
        };
        $scope.downVoteComment = function(commentid, votes){
            var newVotes = votes-1;
            console.log(newVotes);
            $http.put('/api/articles/'+ $scope.article._id + '/' + commentid, {votes: newVotes}).success(function(response){
                $route.reload();
            });
        };
}]);