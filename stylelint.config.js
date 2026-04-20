export default {
    extends: ['stylelint-config-standard-scss'],
    plugins: ['stylelint-scss'],
    rules: {
        'selector-class-pattern': null,
        'scss/dollar-variable-empty-line-before': null,
        'declaration-empty-line-before': null,
        'scss/at-rule-no-unknown': true,
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['global'],
            },
        ],
    },
};
