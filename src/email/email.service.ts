import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { User } from 'src/user/methods/user.methods'
import { SentMessageInfo } from 'nodemailer'

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendRegisterConfirmation(user: User): Promise<SentMessageInfo> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Bienvenue sur CSIM! Confirmer votre email ici',
      template: './emailConfirmation',
      context: {
        name: user.getFullName(),
        code: user.emailCode,
      },
    })
  }

  async sendForgotPasswordCode(user: User): Promise<SentMessageInfo> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Les instructions pour changer votre mot de passe CSIM',
      template: './resetPassword',
      context: {
        name: user.getFullName(),
        code: user.emailCode,
      },
    })
  }
}
