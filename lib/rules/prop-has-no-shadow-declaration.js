/**
 * @fileoverview This rule prevents to name React component props with the same name as shadow functions or variables
 * @author tknysh
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require('eslint/lib/ast-utils');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "This rule prevents to name React component props with the same name as shadow functions or variables",
            recommended: false
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function(context) {

        let mapDispatchToProps = [];

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const options = {
            builtinGlobals: Boolean(context.options[0] && context.options[0].builtinGlobals),
            hoist: (context.options[0] && context.options[0].hoist) || "functions",
            allow: (context.options[0] && context.options[0].allow) || []
        };

        /**
         * Check if the parameters are been shadowed
         * @param {object} scope current scope
         * @param {string} name parameter name
         * @returns {boolean} True is its been shadowed
         */
        function paramIsShadowing(scope, name) {
            const shadowed = astUtils.getVariableByName(scope, name);
            return shadowed &&
                (shadowed.identifiers.length > 0 || (options.builtinGlobals && "writeable" in shadowed)) //&&
        }

        /**
         * Check if props have shadow declarations
         * @param props {object} - react component props
         */
        function checkPropsForShadows(node, props = []) {
            props.forEach(prop => {
                if (prop.type === 'Property'
                    && paramIsShadowing(context.getScope(), prop.key.name)
                    // skip prop that already declared in mapDispatchToProps
                    && !mapDispatchToProps.includes(prop.key.name)) {
                    context.report(node, `"${prop.key.name}" prop has shadow declaration`);
                }
            });
        }

        /**
         * Get properties name
         * @param {Object} node - Property.
         * @returns {String} Property name.
         */
        function getPropertyName(node) {
            // Special case for class properties
            // (babel-eslint does not expose property name so we have to rely on tokens)
            if (node.type === 'ClassProperty') {
                const tokens = context.getFirstTokens(node, 2);
                return tokens[1] && tokens[1].type === 'Identifier' ? tokens[1].value : tokens[0].value;
            }

            return node.key.name;
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            VariableDeclarator(node) {
                if (node.id.name === 'mapDispatchToProps') {
                    if (node.init.type === 'ObjectExpression') {
                        // put mapDispatchToProps into cache
                        mapDispatchToProps = node.init.properties.reduce((acc, it) => {
                            return it.type === 'Property'
                                ? [ ...acc, it.key.name]
                                : acc
                        }, []);
                    }
                } else if (node.id.name === 'mapStateToProps') {
                    let properties = [];
                    switch (node.init.body.type) {
                        case 'BlockStatement':
                            node.init.body.body.forEach(block => {
                                if (block.type === 'ReturnStatement'
                                    && block.argument.type === 'ObjectExpression') {
                                    properties = block.argument.properties;
                                }
                            });
                            break;
                        case 'ArrowFunctionExpression':
                        case 'ObjectExpression':
                            properties = node.init.body.properties;
                            break;
                    }
                    checkPropsForShadows(node, properties);
                }
            },
            ClassProperty(node) {
                if (getPropertyName(node) === 'propTypes'
                    && node.value.type === 'ObjectExpression') {
                    checkPropsForShadows(node, node.value.properties);
                }
            }
        };
    }
};
