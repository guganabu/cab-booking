import {
    haversineDistance,
    round,
    sortBy,
    getTimeDiffInMin,
} from '../../src/utils/index';

describe('utils: haversineDistance', () => {
    test('distance between same geo point should be 0', () => {
        const point1 = {
            latitude: 13.0827,
            longitude: 80.2707,
        };
        const point2 = {
            latitude: 13.0827,
            longitude: 80.2707,
        };
        expect(haversineDistance(point1, point2)).toBe(0);
    });

    test('distance between should be calculated correctly', () => {
        const point1 = {
            latitude: 13.0827,
            longitude: 80.2707,
        };
        const point2 = {
            latitude: 10.7905,
            longitude: 78.7047,
        };
        expect(haversineDistance(point1, point2)).toBe(306.57);
    });
});

describe('utils: round', () => {
    test('it should round number in different variation', () => {
        expect(round(123.1203)).toBe(123.12);
        expect(round(123.45)).toBe(123.45);
        expect(round(123.456)).toBe(123.46);
        expect(round(-1.005, 2)).toBe(-1);
        expect(round(1.005, 2)).toBe(1.01);
    });
});

describe('utils: sortBy', () => {
    test('it should sort given array of elements in asc', () => {
        const unsorted = [
            { key: 'two', val: 2 },
            { key: 'one', val: 1 },
        ];
        const sorted = [
            { key: 'one', val: 1 },
            { key: 'two', val: 2 },
        ];
        expect(sortBy(unsorted, 'val')).toEqual(expect.arrayContaining(sorted));
    });

    test('it should sort given array of elements in desc', () => {
        const unsorted = [
            { key: 'two', val: 2 },
            { key: 'one', val: 1 },
            { key: 'three', val: 3 },
        ];
        const sorted = [
            { key: 'three', val: 3 },
            { key: 'two', val: 2 },
            { key: 'one', val: 1 },
        ];
        expect(sortBy(unsorted, 'val', true)).toEqual(
            expect.arrayContaining(sorted)
        );
    });
});

describe('utils: getTimeDiffInMin', () => {
    test('it should return time diff 30 min', () => {
        const time1 = new Date();
        const time2 = new Date(time1.getTime() + 30 * 60000);
        expect(getTimeDiffInMin(time1, time2)).toEqual(30);
    });
});
