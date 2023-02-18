
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyType } from '../strategies/strategyTypes.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard(StrategyType.JWT) { }