module.exports = function(grunt) {
    grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	// ---------------------------------------------------------------------- //
    jscs: {
		src: [ 'app/controllers/**/*.js' , 'app/alloy.js' ],
		options: {
			reporter: 'node_modules/jscs-html-reporter/jscs-html-reporter.js',
			reporterOutput: 'jscs-report.html'
		}
    },
	// ---------------------------------------------------------------------- //
	jshint: {
		options: {
				node: true,
				reporter: require('jshint-html-reporter'),
				reporterOutput: 'jshint-report.html'

		},
		files: {
			src: [ "app/**/*.js" ]
		}
	}
    });
  
//  require('logfile-grunt')(grunt, { keepColors: true });

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jscs');

	// Default task(s)
	grunt.task.registerTask('jscsLog', function() {
		require('logfile-grunt')(grunt, { filePath: './logs/jscsTest.txt', clearLogFile: true});
	});
	grunt.task.registerTask('jshintLog', function() {
		require('logfile-grunt')(grunt, { filePath: './logs/jshintTest.txt', clearLogFile: true});
	});
  	
  	grunt.registerTask('default', ['jscs', 'jshint']);
    grunt.registerTask('jscsTask', ['jscsLog', 'jscs']);
    grunt.registerTask('jshintTask', ['jshintLog', 'jshint'])
};

