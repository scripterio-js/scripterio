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
    .header { margin-bottom: 0.5rem; }
    .header-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 2rem; }
    .main-flex { display: flex; align-items: flex-start; gap: 3rem; margin-bottom: 0.5rem; }
    .pie-chart-container { 
      position: relative; 
      width: 260px; 
      height: 260px; 
      background: transparent; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
    }
    .pie-center-label {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: #222;
      background: transparent;
      border-radius: 50%;
      width: 110px;
      height: 110px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: bold;
      box-shadow: none;
      pointer-events: none;
      z-index: 2;
      text-align: center;
      transition: background 0.2s;
      user-select: none;
    }
    .pie-center-label .desc {
      font-size: 1.05rem;
      font-weight: 500;
      opacity: 0.85;
      margin-top: 0.3em;
      letter-spacing: 0.02em;
      color: #222;
    }
    .summary-tiles {
      display: flex;
      flex-direction: row;
      gap: 1.2rem;
      align-items: center;
      justify-content: flex-start;
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
      transition: box-shadow 0.2s, border 0.2s;
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
      z-index: 1;
    }
    .stat.total { background: #e3f2fd; cursor: pointer; border: 2px solid transparent; }
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
    .stat.active-filter {
      outline: 2px solid #2196f3;
      box-shadow: 0 0 0 2px #1976d233;
      cursor: pointer;
    }
    .stat { cursor: pointer; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-row">
        <h1>Test Report</h1>
        <div>${new Date().toLocaleString()}</div>
      </div>
    </div>
    <div class="main-flex">
      <div class="summary-tiles">
        <div class="stat total" data-filter="all">
          <h3>Total</h3>
          <p>${numTests}</p>
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
      <div>
        <div class="pie-chart-container">
          <canvas id="pieChart" width="260" height="260" style="cursor:pointer"></canvas>
          <div class="pie-center-label" id="pieCenterLabel">
            ${numTests}
            <div class="desc">Total tests</div>
          </div>
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
        { value: ${numPassed}, solid: '#4caf50', label: 'Passed', percent: ${getPercent(numPassed, numTests)}, filter: 'passed' },
        { value: ${numFailed}, solid: '#f44336', label: 'Failed', percent: ${getPercent(numFailed, numTests)}, filter: 'failed' },
        { value: ${numTodo}, solid: '#ff9800', label: 'Todo', percent: ${getPercent(numTodo, numTests)}, filter: 'todo' }
      ];
      const total = ${numTests};
      const canvas = document.getElementById('pieChart');
      const centerLabel = document.getElementById('pieCenterLabel');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 120;
      const totalValue = data.reduce((sum, d) => sum + d.value, 0);
      const segments = [];
      let startAngle = -0.5 * Math.PI;
      data.forEach((d, i) => {
        if (d.value > 0) {
          const slice = (d.value / totalValue) * 2 * Math.PI;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius, startAngle, startAngle + slice);
          ctx.closePath();
          ctx.fillStyle = d.solid;
          ctx.globalAlpha = 0.97;
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.restore();
          segments.push({
            start: startAngle,
            end: startAngle + slice,
            color: d.solid,
            label: d.label,
            percent: d.percent,
            index: i,
            filter: d.filter
          });
          startAngle += slice;
        }
      });

      let hoveredIndex = null;
      let selectedFilter = 'all';

      function redrawPie(highlightIndex = null, selected = null) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let sa = -0.5 * Math.PI;
        data.forEach((d, i) => {
          if (d.value > 0) {
            const slice = (d.value / totalValue) * 2 * Math.PI;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, sa, sa + slice);
            ctx.closePath();
            ctx.fillStyle = d.solid;
            if (selected === d.filter) {
              ctx.globalAlpha = 1;
              ctx.shadowColor = d.solid;
              ctx.shadowBlur = 18;
            } else if (highlightIndex === i) {
              ctx.globalAlpha = 0.85;
              ctx.shadowColor = d.solid;
              ctx.shadowBlur = 10;
            } else {
              ctx.globalAlpha = 0.6;
              ctx.shadowBlur = 0;
            }
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
            ctx.restore();
            sa += slice;
          }
        });
      }

      function setPieLabel(filter) {
        if (filter === 'all') {
          centerLabel.innerHTML = '<span style="color:#222">${numTests}</span><div class="desc" style="color:#222">Total tests</div>';
        } else {
          const seg = data.find(d => d.filter === filter);
          if (seg) {
            centerLabel.innerHTML = '<span style="color:#222">' + seg.percent + '%</span><div class="desc" style="color:#222">' + seg.label + '</div>';
          }
        }
      }

      canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - centerX;
        const y = e.clientY - rect.top - centerY;
        const angle = Math.atan2(y, x);
        const dist = Math.sqrt(x * x + y * y);
        let found = false;
        if (dist <= radius && dist > 40) {
          let a = angle;
          if (a < -0.5 * Math.PI) a += 2 * Math.PI;
          for (const seg of segments) {
            if (a >= seg.start && a < seg.end) {
              hoveredIndex = seg.index;
              redrawPie(seg.index, selectedFilter !== 'all' ? selectedFilter : null);
              if (selectedFilter === 'all') setPieLabel(seg.filter);
              canvas.style.cursor = "pointer";
              found = true;
              break;
            }
          }
        }
        if (!found) {
          hoveredIndex = null;
          redrawPie(null, selectedFilter !== 'all' ? selectedFilter : null);
          setPieLabel(selectedFilter);
          canvas.style.cursor = "pointer";
        }
      });

      canvas.addEventListener('mouseleave', function() {
        hoveredIndex = null;
        redrawPie(null, selectedFilter !== 'all' ? selectedFilter : null);
        setPieLabel(selectedFilter);
        canvas.style.cursor = "pointer";
      });

      // Видалено click-фільтрацію по кругу

      redrawPie(null, selectedFilter);
      setPieLabel(selectedFilter);

      document.querySelectorAll('.stat[data-filter]').forEach(tile => {
        tile.addEventListener('click', function() {
          document.querySelectorAll('.stat[data-filter]').forEach(t => t.classList.remove('active'));
          this.classList.add('active');
          const filter = this.getAttribute('data-filter');
          selectedFilter = filter;
          redrawPie(null, filter !== 'all' ? filter : null);
          setPieLabel(filter);
          filterResults(filter);

          if (filter !== 'all') {
            setTimeout(() => {
              const root = document.getElementById('results-root');
              if (!root) return;
              const first = root.querySelector('.test-case .test-name.' + filter);
              if (first) {
                first.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 100);
          }
        });
      });

      document.querySelectorAll('.stat[data-filter]').forEach(t => t.classList.remove('active'));
      document.querySelector('.stat.total').classList.add('active');
      redrawPie(null, 'all');
      setPieLabel('all');
    })();

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

    function setFilter(filter) {
      document.querySelectorAll('.stat').forEach(stat => {
        stat.classList.remove('active-filter');
      });
      if (filter) {
        document.querySelector('.stat.' + filter).classList.add('active-filter');
      } else {
        document.querySelector('.stat.total').classList.add('active-filter');
      }

      document.querySelectorAll('.test-case').forEach(tc => {
        const nameDiv = tc.querySelector('.test-name');
        if (!filter || nameDiv.classList.contains(filter)) {
          tc.style.display = '';
        } else {
          tc.style.display = 'none';
        }
      });

      function updateDescribeVisibility(describe) {
        let hasVisible = false;
        const content = describe.querySelector(':scope > .describe-content');
        if (content) {
          content.childNodes.forEach(child => {
            if (child.nodeType !== 1) return;
            if (child.classList.contains('describe-group')) {
              if (updateDescribeVisibility(child)) {
                child.style.display = '';
                hasVisible = true;
              } else {
                child.style.display = 'none';
              }
            } else if (child.classList.contains('test-case')) {
              if (child.style.display !== 'none') {
                hasVisible = true;
              }
            }
          });
        }
        describe.style.display = hasVisible ? '' : 'none';
        return hasVisible;
      }
      document.querySelectorAll('.describe-group').forEach(group => {
        updateDescribeVisibility(group);
      });
    }

    document.addEventListener('DOMContentLoaded', () => {
      document.querySelector('.stat.total').addEventListener('click', () => setFilter(null));
      document.querySelector('.stat.passed').addEventListener('click', () => setFilter('passed'));
      document.querySelector('.stat.failed').addEventListener('click', () => setFilter('failed'));
      document.querySelector('.stat.todo').addEventListener('click', () => setFilter('todo'));
      document.querySelectorAll('.stat[data-filter]').forEach(t => t.classList.remove('active'));
      document.querySelector('.stat.total').classList.add('active');
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