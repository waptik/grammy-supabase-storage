import { Bot, Context, session, SessionFlavor } from 'grammy';
export interface SessionData {
  pizzaCount: number;
}

export type MyContext = Context & SessionFlavor<SessionData>;

export function createBot(token = 'fake-token') {
  return new Bot<MyContext>(token, { 
    botInfo: {
      id: 42,
      first_name: 'Test Bot',
      is_bot: true,
      username: 'bot',
      can_join_groups: true,
      can_read_all_group_messages: true,
      supports_inline_queries: false,
    },
  });
}