/**
 * Journal du client Higgsfield : une ligne JSON par événement, lisible
 * dans les logs Vercel comme par un agent qui les relit.
 *
 * Deux protections, l'une derrière l'autre :
 * - le client ne passe jamais d'en-têtes ni d'identifiants au journal ;
 * - tout ce qui y entre est filtré quand même : les valeurs connues des
 *   identifiants sont remplacées, et toute chaîne `Key …` masquée. Une
 *   erreur réseau qui recopierait un en-tête ne suffirait donc pas à
 *   faire fuiter la clé.
 */

export type LogLevel = 'info' | 'warn' | 'error';

export interface HiggsfieldLogEntry {
  level: LogLevel;
  event: string;
  [key: string]: unknown;
}

export type LogSink = (entry: HiggsfieldLogEntry) => void;

export interface HiggsfieldLogger {
  info(event: string, fields?: Record<string, unknown>): void;
  warn(event: string, fields?: Record<string, unknown>): void;
  error(event: string, fields?: Record<string, unknown>): void;
}

const REDACTED = '[redacted]';

/** Les clés dont la valeur n'est jamais journalisée, quelle qu'elle soit. */
const SENSITIVE_KEY = /authorization|secret|credential|password|token|api[_-]?key/i;

/** `Key <id>:<secret>`, la forme de l'en-tête Authorization. */
const AUTH_HEADER_VALUE = /Key\s+[^\s:]+:[^\s"',}]+/g;

export function redact(value: unknown, secrets: readonly string[], depth = 0): unknown {
  if (typeof value === 'string') {
    let out = value.replace(AUTH_HEADER_VALUE, `Key ${REDACTED}`);

    for (const secret of secrets) {
      if (secret) out = out.split(secret).join(REDACTED);
    }

    return out;
  }

  if (depth > 5 || value === null || typeof value !== 'object') return value;

  if (value instanceof Error) {
    return { name: value.name, message: redact(value.message, secrets, depth + 1) };
  }

  if (Array.isArray(value)) {
    return value.map((item) => redact(item, secrets, depth + 1));
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      SENSITIVE_KEY.test(key) ? REDACTED : redact(item, secrets, depth + 1),
    ]),
  );
}

const consoleSink: LogSink = (entry) => {
  const line = JSON.stringify({ scope: 'higgsfield', ...entry });

  if (entry.level === 'error') console.error(line);
  else if (entry.level === 'warn') console.warn(line);
  else console.info(line);
};

export function createHiggsfieldLogger({
  secrets = [],
  sink = consoleSink,
}: {
  secrets?: readonly string[];
  sink?: LogSink;
} = {}): HiggsfieldLogger {
  const write = (level: LogLevel, event: string, fields: Record<string, unknown> = {}) => {
    sink({
      ...(redact(fields, secrets) as Record<string, unknown>),
      level,
      event,
    });
  };

  return {
    info: (event, fields) => write('info', event, fields),
    warn: (event, fields) => write('warn', event, fields),
    error: (event, fields) => write('error', event, fields),
  };
}
