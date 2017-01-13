# eslint-plugin-prop-has-no-shadow-declaration

This plugin prevents to name React component props with the same name as shadow functions or variables

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-prop-has-no-shadow-declaration`:

```
$ npm install eslint-plugin-prop-has-no-shadow-declaration --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-prop-has-no-shadow-declaration` globally.

## Usage

Add `prop-has-no-shadow-declaration` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "prop-has-no-shadow-declaration"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "prop-has-no-shadow-declaration/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





