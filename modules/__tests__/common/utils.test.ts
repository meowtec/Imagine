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

test('fixed', () => {
  expect(_.fixed(1.324, 2)).toBe(1.32)
  expect(_.fixed(1.001, 2)).toBe(1)
})

test('size', () => {
  expect(_.size(100)).toEqual([100, 'B'])
  expect(_.size(999)).toEqual([999, 'B'])
  expect(_.size(1000)).toEqual([0.98, 'KB'])
  expect(_.size(1024)).toEqual([1, 'KB'])
  expect(_.size(1024000)).toEqual([0.98, 'MB'])
  expect(_.size(1048576)).toEqual([1, 'MB'])
})