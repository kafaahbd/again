export interface ChatUser {
  id: string; // Other user's ID
  conversation_id: string;
  name: string;
  username: string;
  profile_color: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  status: 'sent' | 'delivered' | 'seen';
  created_at: string;
}
