import { exec } from 'child_process';
import { platform } from 'os';

const WINDOWS_PLATFORM = 'win32';
const MAC_PLATFORM = 'darwin';

const osPlatform = platform();

export class RedirectService {
  static redirect(url: string) {
    if (url === undefined) {
      console.error('Please enter a URL, e.g. "http://www.opencanvas.co.uk"');
      process.exit(0);
    }

    let command;

    if (osPlatform === WINDOWS_PLATFORM) {
      command = `start microsoft-edge:${url}`;
    } else if (osPlatform === MAC_PLATFORM) {
      command = `open -a "Google Chrome" ${url}`;
    } else {
      command = `google-chrome --no-sandbox ${url}`;
    }

    console.log(`executing command: ${command}`);

    exec(command);
  }
}
