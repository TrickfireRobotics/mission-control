# **Mission Control**

The mission control is the human interface to communicate bidirectionally (Sends and receives information) with the rover. For example, sending joystick inputs to the rover or displaying the rover's camera feed in realtime. This is done through a websocket server that is ran on the rover.

![image](https://github.com/user-attachments/assets/a93314da-d956-468a-8d9c-59329f747919)

### `Getting Started`

For an introduction, please refer to the [Getting Started Guide](./docs/getting_started.md).

For a code-level overview, check out the [Code Overview](./docs/code_overview.md).

If you're working on mission control development, please follow the [installation.\_guide.md](./docs/installation_guide.md)

## **Running Mission Control for those not working on Mission Control**

Follow the steps below based on your role and setup:

### **For Software Members not working on mission control**

- **Testing Locally (on personal Docker):**
  - Visit [Mission Control](https://www.trickfirerobotics.org/mission-control/) and follow the URC instructions to run the Docker container. Click on the Navbar websocket icon to switch to local development
- **Running on the Rover:**
  - Visit [Mission Control](https://www.trickfirerobotics.org/mission-control/) and follow the **Launching on Rover** instructions below.

### **For Non-Software Members**

Visit [Mission Control](https://www.trickfirerobotics.org/mission-control/) and follow the **Launching on Rover** instructions below.

## **Launching on Rover**

Setup router and ensure connect to trickfirerouter on your computer. The router password is on the router itself Turn the rover computer on by plugging in the c port charger. You will know the computer is on if the LED lights up.
Run the commands below in Powershell or in your OS terminal. When prompted for a password, please ask a software member.

```
Open Powershell or Terminal
> ssh trickfire@192.168.0.145
In Bash Now
> cd ~/urc-2023
> sudo ./container_launch.sh
In Docker Now
> cd /home/trickfire/urc-2023
> ./build.sh
> ./launch.sh
```
