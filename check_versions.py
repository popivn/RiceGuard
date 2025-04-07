import sys
import platform
import os
import pkg_resources
import random
import numpy as np
import tensorflow as tf
import torch

print("=== System Information ===")
print(f"Python version: {sys.version}")
print(f"Platform: {platform.platform()}")
print(f"Processor: {platform.processor()}")
print(f"OS: {platform.system()} {platform.release()}")

print("\n=== Package Versions ===")
packages = [
    "numpy", "tensorflow", "torch", "fastapi", "uvicorn", 
    "ultralytics", "pillow", "opencv-python"
]

for package in packages:
    try:
        version = pkg_resources.get_distribution(package).version
        print(f"{package}: {version}")
    except pkg_resources.DistributionNotFound:
        print(f"{package}: Not installed")

print("\n=== Random/Entropy Sources ===")
print(f"PYTHONHASHSEED: {os.environ.get('PYTHONHASHSEED', 'Not set')}")

# Check availability of /dev/urandom and /dev/random
for device in ['/dev/urandom', '/dev/random']:
    try:
        with open(device, 'rb') as f:
            random_bytes = f.read(4)
            print(f"{device}: Available ({random_bytes.hex()})")
    except Exception as e:
        print(f"{device}: Not available - {str(e)}")

# Test creating a random number with different methods
print("\n=== Random Number Generation ===")
try:
    print(f"random.random(): {random.random()}")
except Exception as e:
    print(f"random.random() error: {str(e)}")

try:
    print(f"numpy.random.rand(): {np.random.rand()}")
except Exception as e:
    print(f"numpy.random.rand() error: {str(e)}")

try:
    print(f"torch.rand(1): {torch.rand(1).item()}")
except Exception as e:
    print(f"torch.rand(1) error: {str(e)}")

# Check CUDA availability
print("\n=== CUDA Information ===")
print(f"CUDA_VISIBLE_DEVICES: {os.environ.get('CUDA_VISIBLE_DEVICES', 'Not set')}")
print(f"torch.cuda.is_available(): {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"CUDA version: {torch.version.cuda}")
    print(f"GPU Count: {torch.cuda.device_count()}")
    for i in range(torch.cuda.device_count()):
        print(f"Device {i}: {torch.cuda.get_device_name(i)}")

# TensorFlow specific
print("\n=== TensorFlow Devices ===")
print(f"TF physical devices: {tf.config.list_physical_devices()}") 