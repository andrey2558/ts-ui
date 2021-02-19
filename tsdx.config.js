const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        extract: true,
        modules: false,
        use: ['sass'],
        inject: false,
        plugins: [
          autoprefixer(),
          cssnano({
            preset: 'default',
          }),
        ],
        // only write out CSS for the first bundle (avoids pointless extra files):
      }));
    return config;
  },
};

/*
scss({
    // Choose *one* of these possible "output:..." options
    // Default behaviour is to write all styles to the bundle destination where .js is replaced by .css
    // Filename to write all styles to
    output: 'bundle.css',
    // Prefix global scss. Useful for variables and mixins.
    prefix: `@import "./fonts.scss";`,

    // Use a node-sass compatible compiler (default: node-sass)
    sass: require('sass'),

    // Run postcss processor before output
    processor: css => postcss([autoprefixer({ overrideBrowserslist: "Edge 18" })]),
})*/
