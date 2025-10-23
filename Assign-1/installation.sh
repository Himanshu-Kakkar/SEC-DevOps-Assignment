#!/bin/bash
# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Starting Automated Installation for macOS ---"


# TASK 1: Install Homebrew for macOS

echo "--- 1. Checking for Homebrew ---"
if ! command -v brew &> /dev/null
then
    echo "[INFO] Homebrew not found. Installing Homebrew..."
    # Install Homebrew
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    

    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
else
    echo " Homebrew is already installed. Updating..."
    brew update
fi


# TASK 2: Install System Prerequisites (Java)

echo "--- 2. Installing Java (OpenJDK 17) ---"
# Jenkins requires Java. I am installing OpenJDK 17.
brew install openjdk@17


sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
echo "Java version check:"
java -version


# TASK 3: Install Docker

echo "--- 3. Installing Docker Desktop ---"
# On macOS, Docker runs as a desktop application ('cask').
brew install --cask docker


echo "!!Manually Installed Docker Application"



# TASK 4: Install Git

echo "--- 4. Installing Git ---"
# Git may already be installed with Xcode, but this ensures it's up to date.
brew install git


# TASK 5: Install and Start Jenkins

echo "--- 5. Installing Jenkins (LTS) ---"

brew install jenkins-lts


brew services start jenkins-lts

echo "Jenkins is now running on http://localhost:8080"
echo "Your macOS firewall may pop up asking to 'Allow incoming connections' for Java. Please accept this."


# TASK 6: Verify Installations

echo "--- 6. Verifying Installations ---"

echo "Git Version:"
git --version

echo "[Verification] Jenkins Status (should show 'started'):"

brew services list | grep jenkins-lts

echo "[Verification] Docker: (Remember to start the Docker Desktop app first!)"
echo "--> To check Docker, first open the Docker.app, then run this in your terminal: docker --version"


echo "Installation Complete!"

echo "Access Jenkins at: http://localhost:8080"
echo "Get the initial Jenkins admin password with:"

# The password path is different on macOS
echo "cat ~/.jenkins/secrets/initialAdminPassword"
