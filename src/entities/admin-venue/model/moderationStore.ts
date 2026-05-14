import { makeAutoObservable, runInAction } from 'mobx';
import { RequestState } from '@/shared/api/RequestState';
import { adminVenuesApi } from '@/entities/admin-venue';
import type {
    AdminModerationDecision,
    AdminVenueModeration,
} from '@/shared/api/types';

const wrap = <T>(promise: Promise<T>): Promise<{ data: T }> =>
    promise.then((data) => ({ data }));

class ModerationStore {
    queue = new RequestState<AdminVenueModeration[]>();

    current = new RequestState<AdminVenueModeration>();

    constructor() {
        makeAutoObservable(this);
    }

    loadQueue = async (): Promise<void> => {
        await this.queue.execute(
            wrap(
                adminVenuesApi
                    .getModerationQueue({ status: 'PENDING' })
                    .then((page) => page.items)
            )
        );
    };

    loadById = async (id: string): Promise<void> => {
        await this.current.execute(wrap(adminVenuesApi.getById(id)));
    };

    verify = async (id: string): Promise<AdminVenueModeration> => {
        const venue = await adminVenuesApi.verify(id);
        runInAction(() => {
            this.removeFromQueue(venue.id);
            this.syncCurrent(venue);
        });
        return venue;
    };

    reject = async (
        id: string,
        decision: AdminModerationDecision = {}
    ): Promise<AdminVenueModeration> => {
        const venue = await adminVenuesApi.reject(id, decision);
        runInAction(() => {
            this.removeFromQueue(venue.id);
            this.syncCurrent(venue);
        });
        return venue;
    };

    clear = (): void => {
        this.queue = new RequestState<AdminVenueModeration[]>();
        this.current = new RequestState<AdminVenueModeration>();
    };

    private removeFromQueue = (id: string): void => {
        if (this.queue.data) {
            this.queue.data = this.queue.data.filter((v) => v.id !== id);
        }
    };

    private syncCurrent = (venue: AdminVenueModeration): void => {
        if (this.current.data?.id === venue.id) {
            this.current.data = venue;
        }
    };
}

export const moderationStore = new ModerationStore();
