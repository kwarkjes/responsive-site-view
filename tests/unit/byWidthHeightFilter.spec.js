describe('byWidthHeightFilter', function () {
    var filterByWidthHeight;
    beforeEach(module('rsv.byWidthHeightFilter'));
    beforeEach(inject(function ($injector) {
        filterByWidthHeight = $injector.get('byWidthHeightFilter');
    }));
    it('should put smallest width first in the list', function () {
        var data, sortedData;
        data = [
            {
                width: 300,
                height: 200
            },
            {
                width: 200,
                height: 100
            }
        ];
        sortedData = filterByWidthHeight(data);
        expect(sortedData[0].width).toEqual(200);
    });
    it('should put smallest height first if widths are the same', function () {
        var data, sortedData;
        data = [
            {
                width: 300,
                height: 200
            },
            {
                width: 300,
                height: 100
            }
        ];
        sortedData = filterByWidthHeight(data);
        expect(sortedData[0].height).toEqual(100);
    });
});