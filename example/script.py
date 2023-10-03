import pandas as pd

# Read table.csv into a dataframe
df = pd.read_csv('table.csv')

# Calculate statistics for numeric columns
stats = df.describe()

# Display the statistics
print(stats)