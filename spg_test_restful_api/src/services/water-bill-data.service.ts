import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Filter} from '@loopback/repository';
import csv from 'csvtojson';
import {WaterConsumption} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class WaterBillDataService {
  constructor(/* Add @inject to inject parameters */) { }

  async getAll(
    filter?: Filter<WaterConsumption>,
  ): Promise<Array<WaterConsumption>> {
    //read data form csv ( databsse )
    const datas = await csv().fromFile('data/water_bill_data.csv');
    const results: WaterConsumption[] | PromiseLike<WaterConsumption[]> = [];

    //testing URL
    //http://[::1]:3000/water-bill-data?filter[where][year][between][0]=2014&filter[where][year][between][1]=2015&ilter[where][month][between][0]=1&filter[where][month][between][1]=10
    try {
      if (filter) {
        //get the filter details because we are not using databases
        const where: any = filter.where;
        let startYear: number = +where.year.between[0];
        let endYear: number = +where.year.between[1];
        let startMonth: number = +where.month.between[0];
        let endMonth: number = +where.month.between[1];

        // filte the datas and build model
        for (let i = startYear; i <= endYear; i++) {
          if(i === startYear){
            for (let k = startMonth; k <= 11; k++) {
              const temp = datas.filter((data) => data.year == i && data.month == k); 
              temp.map((data) => {
                results.push(data);
              });
            }
          }else if(i === endYear){
            for(let k = 0; k <= endMonth; k++){
              const temp = datas.filter((data) => data.year == i && data.month == k); 
              temp.map((data) => {
                results.push(data);
              });
            }
          }else{
            for (let k = 0; k <= 12; k++) {
              const temp = datas.filter((data) => data.year == i && data.month == k); 
              temp.map((data) => {
                results.push(data);
              });
            }
          }
        }
      } else {
        // build model with datas in CSV FILE (database)
        datas.map((data) => {
          results.push(data);
        });
      }
      // return results
      return results;

    } catch (error) {
      // return empty array if any error
      console.error(error);
      return [];
    }
  }
}
