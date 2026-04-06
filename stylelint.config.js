export default {
    extends: ['stylelint-config-standard-scss'],
    plugins: ['stylelint-scss'],
    rules: {
        'scss/at-import-no-partial-leading-underscore': null,
        'scss/at-import-partial-extension': null,
        'selector-class-pattern': null,
        'declaration-empty-line-before': null,
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['global'],
            },
        ],
    },
};
