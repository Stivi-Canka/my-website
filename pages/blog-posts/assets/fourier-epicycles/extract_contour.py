"""
Extract contour points from the Albanian flag image and export to JavaScript format.
"""

import cv2
import numpy as np
import json

def extract_contour(image_path, output_path='path_data.js'):
    # Read the image
    img = cv2.imread(image_path)

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Apply binary threshold - adjusted for the specific image
    _, binary = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)

    # Apply morphological operations to connect nearby components
    kernel = np.ones((3,3), np.uint8)
    binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel, iterations=2)

    # Find contours - use SIMPLE approximation first to get smoother outline
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Get the largest contour (should be the eagle outline)
    largest_contour = max(contours, key=cv2.contourArea)

    # Approximate the contour to reduce noise and get smoother outline
    epsilon = 0.001 * cv2.arcLength(largest_contour, True)
    largest_contour = cv2.approxPolyDP(largest_contour, epsilon, True)

    # Extract points and normalize
    points = []
    for point in largest_contour:
        x = float(point[0][0])
        y = float(point[0][1])
        points.append([x, y])

    # Center and scale the points
    points_array = np.array(points)

    # Center the points
    center_x = np.mean(points_array[:, 0])
    center_y = np.mean(points_array[:, 1])
    points_array[:, 0] -= center_x
    points_array[:, 1] -= center_y

    # Scale to reasonable size (fit within ~400 pixel range)
    max_dimension = max(np.max(np.abs(points_array[:, 0])), np.max(np.abs(points_array[:, 1])))
    scale_factor = 150 / max_dimension  # Scale to fit nicely in canvas
    points_array *= scale_factor

    # Convert back to list
    normalized_points = points_array.tolist()

    # The contour points are already in sequential order from OpenCV
    # We just need to sample them evenly
    normalized_array = np.array(normalized_points)

    # Resample to get evenly spaced points using arc length parameterization
    # Calculate cumulative arc length
    diffs = np.diff(normalized_array, axis=0)
    segment_lengths = np.sqrt((diffs**2).sum(axis=1))
    cumulative_length = np.concatenate([[0], np.cumsum(segment_lengths)])
    total_length = cumulative_length[-1]

    # Create evenly spaced points along the arc length
    # More points = more detail and smoother result
    num_points = 1000
    target_lengths = np.linspace(0, total_length, num_points, endpoint=False)

    # Interpolate to get coordinates at target arc lengths
    from scipy import interpolate
    fx = interpolate.interp1d(cumulative_length, normalized_array[:, 0], kind='linear')
    fy = interpolate.interp1d(cumulative_length, normalized_array[:, 1], kind='linear')

    x_new = fx(target_lengths)
    y_new = fy(target_lengths)

    sampled_points = [[float(x), float(y)] for x, y in zip(x_new, y_new)]

    print(f"Original points: {len(points)}")
    print(f"Final interpolated points: {len(sampled_points)}")
    print(f"Bounding box: x=[{np.min(points_array[:, 0]):.1f}, {np.max(points_array[:, 0]):.1f}], "
          f"y=[{np.min(points_array[:, 1]):.1f}, {np.max(points_array[:, 1]):.1f}]")

    # Write to JavaScript file
    with open(output_path, 'w') as f:
        f.write('// Albanian Eagle Contour Data\n')
        f.write('// Extracted from albania-flag-outline.jpg\n\n')
        f.write('function getAlbanianEaglePath() {\n')
        f.write('    return ')

        # Write the array in a readable format
        json.dump(sampled_points, f, indent=4)

        f.write(';\n')
        f.write('}\n')

    print(f"\nContour data exported to {output_path}")
    print("You can now use this in your epicycles.js file!")

    # Optional: Save a preview image
    preview = cv2.cvtColor(binary, cv2.COLOR_GRAY2BGR)
    cv2.drawContours(preview, [largest_contour], -1, (0, 255, 0), 2)
    cv2.imwrite('contour_preview.jpg', preview)
    print("Preview saved to contour_preview.jpg")

if __name__ == '__main__':
    extract_contour('albanian-flag-outline.jpg')
