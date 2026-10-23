import { registerEnumType } from '@nestjs/graphql';

export enum Gender {
  MAN = 'MAN',
  WOMAN = 'WOMAN',
  NON_BINARY = 'NON_BINARY',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export enum Intent {
  DATING = 'DATING',
  FRIENDSHIP = 'FRIENDSHIP',
  PARTNER = 'PARTNER',
  LIKE_MINDED_FRIEND = 'LIKE_MINDED_FRIEND',
  JUST_CHAT = 'JUST_CHAT',
}

export enum MatchMode {
  INTERESTS = 'INTERESTS',
  RANDOM = 'RANDOM',
}

export enum MatchStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  ENDED = 'ENDED',
}

export enum ReportReason {
  SPAM = 'SPAM',
  HARASSMENT = 'HARASSMENT',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  FAKE_PROFILE = 'FAKE_PROFILE',
  OTHER = 'OTHER',
}

registerEnumType(Gender, { name: 'Gender' });
registerEnumType(Intent, { name: 'Intent' });
registerEnumType(MatchMode, { name: 'MatchMode' });
registerEnumType(MatchStatus, { name: 'MatchStatus' });
registerEnumType(ReportReason, { name: 'ReportReason' });
