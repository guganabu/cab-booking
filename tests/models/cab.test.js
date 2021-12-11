import CabModel from '../../src/models/cab'

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Test getAvailableCabsByPref', () => {
    it('it should return all available cabs matching pref', async () => {
        const cabModel = new CabModel();
        const cabs = [
            {cab_id: 1, color: 'TEST', cab_id: 2, color: 'TEST'}
        ]
        cabModel.queryAll = jest.fn().mockResolvedValueOnce(cabs);
        await expect(cabModel.getAvailableCabsByPref()).resolves.toBe(cabs)
        expect(cabModel.queryAll).toHaveBeenCalledTimes(1);
    });

    it('it should fail request and return error', async () => {
        const cabModel = new CabModel();
        cabModel.queryAll = jest.fn().mockRejectedValueOnce();
        await expect(cabModel.getAvailableCabsByPref()).rejects.toThrow('Failed fetching cabs')
        expect(cabModel.queryAll).toHaveBeenCalledTimes(1);
    });
});


describe('Test updateCabPoint', () => {
    it('it should succeed update cab point done', async () => {
        const cabModel = new CabModel();
        cabModel.runQuery = jest.fn().mockResolvedValueOnce();
        await expect(cabModel.updateCabPoint()).resolves.toBe()
        expect(cabModel.runQuery).toHaveBeenCalledTimes(1);
    });

    it('it should fail update cab point', async () => {
        const cabModel = new CabModel();
        cabModel.runQuery = jest.fn().mockRejectedValueOnce();
        await expect(cabModel.updateCabPoint()).rejects.toThrow('Failed updating cab availability')
        expect(cabModel.runQuery).toHaveBeenCalledTimes(1);
    });

});
