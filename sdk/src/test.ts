import { createZKPassClient } from './index';

async function testSDK() {
  // Initialize the client with your backend URL
  const client = createZKPassClient({
    baseURL: 'http://localhost:3001/api', // Update this with your actual backend URL
  });

  try {
    console.log('🧪 Starting SDK Tests...\n');

    // Test 1: Register a new user
    console.log('📝 Test 1: Register a new user');
    const testUID = `test_user_${Date.now()}`; // Generate unique UID
    const registerResponse = await client.register(testUID);
    console.log('✅ Register Response:', registerResponse);
    console.log('✅ Recovery Phrase:', registerResponse.recoveryPhrase);
    console.log('✅ Test 1 Passed\n');

    // Test 2: Login with the registered user
    console.log('🔑 Test 2: Login with registered user');
    const loginResponse = await client.login(testUID);
    console.log('✅ Login Response:', loginResponse);
    console.log('✅ Test 2 Passed\n');

    // Test 3: Verify recovery phrase
    console.log('🔐 Test 3: Verify recovery phrase');
    const verifyResponse = await client.verifyRecovery(registerResponse.recoveryPhrase);
    console.log('✅ Verify Response:', verifyResponse);
    console.log('✅ Test 3 Passed\n');

    // Test 4: Try to register with same UID (should fail)
    console.log('❌ Test 4: Try to register with existing UID');
    try {
      await client.register(testUID);
      console.log('❌ Test 4 Failed: Should have thrown an error');
    } catch (error: any) {
      console.log('✅ Test 4 Passed: Got expected error:', error.response?.data?.message || error.message);
    }
    console.log();

    // Test 5: Try to login with non-existent UID (should fail)
    console.log('❌ Test 5: Try to login with non-existent UID');
    try {
      await client.login('non_existent_user');
      console.log('❌ Test 5 Failed: Should have thrown an error');
    } catch (error: any) {
      console.log('✅ Test 5 Passed: Got expected error:', error.response?.data?.message || error.message);
    }
    console.log();

    // Test 6: Try to verify invalid recovery phrase (should fail)
    console.log('❌ Test 6: Try to verify invalid recovery phrase');
    try {
      await client.verifyRecovery('invalid recovery phrase');
      console.log('❌ Test 6 Failed: Should have thrown an error');
    } catch (error: any) {
      console.log('✅ Test 6 Passed: Got expected error:', error.response?.data?.message || error.message);
    }
    console.log();

    console.log('🎉 All tests completed!');

  } catch (error: any) {
    console.error('❌ Test failed with error:', error.response?.data?.message || error.message);
    process.exit(1);
  }
}

// Run the tests
testSDK().catch(console.error); 