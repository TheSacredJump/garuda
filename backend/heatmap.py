#!/usr/bin/env python3

from flask import Flask, jsonify, request
from collections import defaultdict
import math

# Initialize Flask app
app = Flask(__name__)

# Geotagged data points (latitude, longitude)
data_points = [
    {"lat": 37.7749, "lon": -122.4194},  # San Francisco
    {"lat": 34.0522, "lon": -118.2437},  # Los Angeles
    {"lat": 40.7128, "lon": -74.0060},  # New York
    {"lat": 51.5074, "lon": -0.1278},  # London
    {"lat": 35.6895, "lon": 139.6917},  # Tokyo
    # Add more points here as needed
]

# Function to add a new data point
@app.route('/add_point', methods=['POST'])
def add_data_point():
    new_point = request.json
    data_points.append(new_point)
    print(data_points)
    return jsonify({"status": "success", "new_point": new_point}), 200

# Function to aggregate and output heatmap data
@app.route('/', methods=['GET'])
def get_heatmap_data():
    # Define grid size (in degrees)
    grid_size = 0.01  # Adjust this value to change the clustering distance

    # Aggregate data points into grid cells
    aggregated_data = defaultdict(lambda: {"lat_sum": 0, "lon_sum": 0, "count": 0})

    for point in data_points:
        grid_lat = math.floor(point["lat"] / grid_size)
        grid_lon = math.floor(point["lon"] / grid_size)
        key = (grid_lat, grid_lon)
        aggregated_data[key]["lat_sum"] += point["lat"]
        aggregated_data[key]["lon_sum"] += point["lon"]
        aggregated_data[key]["count"] += 1

    # Calculate average location and determine color intensity
    heatmap_data = []
    max_count = max(value["count"] for value in aggregated_data.values()) if aggregated_data else 1
    for key, value in aggregated_data.items():
        avg_lat = value["lat_sum"] / value["count"]
        avg_lon = value["lon_sum"] / value["count"]
        color, radius = determine_color(value["count"], max_count)
        heatmap_data.append({
            "location": {"lat": avg_lat, "lng": avg_lon},
            "count": value["count"],
            "color": color,
            "radius": radius
        })

    return jsonify(heatmap_data)

def determine_color(count, max_count):
    # Normalize the count to a value between 0 and 1
    normalized_count = count / max_count
    # Map the normalized count to a color spectrum
    if normalized_count > 0.75:
        return "red", 20
    elif normalized_count > 0.5:
        return "orange", 15
    elif normalized_count > 0.25:
        return "yellow", 10
    else:
        return ""

if __name__ == '__main__':
    app.run(host="localhost", port=8080)

