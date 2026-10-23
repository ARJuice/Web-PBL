import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { ReportReason } from '../../../common/enums';

@InputType()
export class ReportUserInput {
  @Field(() => ID)
  @IsUUID('all', { message: 'Invalid target user ID' })
  targetUserId!: string;

  @Field(() => ReportReason)
  @IsEnum(ReportReason, { message: 'Valid report reason must be provided' })
  reason!: ReportReason;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(500, { message: 'Report note cannot exceed 500 characters' })
  note?: string;
}
