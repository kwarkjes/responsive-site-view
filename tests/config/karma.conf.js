module.exports = function (config) {
    config.set({
        basePath: '../../',
        frameworks: ['jasmine'],
        files: [
            'src/js/lib/angular.min.js',
            'tests/lib/**.js',
            'src/js/**.js',
            'tests/unit/**.js',
            'tests/mocks/**.js'
        ],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['Chrome'],
        plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine'
        ],
        captureTimeout: 60000,
        singleRun: false
    });
};