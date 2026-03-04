---
name: add-menubar
description: Adds a native macOS menu bar icon (🐾) to NanoClaw for visual status, restarting the service, and opening logs.
---

# Add macOS Menubar Icon

This skill adds a lightweight, native macOS menu bar icon to NanoClaw. It uses a Swift script bridge to provide a GUI presence without the overhead of Electron or third-party binaries.

## Phase 1: Pre-flight

### Validate Platform

This skill only works on macOS.

```bash
uname
```
(Should be `Darwin`)

## Phase 2: Apply Code Changes

Run the skills engine to apply the code changes:

```bash
npx tsx scripts/apply-skill.ts .claude/skills/add-menubar
```

This will:
- Add `src/menubar.swift` (Native Swift script)
- Add `src/menubar-controller.ts` (Node.js bridge)
- Modify `src/index.ts` to initialize and start the menubar icon.

## Phase 3: Build & Restart

Rebuild the project to include the new controller:

```bash
npm run build
```

Restart the service to see the icon:

```bash
launchctl kickstart -k gui/$(id -u)/com.nanoclaw
```

## Phase 4: Verify

You should now see a 🐾 icon in your macOS menu bar.

### Test Actions
1. Click the 🐾 icon.
2. Select **Open Logs Folder**. Finder should open to the NanoClaw logs directory.
3. Select **Restart NanoClaw**. The icon should momentarily disappear and reappear as the service restarts.

## Troubleshooting

### Icon Doesn't Appear
Check if the service is running:
```bash
launchctl list | grep nanoclaw
```

Check the logs for any errors starting the menubar controller:
```bash
tail -f logs/nanoclaw.error.log
```

Ensure Xcode Command Line Tools are installed (required for `swift` command):
```bash
xcode-select -p
```
If not found, run `xcode-select --install`.

### Removal

To remove the menu bar icon:
1. Use the uninstaller (if available) or manually:
2. Delete `src/menubar.swift` and `src/menubar-controller.ts`.
3. Revert changes in `src/index.ts`.
4. Rebuild and restart the service.
