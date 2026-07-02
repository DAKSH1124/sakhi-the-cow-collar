import kagglehub
import os
import pandas as pd

# Download latest version
path = kagglehub.dataset_download("shahhet2812/cattle-health-and-feeding-data")

print("Path to dataset files:", path)

# List files in the directory
files = os.listdir(path)
print("Files in dataset:", files)

# Read the first CSV file if available
for file in files:
    if file.endswith('.csv'):
        csv_path = os.path.join(path, file)
        print(f"\nReading {file}:")
        df = pd.read_csv(csv_path)
        print("Shape:", df.shape)
        print("\nColumns:", list(df.columns))
        print("\nFirst 3 rows:")
        print(df.head(3).to_string())
        break
