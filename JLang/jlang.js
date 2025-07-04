document.getElementById('runButton').addEventListener('click', () => {
  const code = document.getElementById('editor').value;
  const terminal = document.getElementById('terminal');
  terminal.textContent = '';
  const variables = {};

  function write(value) {
    terminal.textContent += value + '\n';
  }

  try {
    const lines = code.split('\n');
    let i = 0;

    function evalBlock(endKeyword) {
      while (i < lines.length) {
        let line = lines[i].trim();
        if (line === endKeyword) {
          i++;
          return;
        }

        if (line === 'break') {
          throw { type: 'break' };
        }

        if (line.startsWith('///')) {
          i++;
          continue;
        }

        if (line.startsWith('var ')) {
          const varMatch = line.match(/^var\s+([a-zA-Z_]\w*)\s*=\s*(.+)$/);
          if (varMatch) {
            const varName = varMatch[1];
            let varValue = varMatch[2].trim();
            const strMatch = varValue.match(/^(['"])(.*)\1$/);
            if (strMatch) {
              varValue = strMatch[2];
            } else if (!isNaN(varValue)) {
              varValue = Number(varValue);
            } else if (variables.hasOwnProperty(varValue)) {
              varValue = variables[varValue];
            } else if (varValue === 'True') {
              varValue = true;
            } else if (varValue === 'False') {
              varValue = false;
            }
            variables[varName] = varValue;
            i++;
            continue;
          } else {
            throw new Error('Invalid variable declaration: ' + line);
          }
        }

    if (line.startsWith('write(') && line.endsWith(')')) {
      const arg = line.slice(6, -1).trim();
      if (arg === '') {
        i++;
        continue;
      }

      const strMatch = arg.match(/^(['"])(.*)\1$/);
      if (strMatch) {
        write(strMatch[2]);
      } else if (variables.hasOwnProperty(arg)) {
        write(variables[arg]);
      } else if (!isNaN(arg)) {
        write(Number(arg));
      } else if (arg === 'True') {
        write(true);
      } else if (arg === 'False') {
        write(false);
      } else {
        throw new Error('Invalid argument to write(): ' + arg);
      }
      i++;
      continue;
    }

if (line.startsWith('jlang.windows.obj(') && line.endsWith(')')) {
  const paramsStr = line.slice('jlang.windows.obj('.length, -1).trim();
  // Parse parameters: shape (string), rounded (boolean), size (number)
  const paramMatch = paramsStr.match(/^(['"])(box|circle)['"]\s*,\s*(True|False)\s*,\s*(\d+)$/);
  if (!paramMatch) {
    throw new Error('Invalid parameters for jlang.windows.obj: ' + paramsStr);
  }
  const shape = paramMatch[2];
  const rounded = paramMatch[3] === 'True';
  const size = Number(paramMatch[4]);

  // For circle, rounded parameter is ignored
  const roundedText = shape === 'circle' ? 'N/A (circle shape)' : rounded ? 'Yes' : 'No';

  // Simulate object creation by writing info to terminal
  write(`Created object: shape=${shape}, rounded=${roundedText}, size=${size}`);

  i++;
  continue;
}

        if (line.startsWith('if ')) {
          const conditionMatch = line.match(/^if\s+(.+):$/);
          if (!conditionMatch) throw new Error('Invalid if syntax: ' + line);
          const condition = conditionMatch[1].trim();
          let conditionResult = false;

          if (condition.includes('==')) {
            const [left, right] = condition.split('==').map(s => s.trim());
            let leftVal = variables.hasOwnProperty(left) ? variables[left] : left;
            let rightVal = variables.hasOwnProperty(right) ? variables[right] : right;
            if (!isNaN(leftVal)) leftVal = Number(leftVal);
            if (!isNaN(rightVal)) rightVal = Number(rightVal);
            conditionResult = leftVal == rightVal;
          } else {
            conditionResult = Boolean(variables[condition]);
          }

          i++;
          if (conditionResult) {
            evalBlock('end');
            while (i < lines.length) {
              const peek = lines[i].trim();
              if (peek.startsWith('else:') || peek.startsWith('else-if')) {
                i++;
                evalBlock('end');
              } else break;
            }
          } else {
            evalBlock('end');
            while (i < lines.length) {
              const peek = lines[i].trim();
              if (peek.startsWith('else-if ')) {
                const elseIfMatch = peek.match(/^else-if\s+(.+):$/);
                if (!elseIfMatch) throw new Error('Invalid else-if syntax: ' + peek);
                const elseIfCond = elseIfMatch[1].trim();
                let elseIfResult = false;

                if (elseIfCond.includes('==')) {
                  const [left, right] = elseIfCond.split('==').map(s => s.trim());
                  let leftVal = variables.hasOwnProperty(left) ? variables[left] : left;
                  let rightVal = variables.hasOwnProperty(right) ? variables[right] : right;
                  if (!isNaN(leftVal)) leftVal = Number(leftVal);
                  if (!isNaN(rightVal)) rightVal = Number(rightVal);
                  elseIfResult = leftVal == rightVal;
                } else {
                  elseIfResult = Boolean(variables[elseIfCond]);
                }

                i++;
                if (elseIfResult) {
                  evalBlock('end');
                  break;
                } else {
                  evalBlock('end');
                }
              } else if (peek === 'else:') {
                i++;
                evalBlock('end');
                break;
              } else break;
            }
          }
          continue;
        }

        if (line === 'do-forever:') {
          const startIndex = i + 1;
          let endIndex = -1;
          let depth = 0;
          for (let j = startIndex; j < lines.length; j++) {
            const l = lines[j].trim();
            if (l === 'do-forever:') depth++;
            else if (l === 'end') {
              if (depth === 0) {
                endIndex = j;
                break;
              } else {
                depth--;
              }
            }
          }
          if (endIndex === -1) throw new Error('Missing end for do-forever');

          const loopLines = lines.slice(startIndex, endIndex);
          const savedLines = lines;
          const savedIndex = i;
          lines = loopLines;
          const maxIterations = 1000;

          try {
            for (let iter = 0; iter < maxIterations; iter++) {
              i = 0;
              try {
                evalBlock(null);
              } catch (e) {
                if (e.type === 'break') break;
                else throw e;
              }
            }
          } finally {
            lines = savedLines;
            i = endIndex + 1;
          }
          continue;
        }

        if (line === 'end') {
          i++;
          return;
        }

        if (line.length === 0) {
          i++;
          continue;
        }

        throw new Error('Invalid syntax: ' + line);
      }
    }

    evalBlock(null);
  } catch (err) {
    terminal.textContent = 'Error: ' + (err.message || err);
  }
});

document.getElementById('previewButton').addEventListener('click', () => {
  const code = document.getElementById('editor').value;
  const previewPattern = /jlang\.windows\.init\(funcvar class\s*=\s*".*?"\)/;
  if (previewPattern.test(code)) {
    // Extract parameters inside jlang.windows.text(...)
    const textCallMatch = code.match(/jlang\.windows\.text\(\s*([^,]+),\s*([^,]+),\s*"(.*?)"\s*\)/);
    const size = textCallMatch ? textCallMatch[1].trim() : '';
    const position = textCallMatch ? textCallMatch[2].trim() : '';
    const textContent = textCallMatch ? textCallMatch[3] : '';

    // Extract parameters inside jlang.windows.obj(...)
    const objCallMatch = code.match(/jlang\.windows\.obj\(\s*(['"])(box|circle)\1\s*,\s*(True|False)\s*,\s*(\d+)\s*\)/);
    const shape = objCallMatch ? objCallMatch[2] : null;
    const rounded = objCallMatch ? objCallMatch[3] === 'True' : false;
    const sizeObj = objCallMatch ? Number(objCallMatch[4]) : 0;

    const previewWindow = window.open('', 'Preview', 'width=800,height=600');
    if (textContent.length === 0 && !shape) {
      // Blank preview if no text content and no shape
      previewWindow.document.write(`
        <html><head><title>Preview</title></head>
        <body></body></html>`);
    } else {
      if (textContent.length > 0) {
        // Map position to CSS styles for text
        let style = 'position: absolute; ';
        switch (position) {
          case 'middle-top':
            style += 'top: 0; left: 50%; transform: translateX(-50%); font-size: ' + (size === 'medium' ? '24px' : '16px') + ';';
            break;
          case 'right-top':
            style += 'top: 0; right: 0; font-size: ' + (size === 'medium' ? '24px' : '16px') + ';';
            break;
          case 'middle-middle':
            style += 'top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: ' + (size === 'medium' ? '24px' : '16px') + ';';
            break;
          // Add more positions as needed
          default:
            style += 'top: 0; left: 0; font-size: ' + (size === 'medium' ? '24px' : '16px') + ';';
        }
        previewWindow.document.write(`
          <html><head><title>Preview</title></head>
          <body style="position: relative; height: 100vh; margin: 0;">
            <div style="${style}">${textContent}</div>
          </body></html>`);
      }
      if (shape) {
        // Render shape preview
        const shapeStyle = `
          width: ${sizeObj}px;
          height: ${sizeObj}px;
          background-color: lightblue;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          ${shape === 'circle' ? 'border-radius: 50%;' : ''}
          ${shape === 'box' && rounded ? 'border-radius: 15px;' : ''}
        `;
        previewWindow.document.write(`
          <html><head><title>Preview</title></head>
          <body style="position: relative; height: 100vh; margin: 0;">
            <div style="${shapeStyle}"></div>
          </body></html>`);
      }
    }
    previewWindow.document.close();
  } else {
    alert('No preview available: code does not contain the required pattern.');
  }
});

const editor = document.getElementById('editor');
const highlighting = document.getElementById('highlighting');

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function syntaxHighlight(code) {
  const tokenPattern = /\/\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:jlang\.windows\.init|jlang\.windows\.text|jlang\.windows\.obj|do-forever|else-if|if|else|while|end|var|write|True|False|break|funcvar|define|class)\b|\d+(\.\d+)?|[a-zA-Z_]\w*|[()=<>]|[\s]+|./gm;

  const tokens = [];
  let match;
  while ((match = tokenPattern.exec(escapeHtml(code))) !== null) {
    tokens.push(match[0]);
  }

  return tokens.map(token => {
    if (/^\/\/\//.test(token)) return `<span class="token-comment">${token}</span>`;
    if (/^(var|write|funcvar|jlang\.windows\.init|jlang\.windows\.text|do-forever|else-if|if|else|while|end|break|jlang\.windows\.obj)$/.test(token)) return `<span class="token-function">${token}</span>`;
    if (/^(define|class)$/.test(token)) return `<span class="token-keyword">${token}</span>`;
    if (/^(True|False)$/.test(token)) return `<span class="token-operator">${token}</span>`;
    if (/^(do-forever|else-if|if|else|while|end|break)$/.test(token)) return `<span class="token-keyword">${token}</span>`;
    if (/^['"].*['"]$/.test(token)) return `<span class="token-string">${token}</span>`;
    if (/^\d+(\.\d+)?$/.test(token)) return `<span class="token-number">${token}</span>`;
    if (/^[=<>]$/.test(token)) return `<span class="token-operator">${token}</span>`;
    if (/^[()]+$/.test(token)) return `<span class="token-paren">${token}</span>`;
    if (/^[a-zA-Z_]\w*$/.test(token)) return `<span class="token-variable">${token}</span>`;
    if (/^\s+$/.test(token)) return token;
    return token;
  }).join('');
}

function updateHighlighting() {
  const code = editor.value;
  highlighting.innerHTML = syntaxHighlight(code) + '\n';
}

editor.addEventListener('input', updateHighlighting);
editor.addEventListener('scroll', () => {
  highlighting.scrollTop = editor.scrollTop;
  highlighting.scrollLeft = editor.scrollLeft;
});

updateHighlighting();
