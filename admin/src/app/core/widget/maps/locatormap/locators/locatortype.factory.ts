import { DeviceLocator } from './device.locator';
import { LocatorType } from './locatortype.interface';
import { ProductLocator } from './product.locator';
import { ShipmentLocator } from './shipment.locator';
import { UserLocator } from './user.locator';

/**
 * Factory for create locator types
 *
 * @export
 * @class LocatortypeFactory
 */
export class LocatortypeFactory {
    locatorTypeObj: LocatorType;
    /**
     * Creates an instance of LocatortypeFactory.
     * @memberof LocatortypeFactory
     */
    constructor() {}

    /**
     * Create locator type object depend on provided locator type
     *
     * @param {string} locatorType
     * @memberof LocatortypeFactory
     */
    init(locatorType: string) {
        switch (locatorType) {
            case 'product':
                this.locatorTypeObj = new ProductLocator();
                break;
            case 'device':
                this.locatorTypeObj = new DeviceLocator();
                break;
            case 'shipment':
                this.locatorTypeObj = new ShipmentLocator();
                break;
            case 'user':
                this.locatorTypeObj = new UserLocator();
                break;
            default:
                throw new Error('Invalid Locator');
        }
    }

    /**
     * return locator type object
     *
     * @returns
     * @memberof LocatortypeFactory
     */
    getLocator() {
        return this.locatorTypeObj;
    }
}
