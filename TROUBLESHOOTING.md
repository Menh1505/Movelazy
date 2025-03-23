# Movelazy Troubleshooting Guide

## Common Issues and Solutions

### 1. Installation Issues

#### Extension Not Loading
**Symptoms:**
- Extension icon not appearing in VS Code
- Commands not available in command palette
- Error messages in VS Code output panel

**Solutions:**
1. Verify VS Code version compatibility:
   ```json
   {
     "engines": {
       "vscode": "^1.93.0"
     }
   }
   ```

2. Reinstall the extension:
   ```bash
   # Remove existing installation
   code --uninstall-extension movelazy-extension
   # Install fresh copy
   code --install-extension movelazy-extension
   ```

3. Check extension logs:
   - Open VS Code Output panel (View → Output)
   - Select "Movelazy" from dropdown
   - Look for error messages

### 2. Project Setup Issues

#### Project Initialization Fails
**Symptoms:**
- Error during project creation
- Missing dependencies
- Invalid project structure

**Solutions:**
1. Verify workspace permissions:
   ```bash
   # Check directory permissions
   ls -la
   # Ensure write permissions
   chmod -R 755 .
   ```

2. Clean and retry:
   ```bash
   # Remove existing project files
   rm -rf .movelazy/
   # Reinitialize project
   movelazy init-aptos-project
   ```

3. Check network connectivity:
   ```bash
   # Test network connection
   ping github.com
   # Verify npm registry
   npm config get registry
   ```

### 3. Compilation Issues

#### Move Contract Compilation Errors
**Symptoms:**
- Syntax errors
- Type errors
- Dependency errors

**Solutions:**
1. Check Move.toml configuration:
   ```toml
   [package]
   name = "my_project"
   version = "0.1.0"
   [dependencies]
   AptosFramework = { git = "https://github.com/aptos-labs/aptos-core.git", subdir = "aptos-move/framework/aptos-framework/", rev = "main" }
   ```

2. Verify source files:
   ```move
   // Check module declaration
   module my_project::my_module {
       // Verify imports
       use aptos_framework::account;
       use aptos_framework::coin;
   }
   ```

3. Run diagnostic tools:
   ```bash
   # Check for common issues
   movelazy diagnose
   # Verify dependencies
   movelazy check-deps
   ```

### 4. Deployment Issues

#### Contract Deployment Fails
**Symptoms:**
- Transaction failures
- Gas estimation errors
- Network connectivity issues

**Solutions:**
1. Check account balance:
   ```bash
   # Verify account balance
   movelazy balance
   # Request test tokens if needed
   movelazy faucet
   ```

2. Verify network configuration:
   ```bash
   # Check current network
   movelazy network
   # Switch network if needed
   movelazy select-network proto
   ```

3. Check transaction status:
   ```bash
   # View transaction details
   movelazy tx-status <tx_hash>
   # Check transaction logs
   movelazy tx-logs <tx_hash>
   ```

### 5. AI Feature Issues

#### AI Commands Not Working
**Symptoms:**
- Command generation fails
- Context errors
- API connection issues

**Solutions:**
1. Verify API configuration:
   ```json
   {
     "movelazy.ai": {
       "apiKey": "your-api-key",
       "model": "gpt-4",
       "temperature": 0.7
     }
   }
   ```

2. Check network connectivity:
   ```bash
   # Test API connection
   movelazy test-ai-connection
   # Reset AI service
   movelazy reset-ai
   ```

3. Clear AI cache:
   ```bash
   # Clear conversation history
   movelazy clear-ai-history
   # Reset AI context
   movelazy reset-ai-context
   ```

### 6. Performance Issues

#### Slow Response Times
**Symptoms:**
- Delayed command execution
- UI lag
- High resource usage

**Solutions:**
1. Check system resources:
   ```bash
   # Monitor CPU usage
   top
   # Check memory usage
   free -m
   # Monitor disk space
   df -h
   ```

2. Optimize VS Code settings:
   ```json
   {
     "movelazy.performance": {
       "cacheSize": 1000,
       "maxConcurrentOperations": 3,
       "enableCaching": true
     }
   }
   ```

3. Clear extension cache:
   ```bash
   # Clear command cache
   movelazy clear-cache
   # Reset extension state
   movelazy reset-state
   ```

### 7. Network Issues

#### Connection Problems
**Symptoms:**
- Network timeouts
- Failed API calls
- Sync issues

**Solutions:**
1. Check network configuration:
   ```bash
   # Verify network settings
   movelazy network-config
   # Test network connection
   movelazy test-network
   ```

2. Configure proxy if needed:
   ```json
   {
     "movelazy.network": {
       "proxy": "http://proxy:port",
       "timeout": 30000
     }
   }
   ```

3. Reset network state:
   ```bash
   # Clear network cache
   movelazy clear-network-cache
   # Reset network connections
   movelazy reset-network
   ```

## Getting Additional Help

### 1. Log Collection
```bash
# Collect diagnostic information
movelazy collect-logs

# Generate system report
movelazy system-report
```

### 2. Support Channels
- GitHub Issues: [Movelazy Issues](https://github.com/movelazy/issues)
- Discord Community: [Movelazy Discord](https://discord.gg/movelazy)
- Documentation: [Movelazy Docs](https://docs.movelazy.dev)

### 3. Debug Mode
```bash
# Enable debug logging
movelazy debug-mode

# View debug logs
movelazy view-debug-logs
```

## Best Practices for Troubleshooting

1. **Systematic Approach**
   - Start with basic checks
   - Document error messages
   - Follow troubleshooting steps in order
   - Keep track of attempted solutions

2. **Information Collection**
   - Gather system information
   - Collect error logs
   - Document reproduction steps
   - Note environment details

3. **Prevention**
   - Regular maintenance
   - Keep dependencies updated
   - Monitor system resources
   - Follow best practices 