angular.module("barisan_pencinta_pancasila", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","ionicLazyLoad","barisan_pencinta_pancasila.controllers", "barisan_pencinta_pancasila.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "Barisan Pencinta Pancasila" ;
		$rootScope.appLogo = "data/images/icon/156335918216545943 (1).png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = false ;

		$rootScope.liveStatus = "pause" ;
		$ionicPlatform.ready(function(){
			$rootScope.liveStatus = "run" ;
		});
		$ionicPlatform.on("pause",function(){
			$rootScope.liveStatus = "pause" ;
		});
		$ionicPlatform.on("resume",function(){
			$rootScope.liveStatus = "run" ;
		});


		$rootScope.hide_menu_dashboard = false ;
		$rootScope.hide_menu_home = false ;
		$rootScope.hide_menu_visi_misi = false ;
		$rootScope.hide_menu_categories = false ;
		$rootScope.hide_menu_posts = false ;
		$rootScope.hide_menu_post_bookmark = false ;
		$rootScope.hide_menu_help = false ;
		$rootScope.hide_menu_rate_this_app = false ;


		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "barisan_pencinta_pancasila",
				storeName : "barisan_pencinta_pancasila",
				description : "The offline datastore for Barisan Pencinta Pancasila app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}

			//required: cordova plugin add cordova-plugin-network-information --save
			$interval(function(){
				if ( typeof navigator == "object" && typeof navigator.connection != "undefined"){
					var networkState = navigator.connection.type;
					$rootScope.is_online = true ;
					if (networkState == "none") {
						$rootScope.is_online = false ;
						$window.location = "retry.html";
					}
				}
			}, 5000);

			//required: cordova plugin add onesignal-cordova-plugin --save
			if(window.plugins && window.plugins.OneSignal){
				window.plugins.OneSignal.enableNotificationsWhenActive(true);
				var notificationOpenedCallback = function(jsonData){
					try {
						$timeout(function(){
							$window.location = "#/barisan_pencinta_pancasila/" + jsonData.notification.payload.additionalData.page ;
						},200);
					} catch(e){
						console.log("onesignal:" + e);
					}
				}
				window.plugins.OneSignal.startInit("baa347da-d59c-4512-9db9-65efcf1d8a73").handleNotificationOpened(notificationOpenedCallback).endInit();
			}


		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				var confirmPopup = $ionicPopup.confirm({
					title: "Confirm Exit",
					template: "Are you sure you want to exit?"
				});
				confirmPopup.then(function (close){
					if(close){
						ionic.Platform.exitApp();
					}
				});
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("id");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("id");
})


.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider,$ionicConfigProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("barisan_pencinta_pancasila",{
		url: "/barisan_pencinta_pancasila",
			abstract: true,
			templateUrl: "templates/barisan_pencinta_pancasila-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("barisan_pencinta_pancasila.about_us", {
		url: "/about_us",
		cache:false,
		views: {
			"barisan_pencinta_pancasila-side_menus" : {
						templateUrl:"templates/barisan_pencinta_pancasila-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("barisan_pencinta_pancasila.bookmarks", {
		url: "/bookmarks",
		views: {
			"barisan_pencinta_pancasila-side_menus" : {
						templateUrl:"templates/barisan_pencinta_pancasila-bookmarks.html",
						controller: "bookmarksCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("barisan_pencinta_pancasila.categories", {
		url: "/categories",
		cache:true,
		views: {
			"barisan_pencinta_pancasila-side_menus" : {
						templateUrl:"templates/barisan_pencinta_pancasila-categories.html",
						controller: "categoriesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("barisan_pencinta_pancasila.dashboard", {
		url: "/dashboard",
		views: {
			"barisan_pencinta_pancasila-side_menus" : {
						templateUrl:"templates/barisan_pencinta_pancasila-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("barisan_pencinta_pancasila.faqs", {
		url: "/faqs",
		views: {
			"barisan_pencinta_pancasila-side_menus" : {
						templateUrl:"templates/barisan_pencinta_pancasila-faqs.html",
						controller: "faqsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("barisan_pencinta_pancasila.post_bookmark", {
		url: "/post_bookmark",
		cache:false,
		views: {
			"barisan_pencinta_pancasila-side_menus" : {
						templateUrl:"templates/barisan_pencinta_pancasila-post_bookmark.html",
						controller: "post_bookmarkCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("barisan_pencinta_pancasila.post_singles", {
		url: "/post_singles/:id",
		cache:true,
		views: {
			"barisan_pencinta_pancasila-side_menus" : {
						templateUrl:"templates/barisan_pencinta_pancasila-post_singles.html",
						controller: "post_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("barisan_pencinta_pancasila.posts", {
		url: "/posts/:categories",
		cache:true,
		views: {
			"barisan_pencinta_pancasila-side_menus" : {
						templateUrl:"templates/barisan_pencinta_pancasila-posts.html",
						controller: "postsCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("barisan_pencinta_pancasila.slide_tab_menu", {
		url: "/slide_tab_menu",
		views: {
			"barisan_pencinta_pancasila-side_menus" : {
						templateUrl:"templates/barisan_pencinta_pancasila-slide_tab_menu.html",
						controller: "slide_tab_menuCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("barisan_pencinta_pancasila.user_login", {
		url: "/user_login",
		cache:true,
		views: {
			"barisan_pencinta_pancasila-side_menus" : {
						templateUrl:"templates/barisan_pencinta_pancasila-user_login.html",
						controller: "user_loginCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("barisan_pencinta_pancasila.user_profile", {
		url: "/user_profile",
		views: {
			"barisan_pencinta_pancasila-side_menus" : {
						templateUrl:"templates/barisan_pencinta_pancasila-user_profile.html",
						controller: "user_profileCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("barisan_pencinta_pancasila.user_register", {
		url: "/user_register",
		views: {
			"barisan_pencinta_pancasila-side_menus" : {
						templateUrl:"templates/barisan_pencinta_pancasila-user_register.html",
						controller: "user_registerCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("barisan_pencinta_pancasila.users", {
		url: "/users",
		cache:false,
		views: {
			"barisan_pencinta_pancasila-side_menus" : {
						templateUrl:"templates/barisan_pencinta_pancasila-users.html",
						controller: "usersCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("barisan_pencinta_pancasila.visi_misi", {
		url: "/visi_misi",
		cache:false,
		views: {
			"barisan_pencinta_pancasila-side_menus" : {
						templateUrl:"templates/barisan_pencinta_pancasila-visi_misi.html",
						controller: "visi_misiCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/barisan_pencinta_pancasila/dashboard");
});
