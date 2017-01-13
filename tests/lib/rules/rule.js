/**
 * @fileoverview This rule prevents to name React component props with the same name as shadow functions or variables
 * @author tknysh
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/rule"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
    parser: "babel-eslint",
    parserOptions: {
        ecmaVersion: 2016
    }
});

ruleTester.run("works with ObjectExpression", rule, {

    valid: [
        "const foo = true; const mapStateToProps = () => ({ bar: true });"
    ],

    invalid: [
        {
            code: "const foo = true; const mapStateToProps = () => ({ foo: true });",
            errors: [{
                message: `"foo" prop has shadow declaration`
            }]
        }
    ]
});

ruleTester.run("works with ArrowFunctionExpression", rule, {

    valid: [
        "const foo = true; const mapStateToProps = () => { return { bar: true } };"
    ],

    invalid: [
        {
            code: "const foo = true; const mapStateToProps = () => { return { foo: true } };",
            errors: [{
                message: `"foo" prop has shadow declaration`
            }]
        }
    ]
});

ruleTester.run("works with BlockStatement", rule, {

    valid: [
        "const foo = true; const mapStateToProps = (state) => { return { bar: state.bar } };"
    ],

    invalid: [
        {
            code: "const foo = true; const mapStateToProps = (state) => { return { foo: state.foo } };",
            errors: [{
                message: `"foo" prop has shadow declaration`
            }]
        }
    ]
});

ruleTester.run("works for props in component class", rule, {

    valid: [
        `
        const foo = true;
        class CommunicationHistory extends React.Component {
            static propTypes = {
                bar: PropTypes.bool,    
            }
        }
        `
    ],

    invalid: [
        {
            code: `
                const foo = true;
                class CommunicationHistory extends React.Component {
                    static propTypes = {
                        foo: PropTypes.bool,    
                    }
                }
            `,
            errors: [{
                message: `"foo" prop has shadow declaration`
            }]
        }
    ]
});

ruleTester.run("down't warn props from mapDispatchToProps", rule, {

    valid: [
        `
        const foo = true;
        const mapDispatchToProps = {
            foo
        }
        class CommunicationHistory extends React.Component {
            static propTypes = {
                foo: PropTypes.bool,    
            }
        }
        `
    ],

    invalid: []

});
