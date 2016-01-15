module.exports = function(grunt){
  grunt.initConfig({
    nwjs: {
      options: {
        platforms: ['osx64', 'linux64'],
        buildDir: 'build',
        version: '0.12.3',
        macIcns: 'icons/bellcom.icns',
      },
      src: ['**/*']
    },
    compress: {
      mac: {
        options: { archive: 'build/trckr-osx-x64.zip' },
        files: [{
          expand: true,
          cwd: 'build/trckr/osx64/',
          src: ['**/*'],
        }]
      },
      linux: {
        options: { archive: 'build/trckr-linux-x64.zip' },
        files: [{
          expand: true,
          cwd: 'build/trckr/linux64/',
          src: ['**/*'],
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

  grunt.registerTask('default', [ 'jshint', 'nwjs', 'compress' ]);
};
