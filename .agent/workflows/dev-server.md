---
description: how to start the citizenmate dev server with portman localhost routing
---

# Start CitizenMate Dev Server

// turbo-all

1. Verify portman registration exists for the citizenmate project:

```bash
cd /Volumes/home/Documents/App/AuTest/citizenmate && portman status
```

If not registered, run:

```bash
cd /Volumes/home/Documents/App/AuTest/citizenmate && portman create
```

2. Ensure Caddy is running:

```bash
pgrep -x caddy > /dev/null && echo "Caddy running" || portman reload-caddy
```

3. Start the Next.js dev server on the portman-assigned port:

```bash
cd /Volumes/home/Documents/App/AuTest/citizenmate && npm run dev
```

4. Report the app URL:

```
https://citizenmate.localhost -> localhost:4000
```

The app should now be accessible at **https://citizenmate.localhost**.
