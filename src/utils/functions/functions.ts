import _ from 'lodash';

export const getTtime = (time: Date = new Date()) =>
  new Date(time).toLocaleTimeString('en-Gb', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });

export const removeRepeatIds = <T extends { id: number }>(
  arr1: T[],
  arr2: T[]
): T[] => {
  const ids1 = arr1.map((el) => el.id);
  const ids2 = arr2.map((el) => el.id);
  const common = _.intersection(ids1, ids2);
  common.forEach((id) =>
    arr1.splice(
      arr1.findIndex((i) => i.id === id),
      1
    )
  );
  return arr1;
};

export const transformToArr = (obj: {} | undefined) =>
  obj && Object.values(obj);
