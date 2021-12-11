import CabModel from '../../src/models/cab';
import CabService from '../../src/services/cab';
import RideModel from '../../src/models/ride';
import { CAB_SERVICE_RANGE_IN_KM } from '../../src/constants/index';
import * as constants from '../../src/constants/index';
import { haversineDistance } from '../../src/utils/index';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Test requestCabRide', () => {
    it('it should return null when no cab available', async () => {
        const cabService = new CabService();
        //  const addMock = jest.spyOn(cabService, "getNearestCab").mockResolvedValueOnce(null);
        cabService.getNearestCab = jest.fn().mockResolvedValueOnce(null);
        await expect(cabService.requestCabRide()).resolves.toBe(null);
        expect(cabService.getNearestCab).toHaveBeenCalledTimes(1);
    });

    it('it should return nearest cab with ride id', async () => {
        const cabService = new CabService();
        cabService.rideModel = new RideModel();
        cabService.getNearestCab = jest
            .fn()
            .mockResolvedValueOnce({ cab_id: 1, model: 'TEST', color: 'BLUE' });
        cabService.updateCabPoint = jest.fn().mockResolvedValueOnce(true);
        cabService.rideModel.createRide = jest.fn().mockResolvedValueOnce(1);
        await expect(cabService.requestCabRide()).resolves.toEqual({
            cab_id: 1,
            model: 'TEST',
            color: 'BLUE',
            rideId: 1,
        });
        expect(cabService.getNearestCab).toHaveBeenCalledTimes(1);
        expect(cabService.updateCabPoint).toHaveBeenCalledTimes(1);
        expect(cabService.rideModel.createRide).toHaveBeenCalledTimes(1);
    });

    it('it should throw error when update cab point get failed', async () => {
        const cabService = new CabService();

        cabService.getNearestCab = jest
            .fn()
            .mockResolvedValueOnce({ cab_id: 1, model: 'TEST', color: 'BLUE' });
        cabService.updateCabPoint = jest
            .fn()
            .mockRejectedValueOnce(
                new Error('update cab point service failed')
            );

        await expect(cabService.requestCabRide()).rejects.toThrow(
            'update cab point service failed'
        );
        expect(cabService.getNearestCab).toHaveBeenCalledTimes(1);
        expect(cabService.updateCabPoint).toHaveBeenCalledTimes(2);
    });

    it('it should throw error when create ride is failed', async () => {
        const cabService = new CabService();
        cabService.rideModel = new RideModel();
        cabService.getNearestCab = jest
            .fn()
            .mockResolvedValueOnce({ cab_id: 1, model: 'TEST', color: 'BLUE' });
        cabService.updateCabPoint = jest.fn().mockResolvedValueOnce();
        cabService.rideModel.createRide = jest
            .fn()
            .mockRejectedValueOnce(new Error('create ride model failed'));
        await expect(cabService.requestCabRide()).rejects.toThrow(
            'create ride model failed'
        );
        expect(cabService.getNearestCab).toHaveBeenCalledTimes(1);
        expect(cabService.updateCabPoint).toHaveBeenCalledTimes(2);
        expect(cabService.rideModel.createRide).toHaveBeenCalledTimes(1);
    });
});

describe('Test getNearestCab', () => {
    it('it should throw error when getAvailableCabs is failed', async () => {
        const cabService = new CabService();
        cabService.cabModel = new CabModel();
        cabService.cabModel.getAvailableCabs = jest
            .fn()
            .mockRejectedValueOnce(
                new Error('get available cabs by pref failed')
            );

        await expect(cabService.getNearestCab()).rejects.toThrow(
            'get available cabs by pref failed'
        );
        expect(cabService.cabModel.getAvailableCabs).toHaveBeenCalledTimes(1);
    });

    it('it should throw error when getCabsInRange is failed', async () => {
        const cabService = new CabService();
        cabService.cabModel = new CabModel();
        cabService.cabModel.getAvailableCabs = jest
            .fn()
            .mockResolvedValueOnce([]);
        cabService.getCabsInRange = jest
            .fn()
            .mockRejectedValueOnce(new Error('get cabs in range failed'));

        await expect(cabService.getNearestCab()).rejects.toThrow(
            'get cabs in range failed'
        );
        expect(cabService.cabModel.getAvailableCabs).toHaveBeenCalledTimes(1);
        expect(cabService.getCabsInRange).toHaveBeenCalledTimes(1);
    });

    it('it should return nearest cab object', async () => {
        const cabService = new CabService();
        cabService.cabModel = new CabModel();
        const allCabs = [
            { cab_id: 1, model: 'test1' },
            { cab_id: 2, model: 'test2' },
            { cab_id: 3, model: 'test3' },
        ];
        cabService.cabModel.getAvailableCabs = jest
            .fn()
            .mockResolvedValueOnce(allCabs);
        cabService.getCabsInRange = jest
            .fn()
            .mockResolvedValueOnce([allCabs[1], allCabs[2]]);
        await expect(cabService.getNearestCab()).resolves.toEqual(allCabs[1]);
        expect(cabService.cabModel.getAvailableCabs).toHaveBeenCalledTimes(1);
        expect(cabService.getCabsInRange).toHaveBeenCalledTimes(1);
    });
});

describe('Test updateCabPoint', () => {
    it('it should resolves update cab point', async () => {
        const cabService = new CabService();
        cabService.cabModel = new CabModel();

        cabService.cabModel.updateCabPoint = jest.fn().mockResolvedValueOnce();
        await expect(cabService.updateCabPoint()).resolves.toBe();
        expect(cabService.cabModel.updateCabPoint).toHaveBeenCalledTimes(1);
    });

    it('it should throw error while update cab point', async () => {
        const cabService = new CabService();
        cabService.cabModel = new CabModel();

        cabService.cabModel.updateCabPoint = jest
            .fn()
            .mockRejectedValueOnce(
                new Error('cab model update cab point failed')
            );
        await expect(cabService.updateCabPoint()).rejects.toThrow(
            'cab model update cab point failed'
        );
        expect(cabService.cabModel.updateCabPoint).toHaveBeenCalledTimes(1);
    });
});

describe('Test getCabsInRange', () => {
    it('it should return cabs list which is available within given range', async () => {
        const startPoint = {
            latitude: 13.0827,
            longitude: 80.2707,
        };
        const cabs = [
            { cab_id: 1, latitude: 13.0521, longitude: 80.2255 },
            { cab_id: 2, latitude: 10.7905, longitude: 78.7047 },
        ];
        const cabService = new CabService();
        constants.CAB_SERVICE_RANGE_IN_KM = 30;
        const expectedValue = cabs[0];
        const { latitude, longitude } = expectedValue;
        expectedValue['range'] = haversineDistance(startPoint, {
            latitude,
            longitude,
        });
        expect(CAB_SERVICE_RANGE_IN_KM).toBe(30);
        await expect(
            cabService.getCabsInRange(startPoint, cabs)
        ).resolves.toHaveLength(1);
        await expect(
            cabService.getCabsInRange(startPoint, cabs)
        ).resolves.toEqual(expect.arrayContaining([expectedValue]));
    });

    it('it should return empty list', async () => {
        const startPoint = {
            latitude: 13.0827,
            longitude: 80.2707,
        };
        const cabs = [
            { cab_id: 1, latitude: 1.0521, longitude: 80.2255 },
            { cab_id: 2, latitude: 10.7905, longitude: 78.7047 },
        ];
        const cabService = new CabService();
        constants.CAB_SERVICE_RANGE_IN_KM = 50;
        expect(CAB_SERVICE_RANGE_IN_KM).toBe(50);
        await expect(
            cabService.getCabsInRange(startPoint, cabs)
        ).resolves.toHaveLength(0);
        await expect(
            cabService.getCabsInRange(startPoint, cabs)
        ).resolves.toEqual(expect.arrayContaining([]));
    });
});

describe('Test getAvailableCabs', () => {
    it('it should resolves and return available cabs', async () => {
        const cabService = new CabService();
        cabService.cabModel = new CabModel();
        const availableCabs = [
            { cab_id: 1, model: 'TEST' },
            { cab_id: 2, model: 'TEST2' },
        ];
        cabService.cabModel.getAvailableCabs = jest
            .fn()
            .mockResolvedValueOnce(availableCabs);
        await expect(cabService.getAvailableCabs()).resolves.toBe(
            availableCabs
        );
        expect(cabService.cabModel.getAvailableCabs).toHaveBeenCalledTimes(1);
    });

    it('it should throw error and fail fetching cabs', async () => {
        const cabService = new CabService();
        cabService.cabModel = new CabModel();
        
        cabService.cabModel.getAvailableCabs = jest
            .fn()
            .mockRejectedValueOnce(new Error('Failed fetching available cabs'));
        await expect(cabService.getAvailableCabs()).rejects.toThrow('Failed fetching available cabs')
        expect(cabService.cabModel.getAvailableCabs).toHaveBeenCalledTimes(1);
    });
});
