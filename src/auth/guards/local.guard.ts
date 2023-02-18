import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyType } from '../strategies/strategyTypes.enum';

@Injectable()
export class LocalAuthGuard extends AuthGuard(StrategyType.LOCAL) { }
