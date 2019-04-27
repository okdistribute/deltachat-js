// Generated!

module.exports = [
    'dc_add_address_book',
    'dc_add_contact_to_chat',
    'dc_archive_chat',
    'dc_array_add_id',
    'dc_array_add_ptr',
    'dc_array_add_uint',
    'dc_array_get_accuracy',
    'dc_array_get_chat_id',
    'dc_array_get_cnt',
    'dc_array_get_contact_id',
    'dc_array_get_id',
    'dc_array_get_latitude',
    'dc_array_get_longitude',
    'dc_array_get_marker',
    'dc_array_get_msg_id',
    'dc_array_get_ptr',
    'dc_array_get_raw',
    'dc_array_get_timestamp',
    'dc_array_get_uint',
    'dc_array_is_independent',
    'dc_array_search_id',
    'dc_array_unref',
    'dc_block_contact',
    'dc_chat_empty',
    'dc_chat_get_archived',
    'dc_chat_get_color',
    'dc_chat_get_id',
    'dc_chat_get_name',
    'dc_chat_get_profile_image',
    'dc_chat_get_subtitle',
    'dc_chat_get_type',
    'dc_chat_is_self_talk',
    'dc_chat_is_sending_locations',
    'dc_chat_is_unpromoted',
    'dc_chat_is_verified',
    'dc_chat_new',
    'dc_chat_unref',
    'dc_chatlist_empty',
    'dc_chatlist_get_chat_id',
    'dc_chatlist_get_cnt',
    'dc_chatlist_get_context',
    'dc_chatlist_get_msg_id',
    'dc_chatlist_get_summary',
    'dc_chatlist_new',
    'dc_chatlist_unref',
    'dc_check_password',
    'dc_check_qr',
    'dc_close',
    'dc_configure',
    'dc_contact_empty',
    'dc_contact_get_addr',
    'dc_contact_get_color',
    'dc_contact_get_display_name',
    'dc_contact_get_first_name',
    'dc_contact_get_id',
    'dc_contact_get_name',
    'dc_contact_get_name_n_addr',
    'dc_contact_get_profile_image',
    'dc_contact_is_blocked',
    'dc_contact_is_verified',
    'dc_contact_new',
    'dc_contact_unref',
    'dc_context_new',
    'dc_context_unref',
    'dc_continue_key_transfer',
    'dc_create_chat_by_contact_id',
    'dc_create_chat_by_msg_id',
    'dc_create_contact',
    'dc_create_group_chat',
    'dc_delete_all_locations',
    'dc_delete_chat',
    'dc_delete_contact',
    'dc_delete_msgs',
    'dc_forward_msgs',
    'dc_get_blobdir',
    'dc_get_blocked_cnt',
    'dc_get_blocked_contacts',
    'dc_get_chat',
    'dc_get_chat_contacts',
    'dc_get_chat_id_by_contact_id',
    'dc_get_chat_media',
    'dc_get_chat_msgs',
    'dc_get_chatlist',
    'dc_get_config',
    'dc_get_contact',
    'dc_get_contact_encrinfo',
    'dc_get_contacts',
    'dc_get_draft',
    'dc_get_fresh_msg_cnt',
    'dc_get_fresh_msgs',
    'dc_get_info',
    'dc_get_locations',
    'dc_get_mime_headers',
    'dc_get_msg',
    'dc_get_msg_cnt',
    'dc_get_msg_info',
    'dc_get_next_media',
    'dc_get_oauth2_url',
    'dc_get_securejoin_qr',
    'dc_get_userdata',
    'dc_get_version_str',
    'dc_imex',
    'dc_imex_has_backup',
    'dc_initiate_key_transfer',
    'dc_interrupt_imap_idle',
    'dc_interrupt_mvbox_idle',
    'dc_interrupt_sentbox_idle',
    'dc_interrupt_smtp_idle',
    'dc_is_configured',
    'dc_is_contact_in_chat',
    'dc_is_open',
    'dc_is_sending_locations_to_chat',
    'dc_join_securejoin',
    'dc_lookup_contact_id_by_addr',
    'dc_lot_empty',
    'dc_lot_get_id',
    'dc_lot_get_state',
    'dc_lot_get_text1',
    'dc_lot_get_text1_meaning',
    'dc_lot_get_text2',
    'dc_lot_get_timestamp',
    'dc_lot_new',
    'dc_lot_unref',
    'dc_marknoticed_all_chats',
    'dc_marknoticed_chat',
    'dc_marknoticed_contact',
    'dc_markseen_msgs',
    'dc_may_be_valid_addr',
    'dc_maybe_network',
    'dc_msg_empty',
    'dc_msg_get_chat_id',
    'dc_msg_get_duration',
    'dc_msg_get_file',
    'dc_msg_get_filebytes',
    'dc_msg_get_filemime',
    'dc_msg_get_filename',
    'dc_msg_get_from_id',
    'dc_msg_get_height',
    'dc_msg_get_id',
    'dc_msg_get_received_timestamp',
    'dc_msg_get_setupcodebegin',
    'dc_msg_get_showpadlock',
    'dc_msg_get_sort_timestamp',
    'dc_msg_get_state',
    'dc_msg_get_summary',
    'dc_msg_get_summarytext',
    'dc_msg_get_text',
    'dc_msg_get_timestamp',
    'dc_msg_get_viewtype',
    'dc_msg_get_width',
    'dc_msg_has_location',
    'dc_msg_is_forwarded',
    'dc_msg_is_increation',
    'dc_msg_is_info',
    'dc_msg_is_sent',
    'dc_msg_is_setupmessage',
    'dc_msg_is_starred',
    'dc_msg_latefiling_mediasize',
    'dc_msg_new',
    'dc_msg_set_dimension',
    'dc_msg_set_duration',
    'dc_msg_set_file',
    'dc_msg_set_location',
    'dc_msg_set_text',
    'dc_msg_unref',
    'dc_no_compound_msgs',
    'dc_open',
    'dc_openssl_init_not_required',
    'dc_perform_imap_fetch',
    'dc_perform_imap_idle',
    'dc_perform_imap_jobs',
    'dc_perform_mvbox_fetch',
    'dc_perform_mvbox_idle',
    'dc_perform_sentbox_fetch',
    'dc_perform_sentbox_idle',
    'dc_perform_smtp_idle',
    'dc_perform_smtp_jobs',
    'dc_prepare_msg',
    'dc_remove_contact_from_chat',
    'dc_search_msgs',
    'dc_send_locations_to_chat',
    'dc_send_msg',
    'dc_send_text_msg',
    'dc_set_chat_name',
    'dc_set_chat_profile_image',
    'dc_set_config',
    'dc_set_draft',
    'dc_set_location',
    'dc_star_msgs',
    'dc_stop_ongoing_process'
]
