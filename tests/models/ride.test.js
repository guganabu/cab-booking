import RideModel from '../../src/models/ride';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Test createRide', () => {
    it('it should create ride and return row id', async () => {
        const rideModel = new RideModel();
        rideModel.runQuery = jest.fn().mockResolvedValueOnce(1);
        await expect(rideModel.createRide(1, {})).resolves.toBe(1);
        expect(rideModel.runQuery).toHaveBeenCalledTimes(1);
    });

    it('it should fail create ride and return error', async () => {
        const rideModel = new RideModel();
        rideModel.runQuery = jest.fn().mockRejectedValueOnce();
        await expect(rideModel.createRide(1, {})).rejects.toThrow(
            'Failed creating ride'
        );
        expect(rideModel.runQuery).toHaveBeenCalledTimes(1);
    });
});

describe('Test getRide', () => {
    it('it should get ride data', async () => {
        const rideModel = new RideModel();
        const rideData = { ride_id: 1, cab_id: 1, fare: 100 };
        rideModel.getQuery = jest.fn().mockResolvedValueOnce(rideData);
        await expect(rideModel.getRide(1)).resolves.toBe(rideData);
        expect(rideModel.getQuery).toHaveBeenCalledTimes(1);
    });

    it('it should fail get ride and return error', async () => {
        const rideModel = new RideModel();
        rideModel.getQuery = jest.fn().mockRejectedValueOnce();
        await expect(rideModel.getRide(1)).rejects.toThrow(
            'Failed to get ride'
        );
        expect(rideModel.getQuery).toHaveBeenCalledTimes(1);
    });
});

describe('Test startRide', () => {
    it('it should start ride for given id', async () => {
        const rideModel = new RideModel();
        rideModel.runQuery = jest.fn().mockResolvedValueOnce();
        await expect(rideModel.startRide(1)).resolves.toBe();
        expect(rideModel.runQuery).toHaveBeenCalledTimes(1);
    });

    it('it should fail get ride and return error', async () => {
        const rideModel = new RideModel();
        rideModel.runQuery = jest.fn().mockRejectedValueOnce();
        await expect(rideModel.startRide(1)).rejects.toThrow(
            'Failed to start ride'
        );
        expect(rideModel.runQuery).toHaveBeenCalledTimes(1);
    });
});

describe('Test completeRide', () => {
    it('it should start ride for given id', async () => {
        const rideModel = new RideModel();
        rideModel.runQuery = jest.fn().mockResolvedValueOnce();
        await expect(rideModel.completeRide(1)).resolves.toBe();
        expect(rideModel.runQuery).toHaveBeenCalledTimes(1);
    });

    it('it should fail get ride and return error', async () => {
        const rideModel = new RideModel();
        rideModel.runQuery = jest.fn().mockRejectedValueOnce();
        await expect(rideModel.completeRide(1)).rejects.toThrow(
            'Failed to complete ride'
        );
        expect(rideModel.runQuery).toHaveBeenCalledTimes(1);
    });
});
