 //Initialize Soundcloud API
SC.initialize({
  client_id: "78bfc6a742a617082972ddc5ef20df2a",
});

var myModule = angular.module('ddPlayer', ['ui'], function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: '../home.html',
    controller: 'HomeCtrl'
  });
  $routeProvider.when('/profile/:username', {
    templateUrl: '../profile.html',
    controller: 'ProfileCtrl'
  });
  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
});

myModule.service('profileInfo', function($rootScope, $q) {
  //profile /track data grabbed from here
  //if these containedd soundcloud track objects instead of trackURLs the player mechanism could be simplified
  var profiles = [
    {username: "Danny", trackURLs: ["/tracks/74494996", "/tracks/294", "/tracks/75868018", "/tracks/74421378"] },
    {username: "Josh", trackURLs: ["/tracks/75237140", "/tracks/74913382", "/tracks/74432728"] },
    {username: "Samora", trackURLs:["/tracks/74494996", "/tracks/294", "/tracks/75868018", "/tracks/74421378", "/tracks/75237140", "/tracks/74913382", "/tracks/74432728"]}];

  function getEnlargedArtwork(artwork_url) {
    return artwork_url.replace("large", "t500x500");
  }

  return {
    getProfiles: function() {
      return profiles;
    },
    getProfile: function(username) {
      var profile = _.find(profiles, function(profile) {
        return profile.username == username;
      });
      return profile;
    },
    getTracks: function(profile) {
      _.each(profile.trackURLs, function(trackURL) {
        SC.get(trackURL, function(track) {
          track.playIconState = "play";
          $rootScope.$apply(function() {
           //track.artwork_url = getEnlargedArtwork(track.artwork_url); (grabs enlarged artwork URL)
            $rootScope.$broadcast('trackReturned', track);
          });
        });
      });
    }
  };
});



myModule.service('playerService', function($rootScope) {

  //Use this function instead of apply in order to safely update DOM when switching between tracks. See: https://coderwall.com/p/ngisma
  $rootScope.safeApply = function(fn) { 
    var phase = this.$root.$$phase; 
    if(phase == '$apply' || phase == '$digest') { if(fn) fn(); } 
    else { this.$apply(fn); } 
  };

  //Event logic
  $rootScope.$on('profileChange', function() {
    trackList = [];
    trackIndex = -1;
  });
  /* 
   * The events 'trackCreated' and 'trackDeleted' are trigger when the player cards are dragged and
   * dropped. This updates the player so that the player will play the tracks in the new order.
   */
  $rootScope.$on('trackCreated', function(event, track, index) {
    trackList.splice(index, 0, track);
    if (track === currentTrack) {
      trackIndex = index;
      console.log("playing track now at index " + trackIndex);
    } else {
      trackIndex = _.indexOf(trackList, currentTrack);
      console.log("playing track now at index " + trackIndex);
    }
  });

  $rootScope.$on('trackRemoved', function(event, track, index) {
    trackList.splice(index, 1);
    console.log("track removed");
  });

  /*
   * This click listener allows the user to click on the song progress bar to
   * change the position in the current playing track.
   */
  $(document).on('click', '.song-progress-wrapper', function(e) {
    var pos = e.pageX - $(this).offset().left;
    var relPos = currentSound.duration*pos;
    var newPos = relPos/200;
    currentSound.setPosition(newPos);
  });

  $rootScope.currentPos = 0;

  //Player Logic
  var autoPlay = false;
  var trackIndex = 0;
  var playing = false;

  var trackList = [];
  var currentTrack = null;
  var currentSound = null;
  var currentPos = 0;

  return {
    //Getters
    getCurrentTrack: function() {
      return currentTrack;
    },

    //Player Control Logic
    playFromPlayer: function() {
      if (currentSound === null) {
        SC.stream("/tracks/" + trackList[0].id, function(audio) {
          currentSound = audio;
          currentTrack = trackList[0];
          currentTrack.playIconState = "pause";
          trackIndex = 0;
          audio.play({
            onplay: function() {
              $rootScope.safeApply(function() {
                $rootScope.$broadcast('newTrackPlayed', currentTrack, currentSound);
              });
            },
            whileplaying: function() {
              $rootScope.safeApply(function() {
                $rootScope.currentPos = (audio.position / audio.duration) * 200;
                if ($rootScope.currentPos == 200) { $rootScope.$broadcast('trackFinished'); }
              });
            }
          });
        });
        playing = true;
      } else {
        if (!playing) {
          currentSound.play();
          playing = true;
        }
      }
    },
    //Card Sound Control Logic
    playPauseTrack: function(track, index) {
      if (currentTrack === track) {
        console.log("same track!");
        if (!playing) { 
          currentSound.play();
          playing = true;
        } else { 
          currentSound.pause();
          playing = false;
        }
      } else {
        console.log("different track!");
        if (playing) { 
          currentSound.stop(); 
          playing = false;
        }
        SC.stream("/tracks/" + track.id, function(audio) {
          currentSound = audio;
          currentTrack = track;
          trackIndex = index;
          audio.play({
            onplay: function() {
              $rootScope.safeApply(function() {
                $rootScope.$broadcast('newTrackPlayed', currentTrack, currentSound);
              });
            },
            whileplaying: function() {
              $rootScope.safeApply(function() {
                $rootScope.currentPos = (audio.position / audio.duration) * 200;
                if ($rootScope.currentPos == 200) { $rootScope.$broadcast('trackFinished'); }
              });
            }
           });
        }); 
        playing = true;
      }
    },
    pause: function() {
      if(currentSound) {
        if (playing) { 
          currentSound.pause(); 
          playing = false;
        }
      }
    },
    ffwd: function() {
      if(currentSound) {
        $rootScope.safeApply(function() {
          currentSound.setPosition(currentSound.position + 5000);
        });
     }
    },
    rewind: function() {
      if (currentSound) {
        $rootScope.safeApply(function() {
          currentSound.setPosition(currentSound.position - 5000);
        });
      }
    },
    skipFwd: function() {
      if (currentSound) {
        currentSound.stop();
        currentTrack.playIconState = "play";
        playing = false;
        trackIndex++;
        if (trackIndex >= trackList.length) { trackIndex = 0; }
        var track = trackList[trackIndex];
        track.playIconState = "pause";
        this.playPauseTrack(track, trackIndex);
      }
    },
    skipBack: function() {
      if (currentSound) {
        currentSound.stop();
        currentTrack.playIconState = "play";
        playing = false;
        trackIndex--;
        if (trackIndex === -1) { trackIndex = trackList.length - 1; }
        var track = trackList[trackIndex];
        track.playIconState = "pause";
        this.playPauseTrack(track, trackIndex);
      }
    }
  };
});