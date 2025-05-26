# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added
- Based on [Add tag test](https://github.com/scripterio-js/scripterio/issues/15):
- New context option `tags` to tag a test or a test group.
- Now its possible to specify single tag:

  ```js
  test('test login page', {
    tags: 'regression',
  }, () => {
    // ...
  });
  ```
  and run the test\s using additional flag:
  ```bash
  --tags=regression
  ```

 -  Now its possible to specify multiple tags:
  ```js
  test('test login page', {
    tags: ['regression', 'smoke']
  }, () => {
    // ...
  });
  ```
  and run the test\s using additional flag:

  ```bash
  --tags=regression,smoke
  ```

  - Added [scripterio-example](https://github.com/scripterio-js/scripterio-example)
    Various examples of how to perform unit, API, and UI testing using ScripterI/O.

### Changed
- Moved repository from `personal` type: (https://github.com/VadimNastoyashchy/scripterio)
  to: its `organization` (https://github.com/scripterio-js)
- Updated CLI help message
- Updated documentation
- Updated logo

## 1.0.5 - 2025-05-21

## 1.0.3 - 2025-05-20
### Changed
- Test `skip` declaration. Moved from:
  ```
  describe('description', { skip: true }, () => {})
  //or
  test('description', { skip: true }, () => {})
  ```
  to:
  ```
  describe.skip('description', () => {})
  //or
  test.skip('description', () => {})
  ```
- Updated documentation

## 1.0.2 - 2025-05-19
### Fixed
- Fixed `toBeEqual()` assertion to output types as well as value

## 1.0.1 - 2024-11-29
### Fixed
- Based on: https://github.com/VadimNastoyashchy/scripterio/issues/1
  Fixed If a user timeout `{ timeout: 2000}` is set for a specific test, it will now have no effect on other tests.

## 1.0.0 - 2024-11-20
### Added
- New color for log running files
- Console reporter small updates

### Changed
- Workflow `pr_master.yml` file.

## 0.0.2 - 2024-11-20
### Added
- `src` for runner
- `_tests_` for runner

## 0.0.1 - 2024-11-20
### Added
- Project init and first publish
