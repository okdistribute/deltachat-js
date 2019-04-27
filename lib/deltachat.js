/* eslint-disable camelcase */

const C = require('../constants')
const events = require('../events')
const Chat = require('./chat')
const ChatList = require('./chatlist')
const Contact = require('./contact')
const Message = require('./message')
const Lot = require('./lot')
const EventEmitter = require('events').EventEmitter
const mkdirp = require('mkdirp')
const path = require('path')
const got = require('got')
const Locations = require('./locations')
const pick = require('lodash.pick')
const debug = require('debug')('deltachat:index')

/**
 * Wrapper around dc_context_t*
 */
class DeltaChat extends EventEmitter {
  constructor (binding) {
    debug('DeltaChat constructor')
    super()

    this.binding = binding
    this.dc_context = this.binding.dc_context_new()
    this.binding.dc_set_event_handler(this.dc_context, (event, data1, data2) => {
      handleEvent(this, event, data1, data2)
    })
  }

  addAddressBook (addressBook) {
    debug(`addAddressBook ${addressBook}`)
    return this.binding.dc_add_address_book(this.dc_context, addressBook)
  }

  addContactToChat (chatId, contactId) {
    debug(`addContactToChat ${chatId} ${contactId}`)
    return Boolean(
      this.binding.dc_add_contact_to_chat(
        this.dc_context,
        Number(chatId),
        Number(contactId)
      )
    )
  }

  archiveChat (chatId, archive) {
    debug(`archiveChat ${chatId} ${archive}`)
    this.binding.dc_archive_chat(
      this.dc_context,
      Number(chatId),
      archive ? 1 : 0
    )
  }

  blockContact (contactId, block) {
    debug(`blockContact ${contactId} ${block}`)
    this.binding.dc_block_contact(
      this.dc_context,
      Number(contactId),
      block ? 1 : 0
    )
  }

  checkPassword (password) {
    debug('checkPassword')
    return Boolean(this.binding.dc_check_password(this.dc_context, password))
  }

  checkQrCode (qrCode) {
    debug(`checkQrCode ${qrCode}`)
    const dc_lot = this.binding.dc_check_qr(this.dc_context, qrCode)
    return dc_lot ? new Lot(dc_lot, this.binding) : null
  }

  clearStringTable () {
    debug('clearStringTable')
    this.binding.dc_clear_string_table(this.dc_context)
  }

  close () {
    debug('close')
    this.removeAllListeners()

    this.binding.dc_unset_event_handler(this.dc_context)
    this.binding.dc_stop_threads(this.dc_context)
  }

  configure (opts, cb) {
    debug('configure')
    if (!opts) opts = {}
    const ready = () => {
      this.emit('ready')
      cb && cb()
    }

    if (this.isConfigured()) {
      return process.nextTick(ready)
    }

    if (typeof opts.addr !== 'string') {
      throw new Error('Missing .addr')
    }

    if (typeof opts.mailPw !== 'string') {
      throw new Error('Missing .mailPw')
    }

    this.once('_configured', ready)

    if (typeof opts.e2eeEnabled === 'undefined') opts.e2eeEnabled = 1

    this.setConfig('addr', opts.addr)

    this.setConfig('mail_server', opts.mailServer)
    this.setConfig('mail_user', opts.mailUser)
    this.setConfig('mail_pw', opts.mailPw)
    this.setConfig('mail_port', String(opts.mailPort))

    this.setConfig('send_server', opts.sendServer)
    this.setConfig('send_user', opts.sendUser)
    this.setConfig('send_pw', opts.sendPw)
    this.setConfig('send_port', String(opts.sendPort))

    this.setConfig('server_flags', String(opts.serverFlags))
    this.setConfig('imap_folder', opts.imapFolder)
    this.setConfig('displayname', opts.displayName)
    this.setConfig('selfstatus', opts.selfStatus)
    this.setConfig('selfavatar', opts.selfAvatar)
    this.setConfig('e2ee_enabled', String(opts.e2eeEnabled ? 1 : 0))
    this.setConfig('mdns_enabled', String(opts.mdnsEnabled ? 1 : 0))
    this.setConfig('save_mime_headers', String(opts.saveMimeHeaders ? 1 : 0))

    this.binding.dc_configure(this.dc_context)
  }

  continueKeyTransfer (messageId, setupCode, cb) {
    debug(`continueKeyTransfer ${messageId}`)
    this.binding.dc_continue_key_transfer(this.dc_context, Number(messageId), setupCode, result => {
      if (result === 0) {
        return cb(new Error('Key transfer failed due to bad setup code'))
      }
      cb(null)
    })
  }

  createChatByContactId (contactId) {
    debug(`createChatByContactId ${contactId}`)
    return this.binding.dc_create_chat_by_contact_id(
      this.dc_context,
      Number(contactId)
    )
  }

  createChatByMessageId (messageId) {
    debug(`createChatByMessageId ${messageId}`)
    return this.binding.dc_create_chat_by_msg_id(
      this.dc_context,
      Number(messageId)
    )
  }

  createContact (name, addr) {
    debug(`createContact ${name} ${addr}`)
    return this.binding.dc_create_contact(this.dc_context, name, addr)
  }

  createUnverifiedGroupChat (chatName) {
    debug(`createUnverifiedGroupChat ${chatName}`)
    return this.binding.dc_create_group_chat(this.dc_context, 0, chatName)
  }

  createVerifiedGroupChat (chatName) {
    debug(`createVerifiedGroupChat ${chatName}`)
    return this.binding.dc_create_group_chat(this.dc_context, 1, chatName)
  }

  deleteChat (chatId) {
    debug(`deleteChat ${chatId}`)
    this.binding.dc_delete_chat(this.dc_context, Number(chatId))
  }

  deleteContact (contactId) {
    debug(`deleteContact ${contactId}`)
    return Boolean(
      this.binding.dc_delete_contact(
        this.dc_context,
        Number(contactId)
      )
    )
  }

  deleteMessages (messageIds) {
    if (!Array.isArray(messageIds)) {
      messageIds = [ messageIds ]
    }
    messageIds = messageIds.map(id => Number(id))
    debug('deleteMessages', messageIds)
    this.binding.dc_delete_msgs(this.dc_context, messageIds)
  }

  forwardMessages (messageIds, chatId) {
    if (!Array.isArray(messageIds)) {
      messageIds = [ messageIds ]
    }
    messageIds = messageIds.map(id => Number(id))
    debug('forwardMessages', messageIds)
    this.binding.dc_forward_msgs(this.dc_context, messageIds, chatId)
  }

  getBlobdir () {
    debug('getBlobdir')
    return this.binding.dc_get_blobdir(this.dc_context)
  }

  getBlockedCount () {
    debug('getBlockedCount')
    return this.binding.dc_get_blocked_cnt(this.dc_context)
  }

  getBlockedContacts () {
    debug('getBlockedContacts')
    return this.binding.dc_get_blocked_contacts(this.dc_context)
  }

  getChat (chatId) {
    debug(`getChat ${chatId}`)
    const dc_chat = this.binding.dc_get_chat(this.dc_context, Number(chatId))
    return dc_chat ? new Chat(dc_chat, this.binding) : null
  }

  getChatContacts (chatId) {
    debug(`getChatContacts ${chatId}`)
    return this.binding.dc_get_chat_contacts(this.dc_context, Number(chatId))
  }

  getChatIdByContactId (contactId) {
    debug(`getChatIdByContactId ${contactId}`)
    return this.binding.dc_get_chat_id_by_contact_id(this.dc_context, Number(contactId))
  }

  getChatMedia (chatId, msgType1, msgType2, msgType3) {
    debug(`getChatMedia ${chatId}`)
    return this.binding.dc_get_chat_media(
      this.dc_context,
      Number(chatId),
      msgType1,
      msgType2 || 0,
      msgType3 || 0
    )
  }

  getMimeHeaders (messageId) {
    debug(`getMimeHeaders ${messageId}`)
    return this.binding.dc_get_mime_headers(this.dc_context, Number(messageId))
  }

  getChatMessages (chatId, flags, marker1before) {
    debug(`getChatMessages ${chatId} ${flags} ${marker1before}`)
    return this.binding.dc_get_chat_msgs(
      this.dc_context,
      Number(chatId),
      flags,
      marker1before
    )
  }

  getChats (listFlags, queryStr, queryContactId) {
    debug('getChats')
    const result = []
    const list = this.getChatList(listFlags, queryStr, queryContactId)
    const count = list.getCount()
    for (let i = 0; i < count; i++) {
      result.push(list.getChatId(i))
    }
    return result
  }

  getChatList (listFlags, queryStr, queryContactId) {
    listFlags = listFlags || 0
    queryStr = queryStr || ''
    queryContactId = queryContactId || 0
    debug(`getChatList ${listFlags} ${queryStr} ${queryContactId}`)
    return new ChatList(
      this.binding.dc_get_chatlist(
        this.dc_context,
        listFlags,
        queryStr,
        Number(queryContactId)
      ), this.binding
    )
  }

  static getConfig (dir, cb) {
    debug(`DeltaChat.getConfig ${dir}`)
    const dc_context = this.binding.dc_context_new()
    const db = dir.endsWith('db.sqlite') ? dir : path.join(dir, 'db.sqlite')
    this.binding.dc_open(dc_context, db, '', err => {
      if (err) return cb(err)
      if (this.binding.dc_is_configured(dc_context)) {
        const addr = this.binding.dc_get_config(dc_context, 'addr')
        return cb(null, { addr })
      }
      cb(null, {})
    })
  }

  getConfig (key) {
    debug(`getConfig ${key}`)
    return this.binding.dc_get_config(this.dc_context, key)
  }

  getContact (contactId) {
    debug(`getContact ${contactId}`)
    const dc_contact = this.binding.dc_get_contact(
      this.dc_context,
      Number(contactId)
    )
    return dc_contact ? new Contact(dc_contact, this.binding) : null
  }

  getContactEncryptionInfo (contactId) {
    debug(`getContactEncryptionInfo ${contactId}`)
    return this.binding.dc_get_contact_encrinfo(this.dc_context, Number(contactId))
  }

  getContacts (listFlags, query) {
    listFlags = listFlags || 0
    query = query || ''
    debug(`getContacts ${listFlags} ${query}`)
    return this.binding.dc_get_contacts(this.dc_context, listFlags, query)
  }

  getDraft (chatId) {
    debug(`getDraft ${chatId}`)
    const dc_msg = this.binding.dc_get_draft(this.dc_context, Number(chatId))
    return dc_msg ? new Message(dc_msg, this.binding) : null
  }

  getFreshMessageCount (chatId) {
    debug(`getFreshMessageCount ${chatId}`)
    return this.binding.dc_get_fresh_msg_cnt(this.dc_context, Number(chatId))
  }

  getFreshMessages () {
    debug('getFreshMessages')
    return this.binding.dc_get_fresh_msgs(this.dc_context)
  }

  getInfo () {
    debug('getInfo')
    const result = {}

    const regex = /^(\w+)=(.*)$/i
    this.binding.dc_get_info(this.dc_context)
      .split('\n')
      .filter(Boolean)
      .forEach(line => {
        const match = regex.exec(line)
        if (match) {
          result[match[1]] = match[2]
        }
      })

    return result
  }

  getMessage (messageId) {
    debug(`getMessage ${messageId}`)
    const dc_msg = this.binding.dc_get_msg(this.dc_context, Number(messageId))
    return dc_msg ? new Message(dc_msg, this.binding) : null
  }

  getMessageCount (chatId) {
    debug(`getMessageCount ${chatId}`)
    return this.binding.dc_get_msg_cnt(this.dc_context, Number(chatId))
  }

  getMessageInfo (messageId) {
    debug(`getMessageInfo ${messageId}`)
    return this.binding.dc_get_msg_info(this.dc_context, Number(messageId))
  }

  getNextMediaMessage (messageId, msgType1, msgType2, msgType3) {
    debug(`getNextMediaMessage ${messageId} ${msgType1} ${msgType2} ${msgType3}`)
    return this._getNextMedia(
      messageId,
      1,
      msgType1,
      msgType2,
      msgType3
    )
  }

  getPreviousMediaMessage (messageId, msgType1, msgType2, msgType3) {
    debug(`getPreviousMediaMessage ${messageId} ${msgType1} ${msgType2} ${msgType3}`)
    return this._getNextMedia(
      messageId,
      -1,
      msgType1,
      msgType2,
      msgType3
    )
  }

  _getNextMedia (messageId, dir, msgType1, msgType2, msgType3) {
    return this.binding.dc_get_next_media(
      this.dc_context,
      Number(messageId),
      dir,
      msgType1 || 0,
      msgType2 || 0,
      msgType3 || 0
    )
  }

  getSecurejoinQrCode (chatId) {
    debug(`getSecurejoinQrCode ${chatId}`)
    return this.binding.dc_get_securejoin_qr(this.dc_context, Number(chatId))
  }

  getStarredMessages () {
    debug('getStarredMessages')
    return this.getChatMessages(C.DC_CHAT_ID_STARRED, 0, 0)
  }

  getSystemInfo () {
    debug('DeltaChat.getSystemInfo')
    const result = pick(this.getInfo(), [
      'deltachat_core_version',
      'sqlite_version',
      'sqlite_thread_safe',
      'libetpan_version',
      'openssl_version',
      'compile_date',
      'arch'
    ])
    return result
  }

  importExport (what, param1, param2) {
    debug(`importExport ${what} ${param1} ${param2}`)
    this.binding.dc_imex(this.dc_context, what, param1, param2 || '')
  }

  importExportHasBackup (dir) {
    debug(`importExportHasBackup ${dir}`)
    return this.binding.dc_imex_has_backup(this.dc_context, dir)
  }

  initiateKeyTransfer (cb) {
    debug('initiateKeyTransfer')
    return this.binding.dc_initiate_key_transfer(this.dc_context, statusCode => {
      if (typeof statusCode === 'string') {
        return cb(null, statusCode)
      }
      cb(new Error('Could not initiate key transfer'))
    })
  }

  isConfigured () {
    debug('isConfigured')
    return Boolean(this.binding.dc_is_configured(this.dc_context))
  }

  isContactInChat (chatId, contactId) {
    debug(`isContactInChat ${chatId} ${contactId}`)
    return Boolean(
      this.binding.dc_is_contact_in_chat(
        this.dc_context,
        Number(chatId),
        Number(contactId)
      )
    )
  }

  isOpen () {
    debug('isOpen')
    return Boolean(this.binding.dc_is_open(this.dc_context))
  }

  // TODO this should most likely be async, see
  // https://c.delta.chat/classdc__context__t.html#ae49176cbc26d4d40d52de4f5301d1fa7
  joinSecurejoin (qrCode) {
    debug(`joinSecurejoin ${qrCode}`)
    return this.binding.dc_join_securejoin(this.dc_context, qrCode)
  }

  lookupContactIdByAddr (addr) {
    debug(`lookupContactIdByAddr ${addr}`)
    return Boolean(
      this.binding.dc_lookup_contact_id_by_addr(this.dc_context, addr)
    )
  }

  markNoticedChat (chatId) {
    debug(`markNoticedChat ${chatId}`)
    this.binding.dc_marknoticed_chat(this.dc_context, Number(chatId))
  }

  markNoticedAllChats () {
    debug('markNoticedAllChats')
    this.binding.dc_marknoticed_all_chats(this.dc_context)
  }

  markNoticedContact (contactId) {
    debug(`markNoticedContact ${contactId}`)
    this.binding.dc_marknoticed_contact(this.dc_context, Number(contactId))
  }

  markSeenMessages (messageIds) {
    if (!Array.isArray(messageIds)) {
      messageIds = [ messageIds ]
    }
    messageIds = messageIds.map(id => Number(id))
    debug('markSeenMessages', messageIds)
    this.binding.dc_markseen_msgs(this.dc_context, messageIds)
  }

  static maybeValidAddr (addr) {
    debug('DeltaChat.maybeValidAddr')
    if (addr === null) return false
    return Boolean(this.binding.dc_maybe_valid_addr(addr))
  }

  maybeNetwork () {
    debug('maybeNetwork')
    this.binding.dc_maybe_network(this.dc_context)
  }

  messageNew (viewType = C.DC_MSG_TEXT) {
    debug(`messageNew ${viewType}`)
    return new Message(this.binding.dc_msg_new(this.dc_context, viewType), this.binding)
  }

  open (cwd, cb) {
    debug(`open ${cwd}`)
    if (typeof cwd === 'function') {
      cb = cwd
      cwd = process.cwd()
    }
    if (typeof cb !== 'function') {
      throw new Error('open callback required')
    }
    mkdirp(cwd, err => {
      if (err) return cb(err)
      const db = path.join(cwd, 'db.sqlite')
      this.binding.dc_open(this.dc_context, db, '', err => {
        if (err) return cb(err)
        this.binding.dc_start_threads(this.dc_context)
        cb()
      })
    })
  }

  removeContactFromChat (chatId, contactId) {
    debug(`removeContactFromChat ${chatId} ${contactId}`)
    return Boolean(
      this.binding.dc_remove_contact_from_chat(
        this.dc_context,
        Number(chatId),
        Number(contactId)
      )
    )
  }

  searchMessages (chatId, query) {
    debug(`searchMessages ${chatId} ${query}`)
    return this.binding.dc_search_msgs(this.dc_context, Number(chatId), query)
  }

  sendMessage (chatId, msg) {
    debug(`sendMessage ${chatId}`)
    if (!msg) {
      throw new Error('invalid msg parameter')
    }
    if (typeof msg === 'string') {
      const msgObj = this.messageNew()
      msgObj.setText(msg)
      msg = msgObj
    }
    if (!msg.dc_msg) {
      throw new Error('invalid msg object')
    }
    return this.binding.dc_send_msg(this.dc_context, Number(chatId), msg.dc_msg)
  }

  setChatName (chatId, name) {
    debug(`setChatName ${chatId} ${name}`)
    return Boolean(
      this.binding.dc_set_chat_name(
        this.dc_context,
        Number(chatId),
        name
      )
    )
  }

  setChatProfileImage (chatId, image) {
    debug(`setChatProfileImage ${chatId} ${image}`)
    return Boolean(
      this.binding.dc_set_chat_profile_image(
        this.dc_context,
        Number(chatId),
        image || ''
      )
    )
  }

  setConfig (key, value) {
    debug(`setConfig ${key} ${value}`)
    return this.binding.dc_set_config(this.dc_context, key, value || '')
  }

  setDraft (chatId, msg) {
    debug(`setDraft ${chatId}`)
    this.binding.dc_set_draft(
      this.dc_context,
      Number(chatId),
      msg ? msg.dc_msg : null
    )
  }

  setLocation (latitude, longitude, accuracy) {
    debug(`setLocation ${latitude}`)
    this.binding.dc_set_location(
      this.dc_context,
      Number(latitude),
      Number(longitude),
      Number(accuracy)
    )
  }

  /*
   * @param chatId Chat-id to get location information for.
   *     0 to get locations independently of the chat.
   * @param contactId Contact id to get location information for.
   *     If also a chat-id is given, this should be a member of the given chat.
   *     0 to get locations independently of the contact.
   * @param timestampFrom Start of timespan to return.
   *     Must be given in number of seconds since 00:00 hours, Jan 1, 1970 UTC.
   *     0 for "start from the beginning".
   * @param timestampTo End of timespan to return.
   *     Must be given in number of seconds since 00:00 hours, Jan 1, 1970 UTC.
   *     0 for "all up to now".
   * @return Array of locations, NULL is never returned.
   *     The array is sorted decending;
   *     the first entry in the array is the location with the newest timestamp.
   *
   * Examples:
   * // get locations from the last hour for a global map
   * getLocations(0, 0, time(NULL)-60*60, 0);
   *
   * // get locations from a contact for a global map
   * getLocations(0, contact_id, 0, 0);
   *
   * // get all locations known for a given chat
   * getLocations(chat_id, 0, 0, 0);
   *
   * // get locations from a single contact for a given chat
   * getLocations(chat_id, contact_id, 0, 0);
   */

  getLocations (chatId, contactId, timestampFrom = 0, timestampTo = 0) {
    const locations = new Locations(this.binding.dc_get_locations(
      this.dc_context,
      Number(chatId),
      Number(contactId),
      timestampFrom,
      timestampTo
    ), this.binding)
    return locations.toJson()
  }

  setStringTable (index, str) {
    debug(`setStringTable ${index} ${str}`)
    this.binding.dc_set_string_table(this.dc_context, Number(index), str)
  }

  starMessages (messageIds, star) {
    if (!Array.isArray(messageIds)) {
      messageIds = [ messageIds ]
    }
    messageIds = messageIds.map(id => Number(id))
    debug('starMessages', messageIds)
    this.binding.dc_star_msgs(this.dc_context, messageIds, star ? 1 : 0)
  }
}

function handleEvent (self, event, data1, data2) {
  debug('event', event, 'data1', data1, 'data2', data2)

  self.emit('ALL', event, data1, data2)

  const eventStr = events[event]

  async function handleHttpGetEvent (url) {
    try {
      debug(`handleHttpGetEvent ${url}`)
      const response = await got(url, {})
      debug('handleHttpGetEvent response.body', response.body)
      this.binding.dc_set_http_get_response(self.dc_context, response.body)
    } catch (err) {
      debug('handleHttpGetEvent err', err)
      this.binding.dc_set_http_get_response(self.dc_context, '')
    }
  }

  switch (eventStr) {
    case 'DC_EVENT_INFO': // 100
      self.emit(eventStr, data2)
      break
    case 'DC_EVENT_SMTP_CONNECTED': // 101
      self.emit(eventStr, data2)
      break
    case 'DC_EVENT_IMAP_CONNECTED': // 102
      self.emit(eventStr, data2)
      break
    case 'DC_EVENT_SMTP_MESSAGE_SENT': // 103
      self.emit(eventStr, data2)
      break
    case 'DC_EVENT_WARNING': // 300
      self.emit(eventStr, data2)
      break
    case 'DC_EVENT_ERROR': // 400
      self.emit(eventStr, data2)
      break
    case 'DC_EVENT_ERROR_NETWORK': // 401
      self.emit(eventStr, data1, data2)
      break
    case 'DC_EVENT_ERROR_SELF_NOT_IN_GROUP': // 410
      self.emit(eventStr, data2)
      break
    case 'DC_EVENT_MSGS_CHANGED': // 2000
      self.emit(eventStr, data1, data2)
      break
    case 'DC_EVENT_INCOMING_MSG': // 2005
      self.emit(eventStr, data1, data2)
      break
    case 'DC_EVENT_MSG_DELIVERED': // 2010
      self.emit(eventStr, data1, data2)
      break
    case 'DC_EVENT_MSG_FAILED': // 2012
      self.emit(eventStr, data1, data2)
      break
    case 'DC_EVENT_MSG_READ': // 2015
      self.emit(eventStr, data1, data2)
      break
    case 'DC_EVENT_CHAT_MODIFIED': // 2020
      self.emit(eventStr, data1)
      break
    case 'DC_EVENT_CONTACTS_CHANGED': // 2030
      self.emit(eventStr, data1)
      break
    case 'DC_EVENT_LOCATION_CHANGED': // 2035
      self.emit(eventStr, data1)
      break
    case 'DC_EVENT_CONFIGURE_PROGRESS': // 2041
      if (data1 === 1000) self.emit('_configured')
      self.emit(eventStr, data1)
      break
    case 'DC_EVENT_IMEX_PROGRESS': // 2051
      self.emit(eventStr, data1)
      break
    case 'DC_EVENT_IMEX_FILE_WRITTEN': // 2052
      self.emit(eventStr, data1)
      break
    case 'DC_EVENT_SECUREJOIN_INVITER_PROGRESS': // 2060
      self.emit(eventStr, data1, data2)
      break
    case 'DC_EVENT_SECUREJOIN_JOINER_PROGRESS': // 2061
      self.emit(eventStr, data1, data2)
      break
    case 'DC_EVENT_HTTP_GET': // 2100
      handleHttpGetEvent(data1)
      break
    default:
      debug(`Unknown event ${eventStr}`)
  }
}

module.exports = DeltaChat
