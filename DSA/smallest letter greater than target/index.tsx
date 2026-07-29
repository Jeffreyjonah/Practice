//Question 744
function nextGreatestLetter(letters: string[], target: string): string {
	let left = 0;
	let right = letters.length - 1;
	let result = '';

	while (left <= right) {
		let mid = Math.floor((left + right) / 2);

		if (letters[mid] > target) {
			result = letters[mid];
			right = mid - 1;
		} else {
			left = mid + 1;
		}
	}
	return result || letters[0];
}
