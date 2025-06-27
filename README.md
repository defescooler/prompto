<h1 align="center">
  <br>
  <img src="https://github.com/user-attachments/assets/fc960221-0bcf-4f7e-9204-b83c1e2fdea2" alt="Prompto" width="400">
  <br>
</h1>

<h4 align="center">AI-powered prompt enhancement for ChatGPT, Claude, and Gemini.</h4>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT">
  </a>
  <a href="https://www.python.org/downloads/">
    <img src="https://img.shields.io/badge/Python-3.11+-blue.svg" alt="Python">
  </a>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/React-19-blue.svg" alt="React">
  </a>
  <a href="https://www.docker.com/">
    <img src="https://img.shields.io/badge/Docker-Supported-blue.svg" alt="Docker">
  </a>
</p>

## Overview

Prompto is a complete system for writing better AI prompts. It provides real-time enhancement and analytics through a web dashboard and a Chrome extension, powered by a FastAPI backend and Google's Gemini AI.

## Core Components

-   **Backend**: A Python FastAPI server that handles user authentication, database operations, and prompt enhancement via the Gemini API.
-   **Frontend**: A React-based web dashboard for managing prompts, viewing analytics, and user account settings.
-   **Chrome Extension**: A Manifest V3 extension that injects prompt enhancement controls directly into supported AI chat platforms.

## Tech Stack

| Component         | Technologies                               |
| ----------------- | ------------------------------------------ |
| **Backend**       | Python, FastAPI, SQLAlchemy, PostgreSQL    |
| **Frontend**      | React 19, Vite, Tailwind CSS, shadcn/ui    |
| **Chrome Ext.**   | TypeScript, React, Vite, Manifest V3       |
| **AI**            | Google Gemini API                          |
| **Deployment**    | Docker, Docker Compose                     |

## Quick Start

The fastest way to get Prompto running is with Docker.

### Prerequisites

-   Docker & Docker Compose
-   Git
-   A Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/defescooler/prompto.git
    cd prompto
    ```

2.  **Configure your environment:**
    Copy the example environment file and add your Gemini API key.
    ```sh
    cp backend/env.example backend/.env
    nano backend/.env
    ```

3.  **Launch the services:**
    ```sh
    docker compose up --build -d
    ```

### Accessing the System

-   **Web Dashboard**: `http://localhost:5173`
-   **Backend API**: `http://localhost:8000`
-   **API Docs**: `http://localhost:8000/docs`

### Chrome Extension Setup

1.  Navigate to `chrome://extensions` in your Chrome browser.
2.  Enable **Developer mode**.
3.  Click **Load unpacked**.
4.  Select the `extension/` directory from the project.

## License

This project is licensed under the MIT License.

