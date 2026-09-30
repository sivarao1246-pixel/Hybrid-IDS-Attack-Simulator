# Hybrid IDS Attack Simulator

A standalone defensive demo website with four buttons:
- Port Scan
- Brute Force
- Suspicious HTTP
- ML Anomaly

It sends controlled JSON events to the existing Hybrid IDS API. It does not perform real network attacks.

## Run locally

From this folder:

```powershell
python -m http.server 5500
```

Open:

`http://localhost:5500`

The backend URL is configured in `script.js`:

`https://hybrid-ids-security-monitoring-system.onrender.com`

## GitHub Pages

If you host this as a separate GitHub Pages site, add its exact origin to the FastAPI CORS allow-list in `backend/app/main.py`, then redeploy the backend.

Example:

```python
allow_origins=[
    "http://localhost:5500",
    "https://YOUR-USERNAME.github.io",
]
```
