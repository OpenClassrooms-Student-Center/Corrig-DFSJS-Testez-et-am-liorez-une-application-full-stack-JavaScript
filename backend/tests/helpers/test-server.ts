import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import app from '../../src/app';

let server: Server | undefined;

/**
 * Starts the Express application on a free port chosen by the OS.
 * Returns the base URL so integration tests can call the API with native fetch.
 */
export const startTestServer = async (): Promise<string> => {
  const instance = app.listen(0);
  server = instance;

  await new Promise<void>((resolve) => {
    instance.once('listening', () => resolve());
  });

  const { port } = instance.address() as AddressInfo;

  return `http://127.0.0.1:${port}`;
};

/** Closes the test server so Vitest can exit cleanly. */
export const stopTestServer = async (): Promise<void> => {
  const instance = server;
  if (!instance) return;

  await new Promise<void>((resolve, reject) => {
    instance.close((error) => (error ? reject(error) : resolve()));
  });

  server = undefined;
};
