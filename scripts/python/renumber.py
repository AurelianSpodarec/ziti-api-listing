import csv


def process_csv(input_file_path, output_file_path):
    # Read the CSV file and convert it to a list of lists
    with open(input_file_path, "r", newline="", encoding="utf-8") as file:
        reader = csv.reader(file)
        data = list(reader)

    # Sorting the data by the third column
    data.sort(key=lambda x: int(x[2]))

    # Replace the number in the first column
    for i, row in enumerate(data, start=1):
        row[0] = str(i)

    # Write the processed data to the output CSV file
    with open(output_file_path, "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerows(data)


# Specify the paths to your input and output CSV files
input_csv_path = "./sectores.csv"
output_csv_path = "./sectores-renumbered.csv"

# Call the function with the file paths
process_csv(input_csv_path, output_csv_path)
