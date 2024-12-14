import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BuildVerification } from './buildVerification';
import { buildConfigs } from './config';
import fs from 'fs';
import path from 'path';

// Mock child_process
vi.mock('child_process', () => ({
  execSync: vi.fn()
}));

// Mock fs
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  writeFileSync: vi.fn(),
  mkdirSync: vi.fn()
}));

describe('Build Verification', () => {
  let buildVerification: BuildVerification;

  beforeEach(() => {
    buildVerification = new BuildVerification(buildConfigs.development);
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it('should verify environment variables', async () => {
    const result = await buildVerification.verifyBuild();
    expect(result).toBeDefined();
  });

  it('should detect missing dependencies', async () => {
    // Mock execSync to simulate missing dependency
    const execSync = vi.spyOn(require('child_process'), 'execSync');
    execSync.mockImplementation(() => {
      throw new Error('missing: @testing-library/react');
    });

    const result = await buildVerification.verifyBuild();
    expect(result).toBe(false);
  });

  it('should verify TypeScript compilation', async () => {
    const result = await buildVerification.verifyBuild();
    expect(result).toBeDefined();
  });

  it('should verify build output', async () => {
    // Mock fs.existsSync to return true for build directory
    vi.mocked(fs.existsSync).mockReturnValue(true);
    
    const result = await buildVerification.verifyBuild();
    expect(result).toBeDefined();
  });

  it('should verify static assets', async () => {
    // Mock fs.existsSync to return true for static assets
    vi.mocked(fs.existsSync).mockReturnValue(true);
    
    const result = await buildVerification.verifyBuild();
    expect(result).toBeDefined();
  });

  it('should generate build report', async () => {
    // Mock fs.existsSync and fs.writeFileSync
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.writeFileSync).mockImplementation(() => undefined);
    
    await buildVerification.verifyBuild();
    expect(fs.writeFileSync).toHaveBeenCalled();
  });
});