import urllib.request
import urllib.parse
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# 1. Fetch Token using credentials from .env (I'll extract them from the .env)
# Oh wait, the user's vite proxy fetches token via Copernicus IAM. I can just hit the user's proxy!
