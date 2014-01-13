module.exports = function(grunt){
  grunt.initConfig({
    nodewebkit: {
      options: {
          version: '0.8.4',
          build_dir: './build',
          mac: true,
          win: false,
          linux32: false,
          linux64: true,
          keep_nw: true
      },
      src: ['./src/**/*'] // Your node-wekit app
    },
    compress: {
      mac: {
        options: {
          archive: 'build/trckr-osx-ia32.zip'
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

  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // By default build and create archives
  grunt.registerTask('default', [
    'jshint',
    'nodewebkit',
    'compress'
  ]);
};
