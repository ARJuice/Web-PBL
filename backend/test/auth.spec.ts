import * as assert from 'node:assert';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../src/modules/auth/auth.service';
import { LoginInput } from '../src/modules/auth/dto/login.input';

async function runTests() {
  console.log('🧪 Starting MATCH@SAHRDAYA AuthModule unit test suite...\n');

  // --- Test 1: College Domain Regex Validation ---
  console.log('Test 1: Sahrdaya institutional email domain validation');
  const jwtService = new JwtService({ secret: 'test-secret-key-12345678901234567890' });
  const mockPrisma: any = {
    user: {
      findUnique: async ({ where }: any) => {
        if (where.email === 'arjun@sahrdaya.ac.in') {
          return {
            id: 'uuid-arjun',
            email: 'arjun@sahrdaya.ac.in',
            profileCompleted: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            profile: {
              displayName: 'Arjun Krishna',
              year: 3,
              bio: 'CS junior tinkering with code.',
              gender: 'MAN',
              showDob: false,
              dateOfBirth: new Date('2004-05-14'),
              intent: 'DATING',
              matchMode: 'INTERESTS',
              avatarUrl: 'https://example.com/avatar.jpg',
              interests: [
                { interest: { id: 'coding', name: 'Coding', emoji: '💻', category: 'Tech' } },
              ],
            },
          };
        }
        return null;
      },
      create: async ({ data }: any) => {
        return {
          id: 'uuid-new-user',
          email: data.email,
          profileCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          profile: null,
        };
      },
    },
  };

  const authService = new AuthService(mockPrisma, jwtService);

  // Valid institutional emails
  assert.strictEqual(authService.validateCollegeDomain('arjun@sahrdaya.ac.in'), true);
  assert.strictEqual(authService.validateCollegeDomain('student.22cs@sahrdaya.ac.in'), true);
  assert.strictEqual(authService.validateCollegeDomain('FACULTY@SAHRDAYA.AC.IN'), true);

  // Invalid external emails
  assert.strictEqual(authService.validateCollegeDomain('test@gmail.com'), false);
  assert.strictEqual(authService.validateCollegeDomain('hacker@yahoo.com'), false);
  assert.strictEqual(authService.validateCollegeDomain('spoof@sahrdaya.ac.in.attacker.com'), false);
  assert.strictEqual(authService.validateCollegeDomain('invalid-format'), false);
  console.log('  ✅ Institutional domain validation passed (accepts @sahrdaya.ac.in, rejects all others)');

  // --- Test 2: LoginInput class-validator DTO ---
  console.log('Test 2: LoginInput class-validator DTO constraints');
  const validDto = plainToInstance(LoginInput, { email: 'maya@sahrdaya.ac.in' });
  const validErrors = await validate(validDto);
  assert.strictEqual(validErrors.length, 0, 'Valid email should pass validation');

  const invalidDto = plainToInstance(LoginInput, { email: 'maya@gmail.com' });
  const invalidErrors = await validate(invalidDto);
  assert.strictEqual(invalidErrors.length > 0, true, 'Non-college email should fail validation');

  const malformedDto = plainToInstance(LoginInput, { email: 'not-an-email' });
  const malformedErrors = await validate(malformedDto);
  assert.strictEqual(malformedErrors.length > 0, true, 'Malformed email should fail validation');
  console.log('  ✅ LoginInput DTO validation rules passed');

  // --- Test 3: Existing User Login & JWT Issuance ---
  console.log('Test 3: Existing student authentication flow');
  const loginResult = await authService.login({ email: 'arjun@sahrdaya.ac.in' });
  assert.ok(loginResult.accessToken, 'Access token must be generated');
  assert.strictEqual(loginResult.user.id, 'uuid-arjun');
  assert.strictEqual(loginResult.user.email, 'arjun@sahrdaya.ac.in');
  assert.strictEqual(loginResult.user.profileCompleted, true);
  assert.strictEqual(loginResult.user.profile?.displayName, 'Arjun Krishna');
  assert.strictEqual(loginResult.user.profile?.interests.length, 1);
  assert.strictEqual(loginResult.user.profile?.interests[0].id, 'coding');

  // Verify JWT payload
  const decoded: any = jwtService.verify(loginResult.accessToken);
  assert.strictEqual(decoded.sub, 'uuid-arjun');
  assert.strictEqual(decoded.email, 'arjun@sahrdaya.ac.in');
  console.log('  ✅ Existing student login verified with signed JWT');

  // --- Test 4: New Student Auto-Registration ---
  console.log('Test 4: First-time student onboarding registration');
  const newLoginResult = await authService.login({ email: 'newstudent@sahrdaya.ac.in' });
  assert.ok(newLoginResult.accessToken);
  assert.strictEqual(newLoginResult.user.id, 'uuid-new-user');
  assert.strictEqual(newLoginResult.user.email, 'newstudent@sahrdaya.ac.in');
  assert.strictEqual(newLoginResult.user.profileCompleted, false);
  console.log('  ✅ First-time student registration flow verified');

  // --- Test 5: Rejection of Unauthorized Domains ---
  console.log('Test 5: Unauthorized domain rejection');
  await assert.rejects(
    async () => {
      await authService.login({ email: 'outsider@gmail.com' });
    },
    (err: any) => {
      return err.message.includes('Authentication restricted to Sahrdaya institutional emails');
    },
  );
  console.log('  ✅ Non-institutional email login cleanly rejected');

  console.log('\n🎉 ALL 5 AUTH & DOMAIN VALIDATION TESTS PASSED SUCCESSFULLY!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
