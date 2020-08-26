module.exports = function(grunt) {
    grunt.initConfig({
      copy: {
        dist: {
          cwd: 'src/', expand: true, src: '**', dest: 'www/'
        }
      },
      // Remove unused CSS across multiple files, compressing the final output
      uncss: {
      dist: {
        files: [
          { src: 'src/*.html', dest: 'www/css/compiled.min.css'}
        ]
        },
        options: {
          compress:true
        }
      },
      processhtml: {
        dist: {
          files: {
          'dist/index.html': ['src/index.html']
          }
        }
      },
      uglify: {
        dist: {
          files: {
            'dist/js/compiled.min.js': ['src/js/jquery.js','src/js/*.js'] // make sure we load jQuery first
          }
        }
      }
    });
    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Default tasks.
    grunt.registerTask('default', ['copy', 'uglify', 'uncss','processhtml']);
  };