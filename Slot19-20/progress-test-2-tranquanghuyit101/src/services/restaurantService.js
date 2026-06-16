import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

/**
 * Lấy danh sách tất cả restaurants từ API.
 * Endpoint: GET /restaurants
 *
 * @returns {Promise<Array>} mảng restaurant objects
 */
export async function getRestaurants() {
  const response = await axios.get(`${BASE_URL}/restaurants`)
  return response.data
}

/**
 * Lấy thông tin chi tiết một restaurant.
 * Endpoint: GET /restaurants/:id
 *
 * @param {number|string} id
 * @returns {Promise<object>} restaurant object
 */
export async function getRestaurantById(id) {
  const response = await axios.get(`${BASE_URL}/restaurants/${id}`)
  return response.data
}

/**
 * Tạo mới restaurant.
 * Endpoint: POST /restaurants
 *
 * @param {object} restaurantData  { name, category, owner, address, priceFrom, priceTo, openDate }
 * @returns {Promise<object>} restaurant vừa tạo
 */
export async function addRestaurant(restaurantData) {
  const response = await axios.post(`${BASE_URL}/restaurants`, restaurantData)
  return response.data
}

/**
 * Xóa restaurant.
 * Endpoint: DELETE /restaurants/:id
 *
 * @param {number|string} id
 * @returns {Promise<void>}
 */
export async function deleteRestaurant(id) {
  await axios.delete(`${BASE_URL}/restaurants/${id}`)
}
