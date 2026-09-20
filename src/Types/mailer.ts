export interface SendEmailEventPayload {
  email: string;
  otp?: string;
  subject?: string;
  text?: string;
  lang?: string;
}

export interface SendEmailArgs {
  email: string;
  subject?: string;
  text?: string;
  otp?: string;
  lang?: string;
  template?: string;
  order?: unknown;
}

export interface MailOptions {
  from: string;
  replyTo: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  headers: Record<string, string>;
}
