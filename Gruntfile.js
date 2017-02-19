module.exports = function(grunt) {

    grunt.initConfig({
        sass: {
            options: {
                defaultEncoding: 'utf-8'
            },
            dist: {
                files: {
                    'app.css': 'app.scss'
                }
            }
        },
        watch: {
            sass: {
                files: ['**/*.scss'],
                tasks: ['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');

    grunt.registerTask('default', ['sass']);

};