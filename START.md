# Starting the Dev Environment

Press **`Ctrl+Shift+S`** — that's it.

Or manually: `Ctrl+Shift+P` → `Tasks: Run Task` → **`Dev: Start Servers`**

The `!` tab opens first and checks ports, then the server starts.

Terminal tabs:

- **Sygnal: !** — pre-flight check (stays open)
- **Sygnal: Docs** — Next.js docs server on port 3000

## URLs

| Server | URL |
|---|---|
| Docs | http://localhost:3000 |

## Stopping

Click each terminal tab and press `Ctrl+C`.

## First-time setup

Add this to your global VS Code keybindings (`Ctrl+Shift+P` → `Open Keyboard Shortcuts (JSON)`):

    { "key": "ctrl+shift+s", "command": "workbench.action.tasks.runTask", "args": "Dev: Start Servers" }
