myModule.controller('PageViewCtrl', ['$scope', '$route', '$routeParams', '$location', 'profileInfo', function($scope, $route, $routeParams, $location, profileInfo) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
  $scope.profiles = profileInfo.getProfiles();
}]);
 
myModule.controller('ProfileCtrl', ['$scope', '$routeParams', 'profileInfo', 'playerService', function($scope, $routeParams, profileInfo, playerService) {

  $scope.$emit('profileChange');

  $scope.profile = profileInfo.getProfile($routeParams.username);
  $scope.tracks = [];
  //$scope.playIconState = "play";
  
  profileInfo.getTracks($scope.profile);

  /*
   * These observe functions are triggered when the $scope.tracks array is changed
   * (both when originally created and when updated by a drag-and-drop)
   */
  _.observe($scope.tracks, 'create', function(track, index) {
    $scope.$emit('trackCreated', track, index);
  });

  _.observe($scope.tracks, 'delete', function(track, index) {
    $scope.$emit('trackRemoved', track, index);
  });

  //ng-click functions

  $scope.playFromCard = function(track) {
    var trackIndex = _.indexOf($scope.profile.trackURLs, "/tracks/" + track.id);
    var oldTrack = playerService.getCurrentTrack();
    if (track !== oldTrack && oldTrack !== null) { oldTrack.playIconState = "play"; }
    if (track.playIconState === "play") { track.playIconState = "pause"; }
    else { track.playIconState = "play"; }
    playerService.playPauseTrack(track, trackIndex);
  };

  $scope.deleteCard = function(track) {
    var trackIndex = _.indexOf($scope.profile.trackURLs, "/tracks/" + track.id);
    $scope.profile.trackURLs.splice(trackIndex, 1);
    $scope.tracks.splice(trackIndex, 1);
    $scope.$emit('cardDeleted', trackIndex);
  };

  //Event Logic

  $scope.$on('trackReturned', function(event, track) {
    $scope.tracks.push(track);
  });

  //Options
  $scope.sortableOptions = { handle: '.card-handle'};

}]);

myModule.controller('HomeCtrl', ['$scope', '$routeParams', 'profileInfo', 'playerService', function($scope, $routeParams, profileInfo, playerService) {
  $scope.name = "HomeCtrl";
}]);