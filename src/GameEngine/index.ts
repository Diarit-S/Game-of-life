export type Position = Readonly<{
  x: number;
  y: number;
}>;

export type StringPosition = `${number}|${number}`;

export type LivingCells = Set<StringPosition>;

const baseNeighboursPositions: Position[] = [
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
];

export const formatToStringPosition = ({ x, y }: Position): StringPosition => `${x}|${y}`;

const formatToPositions = (key: StringPosition): Position => {
  const [x, y] = key.split("|");
  return {
    x: parseInt(x),
    y: parseInt(y),
  };
};

export const checkIfCellShouldLive = (neighboursNumber: number, isAlive: boolean): boolean => {
  return (isAlive && neighboursNumber === 2) || neighboursNumber === 3;
};

export const getNeighboursPositions = (cellPosition: Position): Position[] => {
  return baseNeighboursPositions.map((originCellPosition) => {
    return {
      x: originCellPosition.x + cellPosition.x,
      y: originCellPosition.y + cellPosition.y
    }
  });
};

export const getLivingNeighboursNumber = (
  livingCells: LivingCells, 
  candidateCoordinates: Position
): number => {
  return getNeighboursPositions(candidateCoordinates)
    .map(formatToStringPosition)
    .filter((neighbor: StringPosition) => livingCells.has(neighbor))
    .length;
};

export const getPotentiallyLivingCellsPositions = (actualLivingCells: LivingCells): Position[] => {
  return [...actualLivingCells].map(formatToPositions).map(getNeighboursPositions).flat();
};

export const getNextGeneration = (livingCells: LivingCells): LivingCells => {
  const candidates = new Set([...livingCells, ...getPotentiallyLivingCellsPositions(livingCells)
    .map(formatToStringPosition)]);
  return new Set(
    [...candidates].filter((cell) => {
      const neighboursNumber = getLivingNeighboursNumber(livingCells, formatToPositions(cell));
      return checkIfCellShouldLive(neighboursNumber, livingCells.has(cell));
    })
  );
};
