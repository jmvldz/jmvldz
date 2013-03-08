/* I think if we create the 'sounds' or 'tracklist' object containing all the data before its loaded into the player, it will prevent this
 * soundcloud/angular disagreement, and the whole page would run a lot more smoothly
 */

myModule.controller('PlayerCtrl', ['$scope', 'profileInfo', 'playerService', function($scope, profileInfo, playerService) {

  //init scope variables
  $scope.currentTrack = { artwork_url: '../img/default-player-artwork.png' };

  //ng-click Player Control functions
   $scope.play = function() {
    playerService.playFromPlayer();
  };

  $scope.pause = function() {
    playerService.pause();
  };

  $scope.ffwd = function() {
    playerService.ffwd();
  };

  $scope.rewind = function() {
    playerService.rewind();
  };

  $scope.skipFwd = function() {
    playerService.skipFwd();
  };

  $scope.skipBack = function() {
    playerService.skipBack();
  };

  //Event logic
  
  /*
   * The 'newTrackPlayed' event updates $scope.currentTrack so that the
   * UI updates correctly on a song change.
   */
  $scope.$on('newTrackPlayed', function(event, track, sound) {
    console.log("new track played!");
    $scope.currentTrack = track;
  });

  $scope.$on('trackFinished', function() {
    console.log("track finished!");
    playerService.skipFwd();
  });
}]);  