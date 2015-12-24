'use strict';

describe('poeditor-client', function () {
	it('can be required', function () {
		expect(function () {
			require('poeditor-client');
		}).not.toThrowError();
	});

	it('returns promises', function () {
		var Client = require('poeditor-client');
		expect(new Client('my token').projects.list().then).toEqual(jasmine.any(Function));
	});
});
