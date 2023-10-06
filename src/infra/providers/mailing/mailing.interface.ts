export type MailingInput = {
  to: string;
  subject: string;
  body: string;
};

export interface MailingProvider {
  sendMail(props: MailingInput): Promise<void>;
}
