import { rename } from "fs/promises";
import { spawn } from "child_process";

const hiddenApi = "app/_api_hold";

async function restore() {
  await rename(hiddenApi, "app/api").catch(() => {});
}

await rename("app/api", hiddenApi);
try {
  await new Promise((resolve, reject) => {
    const child = spawn("npx", ["next", "build"], {
      stdio: "inherit",
      env: {
        ...process.env,
        NEXT_OUTPUT: "export",
        NEXT_PUBLIC_BASE_PATH: "/blotato121",
        NEXT_PUBLIC_STATIC: "1",
      },
    });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`next build exited ${code}`))));
  });
} finally {
  await restore();
}
