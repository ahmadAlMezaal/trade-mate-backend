import { Test, TestingModule } from '@nestjs/testing';
import { OauthResolver } from './oauth.resolver';
import { OauthService } from './oauth.service';

describe('OauthResolver', () => {
  let resolver: OauthResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OauthResolver, OauthService],
    }).compile();

    resolver = module.get<OauthResolver>(OauthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
