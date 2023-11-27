import requests
import json
import sys
import jwt

BROKER_NAME = "broker"
BROKER_PASS = "3r0k3r"
API_URL = sys.argv[1]


def get_payload (username, deviceName, parameterName, recentValue):
    encoded_jwt = jwt.encode({"username":username, "deviceName":deviceName, "parameterName":parameterName, "recentValue": recentValue, "brokerName": BROKER_NAME, "password":BROKER_PASS}, "secret", algorithm="HS256")
    return {"token":encoded_jwt.decode('utf-8')}

payload = get_payload (sys.argv[2], sys.argv[3], sys.argv[4], float(sys.argv[5]))
req = requests.post (API_URL, json.dumps(payload))
print (req.text)
