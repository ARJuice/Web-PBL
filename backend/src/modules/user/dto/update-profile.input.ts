import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  MaxLength,
} from 'class-validator';
import { Gender, Intent, MatchMode } from '../../../common/enums';

@InputType()
export class UpdateProfileInput {
  @Field()
  @IsNotEmpty({ message: 'Display name cannot be blank' })
  @MaxLength(100)
  displayName!: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(5)
  year!: number;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(500)
  bio?: string;

  @Field(() => Gender)
  @IsEnum(Gender)
  gender!: Gender;

  @Field()
  @IsBoolean()
  showDob!: boolean;

  @Field({ nullable: true })
  @IsOptional()
  dateOfBirth?: string;

  @Field(() => Intent)
  @IsEnum(Intent)
  intent!: Intent;

  @Field(() => MatchMode)
  @IsEnum(MatchMode)
  matchMode!: MatchMode;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty({ message: 'Select at least one campus interest' })
  interestIds!: string[];

  @Field({ nullable: true })
  @IsOptional()
  avatarUrl?: string;
}
