function twoSum(nums: number[], target: number): number[] {
  const hashTable: { [key: number]: number } = {};

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (complement in hashTable) {
      return [hashTable[complement], i];
    } else {
      hashTable[nums[i]] = i;
    }
  }

  return [];
}