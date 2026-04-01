# Amkyaw VPN

![Amkyaw VPN Logo](frontend/public/logo.svg)

A production-ready VPN dashboard application built with FastAPI (backend) and Next.js (frontend), featuring PWA support for offline access.

## 👨‍💻 Developer

**Amkyaw** - Full Stack Developer

- GitHub: [@amkyawdev](https://github.com/amkyawdev)
- Email: amkyaw.dev@example.com

## Features

- **Free VPN Servers**: Access free VPN servers from VPN Gate
- 📊 **Dashboard**: User-friendly interface with server filtering, search, and pagination
- 📱 **PWA Support**: Install as a native app on desktop and mobile
- 🔌 **Offline Access**: Service worker provides basic offline functionality
- 📥 **CSV Export**: Download server list as CSV file
- 🛡️ **Production Ready**: Built with security best practices

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **BeautifulSoup4** - Web scraping

### Frontend
- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Lucide React** - Icons

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Orchestration

## Project Structure

```
amkyaw-vpn/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/v1/      # API endpoints
│   │   ├── core/        # Security & configuration
│   │   ├── schemas/     # Pydantic models
│   │   └── services/    # VPN Gate scraper
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/            # Next.js frontend
│   ├── src/
│   │   ├── app/         # App router pages
│   │   ├── components/ # React components
│   │   ├── hooks/      # Custom hooks
│   │   └── store/       # Zustand state
│   ├── public/
│   │   └── icons/       # PWA icons
│   ├── Dockerfile
│   └── package.json
├── data/
│   └── vpn_servers.csv  # VPN server data (95 servers)
├── infra/
│   └── docker-compose.yml
└── README.md
```

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/amkyawdev/amkyaw-vpn.git
cd amkyaw-vpn

# Start all services
docker-compose -f infra/docker-compose.yml up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api/v1
# API Docs: http://localhost:8000/api/v1/docs
```

### Manual Setup

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## Environment Variables

### Backend

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | `amkyaw-vpn-secret-key-change-in-production` | Secret key for security |
| `CSV_DATA_PATH` | `/data/vpn_servers.csv` | Path to store VPN server data |
| `VPNGATE_SCRAPING_ENABLED` | `true` | Enable/disable scraping |
| `SCRAPING_INTERVAL_HOURS` | `6` | Scraping interval |

### Frontend

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api/v1` | Backend API URL |

## API Endpoints

### Servers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/servers` | List all VPN servers |
| GET | `/api/v1/servers/countries` | List available countries |
| GET | `/api/v1/servers/export/csv` | Export servers as CSV |
| POST | `/api/v1/servers/refresh` | Refresh server list |
| GET | `/api/v1/servers/{id}` | Get server details |
| GET | `/api/v1/servers/status` | Get server status |

### Root

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Root endpoint |
| GET | `/health` | Health check |

## PWA Installation

The frontend can be installed as a Progressive Web App:

1. Open http://localhost:3000 in a browser
2. Click "Install App" button (or use browser's install option)
3. The app will be installed and available offline

## Security Considerations

- ⚠️ Change the default `SECRET_KEY` in production
- 🔒 Use HTTPS in production
- ✅ Follow principle of least privilege
- ✅ Validate and sanitize all user inputs
- ✅ Never expose sensitive information in error messages

## How to Connect to VPN

This dashboard displays free VPN servers from VPN Gate. To connect:

### 1. Get OpenVPN Config Files
Visit [VPN Gate](https://www.vpngate.net/en/) to download configuration files:
- Click on a server entry
- Download the `.ovpn` configuration file
- Or use the "OpenVPN Config" link for each server

### 2. Install VPN Client
- **OpenVPN Connect**: https://openvpn.net/client/
- **WireGuard**: https://www.wireguard.com/install/

### 3. Connect
1. Open your VPN client
2. Import the `.ovpn` config file
3. Enter username/password (use `vpn` / `vpn`)
4. Connect!

### Note
This dashboard only displays server information. Actual VPN connection requires:
- OpenVPN or WireGuard client software
- Server configuration files (.ovpn or .conf)

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ by **Amkyaw**
