/*Í
ç angular charts.js injecting into module and controller çç
*/ 
angular.module('about', [
    'base.models.scotch',
    'base.models.dogs',
    'chart.js', 
    'ngAnimate'


    ])
.config(function ($stateProvider, ChartJsProvider) {
    $stateProvider
    .state('base.about', {
        url: '/about',
        views: {

            '@': {
                templateUrl: 'app/about/partial-about.html'
            },

            'columnOne@base.about': {
                templateUrl: 'app/common/sharts/dchart-tmpl.html',
                controller: 'ScotchController as scotchCtrl'
            },

            'columnTwo@base.about': {
                templateUrl: 'app/about/table-data.html',
                controller: 'ScotchController as scotchCtrl'
            },
             'columnThree@base.about': {
                templateUrl: 'app/about/project.temp.html',
                controller: 'ProjectController as projectCtrl'
            },
             'columnFour@base.about': {
                templateUrl: 'app/about/tasks.temp.html',
                controller: 'ListController as listCtrl'
            }
        }

    });
    ChartJsProvider.setOptions({
        chartColors: ['#48C1CD','#C1C9CD','#BC79CD']
    });
    // Configure all doughnut charts
    ChartJsProvider.setOptions('doughnut', {
        cutoutPercentage: 95
    });
    ChartJsProvider.setOptions('bubble', {
        tooltips: { enabled: true }
    });


})
.controller('ProjectController', function ProjectController($timeout,ScotchModel,DogsModel) {
    var projectCtrl = this;
    projectCtrl.projectInfo = {title: "derp derpy", client: "mr.bigglesworth", rate: 500, duedate: 666};


})

.controller('ListController', function ListController($timeout,ScotchModel,DogsModel) {
    var listCtrl = this;


    listCtrl.title = 'Tasks';

    listCtrl.tasks = [
            {"id": 0, "task": "go fuck yourself"},
            {"id": 1, "task": "then you can really go fuck yourself"},
            {"id": 2, "task": "finally, you know what to do"},
            {"id": 3, "task": "oh wait.. you can also"}
        ];
       var count = 3;
    listCtrl.addTask = function(){
     
        count++;
        listCtrl.tasks.push({"id": count , "task": count + " go fuck yourself again"});

    };
     listCtrl.removeTask = function (task) {
            _.remove(listCtrl.tasks, function (t) {
                return t.id == task.id;
            });
        }

})
// .animation('.fade', function() {
//   return {
//     enter: function(element, done) {
//       element.css('display', 'none');
//       $(element).fadeIn(1000, function() {
//         done();
//       });
//     },
//     leave: function(element, done) {
//       $(element).fadeOut(1000, function() {
//         done();
//       });
//     },
//     move: function(element, done) {
//       element.css('display', 'none');
//       $(element).slideDown(500, function() {
//         done();
//       });
//     }
//   }
// })


.controller('ScotchController', function ScotchController($timeout,ScotchModel,DogsModel) {
    var scotchCtrl = this;
    scotchCtrl.message = 'test';

    // DogsModel.getDogs()
    //     .then(function(result){
    //     scotchCtrl.dogs = result;
    // });
var prices = [];

ScotchModel.getScotch()
.then(function (result){
    scotchCtrl.scotches = result;
    for (var i = 0; i < scotchCtrl.scotches.length; i++) {
        prices.push(scotchCtrl.scotches[i].price);
    };
});

console.log(prices);

scotchCtrl.labels = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
scotchCtrl.data = [0, 0, 0];

scotchCtrl.test = [300, 500, 100];



$timeout(function () {
    scotchCtrl.data = prices;
    var derp = _.mean(prices);

    // console.log(Math.floor(scotchCtrl.average));

    truncateDecimals = function (number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
};

    
    scotchCtrl.average = truncateDecimals(derp , 2);


}, 500);



})


;

//ÍÍÍÍ


// .controller('DoughnutCtrl', ['$timeout', function ($timeout) {
//     var dchartCtrl = this;
//     dchartCtrl.labels = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
//     dchartCtrl.data = [0, 0, 0];

//     $timeout(function () {
//         dchartCtrl.data = [350, 100];
//     }, 500);
// }]);











// angular.module('about', [
//     'base.models.scotch',
//     'base.models.dogs'

// ])
//     .config(function ($stateProvider) {
//         $stateProvider
//             .state('base.about', {
//                 url: '/about',
//                 views: {

//                     '@': {
//                         templateUrl: 'app/about/partial-about.html'
//                     },

//                     'columnOne@base.about': {
//                         template: 'Look I am a column!'
//                     },

//                     'columnTwo@base.about': {
//                         templateUrl: 'app/about/table-data.html',
//                         controller: 'ScotchController as scotchCtrl'
//                     }
//                 }

//             });

//     })


// .controller('ScotchController', function ScotchController(ScotchModel,DogsModel) {
//     var scotchCtrl = this;
//     scotchCtrl.message = 'test';

//     // DogsModel.getDogs()
//     //     .then(function(result){
//     //     scotchCtrl.dogs = result;
//     // });
//     ScotchModel.getScotch()
//         .then(function (result){
//         scotchCtrl.scotches = result;
//     });



// });

