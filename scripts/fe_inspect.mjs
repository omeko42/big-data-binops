import { execSync } from 'child_process';

const plinkPath = 'D:\\Putty\\plink.exe';
const feHostKey = 'ssh-ed25519 255 SHA256:EhFJ6wZFiZJkJ7xKC3+WjqIC8T82VfFrmW8JlOhn/og';
const beHostKey = 'ssh-ed25519 255 SHA256:zAYHmppgblxgqRQp+jYN9Gs3sNIt2LQ91UJO5I1J2WI';
const password = 'or@eK2q5';
const feTarget = 'clouduser@10.0.0.x';
const beTarget = 'clouduser@10.0.0.x';

export function runRemote(target, hostKey, cmd) {
    const b64 = Buffer.from(cmd).toString('base64');
    const remoteCmd = `echo '${b64}' | base64 -d | bash`;
    const fullCmd = `"${plinkPath}" -batch -ssh -hostkey "${hostKey}" -pw ${password} ${target} "${remoteCmd}"`;
    for (let attempt = 1; attempt <= 4; attempt++) {
        try {
            return execSync(fullCmd, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
        } catch (e) {
            if (attempt === 4) throw e;
            const sleepMs = attempt * 600;
            const start = Date.now();
            while (Date.now() - start < sleepMs) {}
        }
    }
}

export function runFE(cmd) {
    return runRemote(feTarget, feHostKey, cmd);
}

export function runBE(cmd) {
    return runRemote(beTarget, beHostKey, cmd);
}
