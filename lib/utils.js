'use strict';

var helpers = require('./helpers');

exports.getProject = function (apiToken, projectName) {
	return helpers.getProject(apiToken, projectName);
};

exports.pullTranslations = function (apiToken, projectName, destination, options) {
	return helpers.getProject(apiToken, projectName)
	.then(function (project) {
		return helpers.getTranslations(project);
	})
	.then(function (translations) {
		return helpers.writeTranslations(translations, destination, options);
	});
};
