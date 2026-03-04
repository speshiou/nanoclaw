# Intent

Initialize and start the `MenubarController` on macOS to provide a native menu bar icon for the NanoClaw service.

# Strategy

1. Import `MenubarController` from `./extensions/menubar/menubar-controller.js`.
2. In the `main` function (or similar entry point), create an instance of `MenubarController` passing the `PROJECT_ROOT`.
3. Call `start()` on the controller instance.

# Invariants

- Only start if `process.platform === 'darwin'`.
- Ensure the controller is started before the main message loop begins.
- Handle graceful shutdown if possible by calling `stop()`.
