module.exports = function (grunt) {
    grunt.initConfig({
        nwjs: {
            options: {
                appName: 'trckr',
                platforms: ['linux64', 'osx64'],
                macIcns: 'icons/bellcom.icns',
                version: '0.18.0',
                buildDir: './build'
            },
            src: ['./**/*']
        },
        compress: {
            mac: {
                options: {archive: 'build/trckr-osx-x64.zip'},
                files: [{
                    expand: true,
                    cwd: 'build/trckr/osx64/',
                    src: ['./**/*']
                }]
            },
            linux: {
                options: {archive: 'build/trckr-linux-x64.zip'},
                files: [{
                    expand: true,
                    cwd: 'build/trckr/linux64/',
                    src: ['./**/*']
                }]
            }
        },
        jshint: {
            all: [
                'app.js',
                'js/**/*.js'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-nw-builder');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // By default build and create archives
    grunt.registerTask('default', ['nwjs']);
    grunt.registerTask('build-test', ['nwjs']);
    grunt.registerTask('build-prod', ['jshint', 'nwjs', 'compress']);
};
