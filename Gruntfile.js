module.exports = function(grunt){
  grunt.initConfig({
    nwjs: {
      options: {
        platforms: ['win64','osx64', 'linux64'],
        buildDir: './build', // Where the build version of my NW.js app is saved
        version: '0.12.3',
      },
      src: ['./src/**/*'] // Your NW.js app
    },
    compress: {
      mac: {
        options: {
          archive: 'build/trckr-osx-x64.zip'
        },
        files: [{
          expand: true,
          cwd: './build/releases/Trckr/mac/',
          src: ['**/*'],
        }]
      },
      linux: {
        options: {
          archive: 'build/trckr-linux-x64.zip'
        },
        files: [{
          expand: true,
          cwd: './build/releases/Trckr/linux64/',
          src: ['**/*'],
        }]
      }

    },
    jshint: {
      all: [
        'src/app/**/*.js',
        'src/inc/addTagger.js'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-nw-builder');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // By default build and create archives
  grunt.registerTask('default', [
    'nwjs',
    'compress'
  ]);
};
