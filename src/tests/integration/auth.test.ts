import { describe, it, expect } from 'vitest';
import { createTestClient, generateTestData } from '../utils/testSetup';

describe('Authentication and Authorization Tests', () => {
  const supabase = createTestClient();

  it('should handle user registration and login', async () => {
    const testData = generateTestData();
    
    // Test registration
    const { data: { user }, error: signUpError } = await supabase.auth.signUp(testData.user);
    expect(signUpError).toBeNull();
    expect(user).toBeDefined();

    // Test login
    const { data: { user: loggedInUser }, error: signInError } = await supabase.auth.signInWithPassword({
      email: testData.user.email,
      password: testData.user.password,
    });
    
    expect(signInError).toBeNull();
    expect(loggedInUser).toBeDefined();

    // Cleanup
    if (user?.id) {
      await supabase.auth.admin.deleteUser(user.id);
    }
  });

  it('should enforce role-based access control', async () => {
    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'admin')
      .single();

    expect(adminError?.message).toContain('permission denied');

    const { data: publicData, error: publicError } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    expect(publicError).toBeNull();
    expect(publicData).toBeDefined();
  });
});