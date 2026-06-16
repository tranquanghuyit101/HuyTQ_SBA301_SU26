import { MESSAGES } from '../constants/messages'

const MAX_LENGTH = 100
const PRICE_MIN = 1000
const PRICE_MAX = 999999

/**
 * Validate tên restaurant.
 * - Bắt buộc (MS01)
 * - Độ dài tối đa 100 ký tự
 *
 * @param {string} value
 * @returns {string|null} message lỗi hoặc null nếu hợp lệ
 */
export function validateName(value) {
  if (!value || String(value).trim() === '') {
    return MESSAGES.MS01('Restaurant Name')
  }

  if (String(value).length > MAX_LENGTH) {
    return `Restaurant Name must be less than or equal ${MAX_LENGTH} characters`
  }

  return null
}

/**
 * Validate giá (priceFrom hoặc priceTo).
 * - Bắt buộc (MS01)
 * - Phải là số nguyên
 * - 1000 <= value <= 999999 (MS02)
 *
 * @param {string|number} value
 * @param {string} fieldName  tên field để hiển thị trong message
 * @returns {string|null}
 */
export function validatePrice(value, fieldName) {
  if (value === undefined || value === null || String(value).trim() === '') {
    return MESSAGES.MS01(fieldName)
  }

  const normalized = String(value).trim()
  if (!/^-?\d+$/.test(normalized)) {
    return MESSAGES.MS02(fieldName, PRICE_MIN, PRICE_MAX)
  }

  const numberValue = Number(normalized)
  if (numberValue < PRICE_MIN || numberValue > PRICE_MAX) {
    return MESSAGES.MS02(fieldName, PRICE_MIN, PRICE_MAX)
  }

  return null
}

/**
 * Validate priceTo phải lớn hơn priceFrom.
 *
 * @param {number} priceFrom
 * @param {number} priceTo
 * @returns {string|null}
 */
export function validatePriceRange(priceFrom, priceTo) {
  if (Number.isNaN(priceFrom) || Number.isNaN(priceTo)) {
    return null
  }

  if (priceTo <= priceFrom) {
    return 'Price to must be greater than Price from'
  }

  return null
}

/**
 * Validate Open Date.
 * - Bắt buộc (MS01)
 * - Định dạng yyyy-MM-dd (MS03)
 * - Không được là ngày tương lai (MS06)
 *
 * @param {string} value  chuỗi ngày dạng "yyyy-MM-dd"
 * @returns {string|null}
 */
export function validateOpenDate(value) {
  if (!value || String(value).trim() === '') {
    return MESSAGES.MS01('Open Date')
  }

  const trimmed = String(value).trim()
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(trimmed)) {
    return MESSAGES.MS03
  }

  const parsedDate = new Date(`${trimmed}T00:00:00`)
  if (Number.isNaN(parsedDate.getTime())) {
    return MESSAGES.MS03
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (parsedDate.getTime() > today.getTime()) {
    return MESSAGES.MS06
  }

  return null
}

/**
 * Validate Owner name.
 * - Bắt buộc (MS01)
 * - Độ dài tối đa 100 ký tự
 *
 * @param {string} value
 * @returns {string|null}
 */
export function validateOwner(value) {
  if (!value || String(value).trim() === '') {
    return MESSAGES.MS01('Owner name')
  }

  if (String(value).length > MAX_LENGTH) {
    return `Owner name must be less than or equal ${MAX_LENGTH} characters`
  }

  return null
}

/**
 * Validate Address.
 * - Bắt buộc (MS01)
 * - Độ dài tối đa 100 ký tự
 *
 * @param {string} value
 * @returns {string|null}
 */
export function validateAddress(value) {
  if (!value || String(value).trim() === '') {
    return MESSAGES.MS01('Address')
  }

  if (String(value).length > MAX_LENGTH) {
    return `Address must be less than or equal ${MAX_LENGTH} characters`
  }

  return null
}

/**
 * Validate Category.
 * - Bắt buộc (MS01)
 *
 * @param {string} value
 * @returns {string|null}
 */
export function validateCategory(value) {
  if (!value || String(value).trim() === '') {
    return MESSAGES.MS01('Category')
  }

  return null
}

export function validateCategoryName(value) {
  if (!value || String(value).trim() === '') {
    return MESSAGES.MS01('Category Name')
  }

  if (String(value).trim().length < 6) {
    return 'Category Name must be at least 6 characters'
  }

  if (String(value).length > MAX_LENGTH) {
    return `Category Name must be less than or equal ${MAX_LENGTH} characters`
  }

  return null
}

export function validateCategoryForm(formData, existingCategories = []) {
  const errors = {}

  errors.name = validateCategoryName(formData.name)

  if (!errors.name) {
    const normalizedName = String(formData.name).trim().toLowerCase()
    const duplicate = existingCategories.some(
      (category) => category.name.trim().toLowerCase() === normalizedName
    )
    if (duplicate) {
      errors.name = 'Category Name already exists'
    }
  }

  return errors
}

/**
 * Validate toàn bộ form AddNew.
 * Trả về object errors { name, priceFrom, priceTo, priceRange, owner, openDate, address, category }
 * Mỗi trường là null (hợp lệ) hoặc string message lỗi.
 *
 * @param {object} formData
 * @returns {object} errors
 */
export function validateRestaurantForm(formData) {
  const errors = {}

  errors.name = validateName(formData.name)
  errors.priceFrom = validatePrice(formData.priceFrom, 'Price from')
  errors.priceTo = validatePrice(formData.priceTo, 'Price to')
  errors.priceRange = validatePriceRange(
    Number(formData.priceFrom),
    Number(formData.priceTo),
  )
  errors.owner = validateOwner(formData.owner)
  errors.openDate = validateOpenDate(formData.openDate)
  errors.address = validateAddress(formData.address)
  errors.category = validateCategory(formData.category)

  return errors
}
