import { makeAutoObservable, runInAction } from 'mobx';
import { message } from 'antd';
import { isErrorMessage } from '@/shared/api/types/error.ts';

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
        } catch (e: unknown) {
            if (id !== this.requestId) return;
            let errorMessage = 'Ошибка загрузки данных';

            if (isErrorMessage(e)) {
                errorMessage = e.message;
            }

            runInAction(() => {
                this.error = errorMessage;
                this.isLoading = false;
            });

            void message.error(errorMessage);
        }
    }

    reset() {
        this.isLoading = false;
        this.error = null;
        this.data = null;
    }
}
