import { UseGuards, applyDecorators } from '@nestjs/common';
import { TurnstileGuard } from './turnstile.guard';

export function UseTurnstile() {
  return applyDecorators(UseGuards(TurnstileGuard));
}
