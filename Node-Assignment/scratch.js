function pagination(data, page, size) {
  const startPage = (page - 1) * size
  const endPage = startPage + size

  return data.slice(startPage, endPage)
}

console.log(pagination([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 22], 3, 5))
