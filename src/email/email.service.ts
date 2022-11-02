import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { User } from 'src/user/entities/user.entity'
import { UserService } from 'src/user/user.service'

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private userService: UserService,
  ) {}

  async sendRegisterConfirmation(user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to CSIM! Confirm your Email',
      template: './emailConfirmation',
      context: {
        name: this.userService.getFullName(user),
        code: user.emailCode,
      },
    })
  }
}
