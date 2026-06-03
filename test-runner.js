const { spawn } = require('child_process');
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const testCases = [
  { id: 'UT1-1', title: 'UT1-1: Mengakses Halaman Library' },
  { id: 'UT2-1', title: 'UT2-1: Mengakses Online Catalog' },
  { id: 'UT2-2', title: 'UT2-2: Melakukan Pencarian Buku Menggunakan Filter (Empty Title)' },
  { id: 'UT2-3', title: 'UT2-3: Melakukan Pencarian Buku Menggunakan Filter (Publisher Filter)' },
  { id: 'UT2-4', title: 'UT2-4: Melakukan Pencarian Buku Menggunakan Filter (Specific Title)' },
  { id: 'UT2-5', title: 'UT2-5: Melihat Detail Buku dan Memilih yang Akan Dipinjam' },
  { id: 'UT2-6', title: 'UT2-6: Menghubungi PIC Library' },
  { id: 'UT2-7', title: 'UT2-7: Menambahkan Buku ke Reservation Basket' },
  { id: 'UT2-8', title: 'UT2-8: Menghapus Data Basket Sebelumnya' },
  { id: 'UT3-1', title: 'UT3-1: Mengakses My Reservation Basket' },
  { id: 'UT3-2', title: 'UT3-2: Melihat Daftar Basket Loan' },
  { id: 'UT3-3', title: 'UT3-3: Menghapus Salah Satu Basket Loan List' },
  { id: 'UT3-4', title: 'UT3-4: Melakukan Online Booking' },
  { id: 'UT3-5', title: 'UT3-5: Melihat Riwayat Online Booking' },
  { id: 'UT4-1', title: 'UT4-1: Mengakses Form Request Collection' },
  { id: 'UT4-2', title: 'UT4-2: Mengisi dan Mengirim Form Request Collection (Valid)' },
  { id: 'UT4-3', title: 'UT4-3: Mengisi dan Mengirim Form Request Collection (Invalid)' },
  { id: 'UT4-4', title: 'UT4-4: Mengakses dan Melihat Data Request Collection' },
  { id: 'UT4-5', title: 'UT4-5: Mencari Data Form yang Telah Diisi' }
];

let spinnerInterval = null;
let spinnerFrame = 0;
const spinnerFrames = ['   ', '.  ', '.. ', '...'];
let lastSpinnerText = '';

function startLoadingAnimation(text) {
  spinnerFrame = 0;
  lastSpinnerText = text;
  process.stdout.write(`\n${lastSpinnerText}   `);
  spinnerInterval = setInterval(() => {
    spinnerFrame = (spinnerFrame + 1) % spinnerFrames.length;
    const frame = spinnerFrames[spinnerFrame];
    process.stdout.write(`\r${lastSpinnerText}${frame}`);
  }, 500);
}

function stopLoadingAnimation() {
  if (spinnerInterval) {
    clearInterval(spinnerInterval);
    spinnerInterval = null;
    process.stdout.write('\r\x1b[K');
  }
}

function runCommand(args, loadingText) {
  return new Promise((resolve) => {
    startLoadingAnimation(loadingText);
    const child = spawn('npx', ['playwright', 'test', ...args], {
      env: { ...process.env, FORCE_COLOR: '1' }
    });
    let stdoutBuffer = '';
    let stderrBuffer = '';
    function processStream(data, isError) {
      const str = data.toString();
      if (isError) {
        stderrBuffer += str;
        const lines = stderrBuffer.split('\n');
        stderrBuffer = lines.pop();
        lines.forEach(line => printLine(line, true));
      } else {
        stdoutBuffer += str;
        const lines = stdoutBuffer.split('\n');
        stdoutBuffer = lines.pop();
        lines.forEach(line => printLine(line, false));
      }
    }
    function printLine(line, isError) {
      if (spinnerInterval) {
        process.stdout.write('\r\x1b[K');
      }
      const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, '');
      const isDeprecation = cleanLine.includes('DeprecationWarning') || 
                            cleanLine.includes('module.register') || 
                            cleanLine.includes('where the warning was created');
      const isEnvInject = cleanLine.includes('injected env') || 
                          cleanLine.includes('secrets for agents') || 
                          cleanLine.includes('Vestauth') ||
                          cleanLine.includes('dotenvx');
      const isTraceDep = cleanLine.includes('--trace-deprecation');
      if (isDeprecation || isEnvInject || isTraceDep) {
        process.stdout.write('\x1b[90m' + cleanLine + '\x1b[0m\n');
      } else {
        if (isError) {
          process.stderr.write(line + '\n');
        } else {
          process.stdout.write(line + '\n');
        }
      }
      if (spinnerInterval) {
        const frame = spinnerFrames[spinnerFrame];
        process.stdout.write(`${lastSpinnerText}${frame}`);
      }
    }
    child.stdout.on('data', (data) => processStream(data, false));
    child.stderr.on('data', (data) => processStream(data, true));
    child.on('close', (code) => {
      if (stdoutBuffer) printLine(stdoutBuffer, false);
      if (stderrBuffer) printLine(stderrBuffer, true);
      stopLoadingAnimation();
      resolve(code);
    });
  });
}

async function main() {
  const rl = readline.createInterface({ input, output });
  let exit = false;

  while (!exit) {
    console.clear();
    console.log('\x1b[36m==================================================\x1b[0m');
    console.log('\x1b[36m             PLAYWRIGHT TEST RUNNER CLI           \x1b[0m');
    console.log('\x1b[36m==================================================\x1b[0m');
    console.log('1. Run All Tests');
    console.log('2. Run a Single Test');
    console.log('3. Run Selected Tests');
    console.log('4. Exit');
    console.log('\x1b[36m--------------------------------------------------\x1b[0m');

    const choice = await rl.question('Select an option (1-4): ');

    if (choice === '1') {
      await runCommand(['--project=chromium'], '\x1b[1m\x1b[36mRunning all tests\x1b[0m');
      await rl.question('\nPress Enter to return to menu...');
    } else if (choice === '2') {
      console.clear();
      console.log('\x1b[36m==================================================\x1b[0m');
      console.log('\x1b[36m                 SELECT A SINGLE TEST             \x1b[0m');
      console.log('\x1b[36m==================================================\x1b[0m');
      testCases.forEach((tc, idx) => {
        console.log(`${idx + 1}. [${tc.id}] ${tc.title}`);
      });
      console.log('\x1b[36m--------------------------------------------------\x1b[0m');

      const testIdxStr = await rl.question(`Choose a test case (1-${testCases.length}): `);
      const testIdx = parseInt(testIdxStr, 10) - 1;

      if (testIdx >= 0 && testIdx < testCases.length) {
        const tc = testCases[testIdx];
        await runCommand(['-g', `${tc.id}:`, '--project=chromium'], `\x1b[1m\x1b[36mRunning test: ${tc.title}\x1b[0m`);
      } else {
        console.log('\nInvalid choice.');
      }
      await rl.question('\nPress Enter to return to menu...');
    } else if (choice === '3') {
      console.clear();
      console.log('\x1b[36m==================================================\x1b[0m');
      console.log('\x1b[36m                 SELECT MULTIPLE TESTS            \x1b[0m');
      console.log('\x1b[36m==================================================\x1b[0m');
      testCases.forEach((tc, idx) => {
        console.log(`${idx + 1}. [${tc.id}] ${tc.title}`);
      });
      console.log('\x1b[36m--------------------------------------------------\x1b[0m');

      const selectionStr = await rl.question('Enter test numbers separated by commas (e.g. 1,3,5): ');
      const indices = selectionStr
        .split(',')
        .map(s => parseInt(s.trim(), 10) - 1)
        .filter(idx => idx >= 0 && idx < testCases.length);

      if (indices.length > 0) {
        const selectedIds = indices.map(idx => testCases[idx].id);
        const grepPattern = selectedIds.join('|');
        await runCommand(['-g', grepPattern, '--project=chromium'], `\x1b[1m\x1b[36mRunning selected tests: ${selectedIds.join(', ')}\x1b[0m`);
      } else {
        console.log('\nNo valid tests selected.');
      }
      await rl.question('\nPress Enter to return to menu...');
    } else if (choice === '4') {
      exit = true;
    } else {
      console.log('\nInvalid choice. Please select 1-4.');
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  rl.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
