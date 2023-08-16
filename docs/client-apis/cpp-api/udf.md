---
title: UDF
sidebar_position: 8
---

# UDF API
Kùzu provides users with two interfaces that enable them to define their own custom scalar and vectorized functions.

## Connection::createScalarFunction
This API allows user to register ordinary scalar functions which are defined in c++ and use them as Kùzu built-in functions in a query. UDF functions are as efficient as the built-in functions.
Since two c++ primitive types may map to the same Cypher data types(e.g. `int32` can map to both `INT32` or `DATE` in Kùzu), Kùzu provides two overloaded APIs which can eliminate the ambiguity in datatype mapping.

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
  * parameterTypes: the type of parameters in cypher.
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

## Connection::createVectorizedFunction
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
```

### 1. Create a vectorized function by automatically inferring the parameter and result type in Kùzu.
```
template<typename TR, typename... Args>
void createVectorizedFunction(const std::string& name, function::scalar_exec_func scalarFunc)
```
#### a. Parameters:
* template parameters:
  * TR: return type of the UDF in c++.
  * ARGS: are the type of the arguments in c++, Kùzu currently support UDF functions with up to 3 parameters.
* parameters:
  * name: the name of the function to be created in Kùzu (note: function name must be unique).
  * scalarFunc: a vectorized udf function. The vectorized udf function takes in a vector of ValueVectors and puts the result in the resultVector.

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
// Create a vectorized function which adds 4 to each value.
static void addFour(
    const std::vector<std::shared_ptr<ValueVector>>& parameters, ValueVector& result) {
    assert(parameters.size() == 1);
    auto parameter = parameters[0];
    result.resetAuxiliaryBuffer();
    result.state = parameter->state;
    if (parameter->state->isFlat()) {
        auto pos = parameter->state->selVector->selectedPositions[0];
        result.setValue(pos, parameter->getValue<int64_t>(pos) + 4);
    } else {
        for (auto i = 0u; i < parameter->state->selVector->selectedSize; i++) {
            auto pos = parameter->state->selVector->selectedPositions[i];
            result.setValue(pos, parameter->getValue<int64_t>(pos) + 4);
        }
    }
}
// Register the vectorized function using the createVectorizedFunction API.
conn->createVectorizedFunction<int64_t, int64_t>("addFour", &addFour);
// Issue a query using the UDF.
conn->query("MATCH (p:person) return addFour(p.age)");
```

### 2. Create a vectorized function with input and return type in cypher.
```
 void createVectorizedFunction(const std::string& name,
        std::vector<common::LogicalTypeID> parameterTypes, common::LogicalTypeID returnType,
        function::scalar_exec_func scalarFunc)
```
#### a. Parameters:
* parameters:
  * name: the name of the function to be created in Kùzu (note: function name must be unique).
  * parameterTypes: the type of parameters in cypher.
  * returnType: the type of return value in cypher.
  * scalarFunc: a vectorized udf function. The vectorized udf function takes in a vector of ValueVectors and puts the result in the resultVector.

#### b. Inference rule for c++ type to cypher type is defined as:
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
// Create a scalar function which adds right(number of days) to the left(date).
struct AddDate {
    static inline void operation(date_t& left, int64_t& right, date_t& result) {
        result.days = (int32_t)(left.days + right);
    }
};
// Utilize the pre-defined `function::BinaryFunctionExecutor::execute` API to execute the AddDate function on parameters.
// Note: Users can utilize Kùzu pre-defined FunctionExecutors(UnaryFunctionExecutor, BinaryFunctionExecutor, TernaryFunctionExecutor) to execute operations on parameters without writing code to retrieve the valueVectors.
static void addDate(
    const std::vector<std::shared_ptr<ValueVector>>& parameters, ValueVector& result) {
    assert(parameters.size() == 2);
    function::BinaryFunctionExecutor::execute<date_t, int64_t, date_t, AddDate>(
        *parameters[0], *parameters[1], result);
}
// Register the vectorized function using the createVectorizedFunction API.
conn->createVectorizedFunction("addDate", std::vector<LogicalTypeID>{LogicalTypeID::DATE, LogicalTypeID::INT64}, LogicalTypeID::DATE, &addDate);
// Issue a query using the UDF.
conn->query("MATCH (p:person) return addDate(p.birthdate, p.age)");
```
