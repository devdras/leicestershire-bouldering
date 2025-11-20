export const gradeOrder = [
    'f3',
    'f3+',
    'f4',
    'f4+',
    'f5',
    'f5+',
    'f6a',
    'f6a+',
    'f6b',
    'f6b+',
    'f6c',
    'f6c+',
    'f7a',
    'f7a+',
    'f7b',
    'f7b+',
    'f7c',
    'f7c+',
    'f8a',
    'f8a+',
    'f8b',
    'f8b+',
    'f8c',
    'f8c+',
    'f9a',
];

export interface GradeData {
    grade: string;
    count: number;
}

export const gradeMap = (grades: string[]): GradeData[] => {
    // Count occurrences of each grade
    const gradeCounts = new Map<string, number>();

    grades.forEach((grade) => {
        const lowerGrade = grade.toLowerCase();
        gradeCounts.set(lowerGrade, (gradeCounts.get(lowerGrade) || 0) + 1);
    });

    // Convert to array format
    const gradeData: GradeData[] = Array.from(gradeCounts.entries()).map(
        ([grade, count]) => ({
            grade,
            count,
        })
    );

    // Sort by predefined grade order
    const sortedArray = gradeData.sort((a, b) => {
        const indexA = gradeOrder.indexOf(a.grade);
        const indexB = gradeOrder.indexOf(b.grade);

        // If grade not found in order, put it at the end
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;

        return indexA - indexB;
    });

    return sortedArray;
};
