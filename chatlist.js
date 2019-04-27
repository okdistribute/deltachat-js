/* eslint-disable camelcase */

const Lot = require('./lot')
const debug = require('debug')('deltachat:chatlist')

/**
 * Wrapper around dc_chatlist_t*
 */
class ChatList {
  constructor (dc_chatlist, binding) {
    debug('ChatList constructor')
    this.dc_chatlist = dc_chatlist
    this.binding = binding
  }

  getChatId (index) {
    debug(`getChatId ${index}`)
    return this.binding.dc_chatlist_get_chat_id(this.dc_chatlist, index)
  }

  getCount () {
    debug('getCount')
    return this.binding.dc_chatlist_get_cnt(this.dc_chatlist)
  }

  getMessageId (index) {
    debug(`getMessageId ${index}`)
    return this.binding.dc_chatlist_get_msg_id(this.dc_chatlist, index)
  }

  getSummary (index, chat) {
    debug(`getSummary ${index}`)
    const dc_chat = (chat && chat.dc_chat) || null
    return new Lot(
      this.binding.dc_chatlist_get_summary(
        this.dc_chatlist,
        index,
        dc_chat
      ), this.binding
    )
  }
}

module.exports = ChatList
