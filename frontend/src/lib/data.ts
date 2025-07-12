// TEMPORARY DATA


export type CoefficientKey = "ZERO_POINT_FIVE" | "ONE" | "ONE_POINT_FIVE" | "TWO";

export type DurationKey ="THREE" | "ONE" | "ONE_POINT_FIVE" | "TWO"

export const coefTable: Record<CoefficientKey, number> = {
  "ZERO_POINT_FIVE": 0.5,
  "ONE": 1,
  "ONE_POINT_FIVE": 1.5,
  "TWO": 2,
};

export const durationTable: Record<DurationKey, number> = {
  "THREE": 3,
  "ONE": 1,
  "ONE_POINT_FIVE": 1.5,
  "TWO": 2,
};

export const search = (data: any[], query: string, keys: string[]) => {
  if (!query) return data;
  
  const lowerQuery = query.toLowerCase();
  console.log(data)
  return data.filter((item) => {
    return keys.some((key) => {
      // Gestion des clés imbriquées
      const value = key.split('.').reduce((obj, k) => obj?.[k], item);
      // // Conversion des enums/constantes en string
      if (key === 'duration' || key === 'exam.duration') {
        return String(durationTable[value as DurationKey]).toLowerCase().includes(lowerQuery);
      }

      if (key === 'subject.coefficient' || key === 'exam.subject.coefficient') {
        return String(coefTable[value as CoefficientKey]).toLowerCase().includes(lowerQuery);
      }

      if (key === 'supervisorexam[0].teacher.user.name') {
        const name = item.supervisorexam?.[0]?.teacher?.user?.name;
        return name?.toLowerCase().includes(lowerQuery) || false;
      }

      return String(value).toLowerCase().includes(lowerQuery);
    });
  });
};