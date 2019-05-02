class Solution:
    def rotate(self, matrix):
        """
        Do not return anything, modify matrix in-place instead.
        """
        size_mat = len(matrix)
        start, end = 0, size_mat-1

        for k in range(1):#size_mat//2):
            for i in range(start,end):
                temp = matrix[start][end-i]
                matrix[start][end-i] = matrix[i+1][start]
                matrix[i+1][start] = matrix[end][i+1]
                matrix[end][i+1] = matrix[end-i][end]
                matrix[end-i][end] = temp
            start+=1
            end-=1




input = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
'''
input = [
  [ 5, 1, 9,11],
  [ 2, 4, 8,10],
  [13, 3, 6, 7],
  [15,14,12,16]
]
'''

sol = Solution()
sol.rotate(input)
print(input)