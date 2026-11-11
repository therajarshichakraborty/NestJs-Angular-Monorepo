import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

import { LOG_CATEGORIES } from "./log-categories";

const WORKSPACE_MARKER_FILE = "pnpm-workspace.yaml";
const DEFAULT_LOG_FOLDER_NAME = "logs";

export function findWorkspaceRoot(startDirectory: string): string {
  let currentDirectory = path.resolve(startDirectory);

  while (true) {
    if (existsSync(path.join(currentDirectory, WORKSPACE_MARKER_FILE))) {
      return currentDirectory;
    }

    const parentDirectory = path.dirname(currentDirectory);
    const reachedFileSystemRoot = parentDirectory === currentDirectory;

    if (reachedFileSystemRoot) {
      return path.resolve(startDirectory);
    }

    currentDirectory = parentDirectory;
  }
}

export function resolveLogDirectory(configuredDirectory?: string): string {
  if (configuredDirectory) {
    return path.resolve(configuredDirectory);
  }

  const workspaceRoot = findWorkspaceRoot(process.cwd());
  return path.join(workspaceRoot, DEFAULT_LOG_FOLDER_NAME);
}

export function ensureLogDirectories(rootDirectory: string): void {
  for (const category of Object.values(LOG_CATEGORIES)) {
    mkdirSync(path.join(rootDirectory, category), { recursive: true });
  }
}
