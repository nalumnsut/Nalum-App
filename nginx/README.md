# Nginx and Let's Encrypt

Set `NGINX_SERVER_NAME` to the deployed DNS name and point its A/AAAA records
at the host before requesting a certificate. Nginx proxies `/api/` to the main
backend and WebSocket upgrades at `/ws` to chatserver; browsers should connect
to `wss://<domain>/ws` in production.

Run Certbot with the mounted `/var/www/certbot` webroot to create the initial
certificate, then reload nginx. Local development uses direct HTTP ports and
does not use this configuration.
