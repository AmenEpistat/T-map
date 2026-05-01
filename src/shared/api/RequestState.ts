import { makeAutoObservable, runInAction } from 'mobx';

export class RequestState<T> {
    data: T | null = null;
    isLoading = false;
    error: string | null = null;

    private requestId = 0;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    async execute(promise: Promise<{ data: T }>) {
        const id = ++this.requestId;

        this.isLoading = true;
        this.error = null;

        try {
            const response = await promise;

            if (id !== this.requestId) return;

            runInAction(() => {
                this.data = response.data;
                this.isLoading = false;
            });
        } catch (e: any) {
            if (id !== this.requestId) return;

            runInAction(() => {
                this.error = e?.message || 'Ошибка загрузки данных';
                this.isLoading = false;
            });
        }
    }

    reset() {
        this.isLoading = false;
        this.error = null;
        this.data = null;
    }
}
