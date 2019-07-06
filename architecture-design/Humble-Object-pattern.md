# Humble Object pattern

See:

- Clean Architecture (book by Robert C. Martin)
- [TDD Patterns: Humble Object](https://ieftimov.com/post/tdd-humble-object/)

## Basic idea

- Problem: some behavior (like how data is represented on a screen) is hard to test
- Solution: split the behavior into two parts
  - Humble Object containing the hard-to-test stuff, stripped down to the bare essence
  - Other part which contains everything stripped from the Humble Object

Example: showing data in a UI

- Create a view model that describes as much as possible about how the data will be shown
  - Dates already converted to correct format
  - Flags describing if elements should be disabled, hidden, ...
- Humble Object is a view which does nothing more than showing contents of view model on the screen