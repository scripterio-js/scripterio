/* eslint-disable space-before-function-paren */
/* eslint-disable no-control-regex */
const stripAnsi = (str) => str.replace(/(\x1b|\u001b)\[\d+(?:;\d+)*m/g, '')

const escapeHtml = (str) => {
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return String(str).replace(/[&<>"']/g, (char) => htmlEntities[char])
}

const formatJson = (data) => {
  try {
    return escapeHtml(JSON.stringify(data, null, 2))
  } catch (e) {
    return 'Unable to format data'
  }
}

export const template = ({
  numTests,
  numPassed,
  numFailed,
  numTodo,
  results,
}) => {
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
      
    .test-name.todo::before {
      content: '◦';
      color: #ff9800;
    }
    .test-name.todo {
      color: #ff9800;
      font-style: italic;
    }

    .stat.todo { background: #fff3e0; }
    .stat.todo h3, .stat.todo p { color: #ff9800; }
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
    .api-details {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
      display: none;
    }
    .api-details.show {
      display: block;
    }
    .toggle-api {
      color: #2196f3;
      text-decoration: underline;
      cursor: pointer;
      margin-top: 0.5rem;
      display: inline-block;
      margin-left: 1rem;
    }
    .api-section {
      margin: 1rem 0;
      padding: 1rem;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }
    .api-section h4 {
      margin: 0 0 0.5rem 0;
      color: #555;
    }
    .api-table {
      width: 100%;
      border-collapse: collapse;
      margin: 0.5rem 0;
    }
    .api-table th, .api-table td {
      text-align: left;
      padding: 0.5rem;
      border: 1px solid #e0e0e0;
    }
    .api-table th {
      background: #f3f4f6;
      font-weight: 600;
    }
    pre.api-data {
      margin: 0.5rem 0;
      padding: 0.5rem;
      background: #f5f5f5;
      border-radius: 4px;
      max-height: 200px;
      overflow-y: auto;
      white-space: pre-wrap;
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
      <div class="stat todo">
        <h3>Todo</h3>
        <p>${numTodo}</p>
      </div>
    </div>

    <div class="results">
        ${renderDescribeGroup(groupByDescribe(results))}
    </div>
  </div>

  <script>
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

    function toggleApiDetails(element) {
      const details = element.nextElementSibling;
      const isShowing = details.classList.contains('show');
      details.classList.toggle('show');
      element.textContent = isShowing ? 'Show API details' : 'Hide API details';
    }

    document.addEventListener('DOMContentLoaded', () => {
      const failedTests = document.querySelectorAll('.test-name.failed');
      failedTests.forEach(test => {
      });
    });
  </script>
</body>
</html>
`

  function renderApiDetails(apiDetails) {
    if (!apiDetails || apiDetails.length === 0) return ''

    return `
      <a class="toggle-api" onclick="toggleApiDetails(this)">Show API details</a>
      <div class="api-details">
        ${apiDetails
          .map(
            (api, index) => `
          <div class="api-section">
            <h4>API Call ${index + 1}</h4>
            <div class="request-details">
              <h4>Request</h4>
              <table class="api-table">
                <tr>
                  <th>URL</th>
                  <td>${escapeHtml(api.request.url)}</td>
                </tr>
                <tr>
                  <th>Method</th>
                  <td>${escapeHtml(api.request.method)}</td>
                </tr>
              </table>
              <h4>Headers</h4>
              <pre class="api-data">${formatJson(api.request.headers)}</pre>
              ${
                api.request.body
                  ? `
                <h4>Body</h4>
                <pre class="api-data">${formatJson(api.request.body)}</pre>
              `
                  : ''
              }
            </div>
            <div class="response-details">
              <h4>Response</h4>
              <table class="api-table">
                <tr>
                  <th>Status</th>
                  <td>${escapeHtml(api.response.status)} ${escapeHtml(
                    api.response.statusText
                  )}</td>
                </tr>
              </table>
              <h4>Headers</h4>
              <pre class="api-data">${formatJson(api.response.headers)}</pre>
              ${
                api.response.data
                  ? `
                <h4>Data</h4>
                <pre class="api-data">${formatJson(api.response.data)}</pre>
              `
                  : ''
              }
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `
  }

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
          test.todo ? 'todo' : test.errors.length ? 'failed' : 'passed'
        }">
          ${test.name}${test.todo ? ' (TODO)' : ''}
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
              ${test.apiDetails ? renderApiDetails(test.apiDetails) : ''}
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
