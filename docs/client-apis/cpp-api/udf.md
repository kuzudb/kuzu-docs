---
title: Query Result
sidebar_position: 8
---

# UDF API
Kùzu provides users with two interfaces that enable them to define their own custom scalar and vectorized functions.

## createScalarFunction
This API allows user to register ordinary scalar functions which are defined in c++ and use them as Kùzu built-in functions in a query. UDF functions are as efficient as the built-in functions.
Since two c++ primitive types may map to the same Cypher(e.g. `int32` can map to both `INT32` or `DATE` in Kùzu), Kùzu provides two overloaded APIs which can eliminate the ambiguity in datatype mapping.

### 1. Create a scalar function by automatically inferring the parameter and result type in Kùzu.
```
template<typename TR, typename... Args>
void createScalarFunction(const std::string& name, TR (*udfFunc)(Args...))
```
#### a. Parameters:
* template parameters:
  * TR: return type of the UDF in c++.
  * ARGS: are the type of the arguments in c++, Kùzu currently support UDF functions with up to 3 parameters.
* parameters:
  * name: the name of the function to be created in Kùzu (note: function name must be unique).
  * udfFunc: the UDF defined in c++.

#### b. Inference rule for c++ type to cypher type is defined as:
| C++ type | Cypher type |
| ---------| ----------- |
| bool | BOOL |
| int16 | INT16 |
| int32 | INT32 |
| int64 | INT64 |
| float | FLOAT |
| double | DOUBLE |
| std::string | STRING |

#### c. Example:
```
// Create a unary scalar function which adds 5 to the input value.
static int32_t add5(int32_t x) {
    return x + 5;
}
// Register the unary scalar function using the createScalarFunction API.
conn->createScalarFunction("add5", &add5);
// Issue a query using the UDF.
conn->query("MATCH (p:person) return add5(to_int32(p.age))");
```

### 2. Create a scalar function with input and return type in cypher.
```
template<typename TR, typename... Args>
void createScalarFunction(const std::string& name, TR (*udfFunc)(Args...))
```
#### a. Parameters:
* template parameters:
  * TR: return type of the UDF in c++.
  * ARGS: are the type of the arguments in c++, Kùzu currently support UDF functions with up to 3 parameters.
* parameters:
  * name: the name of the function to be created in Kùzu (note: function name must be unique).
  * parameterTypes: the types of parameters in cypher.
  * returnType: the type of return value in cypher.
  * udfFunc: the UDF defined in c++.
Note: This function also checks the template types of UDF against the Cypher types passed as arguments(parameterTypes and returnType) and they must follow the rule defined in the data type mapping table.

#### b. Cypher and C++ type mapping:
| Cypher type | C++ type |
| ---------| ----------- |
| BOOL | bool |
| INT16 | int16 |
| INT32, DATE | int32 |
| INT64, TIMESTAMP | int64 |
| FLOAT | float |
| DOUBLE | double |
| STRING | std::string |

#### c. Example:
```
// Create a binary scalar function which adds microseconds to the timestamp value.
static int64_t addMicroSeconds(int64_t timestamp, int32_t microSeconds) {
    return timestamp + microSeconds;
}
// Register the binary scalar function using the createScalarFunction API.
conn->createScalarFunction("addMicro",
        std::vector<common::LogicalTypeID>{
            common::LogicalTypeID::TIMESTAMP, common::LogicalTypeID::INT32},
        common::LogicalTypeID::TIMESTAMP, &addMicroSeconds);
// Issue a query using the UDF.
conn->query("MATCH (p:person) return addMicro(p.registerTime, to_int32(p.ID))")
```

## createVectorizedFunction
Kùzu executes functions on input data in an efficient and vectorized way. In addition to creating scalar user-defined functions(UDFs), Kùzu also provides support for vectorized UDFs. Similar to `createScalarFunction`, the `createVectorizedFunction` also offers two APIs to enhance clarity in datatype mapping.

### Vector types in Kùzu:
#### 1. Flat vector: The vector only holds one value at `selectedPositions[0]` position.
```
Example:
// Get the position, which stores the value, in the flatVector.
auto pos = flatVector->state->selVector->selectedPositions[0];
// Check whether the value is null.
auto isNull = flatVector->isNull(pos)
// Get the value in the vector using the position.
auto value = flatVector->getValue<datatype>(pos)
// Set the value in the vector using the position.
flatVector->setValue(pos, 5 /* valueToSet */)
// Set the value to not-null in the vector using the position.
flatVector->setNull(pos, false /* notNull */)
```
#### 2. Unflat vector: The vector can hold SELECTED_SIZE number of values.
```
Example:
// Traverse the unflat int64 vector, and add 5 to each value if not null.
 for (auto i = 0u; i < vector.state->selVector->selectedSize; i++) {
        // Get the position which stores the ith value in the vector.
        auto pos = vector.state->selVector->selectedPositions[i];
        // Check whether the value is null.
        if (!vector.isNull(pos)) {
            // Retrieve the ith value.
            auto originalVal = vector.getValue<int64_t>(pos);
            // Update the ith value.
            vector.setValue(pos, originalVal + 5);
        }
}
