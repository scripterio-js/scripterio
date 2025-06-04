/* eslint-disable space-before-function-paren */
/* eslint-disable no-control-regex */
const stripAnsi = (str) => str.replace(/(\x1b|\u001b)\[\d+(?:;\d+)*m/g, '')

export const template = ({ numTests, numPassed, numFailed, results }) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Test Results</title>
  <style>
    body { 
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.5;
      padding: 2rem;
      margin: 0;
      background: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
    .header-controls {
      display: flex; 
      gap: 1rem;
      align-items: center;
    }
    .summary {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .stat {
      padding: 1rem;
      border-radius: 6px;
      min-width: 120px;
    }
    .stat.total { background: #e3f2fd; }
    .stat.passed { background: #e8f5e9; }
    .stat.failed { background: #ffebee; }
    .stat h3 { margin: 0; }
    .stat p { margin: 0.5rem 0 0; font-size: 1.5rem; font-weight: bold; }
    .file-group {
      margin-bottom: 2rem;
      border: 1px solid #eee;
      border-radius: 6px;
    }
    .file-header {
      padding: 1rem 1.5rem;
      background: #f8f9fa;
      font-weight: 600;
      font-size: 1rem;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .file-header:hover {
      background: #f3f4f6;
    }
    .file-content {
      display: block;
    }
    .file-content.hide {
      display: none;
    }
    .test-case {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #eee;
    }
    .test-case:last-child {
      border-bottom: none;
    }
    .test-name {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .test-name.passed::before {
      content: '✓';
      color: #4caf50;
    }
    .test-name.failed::before {
      content: '✗';
      color: #f44336;
    }
    .error-details {
      margin-top: 1rem;
      padding: 1rem;
      background: #fff8f8;
      border-radius: 4px;
      display: none;
    }
    .error-details.show {
      display: block;
    }
    .toggle-error {
      color: #f44336;
      text-decoration: underline;
      cursor: pointer;
      margin-top: 0.5rem;
      display: inline-block;
    }
    pre {
      margin: 0.5rem 0;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 4px;
      overflow-x: auto;
    }
    .describe-group {
      margin: 0.5rem 0;
      padding: 0 1rem;
    }
    .describe-header {
      padding: 0.75rem 1rem;
      background: #f3f4f6;
      margin: 0.5rem 0;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
    }
    .describe-content {
      display: block;
      padding: 0.5rem 0;
    }
    .describe-content.hide {
      display: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Test Results</h1>
      <div class="header-controls">
        <div>${new Date().toLocaleString()}</div>
      </div>
    </div>
    
    <div class="summary">
      <div class="stat total">
        <h3>Total Tests</h3>
        <p>${numTests}</p>
      </div>
      <div class="stat passed">
        <h3>Passed</h3>
        <p>${numPassed}</p>
      </div>
      <div class="stat failed">
        <h3>Failed</h3>
        <p>${numFailed}</p>
      </div>
    </div>

    <div class="results">
      ${Object.entries(groupByFile(results))
        .map(
          ([file, tests]) => `
        <div class="file-group">
          <div class="file-header" onclick="toggleFileContent(this)">
            ${file}
            <span class="toggle-indicator">▼</span>
          </div>
          <div class="file-content">
            ${renderDescribeGroup(groupByDescribe(tests))}
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  </div>

  <script>
    function toggleFileContent(element) {
      const content = element.nextElementSibling;
      const indicator = element.querySelector('.toggle-indicator');
      content.classList.toggle('hide');
      indicator.textContent = content.classList.contains('hide') ? '▶' : '▼';
    }

    function toggleDescribeContent(element) {
      const content = element.nextElementSibling;
      content.classList.toggle('hide');
    }

    function toggleError(element) {
      const details = element.nextElementSibling;
      const isShowing = details.classList.contains('show');
      details.classList.toggle('show');
      element.textContent = isShowing ? 'Show error details' : 'Hide error details';
    }

    document.addEventListener('DOMContentLoaded', () => {
      // All groups are shown by default now, no need to manually show them
      const failedTests = document.querySelectorAll('.test-name.failed');
      failedTests.forEach(test => {
        // Remove the auto-opening logic since everything is open by default
      });
    });
  </script>
</body>
</html>
`

  function renderDescribeGroup(group, level = 0) {
    const padding = level * 20

    return Object.entries(group)
      .map(([describeName, content]) => {
        if (describeName === '_tests') {
          return content
            .map(
              (test) => `
            <div class="test-case" style="padding-left: ${padding}px">
              <div class="test-name ${
                test.errors.length ? 'failed' : 'passed'
              }">
                ${test.name}
              </div>
              ${
                test.errors.length
                  ? `
                <a class="toggle-error" onclick="toggleError(this)">Show error details</a>
                <div class="error-details">
                  ${test.errors
                    .map(
                      (error) => `
                    <div class="error">
                      <pre>${stripAnsi(error.message)}</pre>
                      <pre>${stripAnsi(error.stack)}</pre>
                    </div>
                  `
                    )
                    .join('')}
                </div>
              `
                  : ''
              }
            </div>
          `
            )
            .join('')
        }

        return `
          <div class="describe-group" style="padding-left: ${padding}px">
            <div class="describe-header" onclick="toggleDescribeContent(this)">${describeName}</div>
            <div class="describe-content">
              ${renderDescribeGroup(content, level + 1)}
            </div>
          </div>
        `
      })
      .join('')
  }

  function groupByFile(results) {
    return results.reduce((acc, result) => {
      const filePath = result.describeStack[0]?.fileName || 'Unknown file'
      if (!acc[filePath]) {
        acc[filePath] = []
      }
      acc[filePath].push(result)
      return acc
    }, {})
  }

  function groupByDescribe(tests) {
    return tests.reduce((acc, test) => {
      let currentLevel = acc

      if (!test.describeStack || test.describeStack.length === 0) {
        if (!currentLevel._tests) currentLevel._tests = []
        currentLevel._tests.push(test)
        return acc
      }

      for (const describe of test.describeStack) {
        const describeName = describe.name
        if (!currentLevel[describeName]) {
          currentLevel[describeName] = {}
        }
        currentLevel = currentLevel[describeName]
      }

      if (!currentLevel._tests) currentLevel._tests = []
      currentLevel._tests.push(test)

      return acc
    }, {})
  }
}
