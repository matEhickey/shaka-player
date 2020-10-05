/* eslint-disable max-len */

module.exports = (grunt) => {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    profile: {
      default: '3.0.4',
      profiles: ['2.4.7', '2.5.9', '3.0.1', '3.0.2', '3.0.4', 'local'],
    },
    copy: {
      tmp: {
        files: [
          {
            expand: true,
            cwd: '.',
            src: ['dist/shaka-player.compiled.debug.js'],
            dest: './tmp',
            rename: (dest, src) => dest + '/dist/shaka-player.js',
          },
          {
            expand: true,
            cwd: '.',
            src: ['index.html', 'index.css', 'sources.js', 'myapp.js'],
            dest: './tmp',
          },
        ],
      },
      refapp: {
        files: [
          {
            expand: true,
            cwd: 'tmp',
            src: ['index.html', 'index.css', 'index.js'],
            dest: './refapp',
          },
        ],
      },
      workspace: {
        files: [
          {
            expand: true,
            cwd: 'refapp',
            src: ['*'],
            dest: '~/workspace/BasicProject/',
          },
        ],
      },
    },
    shell: {
      get_shaka: {
        'command': () => `python3 get_shaka_version.py ${grunt.config.data.profile.current}`,
      },
      transpile: {
        command: (fileIn, fileOut) => `./node_modules/babel-cli/bin/babel.js ${fileIn} -o ${fileOut}`,
      },
      bundle: {
        command: (fileIn, fileOut) => `./node_modules/bundle-js/bin/bundle-js.js ${fileIn} -o ${fileOut} --disable-beautify`,
      },
      deployTV: {
        command: 'utizen install standalone',
      },
      shaka_build: {
        command: 'python3 build/build.py --force',
      },
      rm: {
        command: (path) => `rm -rf ${path}`,
      },
    },
    browserSync: {
      default_options: {
        bsFiles: {
          src: [
            'refapp/*',
          ],
        },
        options: {
          watchTask: true,
          server: {
            baseDir: './refapp',
          },
        },
      },
    },
    watch: {
      scripts: {
        files: ['*', '!refapp', '!.git', '!tmp'],
        tasks: ['package'],
        options: {
          livereload: true,
        },
      },
    },
  });

  grunt.registerTask('transpile', '', () => {
    grunt.task.run('shell:transpile:tmp/myapp.js:tmp/myapp.js');
    grunt.task.run('shell:transpile:tmp/sources.js:tmp/sources.js');
  });

  grunt.registerTask('bundle', 'bunudle all the needed js file into one', () => {
    grunt.task.run('shell:bundle:tmp/myapp.js:tmp/index.js');
  });

  grunt.registerTask('package', '', () => {
    grunt.task.run('copy:tmp');
    grunt.task.run('shell:get_shaka');
    grunt.task.run('transpile');
    grunt.task.run('bundle');
    grunt.task.run('copy:refapp');
    grunt.task.run('shell:rm:tmp');
  });

  grunt.registerTask('serve', 'build and deploy', () => {
    grunt.task.run('package');
    grunt.task.run('browserSync');
    grunt.task.run('watch');
  });

  grunt.registerTask('tizen-studio', '', () => {
    grunt.task.run('copy:workspace');
  });

  grunt.registerTask('deploy', '', () => {
    grunt.task.run('shell:deployTV');
  });

  // Default task(s).
  grunt.registerTask('default', ['serve']);

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-profile');
};
