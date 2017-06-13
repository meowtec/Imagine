import createLocales from '../../common/i18n'

test('locale', () => {
  const localesTexts = {
    'zh-CN': {
      taxi: '出租车',
    },
  }

  expect(createLocales(localesTexts, {}, 'zh-CN', 'zh-CN')('taxi')).toBe('出租车')
})

test('locale fallback', () => {
  const localesTexts = {
    'zh-CN': {
      taxi: '出租车',
      car: '汽车',
    },
    'en-US': {
      taxi: 'Taxi',
      apple: 'Apple',
    },
    'zh-TW': {
      taxi: '計程車',
    },
  }

  expect(createLocales(localesTexts, {zh: 'zh-CN'}, 'en-US', 'zh-TW')('taxi')).toBe('計程車')
  expect(createLocales(localesTexts, {zh: 'zh-CN'}, 'en-US', 'zh-TW')('car')).toBe('汽车')
  expect(createLocales(localesTexts, {zh: 'zh-CN'}, 'en-US', 'zh-TW')('apple')).toBe('Apple')
  expect(createLocales(localesTexts, {zh: 'zh-CN'}, 'en-US', 'jp-JP')('taxi')).toBe('Taxi')
})

test('locale args', () => {
  const localesTexts = {
    'zh-CN': {
      equal: '{0}是{0}，{1}是{1}',
    },
  }

  expect(
    createLocales(localesTexts, {}, 'zh-CN', 'zh-CN')('equal', '四', '十')
  ).toBe('四是四，十是十')
})
