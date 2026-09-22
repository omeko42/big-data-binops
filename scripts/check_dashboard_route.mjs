import { runFE } from './fe_inspect.mjs';

const cmd = `curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/cms/dashboard/main`;
try {
    console.log('HTTP STATUS:', runFE(cmd).trim());
} catch (e) {
    console.error(e.message);
}
