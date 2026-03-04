import AppKit

class AppDelegate: NSObject, NSApplicationDelegate {
    var statusItem: NSStatusItem?

    func applicationDidFinishLaunching(_ notification: Notification) {
        // Create the status item in the menu bar
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        
        if let button = statusItem?.button {
            button.title = "🐾" // NanoClaw Icon
        }
        
        // Create the menu
        let menu = NSMenu()
        
        let titleItem = NSMenuItem(title: "NanoClaw Assistant", action: nil, keyEquivalent: "")
        titleItem.isEnabled = false
        menu.addItem(titleItem)
        
        menu.addItem(NSMenuItem.separator())
        
        let restartItem = NSMenuItem(title: "Restart NanoClaw", action: #selector(handleAction), keyEquivalent: "r")
        restartItem.representedObject = "restart"
        menu.addItem(restartItem)
        
        let logsItem = NSMenuItem(title: "Open Logs Folder", action: #selector(handleAction), keyEquivalent: "l")
        logsItem.representedObject = "open_logs"
        menu.addItem(logsItem)
        
        menu.addItem(NSMenuItem.separator())
        
        let quitItem = NSMenuItem(title: "Quit NanoClaw", action: #selector(quit), keyEquivalent: "q")
        menu.addItem(quitItem)
        
        statusItem?.menu = menu
    }

    @objc func handleAction(_ sender: NSMenuItem) {
        if let event = sender.representedObject as? String {
            // Print JSON to stdout for Node.js to read
            print("{\"event\": \"\(event)\"}")
            fflush(stdout)
        }
    }

    @objc func quit() {
        print("{\"event\": \"quit\"}")
        fflush(stdout)
        NSApplication.shared.terminate(nil)
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
// Set to accessory to hide from dock/Cmd+Tab
app.setActivationPolicy(.accessory)
app.run()
