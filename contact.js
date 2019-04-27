/* eslint-disable camelcase */

/**
 * Wrapper around dc_contact_t*
 */
class Contact {
  constructor (dc_contact, binding) {
    this.dc_contact = dc_contact
    this.binding = binding
  }

  toJson () {
    return {
      address: this.getAddress(),
      color: this.getColor(),
      displayName: this.getDisplayName(),
      firstName: this.getFirstName(),
      id: this.getId(),
      name: this.getName(),
      profileImage: this.getProfileImage(),
      nameAndAddr: this.getNameAndAddress(),
      isBlocked: this.isBlocked(),
      isVerified: this.isVerified()
    }
  }

  getAddress () {
    return this.binding.dc_contact_get_addr(this.dc_contact)
  }

  getColor () {
    return this.binding.dc_contact_get_color(this.dc_contact)
  }

  getDisplayName () {
    return this.binding.dc_contact_get_display_name(this.dc_contact)
  }

  getFirstName () {
    return this.binding.dc_contact_get_first_name(this.dc_contact)
  }

  getId () {
    return this.binding.dc_contact_get_id(this.dc_contact)
  }

  getName () {
    return this.binding.dc_contact_get_name(this.dc_contact)
  }

  getNameAndAddress () {
    return this.binding.dc_contact_get_name_n_addr(this.dc_contact)
  }

  getProfileImage () {
    return this.binding.dc_contact_get_profile_image(this.dc_contact)
  }

  isBlocked () {
    return Boolean(this.binding.dc_contact_is_blocked(this.dc_contact))
  }

  isVerified () {
    return Boolean(this.binding.dc_contact_is_verified(this.dc_contact))
  }
}

module.exports = Contact
