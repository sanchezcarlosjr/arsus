import * as sgMail from '@sendgrid/mail';
import * as https from 'firebase-functions/lib/providers/https';

export interface EmailData {
  to: string;
  templateId: string;
  dynamic_template_data: string;
}

export const sendEmailHandler = async (body: EmailData, context: https.CallableContext) => {
  const msg = {
    to: body.to,
    from: {
      name: 'Carlos de Arsus',
      email: 'carlos@arsus.com',
    },
    templateId: body.templateId,
    dynamic_template_data: body.dynamic_template_data,
  };
  return sgMail.send(msg);
};
