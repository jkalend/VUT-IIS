import requests
import json
import jwt

BROKER_NAME = "cultsauce"
BROKER_PASS = "cultsauce"
API_URL = "http://localhost:3000/api/broker/"


def get_payload (deviceId, paramId, recentValue):
    encoded_jwt = jwt.encode({"deviceId":deviceId, "paramId":paramId, "recentValue":recentValue, "username": BROKER_NAME, "password":BROKER_PASS}, "secret", algorithm="HS256")
    return {"token":encoded_jwt.decode('utf-8')}

payload = get_payload (20,1,420)
req = requests.post (API_URL, json.dumps(payload))
print (req.text)