'use strict';

(function() {
	// Trainers Controller Spec
	describe('Trainers Controller Tests', function() {
		// Initialize global variables
		var TrainersController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Trainers controller.
			TrainersController = $controller('TrainersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one trainer object fetched from XHR', inject(function(Trainers) {
			// Create sample trainer using the Trainers service
			var sampleTrainer = new Trainers({
				title: 'An Trainer about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample trainers array that includes the new trainer
			var sampleTrainers = [sampleTrainer];

			// Set GET response
			$httpBackend.expectGET('trainers').respond(sampleTrainers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.trainers).toEqualData(sampleTrainers);
		}));

		it('$scope.findOne() should create an array with one trainer object fetched from XHR using a trainerId URL parameter', inject(function(Trainers) {
			// Define a sample trainer object
			var sampleTrainer = new Trainers({
				title: 'An Trainer about MEAN',
				content: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.trainerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/trainers\/([0-9a-fA-F]{24})$/).respond(sampleTrainer);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.trainer).toEqualData(sampleTrainer);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Trainers) {
			// Create a sample trainer object
			var sampleTrainerPostData = new Trainers({
				title: 'An Trainer about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample trainer response
			var sampleTrainerResponse = new Trainers({
				_id: '525cf20451979dea2c000001',
				title: 'An Trainer about MEAN',
				content: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.title = 'An Trainer about MEAN';
			scope.content = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('trainers', sampleTrainerPostData).respond(sampleTrainerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');

			// Test URL redirection after the trainer was created
			expect($location.path()).toBe('/trainers/' + sampleTrainerResponse._id);
		}));

		it('$scope.update() should update a valid trainer', inject(function(Trainers) {
			// Define a sample trainer put data
			var sampleTrainerPutData = new Trainers({
				_id: '525cf20451979dea2c000001',
				title: 'An Trainer about MEAN',
				content: 'MEAN Rocks!'
			});

			// Mock trainer in scope
			scope.trainer = sampleTrainerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/trainers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/trainers/' + sampleTrainerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid trainerId and remove the trainer from the scope', inject(function(Trainers) {
			// Create new trainer object
			var sampleTrainer = new Trainers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new trainers array and include the trainer
			scope.trainers = [sampleTrainer];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/trainers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTrainer);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.trainers.length).toBe(0);
		}));
	});
}());
