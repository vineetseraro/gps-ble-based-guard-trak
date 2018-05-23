/**
 * LocatorType interface provide skeleten for locator/route map entities
 *
 * @export
 * @interface LocatorType
 */
export interface LocatorType {

  /**
   * Interface method for get id field data
   *
   * @param {*} data
   * @returns {string}
   * @memberof LocatorType
   */
  getIdField(data: any): string;

  /**
   * Interface method for get fields data for showing on map
   *
   * @param {*} data
   * @returns {*}
   * @memberof LocatorType
   */
  getFields(data: any): any;

  /**
   * Interface method for get route/details page url
   *
   * @returns {string}
   * @memberof LocatorType
   */
  getDetailsUrl(): string;

  /**
   * Interface method for get custom info window content
   *
   * @returns {string}
   * @memberof LocatorType
   */
  getInfoContent(): string;

  /**
   * Interface method for check if id is exists
   *
   * @param {string} itemId
   * @param {*} data
   * @returns {boolean}
   * @memberof LocatorType
   */
  isExists(itemId: string, data: any): boolean;
}
