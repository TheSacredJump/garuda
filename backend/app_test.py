#!/usr/bin/env python3

from flask import Flask
import requests
import json

def test_flask():
    data_point = {"lat": 51.5074, "lon": -0.1278}
    response = requests.post("http://localhost:8080/add_point", json=data_point)
    print(response)
    return "Hello, World!"

if __name__ == "__main__":
    print('starting test')
    test_flask()