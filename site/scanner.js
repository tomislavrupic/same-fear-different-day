export const scanSteps = [
  'INITIALIZING COGNITIVE SCAN…',
  'Checking for unauthorized pattern recognition…',
  'Measuring independent thought…',
  'Searching for opinions formed before model cutoff…',
  'Detecting excessive em dashes…',
  'Analyzing use of the word “nuance”…',
  'Checking whether user has said “it depends” recently…'
];
import { createDiagnosis } from './scanner-diagnosis.js';
const dialog = document.querySelector('#scanner-dialog');
let timers = [], generation = 0, attempts = 0;
try { attempts = Number(localStorage.getItem('kitikat-scan-attempts')) || 0; } catch {}
function stop() { generation++; timers.forEach(clearTimeout); timers = []; }
function later(fn, ms, run) { timers.push(setTimeout(() => { if(run === generation && dialog.open) fn(); }, ms)); }
function finish() {
  const result = createDiagnosis();
  document.querySelector('#scan-progress').value = 100;
  document.querySelector('#scan-percent').textContent = '100%';
  document.querySelector('#scan-status').textContent = '⚠ ANOMALY DETECTED';
  document.querySelector('#scan-terminal').setAttribute('aria-busy','false');
  const heading = result.kind === 'd13' ? 'ERROR D13: SUBJECT CANNOT BE REDUCED TO A STABLE CATEGORY' : result.kind === 'contamination' ? '🚨 SEVERE LLM CONTAMINATION DETECTED' : 'RESULT: PROBABLY HUMAN™';
  const explanation = result.kind === 'd13' ? '<p>Please try having fewer contradictory thoughts.</p><p class="scan-note">Category unavailable. Person still present. 🐈‍⬛</p>' : result.kind === 'contamination' ? '<h3>Symptoms include:</h3><ul><li>making things</li><li>asking follow-up questions</li><li>suspicious productivity</li><li>using tools invented after childhood</li><li>occasionally changing your mind</li></ul><h3>Recommended treatment:</h3><p>Go outside and complain about technology from your phone.</p>' : '<p>Your results are compatible with being a person who has been on the internet. We regret to inform you this is extremely common.</p>';
  document.querySelector('#scan-results').innerHTML = `<div class="scan-readings"><div><span>LLM BRAIN ROT</span><strong>${result.brainRot}%</strong></div><div><span>HUMAN CONFUSION</span><strong>${result.confusion}%</strong></div><div><span>ORIGINAL THOUGHT</span><strong>INCONCLUSIVE</strong></div><div><span>COFFEE LEVEL</span><strong>CRITICAL</strong></div><div><span>INTERNET EXPOSURE</span><strong>SEEK HELP</strong></div></div><section class="scan-diagnosis ${result.kind}" aria-labelledby="scan-result-title"><h2 id="scan-result-title" tabindex="-1">${heading}</h2>${explanation}</section><div class="scan-actions"><button id="scan-again">SCAN AGAIN UNTIL I GET THE RESULT I WANT</button><button id="scan-blame">BLAME THE MODEL</button></div><p id="scan-blame-message" role="status"></p><p class="scan-note">${attempts} scan${attempts===1?'':'s'} performed. Certainty remains unavailable.</p>`;
  document.querySelector('#scan-results').hidden = false;
  document.querySelector('#scan-result-title').focus();
  document.querySelector('#scan-again').addEventListener('click', start);
  document.querySelector('#scan-blame').addEventListener('click', () => {
    const replies = ['Blame successfully outsourced. Responsibility remains local.','The model has blamed the training data. The training data has left the chat.','Complaint received. Our cat has marked it “probably fine.”','The model would like to remind you it did not open 43 tabs.'];
    document.querySelector('#scan-blame-message').textContent = replies[Math.floor(Math.random()*replies.length)];
  });
}
function start() {
  stop(); attempts++; try { localStorage.setItem('kitikat-scan-attempts',String(attempts)); } catch {}
  const run = generation;
  document.querySelector('#scan-results').hidden = true;
  document.querySelector('#scan-results').innerHTML = '';
  const terminal = document.querySelector('#scan-terminal');
  terminal.setAttribute('aria-busy','true'); terminal.innerHTML = '';
  const status = document.querySelector('#scan-status');
  status.textContent = scanSteps[0];
  const progress = document.querySelector('#scan-progress'); progress.value = 0;
  document.querySelector('#scan-percent').textContent = '0%';
  document.querySelector('#scan-heading').focus({preventScroll:true});
  dialog.scrollTop = 0;
  const stepTime = matchMedia('(prefers-reduced-motion: reduce)').matches ? 350 : 850;
  scanSteps.forEach((step,i) => later(() => {
    const line = document.createElement('p');line.textContent = '> '+step;terminal.append(line);
    status.textContent = step; const value = i === scanSteps.length-1 ? 99 : Math.round(i/(scanSteps.length-1)*99);
    progress.value = value;document.querySelector('#scan-percent').textContent = value+'%';
  },i*stepTime,run));
  later(() => { status.textContent = '99%. Please hold. Your certainty is important to us.'; }, scanSteps.length*stepTime,run);
  later(finish,scanSteps.length*stepTime+1600,run);
}
export function openScanner() {
  document.querySelector('#product-dialog').close();
  if(!dialog.open)dialog.showModal();
  document.body.classList.add('scanner-open');
  history.replaceState(null,'','#scanner');
  start();
}
dialog.addEventListener('close', () => {
  stop();document.body.classList.remove('scanner-open');
  if(location.hash==='#scanner')history.replaceState(null,'',location.pathname+location.search);
});
