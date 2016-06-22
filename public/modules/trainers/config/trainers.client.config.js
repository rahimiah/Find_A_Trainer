'use strict';

// Configuring the Trainers module
angular.module('trainers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Trainers', 'trainers', 'dropdown', '/trainers(/create)?');
		Menus.addSubMenuItem('topbar', 'trainers', 'List Trainers', 'trainers');
		Menus.addSubMenuItem('topbar', 'trainers', 'New Trainers', 'trainers/create');
	}
]);
