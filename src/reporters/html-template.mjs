/* eslint-disable space-before-function-paren */
/* eslint-disable no-control-regex */
import { getPercent } from '../utils/support.mjs'
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
  numTodo = 0,
  results,
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Test Report</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #f5f5f5; margin: 0; padding: 2rem; }
    .container { max-width: 1200px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 2rem; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .main-flex { display: flex; align-items: center; gap: 3rem; margin-bottom: 0.5rem; }
    .pie-chart-container { position: relative; width: 200px; height: 200px; background: #fff; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.07); display: flex; align-items: center; justify-content: center; }
    .summary-tiles {
      display: flex;
      flex-direction: row;
      gap: 1.2rem;
      align-items: center;
      justify-content: center;
      height: 200px;
    }
    .stat {
      padding: 1.2rem 1.5rem;
      border-radius: 12px;
      min-width: 120px;
      background: #f5f5f5;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 70px;
      cursor: pointer;
      transition: box-shadow 0.2s;
      border: 2px solid transparent;
    }
    .stat-percent {
      font-size: 1.1em;
      font-weight: 600;
      margin-top: 0.3em;
      text-align: center;
    }
    .stat.active {
      box-shadow: 0 2px 8px rgba(33,150,243,0.13);
      border: 2px solid #2196f3;
      background: #e3f2fd;
    }
    .stat.total { background: #e3f2fd; cursor: default; border: 2px solid transparent; }
    .stat.passed { background: #e8f5e9; }
    .stat.failed { background: #ffebee; }
    .stat.todo { background: #fff3e0; }
    .stat h3 { margin: 0 0 0.3em 0; font-size: 1.1em; font-weight: 600; }
    .stat p { margin: 0; font-size: 2rem; font-weight: bold; }
    .stat.passed h3, .stat.passed p { color: #4caf50; }
    .stat.failed h3, .stat.failed p { color: #f44336; }
    .stat.todo h3, .stat.todo p { color: #ff9800; }
    .stat.total h3, .stat.total p { color: #2196f3; }
    .dot { width: 18px; height: 18px; border-radius: 50%; display: inline-block; }
    .pie-passed { background: #4caf50; }
    .pie-failed { background: #f44336; }
    .pie-todo { background: #ff9800; }
    .pie-stat-label { font-weight: 600; min-width: 60px; display: inline-block; }
    .pie-stat-value { font-weight: 700; margin-left: 0.5em; }
    .test-case { padding: 0.75rem 1rem; border-bottom: 1px solid #eee; }
    .test-case:last-child { border-bottom: none; }
    .test-name { display: flex; align-items: center; gap: 0.5rem; }
    .test-name.passed::before { content: '✓'; color: #4caf50; }
    .test-name.failed::before { content: '✗'; color: #f44336; }
    .test-name.todo::before { content: '◦'; color: #ff9800; }
    .test-name.todo { color: #ff9800; font-style: italic; }
    .error-details { margin-top: 1rem; padding: 1rem; background: #fff8f8; border-radius: 4px; display: none; }
    .error-details.show { display: block; }
    .toggle-error { color: #f44336; text-decoration: underline; cursor: pointer; margin-top: 0.5rem; display: inline-block; }
    pre { margin: 0.5rem 0; padding: 1rem; background: #f5f5f5; border-radius: 4px; overflow-x: auto; }
    .describe-group { margin: 0.5rem 0; padding: 0 1rem; }
    .describe-header { padding: 0.75rem 1rem; background: #f3f4f6; margin: 0.5rem 0; font-weight: 600; border-radius: 4px; cursor: pointer; }
    .describe-content { display: block; padding: 0.5rem 0; }
    .describe-content.hide { display: none; }
    .api-details { margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 4px; display: none; }
    .api-details.show { display: block; }
    .toggle-api { color: #2196f3; text-decoration: underline; cursor: pointer; margin-top: 0.5rem; display: inline-block; margin-left: 1rem; }
    .api-section { margin: 1rem 0; padding: 1rem; background: #fff; border: 1px solid #e0e0e0; border-radius: 4px; }
    .api-section h4 { margin: 0 0 0.5rem 0; color: #555; }
    .api-table { width: 100%; border-collapse: collapse; margin: 0.5rem 0; }
    .api-table th, .api-table td { text-align: left; padding: 0.5rem; border: 1px solid #e0e0e0; }
    .api-table th { background: #f3f4f6; font-weight: 600; }
    pre.api-data { margin: 0.5rem 0; padding: 0.5rem; background: #f5f5f5; border-radius: 4px; max-height: 200px; overflow-y: auto; white-space: pre-wrap; }
    .hidden { display: none !important; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Test Report</h1>
      <div>${new Date().toLocaleString()}</div>
    </div>
    <div class="main-flex">
      <div>
        <div class="pie-chart-container">
          <canvas id="pieChart" width="200" height="200"></canvas>
        </div>
      </div>
      <div class="summary-tiles">
        <div class="stat total" data-filter="all">
          <h3>Total</h3>
          <p>${numTests}</p>
          <div class="stat-percent" style="color:#2196f3;">${getPercent(numTests, numTests)}%</div>
        </div>
        <div class="stat passed" data-filter="passed">
          <h3>Passed</h3>
          <p>${numPassed}</p>
          <div class="stat-percent" style="color:#4caf50;">${getPercent(numPassed, numTests)}%</div>
        </div>
        <div class="stat failed" data-filter="failed">
          <h3>Failed</h3>
          <p>${numFailed}</p>
          <div class="stat-percent" style="color:#f44336;">${getPercent(numFailed, numTests)}%</div>
        </div>
        <div class="stat todo" data-filter="todo">
          <h3>Todo</h3>
          <p>${numTodo}</p>
          <div class="stat-percent" style="color:#ff9800;">${getPercent(numTodo, numTests)}%</div>
        </div>
      </div>
    </div>
    <div class="results" id="results-root">
      ${renderDescribeGroup(groupByDescribe(results))}
    </div>
  </div>
  <script>
    (function() {
      const data = [
        { value: ${numPassed}, color: '#4caf50' },
        { value: ${numFailed}, color: '#f44336' },
        { value: ${numTodo}, color: '#ff9800' }
      ];
      const total = ${numTests};
      const canvas = document.getElementById('pieChart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 90;
      let startAngle = -0.5 * Math.PI;
      const totalValue = data.reduce((sum, d) => sum + d.value, 0);
      data.forEach((d) => {
        if (d.value > 0) {
          const slice = (d.value / totalValue) * 2 * Math.PI;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius, startAngle, startAngle + slice);
          ctx.closePath();
          ctx.fillStyle = d.color;
          ctx.globalAlpha = 0.92;
          ctx.fill();
          ctx.globalAlpha = 1;
          startAngle += slice;
        }
      });
    })();

    document.querySelectorAll('.stat[data-filter]').forEach(tile => {
      tile.addEventListener('click', function() {
        document.querySelectorAll('.stat[data-filter]').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const filter = this.getAttribute('data-filter');
        filterResults(filter);
      });
    });

    function filterResults(filter) {
      const root = document.getElementById('results-root');
      if (!root) return;
      if (filter === 'all') {
        root.querySelectorAll('.test-case').forEach(tc => tc.classList.remove('hidden'));
        root.querySelectorAll('.describe-group').forEach(dg => dg.classList.remove('hidden'));
        return;
      }
      root.querySelectorAll('.test-case').forEach(tc => tc.classList.add('hidden'));
      root.querySelectorAll('.test-case').forEach(tc => {
        if (
          (filter === 'passed' && tc.querySelector('.test-name.passed')) ||
          (filter === 'failed' && tc.querySelector('.test-name.failed')) ||
          (filter === 'todo' && tc.querySelector('.test-name.todo'))
        ) {
          tc.classList.remove('hidden');
        }
      });
      root.querySelectorAll('.describe-group').forEach(dg => {
        const hasVisible = dg.querySelectorAll('.test-case:not(.hidden)').length > 0 ||
          dg.querySelectorAll('.describe-group:not(.hidden)').length > 0;
        if (hasVisible) {
          dg.classList.remove('hidden');
        } else {
          dg.classList.add('hidden');
        }
      });
    }
  
    document.querySelector('.stat.total').classList.add('active');

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
        <span style="color:#888; font-size:0.95em; margin-left:0.5em;">${
          typeof test.duration === 'number' ? `${test.duration} ms` : ''
        }</span>
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
