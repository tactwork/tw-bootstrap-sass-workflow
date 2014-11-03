var app = angular.module("kApp", ["ngRoute", "ngAnimate", "ngTouch", "ui.bootstrap"], function($routeProvider, $locationProvider) {
  $routeProvider.when('/articles', {
    templateUrl: 'partials/post-list.html', controller: PostListCtrl
  });
  $routeProvider.when('/articles/:postId', {
    templateUrl: 'partials/post-detail.html', controller: PostDetailCtrl
  });
  $routeProvider.when('/projects', {
    templateUrl: 'partials/projects.html'
  });
  $routeProvider.when('/contact', {
    templateUrl: 'partials/contact.html'
  });
  $routeProvider.when('/home', {
    templateUrl: 'partials/home.html'
  });
  $routeProvider.when('/message', {
    templateUrl: 'partials/message.html', controller: PostEditCtrl
  });
  $routeProvider.otherwise({redirectTo: '/home'});
});

app.directive('kenanMenuToggle', function($animate) {
  return {
    restrict: 'AEC',
    link: function(scope, element) {
      element.bind('click', function() {
        var menu = angular.element(document.querySelector('#k-page'));
        menu.toggleClass('show');
      });
    }
  }
});

//Fix to make carosel work. https://github.com/angular-ui/bootstrap/issues/1350
app.directive('disableNgAnimate', ['$animate', function($animate) {
  return {
    restrict: 'A',
    link: function(scope, element) {
      $animate.enabled(false, element);
    }
  };
}]);

//alert controller and really good transclude example. **************************
app.controller('kthalertCtrl', ['$scope', '$timeout', function($scope) {
  $scope.dialogIsHidden = false;
  $scope.hideDialog = function () {
    $scope.dialogIsHidden = true;

  };
  $scope.showDialog = function () {
    $scope.dialogIsHidden = false;

  };
}])
app.directive('kthalert', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      'close': '&onClose'
    },
    templateUrl: 'kthalert.html'
  };
});


function PostListCtrl($scope, $firebase) {
  var ref = new Firebase("https://k-base-2.firebaseio.com/posts");
  var sync = $firebase(ref);
  // create a synchronized array for use in our HTML code
  $scope.posts = sync.$asArray();
};



function PostDetailCtrl($scope, $routeParams, $firebase) {
  var ref = new Firebase("https://k-base-2.firebaseio.com/posts/" + $routeParams.postId + "");
  var sync = $firebase(ref);
  var syncObject = sync.$asObject();
  syncObject.$bindTo($scope, "post");
}

function PostEditCtrl($scope, $firebase) {
  var ref = new Firebase("https://k-base-2.firebaseio.com/messages");
  var sync = $firebase(ref);
  // create a synchronized array for use in our HTML code
  $scope.messages = sync.$asArray();
  $scope.addMessage = function(text) {
    $scope.messages.$add({text: text});
  }
}
//see directive above too
function CarouselDemoCtrl($scope){
  $scope.myInterval = 6000;
  $scope.slides = [
    {
      image: 'images/rain.gif'
    },
    {
      image: 'images/mrdivrules-5.gif'
    },
    {
      image: 'images/mrdivrules-7.gif'
    }
  ];
}

var ModalDemoCtrl = function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'partials/kth-modal.html',
      controller: ModalInstanceCtrl,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

app.directive('backImg', function(){
  return function(scope, element, attrs){
    var url = attrs.backImg;
    element.css({
        'background-image': 'url(' + url +')',
        'background-size' : 'cover'
    });
  };
});

app.directive('typewrite', ['$timeout', function ($timeout) {
  function linkFunction (scope, iElement, iAttrs) {
    var timer = null,
      initialDelay = iAttrs.initialDelay ? getTypeDelay(iAttrs.initialDelay) : 200,
      typeDelay = iAttrs.typeDelay ? getTypeDelay(iAttrs.typeDelay) : 200,
      blinkDelay = iAttrs.blinkDelay ? getAnimationDelay(iAttrs.blinkDelay) : false,
      cursor = iAttrs.cursor ? iAttrs.cursor : '|',
      blinkCursor = iAttrs.blinkCursor ? iAttrs.blinkCursor === "true" : true,
      auxStyle;
    if (iAttrs.text) {
      timer = $timeout(function() {
        updateIt(iElement, 0, iAttrs.text);
      }, initialDelay);
    }

    function updateIt(element, i, text){
      if (i <= text.length) {
        element.html(text.substring(0, i) + cursor);
        i++;
        timer = $timeout(function() {
          updateIt(iElement, i, text);
        }, typeDelay);
        return;
      } else {
        if (blinkCursor) {
          if (blinkDelay) {
            auxStyle = '-webkit-animation:blink-it steps(1) ' + blinkDelay + ' infinite;-moz-animation:blink-it steps(1) ' + blinkDelay + ' infinite ' +
                  '-ms-animation:blink-it steps(1) ' + blinkDelay + ' infinite;-o-animation:blink-it steps(1) ' + blinkDelay + ' infinite; ' +
                  'animation:blink-it steps(1) ' + blinkDelay + ' infinite;';
            element.html(text.substring(0, i) + '<span class="blink" style="' + auxStyle + '">' + cursor + '</span>');
          } else {
            element.html(text.substring(0, i) + '<span class="blink">' + cursor + '</span>');
          }
        } else {
          element.html(text.substring(0, i));
        }
      }
    }

    function getTypeDelay(delay) {
      if (typeof delay === 'string') {
        return delay.charAt(delay.length - 1) === 's' ? parseInt(delay.substring(0, delay.length - 1), 10) * 1000 : +delay;
      }
    }

    function getAnimationDelay(delay) {
      if (typeof delay === 'string') {
        return delay.charAt(delay.length - 1) === 's' ? delay : parseInt(delay.substring(0, delay.length - 1), 10) / 1000;
      }
    }

    scope.$on('$destroy', function() {
      if(timer) {
        $timeout.cancel(timer);
      }
    });
  }

  return {
    restrict: 'A',
    link: linkFunction,
    scope: false
  };

}]);
