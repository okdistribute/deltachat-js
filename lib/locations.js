/* eslint-disable camelcase */

/**
 * Wrapper around dc_location_t*
 */
class Locations {
  constructor (dc_locations, binding) {
    this.dc_locations = dc_locations
    this.binding = this.binding
  }

  locationToJson (index) {
    return {
      accuracy: this.getAccuracy(index),
      latitude: this.getLatitude(index),
      longitude: this.getLongitude(index),
      timestamp: this.getTimestamp(index),
      contactId: this.getContactId(index),
      msgId: this.getMsgId(index),
      chatId: this.getChatId(index),
      isIndependent: this.isIndependent(index)
    }
  }

  toJson () {
    const locations = []
    const count = this.getCount()
    for (let index = 0; index < count; index++) {
      locations.push(this.locationToJson(index))
    }
    return locations
  }

  getCount () {
    return this.binding.dc_array_get_cnt(this.dc_locations)
  }

  getAccuracy (index) {
    return this.binding.dc_array_get_accuracy(this.dc_locations, index)
  }

  getLatitude (index) {
    return this.binding.dc_array_get_latitude(this.dc_locations, index)
  }

  getLongitude (index) {
    return this.binding.dc_array_get_longitude(this.dc_locations, index)
  }

  getTimestamp (index) {
    return this.binding.dc_array_get_timestamp(this.dc_locations, index)
  }

  getMsgId (index) {
    return this.binding.dc_array_get_msg_id(this.dc_locations, index)
  }

  getContactId (index) {
    return this.binding.dc_array_get_contact_id(this.dc_locations, index)
  }

  getChatId (index) {
    return this.binding.dc_array_get_chat_id(this.dc_locations, index)
  }

  isIndependent (index) {
    return this.binding.dc_array_is_independent(this.dc_locations, index)
  }
}

module.exports = Locations
