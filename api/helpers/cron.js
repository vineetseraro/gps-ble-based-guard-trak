const deviceTrackingModel = require('../models/deviceTracking');
const bluebirdPromise = require('bluebird');
const mongoose = require('mongoose');
const akUtils = require('../lib/utility');
const uaLib = require('../lib/pushClient/index');
const uaPayloadCreator = require('../lib/pushClient/payloadCreators');
const shipmentHelper = require('../helpers/shipment');
const notificationLib = require('../lib/notification');
const notificationModel = require('../models/notification');
const thingsModel = require('../models/things');
const clientHandler = require('../lib/clientHandler');
const confHelper = require('./configuration');
const orderModel = require('../models/order');
const orderHelper = require('../helpers/order');
const shipmentModel = require('../models/shipment');
const shipmentStatusMap = require('../mappings/shipmentStatus');
const orderStatusMap = require('../mappings/orderStatus');
const toursModel = require('../models/tours');
const later = require('later');
const schedule = require('schedulejs');
const timediff = require('timediff');
const moment = require('moment');

class CronHelper {
  constructor() {
    this.config = {};

    this.config.secondsBeforeNotReporting = 5 * 60;

    this.scheduleSingleTask = false;
  }

  markNotReporting() {
    return deviceTrackingModel
      .update(
        clientHandler.addClientFilterToConditions({
          lastTracked: {
            $lte: akUtils.subtractSecondsFromDate(new Date(), this.config.secondsBeforeNotReporting)
          }
        }),
        { $set: { isReporting: 0 } },
        { upsert: false, multi: true }
      )
      .exec();
  }

  sendDelayedShipmentNotification() {
    return shipmentHelper
      .getDelayedShipments()
      .then(list =>
        bluebirdPromise.map(list, item =>
          notificationModel
            .find({
              type: 'ShipmentDelayedCR',
              'params.shipment.id': mongoose.Types.ObjectId(item.id)
            })
            .exec()
            .then(data => {
              // console.log(data.length);
              if (!data.length) {
                // console.log(`send ${item.id}`);
                return notificationLib.sendShipmentDelayedNotification(item.id);
              }
              // console.log(`dont send ${item.id}`);

              return {};
            })
        )
      )
      .catch(e => {
        // console.log(e);
      });
  }

  sendDeviceSilentPush() {
    const thingsModel = require('../models/things');
    const deviceTrackingModel = require('../models/deviceTracking');

    return thingsModel
      .find(
        clientHandler.addClientFilterToConditions({
          type: 'software',
          status: 1
        })
      )
      .select('code')
      .exec()
      .then(result => result.map(x => x.code))
      .then(codeList =>
        deviceTrackingModel
          .find(
            clientHandler.addClientFilterToConditions({
              isReporting: 0,
              'device.code': {
                $in: codeList
              }
            })
          )
          .select('device.code')
          .exec()
      )
      .then(result => result.map(x => (x.device || {}).code || ''))
      .then(activeNotReportingDeviceCodes =>
        bluebirdPromise.map(activeNotReportingDeviceCodes, code =>
          notificationLib.sendSilentPush(code)
        )
      )
      .then(() => this.removeOldDeviceSilentPushNotifications());
  }

  removeOldDeviceSilentPushNotifications() {
    const deleteSinceSeconds = 4 * 60 * 60; // 4 hours;
    return notificationModel.remove(
      clientHandler.addClientFilterToConditions({
        type: 'DeviceSilentPush',
        insertedOn: {
          $lte: akUtils.subtractSecondsFromDate(new Date(), deleteSinceSeconds)
        }
      })
    );
  }

  markDevicesInactive() {
    // mongoose.set('debug', true);
    const deviceHelper = require('./device');
    const secondsSinceInactive = 1 * 24 * 60 * 60 + 5 * 60; // 1 day 5 minutes
    const sinceTime = akUtils.subtractSecondsFromDate(new Date(), secondsSinceInactive);
    const allowedApps = process.env.allowedAppNames.split(',');
    return bluebirdPromise
      .map(allowedApps, appName =>
        uaLib.getInstanceByAppNamePromisified(appName).then(instance =>
          bluebirdPromise.all([
            instance
              .getDeviceTokensFeedback({
                since: sinceTime
              })
              .then(result => result.data),
            instance
              .getAPIDFeedback({
                since: sinceTime
              })
              .then(result => result.data)
          ])
        )
      )
      .then(res => {
        const inactivePushIdentifierList = res
          .map(x => [...x[0], ...x[1]])
          .map(x => x.map(y => y.device_token || y.apid))
          .reduce((all, list) => {
            all.push(...list);
            return all;
          }, []);
        const inactivePushIdentifierListRegexList = inactivePushIdentifierList.map(
          x => new RegExp(`^${x}$`, 'i')
        );
        const conditions = clientHandler.addClientFilterToConditions({
          type: 'software',
          $or: [
            {
              attributes: {
                $elemMatch: {
                  name: 'channelId',
                  value: {
                    $in: inactivePushIdentifierListRegexList
                  }
                }
              }
            },
            {
              attributes: {
                $elemMatch: {
                  name: 'pushIdentifier',
                  value: {
                    $in: inactivePushIdentifierListRegexList
                  }
                }
              }
            }
          ]
        });
        // console.log(conditions);
        return thingsModel
          .find(conditions)
          .exec()
          .then(result => deviceHelper.markDevicesInactive(result.map(x => x.code)))
          .catch(e => {
            // console.log(e);
          });
      });
  }

  disassociateNamedUsersFromOldChannels() {
    const allowedApps = process.env.allowedAppNames.split(',');
    return bluebirdPromise
      .map(allowedApps, appName =>
        uaLib.getInstanceByAppNamePromisified(appName).then(instance =>
          instance
            .getNamedUsers({})
            .then(res => res.data.named_users)
            .then(namedUsers => namedUsers.filter(x => x.channels.length > 17))
            .then(namedUsers =>
              namedUsers.map(x => {
                x.channels = x.channels.sort(
                  (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
                );
                return x;
              })
            )
            .then(overLimitNamedUsers =>
              bluebirdPromise.map(overLimitNamedUsers, namedUser =>
                instance.disassociateNamedUsers(
                  uaPayloadCreator.createDisassociateNamedUserPayload({
                    channelId: namedUser.channels[0].channel_id
                  })
                )
              )
            )
        )
      )
      .then(() => '')
      .catch(e => {
        // console.log(e);
      });
  }
  markClosed() {
    return confHelper.getConfigurations().then(config => {
      // // console.log(config);
      const closeOrders = config.autocloseorder;
      const closeShipments = config.autocloseshipment;
      const closeOrdersAfter = config.autocloseorderafter;
      const closeShipmentsAfter = config.autocloseshipmentafter;

      return bluebirdPromise
        .all([
          bluebirdPromise.resolve().then(() => {
            akUtils.log(closeOrders, 'close orders settings');

            if (closeOrders) {
              akUtils.log('finding orders');
              const orderConditions = {
                etd: {
                  $lte: akUtils.subtractSecondsFromDate(new Date(), closeOrdersAfter)
                },
                orderStatus: { $in: [orderStatusMap.Delivered] }
              };
              return orderModel
                .find(orderConditions)
                .exec()
                .then(orders => {
                  akUtils.log(`${orders.length} -> Total orders`);

                  return bluebirdPromise.map(orders || [], order =>
                    // akUtils.log(order._id + ' -> order');

                    orderHelper.closeOrder(order._id)
                  );
                });
            }
          }),
          bluebirdPromise.resolve().then(() => {
            akUtils.log(closeShipments, 'close shipments settings');
            if (closeShipments) {
              akUtils.log('finding shipments');
              const shipmentConditions = {
                deliveryDate: {
                  $lte: akUtils.subtractSecondsFromDate(new Date(), closeShipmentsAfter)
                },
                shipmentStatus: { $in: [shipmentStatusMap.Delivered] }
              };
              return shipmentModel
                .find(shipmentConditions)
                .exec()
                .then(shipments => {
                  akUtils.log(`${shipments.length} -> Total shipments`);

                  return bluebirdPromise.map(shipments || [], shipment =>
                    // akUtils.log(shipment._id + ' -> shipment');
                    shipmentHelper.closeShipment(shipment._id)
                  );
                });
            }
          })
        ])
        .then(() => {
          akUtils.log('All Executions successfull');
        })
        .catch(err => {
          akUtils.log(err);
        });
    });
  }

  scheduleTour(taskId = null) {
    var taskHelper = require('../helpers/tasks');
    var otherParams = {};
    otherParams.sort = '';
    otherParams.pageParams = {};
    otherParams.pageParams.offset = 0;
    otherParams.pageParams.limit = 1000;
    var tours = [];
    var filter = {};
    this.scheduleSingleTask = false;
    if ( taskId ) { // for single task
      filter._id = mongoose.Types.ObjectId(taskId);
      this.scheduleSingleTask = true;
    }

    return taskHelper.get(
      filter,
      otherParams
    ).then( (data) => {
      let promises = [];
      if( Array.isArray(data) && data.length ) {
        data.forEach( schedule => {
          tours.push(this.createTour(schedule));
        });
        promises = tours.map((tour) => {
          return this.validateSchedule(tour);
        });
      }
      return bluebirdPromise.all(promises);
    }).then( (res) => {
      let promises = [];
      if ( res.length ) {
        promises = res.map((tours) => {
          return taskHelper.scheduleTours(tours);
        });
      }
      return bluebirdPromise.all(promises);
    }).catch( (err) => {
      akUtils.log(err);
    });

  }

  createTour (schedule) {
    var shifts = [];
    const duration = timediff(schedule.from, schedule.to, 'm').minutes;
    let parseType  = '';
    let recurOn  = '';
    if ( schedule.scheduleType === 'recurring' ) {
      if( schedule.recur && schedule.recur.type ) {
        const recur = schedule.recur;
        // console.log(recur);
        switch (recur.type) {
          case 'daily':
            let every = ( recur.repeat.type == 'day' ) ? recur.repeat.every : 'workday';
            let availability = '';
            if ( every == 'workday' ) {
              availability = 'every weekday';
              parseType = 'recur';
              recurOn = 'workday';
            } else {
              availability = every;
              parseType = 'recur';
              recurOn = 'day';
            }

            shifts.push({
              name: schedule.name,
              length: duration,
              availability: availability,
              parseType: parseType,
              recurOn: recurOn,
              scheduleStartTime: schedule.from,
              scheduleEndTime: schedule.to,
              frequency: schedule.frequency,
              taskId: schedule.id,
              occurrence: recur.occurrence,
              scheduleType: schedule.scheduleType,
              startDate: schedule.startDate
            });
          break;
          case 'weekly':
            parseType = 'recur';
            recurOn = 'week';
            shifts.push({
              name: schedule.name,
              length: duration,
              availability: recur.repeat.every,
              parseType: parseType,
              recurOn: recurOn,
              scheduleStartTime: schedule.from,
              scheduleEndTime: schedule.to,
              frequency: schedule.frequency,
              taskId: schedule.id,
              occurrence: recur.occurrence,
              days: recur.repeat.days,
              scheduleType: schedule.scheduleType,
              startDate: schedule.startDate
            });
          break;
          case 'monthly':
            parseType = 'recur';
            recurOn = 'month';
            shifts.push({
              name: schedule.name,
              length: duration,
              availability: recur.repeat.every,
              parseType: parseType,
              recurOn: recurOn,
              scheduleStartTime: schedule.from,
              scheduleEndTime: schedule.to,
              frequency: schedule.frequency,
              taskId: schedule.id,
              occurrence: recur.occurrence,
              on: recur.repeat.on,
              scheduleType: schedule.scheduleType,
              startDate: schedule.startDate
            });
          break;
          case 'yearly':
            parseType = 'recur';
            recurOn = 'year';
            shifts.push({
              name: schedule.name,
              length: duration,
              availability: recur.repeat.every,
              parseType: parseType,
              recurOn: recurOn,
              scheduleStartTime: schedule.from,
              scheduleEndTime: schedule.to,
              frequency: schedule.frequency,
              taskId: schedule.id,
              occurrence: recur.occurrence,
              on: recur.repeat.on,
              scheduleType: schedule.scheduleType,
              startDate: schedule.startDate
            });
          break
        }
      } else {
        return [];
      }
    } else if ( schedule.scheduleType === 'fixed' ) {
      shifts.push({
        name: schedule.name,
        length: duration,
        scheduleStartTime: schedule.from,
        scheduleEndTime: schedule.to,
        frequency: schedule.frequency,
        taskId: schedule.id,
        scheduleType: schedule.scheduleType
      });
    }
    return shifts;
  }

  validateSchedule(shifts) {
    var taskHelper = require('../helpers/tasks');
    let dayToadd = 1;
    if ( this.scheduleSingleTask ) {
      dayToadd = 0;
    }
    var eodTime = moment().add( dayToadd, 'day').endOf('day').add( 1, 'minutes').utc();
    var currentTime = moment.utc();
    let startTime = '';
    let endTime = '';
    console.log("currentTime");
    console.log(currentTime);
    console.log("eodTime");
    console.log(eodTime);
    if ( shifts[0].scheduleType === 'fixed' ) {
      var shift = shifts[0];

      startTime = shift.scheduleStartTime;
      endTime = shift.scheduleEndTime;
      let start = moment.utc(shift.scheduleStartTime);
      var totalTours = shift.length / parseInt(shift.frequency);
      let tours = [];
      for ( var i = 0 ; i < parseInt(totalTours); i++ )  {
        // Don't create previous and next dated tours. 
        if (
          moment(start).add( i * shift.frequency, 'minutes').isSameOrAfter(currentTime) &&
          moment(start).add( i * shift.frequency, 'minutes').isSameOrBefore(eodTime)
        ) {
          tours.push({
            'taskId': shift.taskId, 
            'from': moment(start).add( i * shift.frequency, 'minutes'),
            'to': moment(start).add( ((i+1) * shift.frequency), 'minutes'),
            'startTime': startTime,
            'endTime': endTime
          });
        }
      }
      var lastTourDuration = shift.length % parseInt(shift.frequency);
      if ( lastTourDuration ) {
        // Don't create previous and next dated tours
        if (
          moment(start).add( i * shift.frequency, 'minutes').isSameOrAfter(currentTime) &&
          moment(start).add( i * shift.frequency, 'minutes').isSameOrBefore(eodTime)
        ) {
          tours.push({
            'taskId': shift.taskId,
            'from': moment(start).add( i * shift.frequency, 'minutes'),
            'to': moment(start).add( (i * shift.frequency) + lastTourDuration, 'minutes'),
            'startTime': startTime,
            'endTime': endTime
          });
        }
      }
      console.log("tours");
      console.log(tours);
      return bluebirdPromise.try(function() {
        return tours;
      });
    } else if ( shifts[0].scheduleType === 'recurring' ) {
      // creating our task generator
      var dayOnWeekMapping = {
        Sunday: 1,
        Monday: 2,
        Tuesday: 3,
        Wednesday: 4,
        Thursday: 5,
        Friday: 6,
        Saturday: 7
      };

      var monthMapping = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12
      };

      var t = schedule.tasks()
      .id(function(d) { return d.name; })
      .duration(function(d) {
        return d.length;
      })
      .available(function(d) {
        const recurOn = '';
        switch(d.parseType) {
          case 'recur':
            if ( d.recurOn === 'day' ) {
              // recur on specific week days based on day number on week
              d.availability = parseInt(d.availability);
              return d.availability ? later.parse.recur().every(d.availability).dayOfYear() : undefined;
            } else if ( d.recurOn === 'workday' ) {
              // for all days
              return later.parse.recur().every(1).dayOfWeek(); // return later.parse.text('every weekday');
            } else if( d.recurOn === 'week' ) {
              // recur on week days based on day name eg. [ 'Monday', 'Tuesday', 'Wednesday' ]
              const days = d.days.map( day => dayOnWeekMapping[day] );
              // console.log(days);
              d.availability = parseInt(d.availability);
              return d.availability ? later.parse.recur().every(d.availability).weekOfMonth().on(days).dayOfWeek() : undefined;
            } else if( d.recurOn === 'month' ) {
              // recur on month days e.g On 2nd day of every 1 month
              const day = parseInt(d.on);
              d.availability = parseInt(d.availability);
              return d.availability ? later.parse.recur().every(d.availability).month().on(day).dayOfMonth() : undefined;
            } else if( d.recurOn === 'year' ) {
              // recur on day of month of year. Eg. 2nd of feb or 23th march
              const day = parseInt(d.on);
              const month = monthMapping[d.availability] || '';
              return d.availability ? later.parse.recur().every(1).year().on(month).month().on(day).dayOfMonth() : undefined;
            }
          break;
          case 'textExpr':
            // use for text expr
            return d.availability ? later.parse.text(d.availability) : undefined;
          break;
        }
      });

      // create Schedule tasks from our shifts
      var tasks = t(shifts);
      let schStartObj =  moment.utc(shifts[0].scheduleStartTime);
      let start = moment.utc().add(dayToadd, 'day').startOf('day');
      start.add(schStartObj.hours(), 'hours');
      start.add(schStartObj.minutes(), 'minutes');
      start.add(schStartObj.seconds(), 'seconds');
      let schEndObj =  moment.utc(shifts[0].scheduleEndTime);

      // tour should start after this date
      let tourStartObj =  moment.utc(shifts[0].startDate);
      console.log('tourStartObj');
      console.log(tourStartObj);
      let endBy = '';
      let totalOccurrence = '';
      if ( shifts[0].occurrence ) {
        if ( shifts[0].occurrence.type === 'EndBy' ) {
          endBy = moment(shifts[0].occurrence.endBy).endOf('day');
          endBy = endBy.add(1, 'seconds');
          endBy = moment.utc(endBy);
          shifts[0].occurrence.endBy
          let end = moment.utc(shifts[0].occurrence.endBy).startOf('day');
          end.add(schEndObj.hours(), 'hours');
          end.add(schEndObj.minutes(), 'minutes');
          end.add(schEndObj.seconds(), 'seconds');
          endTime = end;
        } else if ( shifts[0].occurrence.type === 'Occurrence' ) {
          totalOccurrence = shifts[0].occurrence.totalOccurrence;
        } else if ( shifts[0].occurrence.type === 'NoEndDate' ) {
          endTime = null;
        }
      }
      console.log('start')
      console.log(start);
      console.log('schedules');
      console.log(tasks[0].available.schedules);
      // console.log('endBy');
      // console.log(endBy);
      if ( !endBy || (endBy && (start < endBy)) ) {
        var s = schedule.create(tasks, [], null, start);
        let endDateObj = eodTime; // default value is eodTime
        if ( totalOccurrence ) {
          var sched = later.schedule(tasks[0].available, tourStartObj);
          // get tour end date
          if ( shifts[0].recurOn == 'workday' || ( shifts[0].recurOn == 'day' && shifts[0].availability == '1' ) ) {
            let futureOccurrences = sched.next(totalOccurrence, tourStartObj);
            endDateObj = moment(futureOccurrences[totalOccurrence-1]).endOf('day').add( 1, 'minutes').utc();
            let end = moment(futureOccurrences[totalOccurrence-1]).endOf('day').add( 1, 'seconds');
            end.add(schEndObj.hours(), 'hours');
            end.add(schEndObj.minutes(), 'minutes');
            end.add(schEndObj.seconds(), 'seconds');
            endTime = end;
          } else {
            let futureOccurrences = sched.nextRange(totalOccurrence, tourStartObj);
            endDateObj = moment(futureOccurrences[totalOccurrence-1][0]).endOf('day').add( 1, 'minutes').utc();
            let end = moment(futureOccurrences[totalOccurrence-1][0]).endOf('day').add( 1, 'seconds');
            end.add(schEndObj.hours(), 'hours');
            end.add(schEndObj.minutes(), 'minutes');
            end.add(schEndObj.seconds(), 'seconds');
            endTime = end;
          }
        }

        console.log('endDateObj');
        console.log(endDateObj);

        startTime = moment(shifts[0].startDate).endOf('day').add( 1, 'minutes');
        startTime.add(schStartObj.hours(), 'hours');
        startTime.add(schStartObj.minutes(), 'minutes');
        startTime.add(schStartObj.seconds(), 'seconds');

        for(var id in s.scheduledTasks) {
          var st = s.scheduledTasks[id];
          let tours = [];
          // check if schedule is valid for start date
          // console.log(st.schedule[0].delays);
          if ( st.schedule && !Object.keys(st.schedule[0].delays).length ) {
            var totalTours = st.duration / parseInt(shifts[0].frequency);
            for ( var i = 0 ; i < parseInt(totalTours); i++ )  {
              // Don't create previous dated tours also don't create tours befor startDate
              if (
                moment(start).add( i * shifts[0].frequency, 'minutes').isSameOrAfter(currentTime) &&
                moment(start).add( i * shifts[0].frequency, 'minutes').isSameOrAfter(tourStartObj) &&
                moment(start).add( i * shifts[0].frequency, 'minutes').isSameOrBefore(eodTime) &&
                moment(start).add( i * shifts[0].frequency, 'minutes').isSameOrBefore(endDateObj)
              ) {
                tours.push({
                  'taskId': shifts[0].taskId, 
                  'from': moment(start).add( i * shifts[0].frequency, 'minutes'),
                  'to': moment(start).add( ((i+1) * shifts[0].frequency), 'minutes'),
                  'startTime': startTime,
                  'endTime': endTime
                });
              }
            }
            var lastTourDuration = st.duration % parseInt(shifts[0].frequency);
            if ( lastTourDuration ) {
              // Don't create previous dated tours also don't create tours befor startDate
              if (
                moment(start).add( i * shifts[0].frequency, 'minutes').isSameOrAfter(currentTime) &&
                moment(start).add( i * shifts[0].frequency, 'minutes').isSameOrAfter(tourStartObj) &&
                moment(start).add( i * shifts[0].frequency, 'minutes').isSameOrBefore(eodTime) &&
                moment(start).add( i * shifts[0].frequency, 'minutes').isSameOrBefore(endDateObj)
              ) {
                tours.push({
                  'taskId': shifts[0].taskId,
                  'from': moment(start).add( i * shifts[0].frequency, 'minutes'),
                  'to': moment(start).add( (i * shifts[0].frequency) + lastTourDuration, 'minutes'),
                  'startTime': startTime,
                  'endTime': endTime
                });
              }
            }
            console.log("tours");
            console.log(tours);
            return bluebirdPromise.try(function() {
              return tours;
            });
          }
        }
      }
    }
    return [];
  }

  markTourStatus() {
    return toursModel.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: 'task.id',
          foreignField: '_id',
          as: 'taskData'
        }
      },
      { $unwind: {'path': '$taskData', 'preserveNullAndEmptyArrays': true} },
      {
        $lookup: {
          from: 'touractions',
          localField: '_id',
          foreignField: 'tour.id',
          as: 'eventData'
        }
      },
      { $project: {
        '_id' : 1,
        'taskData': 1,
        'eventData': 1,
        'tourStatus': 1, 
        'to':1
      } },
      { $match: {'tourStatus': 10, 'to' : {$lt: new Date()} } }
    ]).exec().then((tourList) => {
      //console.log(tourList.length);
      const promises = tourList.map((tourObj) => {
        //console.log(tourObj._id);
        //console.log(tourObj.taskData);
        const taskLocations = tourObj.taskData.locations.map((loc) => {
          return loc.floor.zone.id+'';
        }); 
        
        //console.log('A');
        //console.log(taskLocations);
        //console.log(tourObj.eventData);
        let eventLocations = tourObj.eventData.filter((actionObj) => {
          if(actionObj.action.actionType === 'Scan') {
            return true;
          }
        });
        
        eventLocations = eventLocations.map((actionObj) => {
          //console.log('XXX')
          //console.log(actionObj.location);
          return actionObj.location.floor.zone.id + '';
        });
        
        //console.log('B');
        //console.log(eventLocations);
        const notFoundLocs = taskLocations.filter((taskLoc) => {
          if ( eventLocations.indexOf(taskLoc) === -1 ) {
            return taskLoc;
          }
        });
        //console.log('C');
        // eventLocations = new Set(eventLocations);
        // eventLocations = [...eventLocations];
        //console.log('D');
        //console.log(taskLocations);
        //console.log(eventLocations);
        //console.log(notFoundLocs);
        if(notFoundLocs.length > 0) {
          //console.log('DAA');
          tourObj.tourStatus = 30;
        } else {
          //console.log('DBB');
          tourObj.tourStatus = 20;
        }
        //console.log('E');
        // return tourObj;
        return toursModel.findOneAndUpdate({_id: mongoose.Types.ObjectId(tourObj._id)}, {tourStatus: tourObj.tourStatus}, {
          upsert: false,
          new: false
        })
        .exec();
      });
      
      return bluebirdPromise.all(promises);
    });
  }

}

module.exports = new CronHelper();
