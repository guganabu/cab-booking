import RideService from '../../src/services/ride';
import RideModel from '../../src/models/ride';
import CabModel from '../../src/models/cab';
import * as utils from '../../src/utils/index';
import * as constants from '../../src/constants/index';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Test createRide', () => {
    it('it should create ride and return ride id', async () => {
        const rideService = new RideService();
        rideService.rideModel = new RideModel();
        rideService.rideModel.createRide = jest.fn().mockResolvedValueOnce(1);

        await expect(rideService.createRide()).resolves.toBe(1);
        expect(rideService.rideModel.createRide).toHaveBeenCalledTimes(1);
    });

    it('it should fail create ride and return error', async () => {
        const rideService = new RideService();
        rideService.rideModel = new RideModel();
        rideService.rideModel.createRide = jest
            .fn()
            .mockRejectedValueOnce(new Error('create ride failed'));

        await expect(rideService.createRide()).rejects.toThrow(
            'create ride failed'
        );
        expect(rideService.rideModel.createRide).toHaveBeenCalledTimes(1);
    });
});

describe('Test startRide', () => {
    it('it should start ride and return started date tieme', async () => {
        const rideService = new RideService();
        rideService.rideModel = new RideModel();
        rideService.rideModel.startRide = jest.fn().mockResolvedValueOnce(1);
        const curTime = new Date().toLocaleString();
        utils.getCurrentTime = jest.fn().mockReturnValueOnce(curTime);
        await expect(rideService.startRide()).resolves.toBe(curTime);
        expect(rideService.rideModel.startRide).toHaveBeenCalledTimes(1);
        expect(utils.getCurrentTime).toHaveBeenCalledTimes(1);
    });

    it('it should fail startRide and return error', async () => {
        const rideService = new RideService();
        rideService.rideModel = new RideModel();
        rideService.rideModel.startRide = jest
            .fn()
            .mockRejectedValueOnce(new Error('start ride failed'));

        await expect(rideService.startRide()).rejects.toThrow(
            'start ride failed'
        );
        expect(rideService.rideModel.startRide).toHaveBeenCalledTimes(1);
    });
});

describe('Test completeRide', () => {
    it('it should complete ride and return ride fare', async () => {
        const rideService = new RideService();
        rideService.rideModel = new RideModel();
        rideService.cabModel = new CabModel();
        const curTime = new Date().toLocaleString();

        rideService.rideModel.getRide = jest
            .fn()
            .mockResolvedValueOnce({ cab_id: 1, ride_id: 1, model: 'TEST' });
        rideService.calculateFare = jest
            .fn()
            .mockReturnValueOnce(`123 ${constants.FARE_CURRENCY}`);
        rideService.rideModel.completeRide = jest.fn().mockResolvedValueOnce();
        rideService.cabModel.updateCabPoint = jest.fn().mockResolvedValueOnce();
        utils.getCurrentTime = jest.fn().mockReturnValueOnce(curTime);

        await expect(rideService.completeRide()).resolves.toBe(
            `123 ${constants.FARE_CURRENCY}`
        );
        expect(rideService.rideModel.getRide).toHaveBeenCalledTimes(1);
        expect(rideService.calculateFare).toHaveBeenCalledTimes(1);
        expect(rideService.rideModel.completeRide).toHaveBeenCalledTimes(1);
        expect(rideService.cabModel.updateCabPoint).toHaveBeenCalledTimes(1);
        expect(utils.getCurrentTime).toHaveBeenCalledTimes(1);
    });

    it('it should fail complete ride and return error', async () => {
        const rideService = new RideService();
        rideService.rideModel = new RideModel();
        rideService.cabModel = new CabModel();
        const curTime = new Date().toLocaleString();

        rideService.rideModel.getRide = jest
            .fn()
            .mockResolvedValueOnce({ cab_id: 1, ride_id: 1, model: 'TEST' });
        rideService.calculateFare = jest
            .fn()
            .mockReturnValueOnce(`123 ${constants.FARE_CURRENCY}`);
        rideService.rideModel.completeRide = jest
            .fn()
            .mockRejectedValueOnce(new Error('complete ride failed'));
        rideService.cabModel.updateCabPoint = jest.fn().mockResolvedValueOnce();
        utils.getCurrentTime = jest.fn().mockReturnValueOnce(curTime);

        await expect(rideService.completeRide()).rejects.toThrow(
            'complete ride failed'
        );
        expect(rideService.rideModel.getRide).toHaveBeenCalledTimes(1);
        expect(rideService.calculateFare).toHaveBeenCalledTimes(1);
        expect(rideService.rideModel.completeRide).toHaveBeenCalledTimes(1);
        expect(rideService.cabModel.updateCabPoint).toHaveBeenCalledTimes(0);
        expect(utils.getCurrentTime).toHaveBeenCalledTimes(1);
    });

    it('it should fail update cab point ride and return error', async () => {
        const rideService = new RideService();
        rideService.rideModel = new RideModel();
        rideService.cabModel = new CabModel();
        const curTime = new Date().toLocaleString();

        rideService.rideModel.getRide = jest
            .fn()
            .mockResolvedValueOnce({ cab_id: 1, ride_id: 1, model: 'TEST' });
        rideService.calculateFare = jest
            .fn()
            .mockReturnValueOnce(`123 ${constants.FARE_CURRENCY}`);
        rideService.rideModel.completeRide = jest.fn().mockResolvedValueOnce();
        rideService.cabModel.updateCabPoint = jest
            .fn()
            .mockRejectedValueOnce(new Error('update cab point failed'));
        utils.getCurrentTime = jest.fn().mockReturnValueOnce(curTime);

        await expect(rideService.completeRide()).rejects.toThrow(
            'update cab point failed'
        );
        expect(rideService.rideModel.getRide).toHaveBeenCalledTimes(1);
        expect(rideService.calculateFare).toHaveBeenCalledTimes(1);
        expect(rideService.rideModel.completeRide).toHaveBeenCalledTimes(1);
        expect(rideService.cabModel.updateCabPoint).toHaveBeenCalledTimes(1);
        expect(utils.getCurrentTime).toHaveBeenCalledTimes(1);
    });
});

describe('Test calculateFare', () => {
    it('it should return calculated fare value for PINK color', () => {
        const rideService = new RideService();
        const rideData = {
            ride_id: 1,
            start_latitude: 13.0827,
            start_longitude: 80.2707,
            end_latitude: 10.7905,
            end_longitude: 78.7047,
            start_time: new Date(),
            end_time: new Date().setMinutes(new Date().getMinutes() + 10),
            color: 'PINK',
        };

        const startPoint = {
            latitude: rideData.start_latitude,
            longitude: rideData.start_longitude,
        };
        const endPoint = {
            latitude: rideData.end_latitude,
            longitude: rideData.end_longitude,
        };
        const rideDistanceInKM = utils.haversineDistance(startPoint, endPoint);
        const rideDurationInMin = utils.getTimeDiffInMin(
            rideData.start_time,
            rideData.end_time
        );
        const rideFare =
            rideDistanceInKM * constants.CAB_FARE.PER_KM +
            rideDurationInMin * constants.CAB_FARE.PER_MIN +
            constants.CAB_FARE.COLOR_PREFERENCE;

        expect(rideService.calculateFare(rideData)).toBe(
            `${rideFare} ${constants.FARE_CURRENCY}`
        );
    });

    it('it should return calculated fare value for RED color', () => {
        const rideService = new RideService();
        const rideData = {
            ride_id: 1,
            start_latitude: 13.0827,
            start_longitude: 80.2707,
            end_latitude: 10.7905,
            end_longitude: 78.7047,
            start_time: new Date(),
            end_time: new Date().setMinutes(new Date().getMinutes() + 10),
            color: 'RED',
        };

        const startPoint = {
            latitude: rideData.start_latitude,
            longitude: rideData.start_longitude,
        };
        const endPoint = {
            latitude: rideData.end_latitude,
            longitude: rideData.end_longitude,
        };
        const rideDistanceInKM = utils.haversineDistance(startPoint, endPoint);
        const rideDurationInMin = utils.getTimeDiffInMin(
            rideData.start_time,
            rideData.end_time
        );
        const rideFare =
            rideDistanceInKM * constants.CAB_FARE.PER_KM +
            rideDurationInMin * constants.CAB_FARE.PER_MIN;

        expect(rideService.calculateFare(rideData)).toBe(
            `${rideFare} ${constants.FARE_CURRENCY}`
        );
    });
});
