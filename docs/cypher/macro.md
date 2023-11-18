---
title: Macro
sidebar_position: 16
---
# Create Macro
Kùzu allows user to create a macro in catalog using the `create macro` statement. The process of creating macros involves using the `CREATE MACRO` keyword followed by the macro's name. Users can optionally include parameters with optional default value within parentheses after the name. The "AS" keyword comes next, followed by the actual cypher expression of the macro. It's important to note that a scalar macro is limited to returning only a single value.

## Default parameters
Users can assign default value to parameters. If a query does not specify a value for a parameter, the predefined default value(if exists) will be applied instead. Note: parameters with default value must be defined after parameters without default value in the signature of the macro.
```
// Create a macro which adds two parameters. If the second parameter(b) is not provided, the default value (3) will be used instead.
create macro addWithDefault(a,b:=3) as a + b;
// Executes the macro without providing the default value.
return addWithDefault(2);  // returns 5 (2 + 3)
// Executes the macro by providing the default value (actual parameter value will be used).
return addWithDefault(4, 7);  // returns 11 (4 + 7)
```

## Supported macro expression types

### Case Expression Macro
```
// Creates a case macro which executes sub-expressions based on input value.
CREATE MACRO case_macro(x) AS CASE x WHEN 35 THEN x + 1 ELSE x - 5 END
// Executes queries using the case macro.
match (a:person) return case_macro(a.age) as age
```

### Function Expression Macro
```
// Creates a function macro which executes an arithmetic expression.
CREATE MACRO func_macro(x) AS x + 3 + 2.5 + to_float(2.1)
// Executes queries using the function macro.
match (a:person) return func_macro(a.age) as age
```

### Literal Expression Macro
```
// Creates a literal macro which simply returns a literal value.
CREATE MACRO str_literal() AS 'result'
// Executes queries using the literal macro.
return str_literal()
```

### Property Expression Macro
```
// Creates a property macro which simply returns a property of the parameter.
CREATE MACRO prop_macro(x) AS x.ID
// Executes queries using the property macro.
match (a:person) return prop_macro(a) as age
```

### Variable Expression Macro
```
// Creates a variable macro which simply returns the parameter.
CREATE MACRO var_macro(x) AS x
// Executes queries using the variable macro.
match (a:person) return var_macro(a.ID)
```
