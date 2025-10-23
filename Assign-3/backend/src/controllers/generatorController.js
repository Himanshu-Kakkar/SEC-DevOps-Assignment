const simpleGit = require('simple-git');
const { execa } = require('execa');
const fs = require('fs');
const path = require('path');
const { ChatOpenAI } = require('@langchain/openai');
const Build = require('../models/Build');

const handleGenerateRequest = async (req, res) => {
  let localPath = null;
  console.log('Generating Dockerfile...');
  console.log('Request body:', req.body);
  try {
    // Get request data
    const { repoUrl, pat } = req.body;
    
    if (!repoUrl || !pat) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Repository URL and Personal Access Token are required' 
      });
    }

    // Step A: Clone Repo
    localPath = path.join(__dirname, '..', '..', 'temp-clones', Date.now().toString());
    const cloneUrl = repoUrl.replace('https://', `https://${pat}@`);
    
    console.log('Cloning repository...');
    await simpleGit().clone(cloneUrl, localPath);
    console.log('Repository cloned successfully');

    // Step B: Analyze Repo
    const pkgJsonPath = path.join(localPath, 'package.json');
    
    if (!fs.existsSync(pkgJsonPath)) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'No package.json found in repository' 
      });
    }

    const pkgJsonContent = fs.readFileSync(pkgJsonPath, 'utf8');
    const pkgJson = JSON.parse(pkgJsonContent);

    // Check for framework files
    const frameworkFiles = [
      'next.config.js', 'next.config.ts', 'next.config.mjs',
      'vue.config.js', 'vue.config.ts',
      'nuxt.config.js', 'nuxt.config.ts',
      'angular.json', 'angular-cli.json',
      'svelte.config.js', 'svelte.config.ts',
      'vite.config.js', 'vite.config.ts',
      'webpack.config.js', 'webpack.config.ts'
    ];

    let detectedFramework = 'Node.js';
    for (const file of frameworkFiles) {
      if (fs.existsSync(path.join(localPath, file))) {
        if (file.includes('next')) detectedFramework = 'Next.js';
        else if (file.includes('vue')) detectedFramework = 'Vue.js';
        else if (file.includes('nuxt')) detectedFramework = 'Nuxt.js';
        else if (file.includes('angular')) detectedFramework = 'Angular';
        else if (file.includes('svelte')) detectedFramework = 'Svelte';
        else if (file.includes('vite')) detectedFramework = 'Vite';
        else if (file.includes('webpack')) detectedFramework = 'Webpack';
        break;
      }
    }

    // Create tech summary
    const techSummary = `This is a ${detectedFramework} project. The package manager is ${pkgJson.packageManager || 'npm'}. The start script is '${pkgJson.scripts?.start || 'npm start'}'. Node version: ${pkgJson.engines?.node || 'latest'}.`;

    // Step C: Generate Dockerfile (AI)
    console.log('Generating Dockerfile with AI...');
    const model = new ChatOpenAI({ 
      model: 'gpt-4o', 
      openAIApiKey: process.env.OPENAI_API_KEY 
    });

    const prompt = `You are a Dockerfile expert. Based on this tech summary: ${techSummary} and this package.json: ${pkgJsonContent}, generate a production-ready, multi-stage Dockerfile. 

Requirements:
- Use multi-stage builds for optimization
- Include proper security practices
- Use appropriate base images
- Optimize for production deployment
- Include health checks if applicable
- Use non-root user for security
- Minimize image size

Only output the Dockerfile text itself, nothing else.`;

    const response = await model.invoke(prompt);
    const dockerfileContent = response.content;

    // Step D: Save & Build Dockerfile
    console.log('Saving and building Dockerfile...');
    fs.writeFileSync(path.join(localPath, 'Dockerfile'), dockerfileContent);

    // Try to build the Docker image
    try {
      const { stdout, stderr } = await execa('docker', ['build', '-t', 'dockgen-test-build', '.'], { 
        cwd: localPath 
      });
      
      console.log('Docker build successful');
      console.log('Build output:', stdout);
      
      if (stderr && !stderr.includes('warning')) {
        console.warn('Build warnings:', stderr);
      }
    } catch (buildError) {
      console.error('Docker build failed:', buildError.stderr);
      return res.status(400).json({ 
        status: 'error', 
        message: 'Docker build failed', 
        logs: buildError.stderr 
      });
    }

    // Step E: Save successful build to database (if connected)
    try {
      await Build.create({ 
        repoUrl, 
        status: 'success', 
        dockerfile: dockerfileContent 
      });
      console.log('Build record saved to database');
    } catch (dbError) {
      console.warn('Failed to save to database:', dbError.message);
      // Continue without database save
    }

    // Step F: Send Response
    res.status(200).json({ 
      status: 'success', 
      dockerfile: dockerfileContent 
    });

  } catch (error) {
    console.error('Error in handleGenerateRequest:', error);
    
    // Save failed build to database (if connected)
    try {
      await Build.create({ 
        repoUrl, 
        status: 'failed', 
        buildLogs: error.stderr || error.message 
      });
      console.log('Failed build record saved to database');
    } catch (dbError) {
      console.warn('Failed to save failed build to database:', dbError.message);
      // Continue without database save
    }
    
    // Handle specific error types
    if (error.stderr) {
      res.status(400).json({ 
        status: 'error', 
        message: 'Docker build failed', 
        logs: error.stderr 
      });
    } else {
      res.status(500).json({ 
        status: 'error', 
        message: error.message 
      });
    }
  } finally {
    // Cleanup: Remove temp folder
    if (localPath && fs.existsSync(localPath)) {
      try {
        fs.rmSync(localPath, { recursive: true, force: true });
        console.log('Cleaned up temp directory');
      } catch (cleanupError) {
        console.error('Failed to cleanup temp directory:', cleanupError);
      }
    }
  }
};

module.exports = {
  handleGenerateRequest
};