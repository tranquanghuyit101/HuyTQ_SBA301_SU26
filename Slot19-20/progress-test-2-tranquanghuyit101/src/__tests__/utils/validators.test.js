/**
 * Test suite — validators.js
 * Kiểm tra toàn bộ validation logic theo yêu cầu đề thi.
 */
import {
  validateName,
  validatePrice,
  validatePriceRange,
  validateOpenDate,
  validateOwner,
  validateAddress,
  validateCategory,
  validateRestaurantForm,
} from '../../utils/validators'

// ─── validateName ─────────────────────────────────────────────────────────────

describe('validateName()', () => {
  test('trả về MS01 khi rỗng', () => {
    expect(validateName('')).toMatch(/required/i)
  })
  test('trả về MS01 khi undefined', () => {
    expect(validateName(undefined)).toMatch(/required/i)
  })
  test('trả về null khi hợp lệ', () => {
    expect(validateName('BBQ Restaurant')).toBeNull()
  })
  test('trả về lỗi khi vượt 100 ký tự', () => {
    expect(validateName('A'.repeat(101))).not.toBeNull()
  })
  test('chấp nhận đúng 100 ký tự', () => {
    expect(validateName('A'.repeat(100))).toBeNull()
  })
})

// ─── validatePrice ────────────────────────────────────────────────────────────

describe('validatePrice()', () => {
  test('trả về MS01 khi rỗng', () => {
    expect(validatePrice('', 'Price from')).toMatch(/required/i)
  })
  test('trả về MS02 khi < 1000', () => {
    expect(validatePrice('999', 'Price from')).toMatch(/1000/i)
  })
  test('trả về MS02 khi >= 1000000', () => {
    expect(validatePrice('1000000', 'Price from')).not.toBeNull()
  })
  test('trả về null khi hợp lệ (1000)', () => {
    expect(validatePrice('1000', 'Price from')).toBeNull()
  })
  test('trả về null khi hợp lệ (999999)', () => {
    expect(validatePrice('999999', 'Price from')).toBeNull()
  })
  test('trả về lỗi khi không phải số nguyên', () => {
    expect(validatePrice('abc', 'Price from')).not.toBeNull()
  })
  test('field name xuất hiện trong message lỗi', () => {
    const msg = validatePrice('', 'Price to')
    expect(msg).toMatch(/Price to/i)
  })
})

// ─── validatePriceRange ───────────────────────────────────────────────────────

describe('validatePriceRange()', () => {
  test('trả về lỗi khi priceTo <= priceFrom', () => {
    expect(validatePriceRange(50000, 50000)).not.toBeNull()
    expect(validatePriceRange(50000, 30000)).not.toBeNull()
  })
  test('trả về null khi priceTo > priceFrom', () => {
    expect(validatePriceRange(10000, 50000)).toBeNull()
  })
})

// ─── validateOpenDate ─────────────────────────────────────────────────────────

describe('validateOpenDate()', () => {
  test('trả về MS01 khi rỗng', () => {
    expect(validateOpenDate('')).toMatch(/required/i)
  })
  test('trả về MS03 khi sai định dạng', () => {
    expect(validateOpenDate('20-01-2025')).toMatch(/invalid format date/i)
  })
  test('trả về MS03 khi ngày không hợp lệ', () => {
    expect(validateOpenDate('2025-13-01')).not.toBeNull()
  })
  test('trả về MS06 khi là ngày tương lai', () => {
    const future = new Date()
    future.setFullYear(future.getFullYear() + 1)
    const futureStr = future.toISOString().split('T')[0]
    expect(validateOpenDate(futureStr)).toMatch(/future/i)
  })
  test('trả về null khi là ngày hôm nay', () => {
    const today = new Date().toISOString().split('T')[0]
    expect(validateOpenDate(today)).toBeNull()
  })
  test('trả về null khi là ngày quá khứ hợp lệ', () => {
    expect(validateOpenDate('2024-01-15')).toBeNull()
  })
})

// ─── validateOwner ────────────────────────────────────────────────────────────

describe('validateOwner()', () => {
  test('trả về MS01 khi rỗng', () => {
    expect(validateOwner('')).toMatch(/required/i)
  })
  test('trả về null khi hợp lệ', () => {
    expect(validateOwner('Hoang Dang')).toBeNull()
  })
  test('trả về lỗi khi vượt 100 ký tự', () => {
    expect(validateOwner('A'.repeat(101))).not.toBeNull()
  })
})

// ─── validateAddress ──────────────────────────────────────────────────────────

describe('validateAddress()', () => {
  test('trả về MS01 khi rỗng', () => {
    expect(validateAddress('')).toMatch(/required/i)
  })
  test('trả về null khi hợp lệ', () => {
    expect(validateAddress('Hang Bai, Ha Noi')).toBeNull()
  })
})

// ─── validateCategory ─────────────────────────────────────────────────────────

describe('validateCategory()', () => {
  test('trả về MS01 khi rỗng', () => {
    expect(validateCategory('')).toMatch(/required/i)
  })
  test('trả về null khi hợp lệ', () => {
    expect(validateCategory('Casual')).toBeNull()
  })
})

// ─── validateRestaurantForm ───────────────────────────────────────────────────

describe('validateRestaurantForm()', () => {
  const validForm = {
    name: 'BBQ Restaurant',
    priceFrom: '1000',
    priceTo: '20000',
    owner: 'Hoang Dang',
    openDate: '2024-01-15',
    address: 'Hang Bai',
    category: 'Casual',
  }

  test('trả về tất cả null khi form hợp lệ', () => {
    const errors = validateRestaurantForm(validForm)
    Object.values(errors).forEach((v) => expect(v).toBeNull())
  })

  test('trả về lỗi name khi name rỗng', () => {
    const errors = validateRestaurantForm({ ...validForm, name: '' })
    expect(errors.name).not.toBeNull()
  })

  test('trả về lỗi priceFrom khi < 1000', () => {
    const errors = validateRestaurantForm({ ...validForm, priceFrom: '500' })
    expect(errors.priceFrom).not.toBeNull()
  })

  test('trả về lỗi priceRange khi priceTo <= priceFrom', () => {
    const errors = validateRestaurantForm({ ...validForm, priceFrom: '50000', priceTo: '10000' })
    expect(errors.priceRange).not.toBeNull()
  })

  test('trả về lỗi openDate khi là tương lai', () => {
    const future = new Date()
    future.setFullYear(future.getFullYear() + 1)
    const errors = validateRestaurantForm({
      ...validForm,
      openDate: future.toISOString().split('T')[0],
    })
    expect(errors.openDate).not.toBeNull()
  })
})
