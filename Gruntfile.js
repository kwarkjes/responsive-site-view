module.exports = function (grunt) {
    grunt.initConfig({
        karma: {
            options: {
                configFile: 'tests/config/karma.conf.js'
            },
            watch: {
                autoWatch: true
            },
            singleRun: {
                singleRun: true
            },
            travis: {
                singleRun: true,
                browsers: ['PhantomJS']
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('testRun', ['karma:singleRun']);
    grunt.registerTask('testWatch', ['karma:watch']);
    grunt.registerTask('test', ['karma:travis']);
};