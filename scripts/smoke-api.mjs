#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function normalizeBaseUrl(raw) {
  if (!raw) return '';
  return String(raw).trim().replace(/\/+$/, '');
}

function resolveApiPath(apiPath, version) {
  if (version !== 'v1') {
    return apiPath;
  }

  if (apiPath.startsWith('/api/v1')) {
    return apiPath;
  }

  if (apiPath === '/api') {
    return '/api/v1';
  }

  if (apiPath.startsWith('/api/')) {
    return apiPath.replace('/api/', '/api/v1/');
  }

  return apiPath;
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue;
    }

    const [rawKey, ...rawValueParts] = trimmed.split('=');
    const key = rawKey.trim();
    const rawValue = rawValueParts.join('=').trim();
    const unquoted =
      (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
      (rawValue.startsWith("'") && rawValue.endsWith("'"))
        ? rawValue.slice(1, -1)
        : rawValue;

    if (!(key in process.env)) {
      process.env[key] = unquoted;
    }
  }
}

const cwd = process.cwd();
loadEnvFile(path.join(cwd, '.env'));
loadEnvFile(path.join(cwd, '.env.local'));

const baseUrl = normalizeBaseUrl(
  process.env.API_BASE_URL ||
    process.env.VITE_API_URL ||
    process.env.VITE_API_BASE_URL ||
    'http://localhost:3000'
);
const apiVersion = (process.env.API_VERSION || process.env.VITE_API_VERSION || 'legacy').toLowerCase();
const bearerToken = process.env.SMOKE_BEARER_TOKEN;

if (!baseUrl) {
  console.error('API base URL no definida. Usa API_BASE_URL o VITE_API_URL.');
  process.exit(1);
}

const checks = [
  { name: 'health', path: '/api/health', expected: [200] },
  { name: 'products', path: '/api/products?page=1&pageSize=5', expected: [200] },
  { name: 'auth_me', path: '/api/auth/me', expected: bearerToken ? [200] : [401] },
];

let failed = false;

console.log(`Smoke API against ${baseUrl} (version=${apiVersion})`);

for (const check of checks) {
  const finalPath = resolveApiPath(check.path, apiVersion);
  const url = `${baseUrl}${finalPath}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
      },
    });

    const requestId = response.headers.get('x-request-id') || response.headers.get('x-vercel-id') || 'n/a';
    const acao = response.headers.get('access-control-allow-origin') || 'n/a';
    const ok = check.expected.includes(response.status);

    console.log(
      `${ok ? 'OK' : 'FAIL'} ${check.name}: ${response.status} | URL=${url} | requestId=${requestId} | ACAO=${acao}`
    );

    if (!ok) {
      failed = true;
    }
  } catch (error) {
    failed = true;
    console.log(`FAIL ${check.name}: network error | URL=${url} | error=${error instanceof Error ? error.message : String(error)}`);
  }
}

if (failed) {
  process.exit(1);
}

console.log('Smoke API passed.');
