export const gradeOrder = [
  "f3",
  "f3+",
  "f4",
  "f4+",
  "f5",
  "f5+",
  "f6a",
  "f6a+",
  "f6b",
  "f6b+",
  "f6c",
  "f6c+",
  "f7a",
  "f7a+",
  "f7b",
  "f7b+",
  "f7c",
  "f7c+",
  "f8a",
  "f8a+",
  "f8b",
  "f8b+",
  "f8c",
  "f8c+",
  "f9a",
];

export const gradeMap = (data: any[]) => {
  const gradeArray: string[] = [];

  // Recursive function to find 'routes' in nested objects
  const findRoutes = (items: any[]) => {
    items.forEach((item) => {
      if (Array.isArray(item.routes)) {
        item.routes.forEach((route: any) => gradeArray.push(route.grade));
      } else if (Array.isArray(item.blocks) || Array.isArray(item.sections)) {
        findRoutes(item.blocks || item.sections);
      }
    });
  };

  // Start recursion
  findRoutes(data);

  // Get unique grades
  const uniqueGrades = [...new Set(gradeArray)];

  // Count occurrences of each grade
  const gradeCount = uniqueGrades.map((grade) => ({
    grade,
    count: gradeArray.filter((item) => item === grade).length,
  }));

  // Sort by predefined grade order
  const sortedArray = gradeCount.sort((a, b) => {
    return gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade);
  });

  return sortedArray;
};
