# Pushkin React

![](http://i.imgur.com/ncRJMJ5.png)



# Overview

Pushkin React is a system that uses [React](https://facebook.github.io/react/) and [Redux](http://redux.js.org/) to simplify the process of creating client side, psychological quizzes.

# Core Features
- `SurveyProvider` a React component that connects to the redux store and internally handles fetching questions and sending responses
- `pushkinReducer` a redux reducer that must be connected to the redux store


# Spec

Pushkin React relies on a set of endpoints that match the `pushkin-api` spec.
Pushkin React requires itself to be integrated into an existing redux store

Check out the demo app in this repo or run `npm start` to get going with `pushkin-react` 

1. `git clone --recursive`
2. `npm start`


## SurveyProvider

Props


| name             | type     | description                                                                            |
| ---------------- | -------- | -------------------------------------------------------------------------------------- |
| progress         | function | An option function that is called whenever a user answers a question                   |
| instructions     | String   | A line of text you want displayed before the user begins the survey                    |
| resultsContainer | function | a function that takes the results returned from the api, and returns a react component |



# Get started

Import `pushkinReducer`  and bring it into your redux store
(make sure you have `redux-thunk` configured)

```JS

    import { combineReducers } from 'redux';
    import pushkinReducer from 'pushkin-react';
    
    export const rootReducer = combineReducers({
      pushkin: pushkinReducer
    });
```

Import `SurveyProvider` and render it on the page

```JS
    render() {
      return (
            <SurveyProvider 
              progress={this.dispatchProgress}
              instructions={Scripts.instruction}
              resultsContainer={(results) => (
                <ResultsContainer results={results} />
              )}
            />
      );
    }
```



# Extension


