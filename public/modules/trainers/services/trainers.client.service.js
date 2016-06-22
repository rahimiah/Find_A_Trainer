'use strict';

//Trainers service used for communicating with the trainers REST endpoints
angular.module('trainers').factory('Trainers', ['$resource',
	function($resource) {
		return $resource('trainers/:trainerId', {
			trainerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
