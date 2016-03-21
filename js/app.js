/**
 * Created by Tarena on 2016/2/5.
 */
angular.module('kaifanla', [
  'ng',
  'ngRoute',
  'ngAnimate'
])
  .controller('parentCtrl', function ($scope, $location,$rootScope) {
    $rootScope.phone = "13312345678";
    //父控制器,作用范围包含所有的ngView所对应的控制器--此控制器一般声明在body元素上
    $scope.jump = function (url) {
      $location.path('/' + url);
    }
  })
  .controller('startCtrl', function ($scope) {
  })
  .controller('mainCtrl', function ($scope, $http) {
    //从服务器端获取最开始的5条菜品数据,声明为Model,绑定到View中
    $scope.hasMoreData = true;
    $scope.dishList = [];
    $http.get('data/dish_getbypage.php?start=0')
      .success(function (data) {
        $scope.dishList = data;  //服务器返回的数据生成model数据
      });
    //加载更多按钮的监听函数
    $scope.loadMore = function () {
      $http.get('data/dish_getbypage.php?start=' + $scope.dishList.length)
        .success(function (data) {
          if (data.length < 5) {
            $scope.hasMoreData = false;
          }
          //把新获取的数据追加到之前已经获取数据的尾部
          $scope.dishList = $scope.dishList.concat(data);
        });
    }

    //监视Model数据kw的改变,只要一改变就要发起服务器请求
    $scope.$watch('kw', function () {
      if (!$scope.kw) {
        return;
      }
      $http.get('data/dish_getbykw.php?kw=' + $scope.kw)
        .success(function (data) {
          $scope.dishList = data;
        })
    })
  })
  .controller('detailCtrl', function ($scope, $http, $routeParams) {
    //  console.log('detail模板页面获取到的路由参数:');
    //  console.log($routeParams);
    $http.get('data/dish_getbyid.php?did=' + $routeParams.did)
      .success(function (data) {
        $scope.dish = data[0];
      })
  })
  .controller('orderCtrl', function ($scope, $http, $routeParams,$rootScope) {
    $scope.ordered = false;

    $scope.order = {did: $routeParams.did};
    $scope.order.user_name = "小红";
    $scope.order.sex = "1";
    $scope.order.phone = "13312345678";
    $scope.order.addr = "徐家汇";

    $scope.orderDish = function () {
      console.log($scope.order);
      //必须把js中对象转化为k=v&k=v形式 才能使用HTTP协议提交
      var orderData = $.param($scope.order);
      console.log(orderData);
      //GET请求提交数据
      /*  $http.get('data/order_add.php?'+orderData)
       .success(function(data){
       console.log(data);
       });*/
      $http.post('data/order_add.php', orderData)
        .success(function (data) {
          if (data.result == "ok") {
            $scope.ordered = true;
            $scope.oid = data.oid;
            $rootScope.phone=$scope.order.phone;
            console.log($scope.ordered);
            console.log($scope.oid);
          }
        });
    }
  })
  .controller('myorderCtrl', function ($scope,$http,$rootScope) {
    $scope.dishOrdered=[];
    $http.get('data/order_getbyphone.php?phone='+$rootScope.phone)
      .success(function(data){
        $scope.dishOrdered=data;
        console.log($scope.dishOrdered);
      });
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/start', {
        templateUrl: '../tpl/start.html',
        controller: 'startCtrl'
      })
      .when('/main', {
        templateUrl: 'tpl/main.html',
        controller: 'mainCtrl'
      })
      .when('/detail/:did', {   //路由url中的参数必须以:开头
        templateUrl: 'tpl/detail.html',
        controller: 'detailCtrl'
      })
      .when('/order/:did', {
        templateUrl: 'tpl/order.html',
        controller: 'orderCtrl'
      })
      .when('/myorder', {
        templateUrl: 'tpl/myorder.html',
        controller: 'myorderCtrl'
      })
    /*.otherwise({
     redirectTo: 'tpl/start.html';
     })*/
  })
  .run(function ($http) {//修改post请求的默认头部
    $http.defaults.headers.post =
    {'Content-Type': 'application/x-www-form-urlencoded'};
  })