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
  });

  grunt.loadNpmTasks('grunt-node-webkit-builder');

  grunt.registerTask('default', [
    'nodewebkit'
  ]);
};
