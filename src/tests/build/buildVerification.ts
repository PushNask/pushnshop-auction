import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface BuildConfig {
  environment: 'development' | 'staging' | 'production';
  requiredEnvVars: string[];
  requiredDependencies: string[];
  outputDir: string;
  staticAssets: string[];
}

class BuildVerification {
  private config: BuildConfig;
  private errors: string[] = [];
  private warnings: string[] = [];

  constructor(config: BuildConfig) {
    this.config = config;
  }

  async verifyBuild(): Promise<boolean> {
    try {
      console.log('Starting build verification...');
      
      this.checkEnvironmentVariables();
      this.checkDependencies();
      this.verifyTypeScriptCompilation();
      this.runBuild();
      this.verifyBuildOutput();
      this.verifyStaticAssets();
      this.generateBuildReport();

      return this.errors.length === 0;
    } catch (error) {
      this.errors.push(`Build verification failed: ${error.message}`);
      return false;
    }
  }

  private checkEnvironmentVariables(): void {
    console.log('Checking environment variables...');
    
    this.config.requiredEnvVars.forEach(envVar => {
      if (!process.env[envVar]) {
        this.errors.push(`Missing required environment variable: ${envVar}`);
      }
    });
  }

  private checkDependencies(): void {
    console.log('Verifying dependencies...');
    
    try {
      execSync('npm list --json', { stdio: 'pipe' });
    } catch (error) {
      const missingDeps = error.message.match(/missing: (.*?)\n/g);
      if (missingDeps) {
        missingDeps.forEach(dep => {
          this.errors.push(`Missing dependency: ${dep.replace('missing: ', '').trim()}`);
        });
      }
    }
  }

  private verifyTypeScriptCompilation(): void {
    console.log('Verifying TypeScript compilation...');
    
    try {
      execSync('tsc --noEmit', { stdio: 'pipe' });
    } catch (error) {
      this.errors.push('TypeScript compilation failed');
      this.errors.push(error.message);
    }
  }

  private runBuild(): void {
    console.log('Running build process...');
    
    try {
      execSync(`npm run build:${this.config.environment}`, { stdio: 'pipe' });
    } catch (error) {
      this.errors.push(`Build failed: ${error.message}`);
    }
  }

  private verifyBuildOutput(): void {
    console.log('Verifying build output...');
    
    if (!fs.existsSync(this.config.outputDir)) {
      this.errors.push(`Build output directory not found: ${this.config.outputDir}`);
      return;
    }

    const requiredFiles = ['index.html'];
    requiredFiles.forEach(file => {
      if (!fs.existsSync(path.join(this.config.outputDir, file))) {
        this.errors.push(`Required build output file missing: ${file}`);
      }
    });
  }

  private verifyStaticAssets(): void {
    console.log('Checking static assets...');
    
    this.config.staticAssets.forEach(asset => {
      const assetPath = path.join(this.config.outputDir, asset);
      if (!fs.existsSync(assetPath)) {
        this.warnings.push(`Static asset directory not found: ${asset}`);
      }
    });
  }

  private generateBuildReport(): void {
    const report = {
      timestamp: new Date().toISOString(),
      environment: this.config.environment,
      success: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
    };

    if (!fs.existsSync(this.config.outputDir)) {
      fs.mkdirSync(this.config.outputDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(this.config.outputDir, 'build-report.json'),
      JSON.stringify(report, null, 2)
    );
  }
}

async function runBuildTests() {
  const buildConfig: BuildConfig = {
    environment: (process.env.NODE_ENV as 'development' | 'staging' | 'production') || 'development',
    requiredEnvVars: [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ],
    requiredDependencies: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'tailwindcss'
    ],
    outputDir: './dist',
    staticAssets: [
      'assets/images',
      'assets/css'
    ]
  };

  const buildVerification = new BuildVerification(buildConfig);
  const success = await buildVerification.verifyBuild();

  if (!success) {
    process.exit(1);
  }
}

export { BuildVerification, runBuildTests };