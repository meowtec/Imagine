import * as _ from '../../common/utils'

test('coop', () => {
  expect(
    _.coop(2, 3)(2)
  ).toBe(2)
  expect(
    _.coop(2, 3)(1)
  ).toBe(2)
  expect(
    _.coop(2, 3)(4)
  ).toBe(3)
})

test('shallowCompare', () => {
  expect(
    _.shallowCompare({}, {})
  ).toBeTruthy()

  expect(
    _.shallowCompare({a: 1}, {a: 1})
  ).toBeTruthy()

  expect(
    _.shallowCompare({a: 1}, {a: 2})
  ).toBeFalsy()

  expect(
    _.shallowCompare({a: 1}, {a: 2}, [])
  ).toBeTruthy()

  expect(
    _.shallowCompare({a: 1}, {a: 2}, ['a'])
  ).toBeFalsy()
})
