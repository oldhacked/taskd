/*Í
ç chart.js ang stand just self module çç
*/ 

angular.module('dchart', ['chart.js', 'ui.bootstrap'])
.config(function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
    	colors: ['#97BBCD', '#DCDCDC', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
    });
    // Configure all doughnut charts
    ChartJsProvider.setOptions('doughnut', {
    	cutoutPercentage: 90
    });
    ChartJsProvider.setOptions('bubble', {
    	tooltips: { enabled: true }
    });
})
.controller('DoughnutCtrl', ['$scope', '$timeout', function ($timeout) {
	var dchart = this.
	dchart.labels = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
	dchart.data = [0, 0, 0];

	$timeout(function () {
		dchart.data = [350, 450, 100];
	}, 500);
}]);
//ÍÍÍÍ