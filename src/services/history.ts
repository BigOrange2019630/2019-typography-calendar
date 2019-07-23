import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { StorageService } from './storage';
import { STORE_KEY } from '../utils/constants';

@Injectable()
export class HistoryService {
    constructor(public storage: StorageService) {

    }

    async getTearDate(): Promise<Date> {
        return await this.storage.get(STORE_KEY.TORN_DATE);
    }

    async setTearDay(day: moment.Moment): Promise<void> {
        const lastTear = await this.getTearDate();
        if (!lastTear) {
            await this.storage.set(STORE_KEY.FIRST_TEAR, 'torn');
        }
        else if (moment(lastTear).isAfter(day)) {
            return;
        }

        return await this.storage.set(STORE_KEY.TORN_DATE, day.toDate());
    }

    async tearNextDay(currentDate: moment.Moment, width: number, height: number): Promise<void> {
        const lastTear = await this.getTearDate();
        if (!lastTear) {
            await this.storage.set(STORE_KEY.FIRST_TEAR, 'torn');
        }
        return await this.storage.set(STORE_KEY.TORN_DATE, currentDate.toDate());
    }

    async isFirstOpen(): Promise<boolean> {
        return await this.storage.get(STORE_KEY.FIRST_OPEN) == null;
    }

    async setFirstOpened(): Promise<void> {
        await this.storage.set(STORE_KEY.FIRST_OPEN, 'opened');
    }

    async isFirstTear(): Promise<boolean> {
        return !await this.storage.get(STORE_KEY.FIRST_TEAR);
    }

    async canPromptAd(): Promise<boolean> {
        if (await this.storage.get(STORE_KEY.DONT_ASK_AD_AGAIN) === true) {
            return false;
        }
        return Math.random() > 0.5;
    }

    async markDontPromptAd(): Promise<void> {
        await this.storage.set(STORE_KEY.DONT_ASK_AD_AGAIN, true);
    }
}
