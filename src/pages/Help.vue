<!-- Controls layout and keybindings reference -->
<script setup lang="ts"></script>

<template>
  <div class="help-page">
    <header class="help-header">
      <h1>Controls &amp; Reference</h1>
      <p>Quick reference for gamepad and keyboard controls during rover operation.</p>
    </header>

    <div class="help-grid">
      <!-- Operation Modes -->
      <section class="help-card">
        <h2>Operation Modes</h2>
        <table class="help-table">
          <tbody>
            <tr>
              <td class="key-cell"><kbd>Disable</kbd></td>
              <td>Stop all rover motion — safe state, no commands sent</td>
            </tr>
            <tr>
              <td class="key-cell"><kbd>TeleOp</kbd></td>
              <td>Manual teleoperation via gamepad — driving and arm control active</td>
            </tr>
            <tr>
              <td class="key-cell"><kbd>Auto</kbd></td>
              <td>Autonomous navigation — rover follows planned waypoints</td>
            </tr>
          </tbody>
        </table>
        <p class="help-note">
          Always <strong>Disable</strong> before connecting or disconnecting hardware.
        </p>
      </section>

      <!-- Driving (Gamepad) -->
      <section class="help-card">
        <h2>Driving — Gamepad</h2>
        <table class="help-table">
          <tbody>
            <tr>
              <td class="key-cell"><kbd>L Stick</kbd></td>
              <td>Throttle (forward / reverse)</td>
            </tr>
            <tr>
              <td class="key-cell"><kbd>R Stick</kbd></td>
              <td>Steering (turn left / right)</td>
            </tr>
            <tr>
              <td class="key-cell"><kbd>L2 / R2</kbd></td>
              <td>Fine-speed modifiers (hold to reduce speed)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Arm (Gamepad) -->
      <section class="help-card">
        <h2>Arm — Gamepad</h2>
        <table class="help-table">
          <tbody>
            <tr>
              <td class="key-cell"><kbd>L Stick</kbd></td>
              <td>Shoulder joint (up / down)</td>
            </tr>
            <tr>
              <td class="key-cell"><kbd>R Stick</kbd></td>
              <td>Elbow joint (up / down)</td>
            </tr>
            <tr>
              <td class="key-cell"><kbd>D-Pad ↑↓</kbd></td>
              <td>Wrist pitch</td>
            </tr>
            <tr>
              <td class="key-cell"><kbd>D-Pad ←→</kbd></td>
              <td>Wrist roll / turntable</td>
            </tr>
            <tr>
              <td class="key-cell"><kbd>L1 / R1</kbd></td>
              <td>Gripper open / close</td>
            </tr>
          </tbody>
        </table>
        <p class="help-note">
          Switch between driving and arm modes from the <strong>Arm</strong> page.
        </p>
      </section>

      <!-- Navigation quick tips -->
      <section class="help-card">
        <h2>Navigation Tips</h2>
        <ul class="help-list">
          <li>The <strong>Home</strong> page shows velocity, system status, and rover connection at a glance.</li>
          <li>Use <strong>Cameras</strong> to monitor all live video feeds.</li>
          <li>The <strong>Map</strong> page lets you place GPS waypoints for autonomous navigation.</li>
          <li>
            <strong>Telemetry</strong> shows per-motor data — use the record function to export a
            CSV for post-run analysis.
          </li>
          <li>
            Connection settings are <strong>persistent</strong> — your last rover address is
            remembered between sessions.
          </li>
        </ul>
      </section>

      <!-- ROS Bridge info -->
      <section class="help-card">
        <h2>Rover Connection</h2>
        <table class="help-table">
          <tbody>
            <tr>
              <td class="key-cell">Competition</td>
              <td><code>ws://10.0.0.10:9090</code></td>
            </tr>
            <tr>
              <td class="key-cell">Local</td>
              <td><code>ws://192.168.0.146:9090</code></td>
            </tr>
            <tr>
              <td class="key-cell">Dev</td>
              <td><code>ws://localhost:9090</code></td>
            </tr>
          </tbody>
        </table>
        <p class="help-note">
          Use <strong>Auto-Discover</strong> on the Home page or in Settings to scan your local
          network automatically.
        </p>
      </section>

      <!-- Troubleshooting -->
      <section class="help-card">
        <h2>Troubleshooting</h2>
        <ul class="help-list">
          <li>
            <strong>ROVER indicator red</strong> — check that the rover is powered on and the
            rosbridge server is running (<code>ros2 launch rosbridge_server rosbridge_websocket_launch.xml</code>).
          </li>
          <li>
            <strong>High ping / timeouts</strong> — ensure you're on the same network segment as the
            rover and no firewall is blocking port 9090.
          </li>
          <li>
            <strong>Gamepad not detected</strong> — press any button on the gamepad to wake it, then
            check the CTRL indicator in the navbar.
          </li>
          <li>
            <strong>Camera feed blank</strong> — verify the camera topics are being published
            on the rover.
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.help-page {
  height: calc(100vh - var(--nav-bar-size));
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 1.5rem 2rem;
  gap: 1.5rem;
}

.help-header {
  h1 {
    font-size: 2rem;
    color: var(--white);
    margin-bottom: 0.25rem;
  }

  p {
    color: var(--dark-white);
    font-size: 0.95rem;
  }
}

.help-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
  gap: 1rem;
}

.help-card {
  background-color: var(--component-background);
  border: 1px solid var(--light-grey);
  border-top: 2px solid var(--tf-green-mid);
  border-radius: 4px;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  h2 {
    font-size: 1rem;
    color: var(--tf-green);
    margin-bottom: 0.25rem;
  }
}

.help-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;

  tr:not(:last-child) td {
    border-bottom: 1px solid var(--light-grey);
  }

  td {
    padding: 0.45rem 0.5rem;
    color: var(--dark-white);
    vertical-align: middle;
  }
}

.key-cell {
  white-space: nowrap;
  width: 30%;

  kbd,
  code {
    font-family: 'Overpass', monospace;
    font-size: 0.78rem;
    background-color: var(--dark-grey);
    border: 1px solid var(--light-grey);
    border-radius: 3px;
    padding: 1px 6px;
    color: var(--white);
  }
}

.help-note {
  font-size: 0.8rem;
  color: var(--dark-white);
  opacity: 0.7;
  font-style: italic;
  margin-top: auto;

  strong {
    color: var(--white);
    font-style: normal;
  }
}

.help-list {
  list-style: disc;
  padding-left: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.88rem;
  color: var(--dark-white);

  strong {
    color: var(--white);
  }

  code {
    font-family: 'Overpass', monospace;
    font-size: 0.78rem;
    color: var(--tf-green);
    background-color: var(--dark-grey);
    padding: 1px 5px;
    border-radius: 3px;
  }
}
</style>
