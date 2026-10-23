import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, Matches } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: 'Must provide a valid email address.' })
  @Matches(/^[a-zA-Z0-9._%+-]+@sahrdaya\.ac\.in$/, {
    message: 'Authentication restricted to Sahrdaya institutional emails (@sahrdaya.ac.in).',
  })
  email!: string;
}
