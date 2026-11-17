import * as fs from 'fs';
import * as net from 'net';
import * as path from 'path';
import { Module } from '@nestjs/common';
import { AuthModule } from '../../app_core/auth/auth.module';
import { AuditService } from '../audit/audit.service';
import { CoserseController } from './coserse.controller';
import { CoserseDocParserService } from './coserse-doc-parser.service';
import { CoserseKnowledgeService } from './coserse-knowledge.service';
import { CoserseLlmService } from './coserse-llm.service';
import { CoserseQuotaService } from './coserse-quota.service';
import { CoserseService } from './coserse.service';

// Load production Coserse overrides from .env.coserse if present (without overriding explicit env)
try {
    const envPath = path.join(process.cwd(), '.env.coserse');
    if (fs.existsSync(envPath)) {
        const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
        for (const line of lines) {
            const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
            if (m && !process.env[m[1]]) {
                process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
            }
        }
    }
} catch {
    // ignore
}

// Local container loopback bridge (127.0.0.1:11434 -> COSERSE_TUNNEL_UPSTREAM_HOST:11434)
// Keeps Zero-Data-Leakage loopback boundary intact inside Dockerized bdb-api.
try {
    const upstreamHost = (process.env.COSERSE_TUNNEL_UPSTREAM_HOST || '').trim();
    const upstreamPort = Number(process.env.COSERSE_TUNNEL_UPSTREAM_PORT || 11434);
    if (upstreamHost && !(global as any).__coserseLoopbackBridgeStarted) {
        (global as any).__coserseLoopbackBridgeStarted = true;
        const server = net.createServer((clientSocket) => {
            const upstream = net.connect(upstreamPort, upstreamHost);
            clientSocket.pipe(upstream);
            upstream.pipe(clientSocket);
            const cleanup = () => {
                clientSocket.destroy();
                upstream.destroy();
            };
            clientSocket.on('error', cleanup);
            upstream.on('error', cleanup);
        });
        server.on('error', () => {
            // Port may already be bound by another worker or local Ollama
        });
        server.listen(11434, '127.0.0.1');
    }
} catch {
    // ignore
}

@Module({
    imports: [AuthModule],
    controllers: [CoserseController],
    providers: [CoserseService, CoserseQuotaService, CoserseLlmService, CoserseDocParserService, CoserseKnowledgeService, AuditService],
    exports: [CoserseService, CoserseQuotaService, CoserseLlmService, CoserseDocParserService, CoserseKnowledgeService]
})
export class CoserseModule {}
